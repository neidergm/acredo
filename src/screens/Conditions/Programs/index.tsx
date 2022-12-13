import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import { ArrowLeftShort, CheckCircleFill, ExclamationCircleFill } from '../../../components/Icons';
import Loader from '../../../components/Loader';
import { SubHeader } from '../../../components/SubHeader';
import { I_Condition, I_Form, I_FormField, I_FormFieldWithAnswer } from '../../../interfaces/conditions.interface';
import { I_Convocatory } from '../../../interfaces/convocatory.interface';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ANSWER_BY_FORM, FORM, FORM_FIELDS, SAVE_ANSWERS } from '../../../services/endPointsService';
import classnames from 'classnames';
import './style.css';
import Form from 'react-ngm-form';
import { formToSubmitData } from '../../../utils/formUtils';
import Alert, { I_AlertObject } from '../../../components/Alert';
import mapFields from '../../../utils/mapFields';

type T_Form = { form_fields?: Array<I_FormFieldWithAnswer> } & I_Form;
let DATA: { [form: string]: Array<I_FormFieldWithAnswer> } = {};

const Create = () => {

  const conditionSelected: I_Condition = useLocation().state.condition;
  const convocatorySelected: I_Convocatory = useLocation().state.convocatory;
  const { id_cond } = useParams();

  const [selectedForm, setSelectedForm] = useState<T_Form | null>(null);
  const [formList, setFormList] = useState<T_Form[] | null>(null);
  const [loader, setLoader] = useState<string | null>(null);
  const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
  const [_alert, setAlert] = useState<I_AlertObject | null>(null);

  const selectForm = (item: typeof selectedForm) => {
    if (item) {
      let form_fields = DATA[item.id_form];
      if (form_fields) {
        setSelectedForm({ ...item, form_fields: [...form_fields] });
      } else {
        setSelectedForm(item);
        getFormFields(
          item?.est_resp === 1 ? item.id_form : item.campos,
          item?.est_resp === 1 ? ANSWER_BY_FORM : FORM_FIELDS
        );
      }
    }
  }

  const getFormFields = (param: string | number, url: string) => {
    AXIOS_REQUEST(url + param)
      .then(res => {
        setSelectedForm(e => {
          DATA[e!.id_form] = res.data;
          return { ...e!, form_fields: mapFields(res.data, (field, item) => item) as any }
        })
      })
      .catch(err => { })
  }

  const confirmSubmit = (data: any) => {
    setAlertConfirm({
      isOpen: true,
      title: "¿Desea guardar los cambios?",
      type: "question",
      submitButton: { value: "Sí, guardar", onClick: () => submitAll(data) },
      closeButton: { value: "No, cancelar" }
    })
  }

  const submitAll = (data: any) => {
    setLoader("Guardando datos");
    let formData = formToSubmitData(data,
      selectedForm!.form_fields?.map(i => ({ ...i, id_fcamp: selectedForm?.id_fcamp })) as I_FormFieldWithAnswer[],
      ["id_campo"],
      { id_fcamp: selectedForm?.id_fcamp },
      { id_cond: conditionSelected.id_cond, id_form: selectedForm?.id_form }
    )

    AXIOS_REQUEST(SAVE_ANSWERS, "POST", formData, true)
      .then(res => {
        delete DATA[selectedForm!.id_form];
        setFormList(e => {
          let current = e!.findIndex(i => i.id_form === selectedForm?.id_form);
          if (current) {
            e![current] = { ...selectedForm!, est_resp: 1 }
            selectForm(e![current])
          };
          return [...e!]
        });

        setAlert({
          isOpen: true,
          title: "¡Muy bien!",
          subtitle: "Se han registrado correctamente los datos",
          type: "success",
        });
        setLoader(null);
      })
      .catch(err => {
        setAlert({
          isOpen: true,
          title: "Ops...",
          subtitle: err.data || "Parece que hubo un error, por favor verifique la información e intentelo nuevamente",
          type: "error",
        });
        setLoader(null)
      })
  }

  useEffect(() => {
    if (!id_cond) return;
    AXIOS_REQUEST(FORM + conditionSelected.form_cond)
      .then(res => {
        setFormList(res.data);
      })
      .catch(err => { })
  }, []);

  useEffect(() => {
    if (!!(selectedForm)) {
      const element = document.getElementById(`form-${selectedForm.id_form}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: "center" });
      }
    }
  }, [selectedForm])

  return (
    <>
      <SubHeader text={conditionSelected.nomb_cond} showBackButton={true} />
      <Loader isOpen={!!loader} subtitle={loader!} />
      <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} closeButton={{ value: "Ok" }} />
      <Alert isOpen={!!(alertConfirm?.isOpen)}{...alertConfirm} onClosed={() => { setAlertConfirm(null) }} />

      <div className="container pt-3 pb-5">
        <div>
          <p>
            <b>Convocatoria:</b>
            <span className="d-block">{convocatorySelected.nomb_conv}</span>
          </p>
          {!!convocatorySelected.programa && <p>
            <b>Programa:</b>
            <span className="d-block">{convocatorySelected.programa}</span>
          </p>}
        </div>
        {!formList ? <Loader isOpen loaderAsModal={false} />
          :
          !formList.length ?
            <p>| No hay nada para mostrar</p>
            :
            <>
              <div className='mb-3'>
                <p>
                  <b>Completados:</b>
                  <span className="d-block">
                    {formList.reduce((p, c) => p += c.est_resp, 0)} de {formList.length} formularios
                  </span>
                </p>
              </div>
              <div className="row flex-column-reverse flex-md-row">
                <div
                  className={classnames("overflow-auto pb-5 col-12", !!(selectedForm) ? "col-md-4 col-xl-3 d-none d-lg-block" : "col-md-12")}
                  style={{ maxHeight: !!(selectedForm) ? "90vh" : "unset" }}
                >
                  <div className='vstack gap-3 pt-4'>
                    {formList.map((f, i) =>
                      <Card
                        className={classnames(
                          'hover-scale-up',
                          f.id_form === selectedForm?.id_form ? "border-secondary shadow h6 m-0" : "border-0 bg-light")}
                        key={i}
                        id={`form-${f.id_form}`}
                        onClick={() => selectForm(f)}
                      >
                        <CardBody className='d-flex align-items-center'>
                          <div className='pe-3'>
                            <div
                              className={classnames("rounded-circle",
                                f.est_resp === 1 ? "text-success" : "form-index",
                                { "text-primary": f.id_form === selectedForm?.id_form })
                              }
                            >
                              {f.est_resp === 1 ? <CheckCircleFill size={50} /> : <ExclamationCircleFill size={50} />}
                            </div>
                          </div>
                          <div>
                            <span>{f.nomb_form}</span>
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                </div>
                {selectedForm && < div className='col-md-8 col-xl-9'>
                  <Card className='border-0 h-100' >
                    <CardBody className='pt-1 px-0 ps-md-3'>
                      <div className='mb-4'>
                        <button className='pe-3 btn btn-sm btn-secondary' onClick={() => setSelectedForm(null)}>
                          <ArrowLeftShort size={21} />Cerrar
                        </button>
                      </div>
                      <h4>{selectedForm.nomb_form}</h4>
                      <div className='mt-4'>
                        {!(selectedForm.form_fields) ?
                          <div className='p-5'><Loader loaderAsModal={false} isOpen /></div>
                          :
                          <Form
                            key={selectedForm.id_form}
                            {...(selectedForm.form_fields || []).reduce((p, c) => ({
                              defaultValues: { ...p.defaultValues, [c.json_campo.name]: c.respuesta || c.json_campo.defaultValue },
                              fields: [...p.fields, c.json_campo]
                            }),
                              { defaultValues: {}, fields: [] } as any
                            )}
                            onSubmit={confirmSubmit}
                          >
                            <div className='text-end mt-4'>
                              <button type='submit' className='btn btn-success'>Guardar</button>
                            </div>
                          </Form>
                        }
                      </div>
                    </CardBody>
                  </Card>
                </div>}
              </div>
            </>
        }
      </div>
    </>
  )
}

export default Create;
