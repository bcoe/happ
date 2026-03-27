import React from 'react'
import { Link } from "@remix-run/react";

export default function Index () {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-semibold text-zinc-100 tracking-tight mb-4">
        Build habits that stick.
      </h1>
      <p className="text-zinc-400 text-base max-w-md mb-8 leading-relaxed">
        Track your daily habits, visualise your consistency, and reflect on your progress — all in one minimal interface.
      </p>
      <Link
        to="/login"
        className="inline-flex items-center px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
      >
        Get started
      </Link>
    </div>
  )
}
