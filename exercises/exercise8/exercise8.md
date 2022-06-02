
# Instructions

## Modify sankey-demo/src/index.js

1. Goto the Terminal window with the React app and stop it.

2. Install Apollo Client and GraphQL using the following command:

```
npm install @apollo/client graphql
```

3. Open the `sankey-demo/src/index.js` file.

4. Add the following import statement after the other imports:

```
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
```

5. After the imports add the following:

```
const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache({
    resultCaching: false
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    }
  }
});
```

This sets up our connection to the GraphQL API listening on port 4001.

6. Under `root.render` put `ApolloProvider` around `App` as follows:

```
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
```

This enables Apollo Client functions like `useQuery` and `useLazyQuery` we use later to use the connection we set up.

7. The complete file should now look like:

### index.js
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4001/graphql',
  cache: new InMemoryCache({
    resultCaching: false
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
    },
    query: {
      fetchPolicy: 'no-cache',
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## Create and modify sankey-demo/src/components/SankeyApollo.js

1. Make a copy of `src/components/SankeyState.js` called `src/components/SankeyApollo.js`

2. Add the following to the imports section:

```
import {
  useLazyQuery,
  gql
} from "@apollo/client";
```

3. After the imports section add the following:

```
const SANKEY_BY_GEO_TYPE_ALL_COMMODITIES_TRANSPORT_MODE = gql`
  query SankeyByGeoTypeAllCommoditiesByTransportMode($geoType: String!) {
    sankeyByGeoTypeAllCommoditiesByTransportMode(geoType: $geoType) {
      start
      end
      value
    }
  }
`;
```

This is the same GraphQL we used in the Apollo Sandbox.

4. Rename the function from `export function SankeyState` to `export function SankeyApollo`

5. Add the lazy query declaration after the line with `useState`

```
    const [getSankeyGeoTypeAllCommoditiesTransportMode, sankeyStatus] = useLazyQuery(SANKEY_BY_GEO_TYPE_ALL_COMMODITIES_TRANSPORT_MODE);
```

The function `useLazyQuery` returns a function `getSankeyGeoTypeAllCommoditiesTransportMode` that we will call to invoke the GraphQL call. The `sankeyStatus` returned is a way for Apollo to report back Loading and Error statuses.

6. Add the following function after the line you just added:

```
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
```

Detailed explanation of code:

- We will call this function from a button. When the button is clicked we call `getSankeyGeoTypeAllCommoditiesTransportMode` we defined earlier as a lazy query. We pass in the required variable `geoType`.

- Additionally, we set up an `onCompleted` function that gets invoked by Apollo when the GraphQL call completes successfully. 

- When `onCompleted` is invoked, we first print the data to the console, then allocate an empty array `dataFromServer` to accept the data. We add the header row required by the Sankey Chart component first.

- The GraphQL data we receive from the GraphQL API call is in the `data` variable. It has a field called `sankeyByGeoTypeAllCommoditiesByTransportMode` which is the same name as the GraphQL query name. (It is possible to alias this before the call, but we didn't do that here).  The `sankeyByGeoTypeAllCommoditiesByTransportMode` field contains an array of `{ start: <start>, value: <value>, end: <value> }` maps, which are returned from our Cypher statement and passed back by Apollo Server.

- We use the Javascript function `map` to process each element in the array. Each element of the array is passed to an anonymous function `x => dataFromServer.push([x.start, x.end, x.value])`. The value of `x` is each `{ start: <start>, value: <value>, end: <value> }` map. We convert the map into a 3-element array with this syntax `[x.start, x.end, x.value]`. Each resulting 3-element array is added to the `dataFromServer` array we added the header to previously.

- Finally, we call the React state function `setSankeyData` with our `dataFromServer`. Doing this triggers React to re-render the `Chart` component automatically.

7. Before the return add the following:

```
    if (sankeyStatus.loading) return 'Loading...';
    if (sankeyStatus.error) return `Error! ${sankeyStatus.error.message}`;    
```

These help process Apollo loading and error states.

8. After the `Update Sankey` button add the following `button` definition

```
            <button style={{margin: '10px'}} onClick={() => geoTypeAllCommoditiesTransportModeClick()}>GeoType All Commodities Transport Mode</button>
```

This button calls the `geoTypeAllCommoditiesTransportModeClick` function when clicked triggering the GraphQL call and subsequent update of the Sankey.

9. In the `Chart` component, increase the height of the Chart from `300px` to `500px`

10. Save the `SankeyApollo` file. The complete should now look like:

### SankeyApollo.js
```
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
```

11. Modify App.js

Add this line
```
import { SankeyApollo } from './components/SankeyApollo';
```

Remove the content under the `<header>` tag and put in `<SankeyApollo/>`

12. Go to the Terminal and run the React app from the `sankey-demo` directory.

```
npm start
```

## More information
For more information on Apollo client and React see https://www.apollographql.com/docs/react/get-started/.