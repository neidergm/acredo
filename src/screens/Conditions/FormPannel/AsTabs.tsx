import { useState, useEffect } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import Loader from '../../../components/Loader';
import classnames from 'classnames';
import { T_Form, T_FormPannelActions } from '.';
import { T_ObservationsInFormResp } from '../../../interfaces/conditions.interface';
import ObservationChat from '../../../components/ObservationChat';
import FormContent from './FormContent';

type T_Props = {
    canEdit: boolean,
    id_cond: string,
    formList: T_Form[],
    children?: JSX.Element | JSX.Element[] | false
} & T_FormPannelActions

const AsTabs = ({
    canEdit,
    id_cond,
    formList,
    onPickOne,
    onDelete,
    onSubmit,
    children,
    onObservationsDone
}: T_Props) => {
    const [currentActiveTab, setCurrentActiveTab] = useState(0);
    const [loadedItems, setLoadedItems] = useState<Array<T_Form | null>>(formList.map(i => null));
    const [observationsIsOpen, setObservationsIsOpen] = useState<T_Form | null>(null);

    const showObservations = (item: T_Form | null) => setObservationsIsOpen(item)

    const toggleTab = (tab: number) => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }

    const getFormFields = () => {
        if (currentActiveTab === null) return;
        const items = [...loadedItems];
        const form = items[currentActiveTab];
        if ((form)) {
            form.fields = [];
            setLoadedItems(items);
        }
        return onPickOne(form || formList[currentActiveTab], !!(form))
            .then(resp => {
                items[currentActiveTab] = resp;
                setLoadedItems([...items]);
            })
    }

    const submit = (data: any, form: T_Form, callback?: () => void, onlyRefreshForm = false) => {
        onlyRefreshForm ?
            getFormFields()
            :
            onSubmit(
                data,
                form,
                () => {
                    getFormFields();
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

    useEffect(() => {
        if (!loadedItems[currentActiveTab]) getFormFields()
    }, [currentActiveTab]);

    const getNumObs = (item: T_Form) => {
        if (item.num_obs === null) return 0;

        if (typeof item.num_obs === "number") {
            return item.num_obs;
        } else {
            return (item.num_obs as T_ObservationsInFormResp[]).reduce((p, c) => p + c.num_obs, 0)
        }
    }

    return (
        <>
            <ObservationChat
                onlyRead={!canEdit}
                toggle={showObservations}
                isOpen={!!(observationsIsOpen)}
                callbackOnUnmount={(res) => { if (res) { onObservationsDone() } }}
                id_fcamp={observationsIsOpen?.id_fcamp}
                extra_data_to_send={{ id_cond }}
            >
                <small className='text-muted'>
                    <b className='border-start ps-2 border-3 border-primary'>Formulario </b>
                    {observationsIsOpen && `${observationsIsOpen?.nomb_form}`}
                </small>
            </ObservationChat>

            <div>
                <Nav tabs className="group-subtitle p-0 mb-3 border-bottom justify-content-md-start d-flex flex-nowrap align-items-center">
                    {
                        formList.map((item, i) => {
                            const num_obs = item.tipo_obs !== 0 ? getNumObs(item) : 0;
                            return <NavItem key={`ni-${i}`}>
                                <NavLink onClick={() => { toggleTab(i); }}
                                    className={classnames("sub-item text-muted px-3 pb-2 d-flex align-items-center", {
                                        "active fw-bold px-xl-4": currentActiveTab === i
                                    })}
                                >
                                    {item.nomb_form}
                                    {!!(num_obs) &&
                                        <span className='position-relative ps-2'>
                                            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                                                {num_obs}
                                            </span>
                                        </span>
                                    }
                                </NavLink>
                            </NavItem>
                        }
                        )
                    }
                    {/* <NavLink onClick={() => { toggleTab(i); }}
                                    className={"sub-item text-muted px-3 pb-3 d-flex align-items-center " + classnames({
                                        "active fw-bold px-md-5": currentActiveTab === i
                                    })}
                                >
                                    {item.nomb_form}
                                    {!!(num_obs) &&
                                        <span className='position-relative ps-2'>
                                            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                                                {num_obs}
                                            </span>
                                        </span>
                                    }
                                </NavLink> */}
                </Nav>
                <div className='flex-grow-1 text-end'>{children}</div>
                <TabContent activeTab={currentActiveTab} className="tab-content-item pt-4">
                    {formList.map((item, i) => {
                        return <TabPane tabId={i} key={`tp-${i}`}>
                            {loadedItems[i] === null ?
                                <Loader loaderAsModal={false} isOpen />
                                :
                                <>
                                    {
                                        item.tipo_obs === 1 && <div>
                                            <Button
                                                outline
                                                color={"primary"}
                                                className="rounded-pill btn-sm px-3 mb-3 d-flex align-items-center"
                                                onClick={() => { showObservations(item) }}
                                            >
                                                <span className="mx-2">Observaciones</span>
                                            </Button>
                                        </div>
                                    }
                                    {!(loadedItems[i]?.fields?.length) ?
                                        <Loader loaderAsModal={false} isOpen />
                                        :
                                        <FormContent
                                            canEdit={canEdit}
                                            onSubmit={submit}
                                            onDelete={onDelete ? deleteHandle : undefined}
                                            onObservationsDone={() => { onObservationsDone() }}
                                            formItem={loadedItems[i]!}
                                        />
                                    }
                                </>
                            }
                        </TabPane>
                    })}
                </TabContent>
            </div>
        </>
    )
}

export default AsTabs;
