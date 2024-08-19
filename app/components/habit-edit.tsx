import React from 'react';
import { useHabits, DayToggles } from '../providers/habits';

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
  const [days, setDays] = React.useState<DayToggles>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false
  });

  function cancel() {
    habits.setEditing(false);
  }

  function toggleDay(e) {
    const toggledDay = !days[e.target.dataset.day];
    setDays(prevDays => {
      prevDays[e.target.dataset.day] = toggledDay;
      return {...prevDays}
    });
  }

  return (
    <div className={`relative z-10${habits.editing ? ' visible' : ' invisible'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-baseline justify-center p-4 text-center sm:items-baseline sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                  </svg>
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Edit habit</h3>
                  <div className="mt-2">
                    <input autoComplete={'off'} name="name" type="text" className='block w-96 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline' />
                    <ul className="grid w-full grid-cols-2 gap-2 mt-5">
                      {Object.keys(days).map(day => (
                        <li key={day}>
                          <span data-day={day} onClick={toggleDay} className={`inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center border rounded-lg cursor-pointer text-blue-600 border-blue-600${days[day] ? ' text-white bg-blue-500' : ' bg-white'}`}>
                            {DAY_LOOKUP[day]}
                          </span>
                        </li>
                      ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex bg-gray-50 px-4 py-3 px-6">
              <div className="w-full">
                <button type="button" className="mr-1 bg-blue-500 hover:bg-blue-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto text-white">Save</button>
                <button type="button" onClick={cancel} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
              </div>
              <div className="w-full text-right">
                <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto sm:mt-0 sm-ml-0 ml-2 mt-3">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
