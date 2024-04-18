import React, { createContext, ReactNode, useContext } from 'react';

export interface HabitType {
  name: string;
  id: string;
}

interface HabitsType {
  habits: Array<HabitType>;
  load: () => Promise<void>;
  create: (type: string) => Promise<void>;
  set: (habits: Array<HabitType>) => {};
  remove: (prefix: string, created: number) => Promise<void>;
}

export type Props = {
  children: ReactNode;
  testValue: HabitsType;
};  

interface HabitsType {
    habits: Array<HabitType>; 
    create: (type: string) => Promise<void>;
    set: (habits: Array<HabitType>) => {};
    remove: (prefix: string, created: number) => Promise<void>;
  }
  
  const HabitsContext = React.createContext<HabitsType>(null!);
  
  export function HabitsProvider(props: Props) {
    return <HabitsContext.Provider value={props.testValue}>{props.children}</HabitsContext.Provider>;
  }
  
  export function useHabits() {
    return React.useContext(HabitsContext);
  }
  