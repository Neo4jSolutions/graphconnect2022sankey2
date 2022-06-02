
# Instructions

1. Copy `Sankey.js` to `SankeyState.js` under `/components`

2. Add `useState` as an import 

```
import React, { useState } from "react";
```

3. Add a `data2` after `data`

```
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
```

4. Modify `export function Sankey` to `export function SankeyState`

```
export function SankeyState(props) {
```

5. Add the following after `export function SankeyState(props) {`

```
    const [sankeyData, setSankeyData] = useState(data);

    const updateSankeyData = () => {
      setSankeyData(data2);
    }
```

This sets the initial state of `sankeyData` to `data` and provides a function `setSankeyData` to change it's value.

The function `updateSankeyData` uses `setSankeyData` to change the value of `sankeyData` to `data2`. When this happens, React understands that the value of `sankeyData` has changed and any components that rely on its data will be updated.

6. Change the `return` to the following:

```
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
```

- We added a `div` that now serves as the root of the `SankeyState` component.  
- We added an `h1` for a title
- We added another `div` that hold a single `button`
- On `button` onClick, we call the function `updateSankeyData` defined previously
- We changed the `data` property of `Chart` to be dependent on `sankeyData` instead of `data`

### components/SankeyState.js
```
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
```

7. Modify App.js

Add this line
```
import { SankeyState } from './components/SankeyState';
```

Remove the content under the `<header>` tag and put in `<SankeyState/>`

Optional: add a `style` tag to `header` to switch the color scheme from black to white.

### App.js
```
import './App.css';
import { SankeyState } from './components/SankeyState';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{background: 'white', color: 'black'}}>
        <SankeyState/>
      </header>
    </div>
  );
}

export default App;
```

Your browser will automatically refresh with the latest code changes.