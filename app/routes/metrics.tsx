import React, {useEffect, useState} from 'react'
import HabitAreaChart from '../components/habit-area-chart.tsx';
import { useMetrics } from '../providers/metrics';
import { requireUserId } from "../session.server";

export async function loader({request}) {
  await requireUserId(request);
  return {}
}

export default function Login () {
  const metrics = useMetrics();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  useEffect(() => {
    if (!initialLoad) return;
    setInitialLoad(false);
    metrics.load(); 
  }, [metrics]);
  return (
    <div className={'bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'}>
      <h2 className={'text-center'}>Habit completion by day</h2>
      <div className={'m-4 h-56'}>
        <HabitAreaChart data={metrics.metrics.daily} />
      </div>
    </div>
  )
}
