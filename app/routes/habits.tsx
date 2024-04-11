import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import { useState } from 'react';
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from '../components/sortable-item';

function Habits() {
  const [items, setItems] = useState([{id: 1, value: 'make coffee'}, {id: 2, value: 'brush my teeth'}, {id: 3, value: 'be rad'}, {id: 4, value: 'go climb a mountain'}]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (  
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => <SortableItem value={item.value} key={item.id} id={item.id} />)}
        </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const {active, over} = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

export default withSentry(Habits);
