import React, {useEffect, useState} from 'react'
import HabitAreaChart from '../components/habit-area-chart.tsx';
import { useMetrics } from '../providers/metrics';
import { requireUserId } from "../session.server";

export async function loader({request}) {
  await requireUserId(request);
  return {}
}

export default function Metrics () {
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
      <div className="mt-4 relative overflow-x-auto shadow-md sm:rounded-lg mb-5">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                          Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                          Note
                      </th>
                  </tr>
              </thead>
              <tbody>
              {metrics.notes.map((note, i) => (
                <tr key={i} className={`${note.highlight ? 'bg-gray-100' : 'bg-white'} border-b`}>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {note.date}
                    </th>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {note.note}
                    </td>
                </tr>
              ))}
              </tbody>
          </table>
      </div>
    </div>
  )
}
