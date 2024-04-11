import { withSentry } from "@sentry/remix";
import React from 'react';
import {HabitList} from '../components/habit-list';

function Habits() {
  return (  
    <HabitList />
  );
}

export default withSentry(Habits);
