import * as React from "react";

export interface MetricType {
  daily: Array<{
    name: string;
    completed: number;
  }>
}

interface MetricsType {
  metrics: MetricType; 
  load: () => Promise<void>;
  set: (metrics: MetricType) => {};
}

const MetricsContext = React.createContext<MetricsType>(null!);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] =  React.useState<MetricType>({daily: []});

  const set = (metrics: MetricType) => {
    setMetrics(metrics);
    return {}
  }

  const load = async () => {
    const resp = await fetch("/v1/metrics");
    const m = await resp.json();
    set({daily: m.map((item) => {
      const date = (new Date(item.date)).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
      return {
        name: date,
        completed: item.habits_completed / item.total_habits_for_day
      }
    })});
  }

  const value = { metrics, load, set };

  return <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>;
}

export function useMetrics() {
  return React.useContext(MetricsContext);
}
