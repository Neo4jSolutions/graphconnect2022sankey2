import React, { useState } from "react";
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

export const data2 = [
  ["From", "To", "Weight"],
  ["A", "X", 1],
  ["A", "Y", 2],
  ["A", "Z", 3],
  ["C", "W", 5],
  ["B", "X", 4],
  ["B", "Y", 5],
  ["B", "Z", 6],
  ["X", "W", 7],
  ["X", "W", 8],
  ["W", "Y", 9],
];

export const options = {};

export function SankeyState(props) {

    const [sankeyData, setSankeyData] = useState(data);

    const updateSankeyData = () => {
      setSankeyData(data2);
    }

    return (
        <div style={{width:'99%'}}>
          <h1>Sankey Demo</h1>
          <div>
            <button onClick={() => updateSankeyData()}>Update Sankey</button>
          </div>
          <Chart
            chartType="Sankey"
            width="98%"
            height="300px"
            data={sankeyData}
            options={options}
          />
        </div>
      );
}