import React from 'react'
import { Link } from "@remix-run/react";
import HabitAreaChart from '../components/habit-area-chart.tsx';

export default function Login () {
  return (
    <div className={'bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'}>
      <div className={'m-4 h-56'}>
        <HabitAreaChart />
      </div>
    </div>
  )
}
