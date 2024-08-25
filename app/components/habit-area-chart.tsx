import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMetrics } from '../providers/metrics';

const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;
const tooltipFormatter = (value) => toPercent(value);

export default function HabitAreaChart(props) {
  const metrics = useMetrics();  

  function formatLabel(label) {
    requestAnimationFrame(() => {
      metrics.maybeSelectRow(label);
    });
    return label;
  }

  function gotFocus() {
    requestAnimationFrame(() => {
      metrics.gotFocus();
    });
  }

  function lostFocus() {
    requestAnimationFrame(() => {
      metrics.lostFocus();
    });  
  }
  
  return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          onMouseMove={gotFocus}
          onMouseLeave={lostFocus}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={toPercent} />
          <Tooltip formatter={tooltipFormatter} labelFormatter={formatLabel} />
          <Area type="monotone" dataKey="completed" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
}
