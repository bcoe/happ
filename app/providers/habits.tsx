import * as React from "react";

export interface HabitType {
  name: string;
  habit_id: string;
  id: string;
  status: boolean;
  date: string;
}

interface HabitsType {
  habits: Array<HabitType>; 
  load: () => Promise<void>;
  create: (name: string) => Promise<void>;
  set: (habits: Array<HabitType>) => {};
  toggle: (id: string) => Promise<void>;
}

const HabitsContext = React.createContext<HabitsType>(null!);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] =  React.useState<Array<HabitType>>([]);

  const set = (habits: Array<HabitType>) => {
    setHabits([...habits]);
    return {}
  }

  const create = async (name: string) => {
    await fetch('/v1/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name})
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

  const load = async () => {
    const resp = await fetch("/v1/habits-daily");
    const habits = await resp.json();
    habits.map((h) => {
      h.id = h.habit_id;
    });
    set(habits);
  }

  const value = { habits, load, set, create, toggle };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
