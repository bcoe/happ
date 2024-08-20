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

export const NO_DAYS_SET = {
  Mon: false,
  Tue: false,
  Wed: false,
  Thu: false,
  Fri: false,
  Sat: false,
  Sun: false
};

export const ALL_DAYS_SET = {
  Mon: true,
  Tue: true,
  Wed: true,
  Thu: true,
  Fri: true,
  Sat: true,
  Sun: true
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
  currentlyEditing?: HabitType;
  setEditing: (editing: boolean, id: string | undefined) => Promise<void>;
  load: () => Promise<void>;
  create: (name: string, days: DayToggles) => Promise<void>;
  update: (id: string, name: string, days: DayToggles) => Promise<void>;
  del: (id: string) => Promise<void>;
  set: (habits: HabitResponse) => {};
  toggle: (id: string) => Promise<void>;
  move: (oldIndex: number, newIndex: number) => Promise<void>;
  // Notes CRUD:
  createNote: (note: string) => Promise<void>;
}

const HabitsContext = React.createContext<HabitsType>(null!);

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = React.useState<Array<HabitType>>([]);
  const [empty, setEmpty] = React.useState<boolean>(false);
  const [currentDayOfWeek, setCurrentDayOfWeek] = React.useState<string>('');
  const [editing, _setEditing] = React.useState<boolean>(false);
  const [currentlyEditing, setCurrentlyEditing] = React.useState<HabitType | undefined>(undefined);

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

  const update = async (id: string, name: string, days: DayToggles) => {
    let hasDaysSet = false;
    for (const toggle of Object.values(days)) {
      if (toggle) hasDaysSet = true;
    }
    await fetch(`/v1/habits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, days: hasDaysSet ? days : ALL_DAYS_SET})
    });
  }

  const del = async (id: string) => {
    await fetch(`/v1/habits/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
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

  const setEditing = async (editing: boolean, id: string | undefined) => {
    if (id) {
      setCurrentlyEditing(habits.find(h => {
        return h.id === id;
      }));
    } else {
      setCurrentlyEditing(undefined);
    }
    _setEditing(editing);
  }

  // Add notes to your day that you can come back and reference in the future. Why did I have trouble making it
  // to the gym on August 1st 2024?
  const createNote = async (note: string) => {
    await fetch('/v1/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({note})
    });
  };

  const value = { habits, empty, currentDayOfWeek, editing, setEditing, currentlyEditing, load, set, create, update, del, toggle, move, createNote };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
