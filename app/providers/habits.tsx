import * as React from "react";

export type DayToggles = {
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
};

export interface HabitType {
  name: string;
  days: DayToggles,
  habit_id: string;
  id: string;
  status: boolean;
  date: string;
}

export interface HabitResponse {
  current_dow: string;
  habits: Array<HabitType>;
}

interface HabitsType {
  habits: Array<HabitType>; 
  empty: boolean;
  currentDayOfWeek: string;
  editing: boolean;
  setEditing: (editing: boolean) => Promise<void>;
  load: () => Promise<void>;
  create: (name: string, days: DayToggles) => Promise<void>;
  set: (habits: HabitResponse) => {};
  toggle: (id: string) => Promise<void>;
  move: (oldIndex: number, newIndex: number) => Promise<void>;
}

const HabitsContext = React.createContext<HabitsType>(null!);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] =  React.useState<Array<HabitType>>([]);
  const [empty, setEmpty] = React.useState<boolean>(false);
  const [currentDayOfWeek, setCurrentDayOfWeek] = React.useState<string>('');
  const [editing, _setEditing] = React.useState<boolean>(false);

  const set = (habits: HabitResponse) => {
    setHabits([...habits.habits]);
    setEmpty(!habits.habits.length);
    setCurrentDayOfWeek(habits.current_dow);
    return {}
  }

  const create = async (name: string, days: DayToggles) => {
    let hasDaysSet = false;
    for (const toggle of Object.values(days)) {
      if (toggle) hasDaysSet = true;
    }
    await fetch('/v1/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, days: hasDaysSet ? days : undefined})
    });
  }

  const toggle = async (id: string) => {
    const habit = habits.find((h) => {
      if (h.id === id) return true;
    })
    if (!habit) return;
    await fetch('/v1/habits-daily', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        habit_id: habit.habit_id,
        status: !habit.status,
        date: habit.date,
      })
    });
  }

  const move = async (oldIndex: number, newIndex: number) => {
    await fetch('/v1/habits/array-move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        oldIndex,
        newIndex
      })
    });
  }

  const load = async () => {
    const resp = await fetch("/v1/habits-daily");
    const habits = await resp.json();
    habits.habits.map((h) => {
      h.id = h.habit_id;
    });
    set(habits);
  }

  const setEditing = async (editing: boolean) => {
    _setEditing(editing);
  }

  const value = { habits, empty, currentDayOfWeek, editing, setEditing, load, set, create, toggle, move };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
