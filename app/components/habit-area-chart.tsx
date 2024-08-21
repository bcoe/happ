import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { json, useLoaderData } from "@remix-run/react";

const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;
const tooltipFormatter = (value) => toPercent(value);

export default class HabitAreaChart extends PureComponent<{data: any}> {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
