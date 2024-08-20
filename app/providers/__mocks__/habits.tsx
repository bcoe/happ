import React, { ReactNode } from 'react';

export const NO_DAYS_SET = {
  Mon: false,
  Tue: false,
  Wed: false,
  Thu: false,
  Fri: false,
  Sat: false,
  Sun: false
};

export interface HabitType {
  name: string;
  id: string;
}

export interface HabitResponse {
  current_dow: string;
  habits: Array<HabitType>;
}

interface HabitsType {
  habits: Array<HabitType>;
  load: () => Promise<void>;
  create: (type: string) => Promise<void>;
  set: (habits: HabitResponse) => {};
  remove: (prefix: string, created: number) => Promise<void>;
}

export type Props = {
  children: ReactNode;
  testValue: HabitsType;
};  

interface HabitsType {
  habits: Array<HabitType>;
  create: (type: string) => Promise<void>;
  set: (habits: HabitResponse) => {};
  remove: (prefix: string, created: number) => Promise<void>;
}

const HabitsContext = React.createContext<HabitsType>(null!);

export function HabitsProvider(props: Props) {
  return <HabitsContext.Provider value={props.testValue}>{props.children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
