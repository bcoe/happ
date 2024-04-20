
import { createContext, ReactNode, useContext } from 'react';
import { createRemixStub } from "@remix-run/testing";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { test } from 'vitest'
import { vi } from 'vitest'

vi.doMock('../../providers/habits');

test("renders habits", async () => {
  const { HabitsProvider } = await import('../../providers/habits');
  const { default: Habits } = await import('../habits');

  const HabitStub = createRemixStub([
    {
      path: "/",
      Component: Habits,
      // loader() {},
    },
  ]);
  render(
    <HabitsProvider testValue={{
      habits: [{id: 'abc123', name: 'be awesome'}],
      load: async () => {}
    }}>
      <HabitStub />
    </HabitsProvider>
  );
  await waitFor(() => screen.findByText("be awesome"));
});
