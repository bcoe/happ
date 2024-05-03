import React from 'react'
import screen from "../images/screen-01.png";

export default function Index () {
  return (
    <div className={'grid grid-cols-2'}>
      <div>
        <img src={screen} />
      </div>
      <div className={'mt-10'}>
        <blockquote className="text-xl italic font-semibold text-gray-900 dark:text-white">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 14">
                <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"/>
            </svg>
            <p className={'text-gray-400'}>HabitTrack.me lets you track daily habits that you'd like to make a part of your routine. Its metrics allow you to see if you're meeting your goals week over week.</p>
        </blockquote>
      </div>
    </div>
  )
}
