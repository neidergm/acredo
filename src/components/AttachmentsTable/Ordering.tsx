import { useState, type CSSProperties } from 'react'
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { type T_MapedItemList } from '.';
import { Badge } from 'reactstrap';

// const dropAnimation: DropAnimation = {
//     sideEffects: defaultDropAnimationSideEffects({
//         styles: {
//             active: {
//                 opacity: '0.5',
//             },
//         },
//     }),
// };

type T_Props = {
    list: Array<T_MapedItemList>,
    orderRef: React.MutableRefObject<Array<T_MapedItemList>>,
}

const Ordering = ({ list, orderRef }: T_Props) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [items, setItems] = useState(list);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(i => i?.id === active.id);
                const newIndex = items.findIndex(i => i?.id === over?.id);
                orderRef.current = arrayMove(items, oldIndex, newIndex);
                return orderRef.current
            });
        }
    }

    // function handleDragStart(event: DragStartEvent) {
    //     console.log(event)
    //     const { active } = event;
    // }

    return (
        <div>
            <DndContext
                modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            // onDragStart={handleDragStart}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className='list-group'>
                        {items.map(item => <SortableItem key={item?.id} id={item!.id} data={item} />)}
                    </div>
                </SortableContext>

                {/* <DragOverlay dropAnimation={dropAnimation} zIndex={2}>
                {activeId ? <ItemContent data={{ text: "Draggin", id: activeId }} /> : null}
            </DragOverlay> */}
            </DndContext>
        </div>
    );
}

export default Ordering;

function SortableItem({ id, data }: { id: number, data: T_MapedItemList }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isSorting,
    } = useSortable({ id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(isDragging ? {
            zIndex: 2,
            position: "relative",
            boxShadow: "0px 5px 7px 0px rgba(0,0,0,0.2)",
            opacity: 1,
            cursor: "grabbing"
        } : { cursor: "grab" }),
        opacity: !isSorting ? 1 : 0.5
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='list-group-item'>
            <div >
                <Badge color='primary' className='me-3'>{id}</Badge>
                {data.nomb_anexo}-{data.item.defaultValues.anexo_nombre}
            </div>
        </div>
    );
}

// const ItemContent = ({ data }: { data: T_ItemList }) => {
//     return <div className='p-2 bg-light rounded-3 my-2 border'>
//         {data.id} - {data.text}
//     </div>
// }