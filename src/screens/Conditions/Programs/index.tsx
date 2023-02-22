import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Card, CardBody } from 'reactstrap';
import { ArrowLeftShort, ChatDots, ChatDotsFill, CheckCircleFill, ExclamationCircleFill } from '../../../components/Icons';
import Loader from '../../../components/Loader';
import { SubHeader } from '../../../components/SubHeader';
import { I_Condition, I_Form, I_FormFieldWithAnswer, T_Stage } from '../../../interfaces/conditions.interface';
import { I_Process } from '../../../interfaces/process.interface';
import { AXIOS_REQUEST } from '../../../services/axiosService';
import { ANSWER_BY_FORM, FORM, FORM_FIELDS, PUT_STAGE, SAVE_ANSWERS, STAGES } from '../../../services/endPointsService';
import classnames from 'classnames';
import './style.css';
import Form from 'react-ngm-form';
import { formToSubmitData, jsonToFormData } from '../../../utils/formUtils';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { mapFieldAndDefaultValues } from '../../../utils/mapField';
import { I_FieldProps, I_JSONObject } from '../../../interfaces/generic.interface';
import { T_FieldsTypes } from 'react-ngm-form/dist/interfaces/FormElements.interface';
import ObservationChat from '../../../components/ObservationChat';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setConditionDetails, setConditions } from '../../../store/actions/conditionsActions';
import StagesList from '../../../components/Stages/StagesList';
import Stages from '../../../components/Stages';

type T_Form = {
  fields: Array<I_FieldProps>;
  defaultValues: I_JSONObject;
} & I_Form;

let DATA: { [form: string]: Array<I_FormFieldWithAnswer> } = {};
let currentStage = 1;

