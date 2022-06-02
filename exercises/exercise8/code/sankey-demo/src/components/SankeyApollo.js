import React, { useState } from "react";
import { Chart } from "react-google-charts";
import {
  useLazyQuery,
  gql
} from "@apollo/client";

const SANKEY_BY_GEO_TYPE_ALL_COMMODITIES_TRANSPORT_MODE = gql`
  query SankeyByGeoTypeAllCommoditiesByTransportMode($geoType: String!) {
    sankeyByGeoTypeAllCommoditiesByTransportMode(geoType: $geoType) {
      start
      end
      value
    }
  }
`;

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

export function SankeyApollo(props) {

    const [sankeyData, setSankeyData] = useState(data);
    const [getSankeyGeoTypeAllCommoditiesTransportMode, sankeyStatus] = useLazyQuery(SANKEY_BY_GEO_TYPE_ALL_COMMODITIES_TRANSPORT_MODE);

    const geoTypeAllCommoditiesTransportModeClick = () => {
      getSankeyGeoTypeAllCommoditiesTransportMode({
        variables: { 
          geoType: "Division"
        },
        onCompleted(data) {
            console.log("sankey data: ", data);
            var dataFromServer = [];
            dataFromServer.push(["From", "To", "Tons (1000s)"]);
            data.sankeyByGeoTypeAllCommoditiesByTransportMode.map(x => 
              dataFromServer.push([x.start, x.end, x.value])
            );
            setSankeyData(dataFromServer);
        }      
      })
    }

    const updateSankeyData = () => {
      setSankeyData(data2);
    }

    if (sankeyStatus.loading) return 'Loading...';
    if (sankeyStatus.error) return `Error! ${sankeyStatus.error.message}`;     

    return (
        <div style={{width:'99%'}}>
          <h1>Sankey Demo</h1>
          <div>
            <button onClick={() => updateSankeyData()}>Update Sankey</button>
            <button style={{margin: '10px'}} onClick={() => geoTypeAllCommoditiesTransportModeClick()}>GeoType All Commodities Transport Mode</button>
          </div>
          <Chart
            chartType="Sankey"
            width="98%"
            height="500px"
            data={sankeyData}
            options={options}
          />
        </div>
      );
}