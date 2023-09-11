import { useState, useRef, useEffect } from 'react'
import { T_Action, T_Phase, T_Stage } from '../../../interfaces/phasesAndStages.interface'
import { Badge, Input, Label } from 'reactstrap';
import classnames from 'classnames';
import toast from 'react-hot-toast';

type T_Props = {
    phase: T_Phase,
    stage: T_Stage,
    formId: string,
    submit: (data: T_Action[]) => void
}

const StageChooser = ({ phase, stage: _st, formId, submit }: T_Props) => {

    const [selectedStage, setSelectStage] = useState<number | null>(null);
    const actionsSelected = useRef<T_Action[]>([]);

    const handleChangeActions = (a: T_Action) => {
        const exist = actionsSelected.current?.findIndex(i => i.id_accion === a.id_accion);

        if (exist !== -1) {
            actionsSelected.current?.splice(exist, 1)
        } else {
            actionsSelected.current?.push(a)
        }
    }

    useEffect(() => {
        if (phase.stages && selectedStage !== null) {
            actionsSelected.current = [...(phase.stages[selectedStage].actions || [])];
        } else {
            actionsSelected.current = [];
        }
    }, [selectedStage])

    return (
        <form className='user-select-none' id={formId} onSubmit={(e) => {
            e.preventDefault();
            submit(actionsSelected.current)
        }}>
            {
                phase.stages?.map((stage, idx) => stage.id !== _st.id && <div key={stage.id}
                    className={classnames({
                        "text-opacity-50 text-primary": selectedStage !== null,
                        "text-opacity-100 bg-light py-2 px-2 rounded-3 mb-2": selectedStage === idx
                    })}>
                    <Input type='radio' value={stage.id} id={`${stage.id}`} onChange={() => setSelectStage(idx)} name="stageChooser" />
                    <Label htmlFor={`${stage.id}`}
                        className={classnames('ps-2 cursor-pointer', { "fw-semibold": selectedStage === idx })}>{stage.name}</Label>

                    {selectedStage === idx &&
                        <div className='pt-2 border-start border-2 border-primary ms-1 border-opacity-25 mb-2 text-secondary'>
                            {stage.actions?.map(action => <div className='ps-2 ms-1' key={action.id_accion}>
                                <Input type='checkbox'
                                    defaultChecked
                                    onChange={() => handleChangeActions(action)}
                                    defaultValue={`${action.id_accion}`}
                                    id={`${action.id_accion}`}
                                />
                                <Label htmlFor={`${action.id_accion}`} className='ps-2 cursor-pointer'>{action.nomb_accion}</Label>
                                <p className='small pb-1'>
                                    <Badge color='success' className='bg-opacity-50 me-2'>{action.fecha_accion}</Badge>
                                    {action.usuarios?.map(u => u.responsable).join(", ")}
                                </p>
                            </div>)}
                        </div>}
                </div>)
            }
        </form>
    )
}

export default StageChooser