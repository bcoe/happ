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
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Completion over time
        </h2>
        <div className="h-48">
          <HabitAreaChart data={metrics.metrics.daily} />
        </div>
      </div>

      {metrics.notes.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Notes
            </h2>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {metrics.notes.map((note, i) => (
                <tr
                  key={i}
                  className={`border-b border-zinc-800 last:border-0 transition-colors ${
                    note.highlight ? 'bg-zinc-800' : ''
                  }`}
                >
                  <td className="px-5 py-3 text-zinc-500 whitespace-nowrap w-32">
                    {note.date}
                  </td>
                  <td className="px-5 py-3 text-zinc-300">
                    {note.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
