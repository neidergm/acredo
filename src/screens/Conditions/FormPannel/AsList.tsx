import { useState, useEffect } from 'react';
import { Button, Card, CardBody, CloseButton } from 'reactstrap';
import { ChatDots, ChatDotsFill, CheckCircleFill, ExclamationCircleFill, XCircle } from '../../../components/Icons';
import Loader from '../../../components/Loader';
import classnames from 'classnames';
import ObservationChat from '../../../components/ObservationChat';
import { type T_Form, type T_FormPannelActions } from '.';
import FormContent from './FormContent';
import './../Details/style.css';

type T_Props = {
    canEdit: boolean,
    id_cond: string,
    children?: JSX.Element | JSX.Element[] | boolean,
    formList: T_Form[],
} & T_FormPannelActions;

const AsList = ({
    canEdit,
    id_cond,
    formList,
    children,
    onPickOne,
    onSubmit,
    onDeleteForm,
    onDelete,
    onObservationsDone
}: T_Props) => {

    const [currentActiveTab, setCurrentActiveTab] = useState<number | null>(null);
    const [observationsIsOpen, setObservationsIsOpen] = useState<T_Form | null>(null);
    const [loadedItems, setLoadedItems] = useState<Array<T_Form | null>>(formList.map(_i => null));

    const showObservations = (item: T_Form | null) => setObservationsIsOpen(item)

    const selectItem = (item: typeof currentActiveTab, _pick = true) => {
        if (item === null) return setCurrentActiveTab(null);
        setCurrentActiveTab(item);
    }

    const deleteForm = (item: T_Form) => {
        onDeleteForm?.(item.id_fcamp, `El formulario "${item.nomb_form}" será eliminado de forma permanente`, () => {
            selectItem(null)
        });
    }

    const submit = (data: any, form: T_Form, callback?: () => void, onlyRefreshForm = false) => {
        onlyRefreshForm ?
            getFormFields()
            :
            onSubmit(
                data,
                form,
                () => {
                    getFormFields()
                    callback?.();
                }
            )
    }

    const deleteHandle = (item: string, title?: string, subtitle?: any) => {
        onDelete?.(
            item,
            title,
            subtitle,
            () => {
                getFormFields();
            }
        )
    }

    const getFormFields = () => {
        if (currentActiveTab === null) return;
        const items = loadedItems;
        const form = items[currentActiveTab];
        if ((form)) {
            form.fields = [];
            setLoadedItems(items);
        }
        onPickOne(form || formList[currentActiveTab], !!(form))
            .then(resp => {
                items[currentActiveTab] = resp;
                setLoadedItems([...items]);
            })
    }

    useEffect(() => {
        if (currentActiveTab !== null) {
            if (!loadedItems[currentActiveTab]) getFormFields();

            // const element = document.getElementById(`form-${currentActiveTab}`);
            // if (element) {
            //     element.scrollIntoView({ behavior: 'smooth', block: "center" });
            // }
        }
    }, [currentActiveTab]);

    const selectedItem = currentActiveTab !== null && (loadedItems[currentActiveTab] || formList[currentActiveTab]);

    return (
        <>
            {children}
            <ObservationChat
                onlyRead={!canEdit}
                toggle={showObservations}
                isOpen={!!(observationsIsOpen)}
                id_fcamp={observationsIsOpen?.id_fcamp}
                callbackOnUnmount={(res) => { if (res) { onObservationsDone() } }}
                extra_data_to_send={{
                    id_cond: id_cond,
                }}
            >
                <small className='text-muted'>
                    <b className='border-start ps-2 border-3 border-primary'>Formulario </b>
                    {observationsIsOpen && `${observationsIsOpen?.nomb_form}`}
                </small>
            </ObservationChat>
            <div className="row flex-column-reverse flex-md-row">
                <div
                    className={classnames("custom-scrollbar overflow-auto pb-5 col-12 mt-3", !(selectedItem) ? "col-md-12" : "col-xxl-3 d-none d-xxl-block")}
                    style={{ maxHeight: !(selectedItem) ? "unset" : "90vh" }}
                >
                    <div className='vstack gap-3 pt-1'>
                        {formList.map((f, i) =>
                            <div className='d-flex' key={i}>
                                <Card
                                    className={classnames(
                                        'hover-scale-up rounded-3',
                                        i === currentActiveTab ? "border-secondary shadow h6 m-0" : "border-0 bg-light",
                                        'flex-grow-1',
                                        { "small": !!selectedItem }
                                    )}
                                    id={`form-${f.id_fcamp}`}
                                >
                                    <CardBody className='d-flex align-items-center' onClick={() => selectItem(i)}>
                                        <div className='pe-3'>
                                            <div
                                                className={classnames("rounded-circle",
                                                    f.est_resp === 1 ? "text-success" : "form-index",
                                                    { "text-primary": i === currentActiveTab })
                                                }
                                            >
                                                {f.est_resp === 1 ?
                                                    <CheckCircleFill size={selectedItem ? 32 : 42} />
                                                    :
                                                    <i className='text-dark text-opacity-25'>
                                                        <ExclamationCircleFill size={selectedItem ? 32 : 42} />
                                                    </i>
                                                }
                                            </div>
                                        </div>
                                        <div className=''>
                                            <span>{f.nomb_form}</span>
                                        </div>
                                    </CardBody>
                                </Card>
                                {!selectedItem && f.tipo_obs === 1 &&
                                    <div className='ms-3 d-flex align-items-stretch'>
                                        <Button color="light" size='sm' className='p-3 border-0 rounded-3'
                                            onClick={() => showObservations(f)}>
                                            <span className={classnames('position-relative', {
                                                "text-primary": !!(f.num_obs)
                                            })}>
                                                {!(f.num_obs) ? <ChatDots /> : <ChatDotsFill />}
                                                {!!(f.num_obs) && typeof f.num_obs === 'number' &&
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {f.num_obs}
                                                    </span>
                                                }
                                            </span>
                                        </Button>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                </div>
                {selectedItem && <div className='col-xxl-9 d-flex flex-column justify-content-between'>
                    <div className='pt-0 px-0 ps-2'>
                        <div className='float-end'>
                            <CloseButton onClick={() => selectItem(null)} className="ms-3" />
                        </div>
                        <h5 className='mt-3 text-secondary'>{selectedItem.nomb_form}</h5>
                        {/* <hr/> */}
                        <div className='mt-5'>
                            {!(selectedItem.fields?.length) ?
                                <Loader loaderAsModal={false} isOpen />
                                :
                                <FormContent
                                    onObservationsDone={() => { onObservationsDone() }}
                                    canEdit={canEdit}
                                    onSubmit={submit}
                                    onDelete={onDelete ? deleteHandle : undefined}
                                    formItem={selectedItem}
                                />
                            }
                        </div>
                    </div>
                    {selectedItem?.est_resp === 0 && !!(onDeleteForm) && !!(selectedItem.fields?.length) && <div className='text-end mt-4 pt-2'>
                        <Button size="sm" color="danger" outline className='opacity-75'
                            onClick={() => deleteForm(selectedItem)}
                        >
                            <i className='me-1'><XCircle size={16}/></i>
                            <span>Eliminar este formulario</span>
                        </Button>
                    </div>}
                </div>}
            </div>
        </>
    )
}

export default AsList
