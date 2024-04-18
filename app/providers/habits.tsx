import * as React from "react";

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

const HabitsContext = React.createContext<HabitsType>(null!);

const HABITS: Array<HabitType> = [
  {
    id: 'abc123',
    name: 'Make my morning coffee'
  },
  {
    id: 'qwerty',
    name: 'Take Finn for a walk'
  },
];

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] =  React.useState<Array<HabitType>>([]);

  const set = (habits: Array<HabitType>) => {
    setHabits([...habits]);
    return {}
  }

  const create = async (type: string) => {
    /*const body: {type: string; ott?: string} = {
      ...opts,
      type,
    };
    if (account.ott) {
      body.ott = account.ott;
    }
    const req = await fetch('/_/token', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (req.status === 200) {
      const tokenObject = await req.json();
      flash.set('success', tokenObject.message);
      account.setOtt(undefined);
    }
    // TODO: add error handling with tests.
    */
  }

  const remove = async (prefix: string, created: number) => {
    /*const newTokens = [];
    for (const token of tokens) {
      if (token.prefix === prefix && token.created === created) {
        await fetch('/_/api/v1/token', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(token)
        });
        // TODO: add error handling with tests.
        continue;
      } else {
        newTokens.push(token);
      }
    }
    setTokens([...newTokens]);*/
  };

  const load = async () => {
    const resp = await fetch("/v1/habits");
    console.info(await resp.json());
    set(HABITS);
  }

  const value = { habits, load, set, create, remove };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  return React.useContext(HabitsContext);
}
