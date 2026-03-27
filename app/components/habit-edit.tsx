import React from 'react';
import { useEffect } from 'react';
import { useHabits, DayToggles, NO_DAYS_SET } from '../providers/habits';

const DAY_LOOKUP = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

export function HabitEdit() {
  const habits = useHabits();
  const [id, setId] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [days, setDays] = React.useState<DayToggles>({...NO_DAYS_SET});

  function cancel() {
    habits.setEditing(false, undefined);
  }

  async function save(e) {
    e.preventDefault();
    await habits.update(id, name, days);
    await habits.load();
    habits.setEditing(false, undefined);
  }

  async function del() {
    await habits.del(id);
    await habits.load();
    habits.setEditing(false, undefined);
  }

  function toggleDay(e) {
    const toggledDay = !days[e.target.dataset.day];
    setDays(prevDays => {
      prevDays[e.target.dataset.day] = toggledDay;
      return {...prevDays}
    });
  }

  function handleKeyPress(e) {
    if (e.code === 'Escape') {
      cancel();
    }
  }

  useEffect(() => {
    if (habits.editing) {
      document.addEventListener('keydown', handleKeyPress);
    } else {
      document.removeEventListener('keydown', handleKeyPress);
    }

    if (habits.editing && habits.currentlyEditing) {
      setId(habits.currentlyEditing.id);
      setName(habits.currentlyEditing.name);
      let allDaysSet = true;
      if (habits.currentlyEditing.days) {
        for (const toggle of Object.values(habits.currentlyEditing.days)) {
          if (!toggle) allDaysSet = false;
        }
      }
      if (!allDaysSet) {
        setDays({...habits.currentlyEditing.days});
      } else {
        setDays({...NO_DAYS_SET});
      }
    }
  }, [habits.editing]);

  return (
    <div
      className={`relative z-10 ${habits.editing ? 'visible' : 'invisible'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <form onSubmit={save} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-100" id="modal-title">
                Edit habit
              </h3>
            </div>

            <div className="px-5 py-4 space-y-4">
              <input
                autoComplete="off"
                name="name"
                type="text"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(days).map(day => (
                  <button
                    type="button"
                    key={day}
                    data-day={day}
                    onClick={toggleDay}
                    className={`py-1.5 text-xs font-medium rounded transition-colors ${
                      days[day]
                        ? 'bg-violet-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {DAY_LOOKUP[day]}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium rounded transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
              <button
                type="button"
                onClick={del}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-medium rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
