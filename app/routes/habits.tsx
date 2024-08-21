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
import { HabitListItem } from '../components/habit-list-item';
import { HabitEdit } from '../components/habit-edit';
import { CommentBox } from '../components/comment-box';
import { useHabits, DayToggles, NO_DAYS_SET } from '../providers/habits';

const DAY_LOOKUP = {
  Mon: 'Mon',
  Tue: 'Tue',
  Wed: 'Wed',
  Thu: 'Thu',
  Fri: 'Fri',
  Sat: 'Sat',
  Sun: 'Sun'
};

export async function loader({request}) {
  await requireUserId(request);
  return {}
}

export default function Habits() {
  const habits = useHabits();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [sorting, setSorting] = useState<boolean>(false);
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
  const [days, setDays] = React.useState<DayToggles>({...NO_DAYS_SET});
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    if (!initialLoad) return;
    habits.load();
    setInitialLoad(false);
  });

  // If all habits are deleted, switch to
  // sort / edit mode:
  useEffect(() => {
    if (habits.empty) {
      setSorting(true);
    }
  }, [habits.empty]);
  
  // When we toggle into sort / edit mode
  // reset the day selectors.
  useEffect(() => {
    if (sorting) {
      setDays({...NO_DAYS_SET});
    }
  }, [sorting]);

  async function createDailyHabit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    await habits.create(name, days);
    await habits.load();
    setDays({...NO_DAYS_SET});
    e.target.reset();
  }

  function handleChange(event) {
    setSorting(!sorting);
  }

  async function handleDragEnd(event) {
    const {active, over} = event;
    const oldIndex = habits.habits.findIndex(item => item.habit_id === active.id);
    const newIndex = habits.habits.findIndex(item => item.habit_id === over.id);
    let insertIndex = newIndex;
    let action = 'before';
    if (newIndex > oldIndex) {
      action = 'after';
      if (newIndex >= habits.habits.length) {
        insertIndex = habits.habits.length - 1;
      }
    }
    if (oldIndex !== newIndex) {
      habits.set({
        habits: arrayMove(habits.habits, oldIndex, newIndex),
        current_dow: habits.currentDayOfWeek
      });
      await habits.move(oldIndex, newIndex);
      await habits.load();
    }
  }
  
  function toggleDay(e) {
    const toggledDay = !days[e.target.dataset.day];
    setDays(prevDays => {
      prevDays[e.target.dataset.day] = toggledDay;
      return {...prevDays}
    });
  }

  return (
    <Suspense>
        <Await resolve={habits}>
          <HabitEdit />
          <div className={'p-2'}>
            <div className={'flex items-center justify-center'}>
              <h1 className="text-1xl font-extrabold mb-1">{(sorting || habits.empty) ? 'Add / edit habits' : date}</h1>
            </div>
          </div>
          {habits.empty ? (
              <div className={'border-dashed border-2 border-slate-100 grid p-10'}>
                <div className={'flex items-center justify-center'}>
                  <p>
                    You have not yet created your first daily habit. Enter a daily habit that you would
                    like to start keeping into the text box below and click
                    <span className={'text-xs	bg-blue-500 ml-2 text-white font-bold py-1 px-2 rounded whitespace-nowrap'}>Add Habit</span>
                  </p>
                </div>
              </div>
          ) : ''}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={habits.habits}
              strategy={verticalListSortingStrategy}
            >
              {habits.habits.map(habit => <HabitListItem name={habit.name} key={habit.habit_id} id={habit.habit_id} status={habit.status} days={habit.days} disabled={!sorting} />)}
            </SortableContext>
          </DndContext>
          {(sorting || habits.empty) ? (
            <form onSubmit={createDailyHabit}>
              <div className='flex w-full'>
                <div className='w-4/6 mt-1'>
                  <input autoComplete={'off'} name="name" type="text" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline' />
                </div>
                <input type="submit" value="Add Habit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-1 mt-1 rounded focus:outline-none focus:shadow-outline w-2/6' />
              </div>
              <ul className='flex w-full'>
                {Object.keys(days).map((day, i) => (
                  <li data-day={day} key={day} onClick={toggleDay} className={`p-1 ${i === 0 ? '' : 'ml-1'} text-sm font-medium text-center border rounded-lg cursor-pointer text-blue-600 border-blue-600${days[day] ? ' text-white bg-blue-500' : ' bg-white'}`}>
                    {DAY_LOOKUP[day]}
                  </li>
                ))}
              </ul>
            </form>
          ) : ''}
          <label className="mt-3 inline-flex items-center cursor-pointer">
            <input type="checkbox" name="toggle-edit" value="" className="sr-only peer" checked={sorting || habits.empty} onChange={handleChange} />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">Add / edit habits</span>
          </label>
          {(sorting || habits.empty) ? '' : <CommentBox />}
        </Await>
    </Suspense>
  )
}
