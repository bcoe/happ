import * as React from "react";

export interface MetricType {
  daily: Array<{
    name: string;
    completed: number;
  }>
}

export interface NoteTableRow {
  note: string;
  date: string;
  highlight: boolean;
}

interface MetricsType {
  metrics: MetricType; 
  notes: Array<NoteTableRow>,
  load: () => Promise<void>;
  set: (metrics: MetricType) => void;
  maybeSelectRow: (date: string) => void;
  lostFocus: () => void;
  gotFocus: () => void;
}

const MetricsContext = React.createContext<MetricsType>(null!);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] =  React.useState<MetricType>({daily: []});
  const [notes, setNotes] = React.useState<Array<NoteTableRow>>([]);
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [hasFocus, setHasFocus] = React.useState<boolean>(false);

  const set = (metrics: MetricType) => {
    setMetrics(metrics);
    return {};
  }

  const loadNotes = async () => {
    const resp = await fetch("/v1/notes");
    const n = await resp.json();
    setNotes(n.map((n) => {
      return {
        note: n.note,
        date: n.date,
        highlight: false
      }
    }));
  }

  const load = async () => {
    const resp = await fetch("/v1/metrics");
    const m = await resp.json();
    set({daily: m.map((item) => {
      const date = (new Date(item.date)).toISOString().split('T')[0];
      return {
        name: date,
        completed: item.total_habits_for_day ? (item.habits_completed / item.total_habits_for_day) : 0
      }
    })});
    await loadNotes();
  }

  const maybeSelectRow = async (date: string) => {
    if (date === selectedDate || hasFocus === false) return;
    else setSelectedDate(date);
    if (date !== selectedDate) {
      setNotes(notes.map((n) => {
        return {
          note: n.note,
          date: n.date,
          highlight: n.date === date
        };
      }))
    }
  };

  const gotFocus = async () => {
    if (hasFocus === true) return;
    setHasFocus(true);
  };

  const lostFocus = async () => {
    if (hasFocus === false) return;
    else setHasFocus(false);
    setSelectedDate('');
    setNotes(notes.map((n) => {
      return {
        note: n.note,
        date: n.date,
        highlight: false
      };
    }));
  };

  const value = { metrics, notes, load, set, maybeSelectRow, gotFocus, lostFocus };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  return React.useContext(MetricsContext);
}
