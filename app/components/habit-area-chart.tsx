import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { json, useLoaderData } from "@remix-run/react";

/*
const data = [
  {
    name: '2018-04-5',
    completed: 0.9
  },
  {
    name: '2018-04-6',
    completed: 1.0
  },
  {
    name: '2018-04-7',
    completed: 0.5
  },
  {
    name: '2018-04-8',
    completed: 0.5
  },
  {
    name: '2018-04-9',
    completed: 0.8
  },
  {
    name: '2018-04-10',
    completed: 0.8
  },
  {
    name: '2018-04-11',
    completed: 1.0
  },
];
*/

const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;
const tooltipFormatter = (value) => toPercent(value);

export default class HabitAreaChart extends PureComponent<{data: any}> {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={this.props.data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={toPercent} />
          <Tooltip formatter={tooltipFormatter} />
          <Area type="monotone" dataKey="completed" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
