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
import { useHabits } from '../providers/habits';

export async function loader({request}) {
  await requireUserId(request);
  return {}
}

export default function Habits() {
  const habits = useHabits();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [sorting, setSorting] = useState<boolean>(false);
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
  
  async function createDailyHabit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    await habits.create(name);
    await habits.load();
    e.target.reset();
  }

  function handleChange(event) {
    setSorting(!sorting);
  }

  return (
    <Suspense>
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
              {habits.habits.map(habit => <HabitListItem name={habit.name} key={habit.habit_id} id={habit.habit_id} status={habit.status} disabled={!sorting} />)}
            </SortableContext>
          </DndContext>
          <label className="mt-3 inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={sorting} onChange={handleChange} />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Edit habits</span>
          </label>
          {sorting ? (
            <form onSubmit={createDailyHabit} className={'grid grid-cols-6 mt-3 w-11/12'}>
              <div></div>
              <div className={'col-span-4'}>
                <input autoComplete={'off'} name="name" type="text" className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'} />
              </div>
              <div>
                <input type="submit" value="Add Habit" className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'} />
              </div>
            </form>
          ) : ''}
        </Await>
    </Suspense>
  )

  function handleDragEnd(event) {
    const {active, over} = event;
    const oldIndex = habits.habits.findIndex(item => item.habit_id === active.id);
    const newIndex = habits.habits.findIndex(item => item.habit_id === over.id);
    habits.set(arrayMove(habits.habits, oldIndex, newIndex));
  }
}
