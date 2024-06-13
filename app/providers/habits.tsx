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
  empty: boolean;
  editing: boolean;
  setEditing: (editing: boolean) => Promise<void>;
  load: () => Promise<void>;
  create: (name: string) => Promise<void>;
  set: (habits: Array<HabitType>) => {};
  toggle: (id: string) => Promise<void>;
  move: (oldIndex: number, newIndex: number) => Promise<void>;
}

const HabitsContext = React.createContext<HabitsType>(null!);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] =  React.useState<Array<HabitType>>([]);
  const [empty, setEmpty] = React.useState<boolean>(false);
  const [editing, _setEditing] = React.useState<boolean>(false);

  const set = (habits: Array<HabitType>) => {
    setHabits([...habits]);
    /*
      setHabits([
        {
          name: 'get up without hitting snooze',
          habit_id: 'abc-123',
          id: 'abc-123',
          status: true,
          date: '10-10-1983'
        },
        {
          name: 'take finn for walk',
          habit_id: 'abc-124',
          id: 'abc-124',
          status: true,
          date: '10-10-1983'
        },
        {
          name: 'make breakfast at home',
          habit_id: 'abc-125',
          id: 'abc-124',
          status: true,
          date: '10-10-1983'
        }
      ]);
    */
    setEmpty(!habits.length);
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
    habits.map((h) => {
      h.id = h.habit_id;
    });
    set(habits);
  }

  const setEditing = async (editing: boolean) => {
    _setEditing(editing);
  }

  const value = { habits, empty, editing, setEditing, load, set, create, toggle, move };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
