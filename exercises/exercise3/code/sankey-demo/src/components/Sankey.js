import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  ["From", "To", "Weight"],
  ["A", "X", 5],
  ["A", "Y", 7],
  ["A", "Z", 6],
  ["B", "X", 2],
  ["B", "Y", 9],
  ["B", "Z", 4],
  ["X", "W", 5],
  ["X", "W", 7],
  ["W", "Y", 1],
  ["W", "Z", 9],
];

export const options = {};

export function Sankey(props) {

    return (
        <Chart
          chartType="Sankey"
          width="98%"
          height="300px"
          data={data}
          options={options}
        />
      ); 
}