const Create = () => {
  const conditionSelected: I_Condition = useLocation().state.condition;
  const processSelected: I_Process = useLocation().state.process;
  const { id_cond } = useParams();

  const [selectedForm, setSelectedForm] = useState<T_Form | null>(null);
  const [formList, setFormList] = useState<T_Form[] | null>(null);
  const [loader, setLoader] = useState<string | null>(null);
  const [alertConfirm, setAlertConfirm] = useState<I_AlertObject | null>(null);
  const [_alert, setAlert] = useState<I_AlertObject | null>(null);
  const [observationsIsOpen, setObservationsIsOpen] = useState<T_Form | null>(null);

  const [stages, setStages] = useState<Array<T_Stage> | null>(null);

  const canEdit = conditionSelected.rol.split(",").includes(stages?.[currentStage].resp_etapa as any);
  // const canEdit = true;

  const selectForm = (item: typeof selectedForm) => {
    if (item) {
      let form_fields = DATA[item.id_fcamp];
      if (form_fields) {
        setSelectedForm({ ...item, ...mapFieldAndDefaultValues(form_fields) });
      } else {
        setSelectedForm(item);
        getFormFields(
          item?.est_resp === 1 ? item.id_fcamp : item.campos,
          item?.est_resp === 1 ? ANSWER_BY_FORM : FORM_FIELDS
        );
      }
    }
  }

  const getFormFields = (param: string | number, url: string) => {
    AXIOS_REQUEST(`${url}${param}`)
      .then(res => {
        setSelectedForm(e => {
          DATA[e!.id_fcamp] = res.data;
          console.log(res.data)
          return {
            ...e!,
            ...mapFieldAndDefaultValues(res.data)
          }
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

  const getConditionsStages = () => {
    
    return AXIOS_REQUEST(STAGES + id_cond).then(resp => {
      currentStage = (resp.data as Array<T_Stage>).findIndex(i => i.est_etapa === 1 || i.est_etapa === 0);
      setStages((resp.data as Array<T_Stage>).map((item, i) => ({ ...item, internalId: i + 1 })));
      return true;
    })
  }

  const markStageAsCompleted = () => {
    setLoader("Espere");

    AXIOS_REQUEST(PUT_STAGE, "PUT", jsonToFormData({
      id_cond, id_nodo: stages![currentStage].id_nodo, est_etapa: 2
    })).then(() => {
      setLoader(null);
      setStages(null);
    }).catch(() => {
      setLoader(null);
      setAlert({
        type: "error",
        title: "Ops...",
        subtitle: "No se pudo marcar la etapa como finalizada, por favor intente nuevamente",
        isOpen: true,
        closeButton: { value: "Ok" }
      })
    })
  }

  const submitAll = (data: any) => {

    setLoader("Guardando datos");
    let formData = formToSubmitData(data,
      DATA[selectedForm!.id_fcamp].map(i => ({ ...i, id_fcamp: selectedForm?.id_fcamp })),
      ["id_campo", "id_fcamp"],
      undefined,
      { id_cond: conditionSelected.id_cond }
    )
    AXIOS_REQUEST(SAVE_ANSWERS, "POST", formData, true)
      .then(res => {
        delete DATA[selectedForm!.id_fcamp];
        setFormList(e => {
          let current = e!.findIndex(i => i.id_fcamp === selectedForm?.id_fcamp);
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

  const showObservations = (item: T_Form | null) => {
    setObservationsIsOpen(item)
  }

  useEffect(() => {
    if (!id_cond) return;

    !stages && getConditionsStages().then(() => {

      AXIOS_REQUEST(FORM + conditionSelected.form_cond)
        .then(res => {
          setFormList(res.data);
        })
        .catch(err => { })
    })
    return () => {
      DATA = {};
    }
  }, [stages]);

  useEffect(() => {
    if (!!(selectedForm)) {
      const element = document.getElementById(`form-${selectedForm.id_fcamp}`);
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

      <ObservationChat
        onlyRead={!canEdit}
        toggle={showObservations}
        isOpen={!!(observationsIsOpen)}
        id_fcamp={observationsIsOpen?.id_fcamp}
        extra_data_to_send={{
          id_cond: id_cond,
        }}
      >
        <small className='text-muted'>
          <b className='border-start ps-2 border-3 border-primary'>Formulario </b>
          {observationsIsOpen && `${observationsIsOpen?.nomb_form}`}
        </small>
      </ObservationChat>

      <div className="container pt-3 pb-5">
        <div className="row">
          <div className='col-xl-8'>
            <p>
              <b>Proceso:</b>
              <span className="d-block">{processSelected.nomb_conv}</span>
            </p>
            {!!processSelected.programa && <p>
              <b>Programa:</b>
              <span className="d-block">{processSelected.programa}</span>
            </p>}
            {!!formList && <p>
              <b>Completados:</b>
              <span className="d-block">
                {formList.reduce((p, c) => p += c.est_resp, 0)} de {formList.length} formularios
              </span>
            </p>}
          </div>
          <div className='col'>
            {!(stages) ? <Loader isOpen loaderAsModal={false} />
              :
              (!(stages.length) ?
                <p>
                  <b>Etapas:</b>
                  <span className="d-block"><i className='text-warning'><ExclamationCircleFill /></i> No hay etapas registradas</span>
                </p>
                :
                <div className='row flex-row-reverse'>
                  <div className='col-12 col-md-6 col-xl-12'>
                    <div className='mb-3'>
                      <p className='mb-2'><b>Etapas:</b></p>
                      <StagesList
                        items={stages}
                        currentStage={stages[currentStage]}
                      />
                    </div>
                  </div>
                  <div className='col'>
                    <div className='mb-3'>
                      <p className='mb-2'><b>Etapa actual:</b></p>
                      <Stages
                        condition={conditionSelected}
                        currentStage={stages[currentStage]}
                        callback={markStageAsCompleted}
                      />
                    </div>
                  </div>
                </div>)
            }
          </div>
        </div>
        {!formList || !stages ? <Loader isOpen loaderAsModal={false} />
          :
          !formList.length ?
            <p>| No hay nada para mostrar</p>
            :
            <>
              <div className="row flex-column-reverse flex-md-row">
                <div
                  className={classnames("overflow-auto pb-5 col-12", !!(selectedForm) ? "col-md-4 col-xl-3 d-none d-lg-block" : "col-md-12")}
                  style={{ maxHeight: !!(selectedForm) ? "90vh" : "unset" }}
                >
                  <div className='vstack gap-3 pt-4'>
                    {formList.map((f, i) =>
                      <div className='d-flex' key={i}>
                        <Card
                          className={classnames(
                            'hover-scale-up',
                            f.id_fcamp === selectedForm?.id_fcamp ? "border-secondary shadow h6 m-0" : "border-0 bg-light",
                            'flex-grow-1'
                          )}
                          id={`form-${f.id_fcamp}`}
                        >
                          <CardBody className='d-flex align-items-center' onClick={() => selectForm(f)}>
                            <div className='pe-3'>
                              <div
                                className={classnames("rounded-circle",
                                  f.est_resp === 1 ? "text-success" : "form-index",
                                  { "text-primary": f.id_fcamp === selectedForm?.id_fcamp })
                                }
                              >
                                {f.est_resp === 1 ? <CheckCircleFill size={50} /> : <ExclamationCircleFill size={50} />}
                              </div>
                            </div>
                            <div className=''>
                              <span>{f.nomb_form}</span>
                            </div>
                          </CardBody>
                        </Card>
                        {!selectedForm &&
                          <div className='ms-3 d-flex align-items-stretch'>
                            <Button color="light" size='sm' className='p-3 border-0'
                              onClick={() => showObservations(f)}>
                              <span className={classnames('position-relative', {
                                "text-primary": !!(f.num_obs)
                              })}>
                                {!(f.num_obs) ? <ChatDots /> : <ChatDotsFill />}
                                {!!(f.num_obs) &&
                                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {f.num_obs}
                                    <span className="visually-hidden">unread messages</span>
                                  </span>}
                              </span>
                            </Button>
                          </div>
                        }
                      </div>
                    )}
                  </div>
                </div>
                {selectedForm && < div className='col-lg-8 col-xl-9'>
                  <Card className='border-0 h-100' >
                    <CardBody className='pt-1 px-0 ps-md-3'>
                      <div className='mb-4'>
                        <button className='pe-3 btn btn-sm btn-secondary' onClick={() => setSelectedForm(null)}>
                          <ArrowLeftShort size={21} />Cerrar
                        </button>
                      </div>
                      <h4>{selectedForm.nomb_form}</h4>
                      <div className='mt-4'>
                        {!(selectedForm.fields) ?
                          <div className='p-5'><Loader loaderAsModal={false} isOpen /></div>
                          :
                          <Form
                            disabled={!canEdit}
                            key={selectedForm.id_fcamp}
                            // {...(selectedForm.form_fields || []).reduce((p, c) => ({
                            //   defaultValues: { ...p.defaultValues, [c.json_campo.name]: c.respuesta || c.json_campo.defaultValue },
                            //   fields: [...p.fields, c.json_campo]
                            // }),
                            //   { defaultValues: {}, fields: [] } as any
                            // )}
                            fields={selectedForm.fields as T_FieldsTypes[]}
                            defaultValues={selectedForm.defaultValues}
                            onSubmit={confirmSubmit}
                          >
                            {canEdit ?
                              <div className='text-end mt-4'>
                                <button type='submit' className='btn btn-success'>Guardar</button>
                              </div>
                              :
                              <></>
                            }
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
