import { Await  } from "@remix-run/react";
import { requireUserId } from "../session.server";
import React, { useState, useEffect, Suspense } from 'react';
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
import {HabitListItem} from '../components/habit-list-item';
import { useHabits, HabitType } from '../providers/habits';

export async function loader({request}) {
  await requireUserId(request);
  return {};
}

export default function Habits() {
  const habits = useHabits();
  // const [items, setItems] = useState<HabitType[]>(Array<HabitType>());
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    if (!initialLoad) return;
    setInitialLoad(false);
    habits.load();
  }, [initialLoad, habits]);

  return (
    <Suspense fallback={<div>Beep Boop I AM CONTENT</div>}>
        <Await resolve={habits}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={habits.habits}
              strategy={verticalListSortingStrategy}
            >
              {habits.habits.map(habit => <HabitListItem name={habit.name} key={habit.id} id={habit.id} />)}
            </SortableContext>
          </DndContext> 
        </Await>
    </Suspense>
  )

  function handleDragEnd(event) {
    const {active, over} = event;
    const oldIndex = habits.habits.findIndex(item => item.id === active.id);
    const newIndex = habits.habits.findIndex(item => item.id === over.id);
    habits.set(arrayMove(habits.habits, oldIndex, newIndex));
  }
}
