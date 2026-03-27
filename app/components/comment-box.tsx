import React from 'react';
import { useEffect } from 'react';
import { useHabits } from '../providers/habits';

export function CommentBox() {
  const habits = useHabits();
  const [note, setNote] = React.useState<string>('');
  const [saving, setSaving] = React.useState<boolean>(false);

  async function createNote(e) {
    e.preventDefault();
    setSaving(true);
    await habits.createNote(note);
    await habits.loadNote();
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setSaving(false);
  }

  useEffect(() => {
    setNote(habits.note);
  }, [habits.note]);

  return (
    <div className="mt-6 pt-6 border-t border-zinc-800">
      <form onSubmit={createNote}>
        <textarea
          name="note"
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-violet-500 rounded-md px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none transition-colors"
          placeholder="Leave a note about today's progress..."
          required
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 text-xs font-medium rounded transition-colors"
          >
            {saving && (
              <svg className="animate-spin size-3 text-zinc-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {saving ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </form>
    </div>
  );
}
