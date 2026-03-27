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

  useEffect(() => {
    if (habits.empty) {
      setSorting(true);
    }
  }, [habits.empty]);

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

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-sm font-medium text-zinc-400">
            {(sorting || habits.empty) ? 'Add / edit habits' : date}
          </h1>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-zinc-500">Edit</span>
            <input
              type="checkbox"
              name="toggle-edit"
              value=""
              className="sr-only peer"
              checked={sorting || habits.empty}
              onChange={handleChange}
            />
            <div className="relative w-9 h-5 bg-zinc-700 rounded-full peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full transition-colors" />
          </label>
        </div>

        {habits.empty && (
          <div className="border border-dashed border-zinc-800 rounded-lg p-8 text-center mb-4">
            <p className="text-zinc-500 text-sm">
              No habits yet. Add your first one below.
            </p>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={habits.habits}
            strategy={verticalListSortingStrategy}
          >
            {habits.habits.map(habit => (
              <HabitListItem
                name={habit.name}
                key={habit.habit_id}
                id={habit.habit_id}
                status={habit.status}
                days={habit.days}
                disabled={!sorting}
              />
            ))}
          </SortableContext>
        </DndContext>

        {(sorting || habits.empty) && (
          <form onSubmit={createDailyHabit} className="mt-4">
            <div className="flex gap-2 mb-3">
              <input
                autoComplete="off"
                name="name"
                type="text"
                placeholder="Habit name"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <input
                type="submit"
                value="Add"
                className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-md cursor-pointer transition-colors"
              />
            </div>
            <div className="flex gap-1.5">
              {Object.keys(days).map((day, i) => (
                <button
                  type="button"
                  data-day={day}
                  key={day}
                  onClick={toggleDay}
                  className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                    days[day]
                      ? 'bg-violet-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {DAY_LOOKUP[day]}
                </button>
              ))}
            </div>
          </form>
        )}

        {!(sorting || habits.empty) && <CommentBox />}
      </Await>
    </Suspense>
  )
}
