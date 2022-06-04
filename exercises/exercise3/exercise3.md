
# Instructions

1. Stop the app and install

```
npm install --save react-google-charts
```

2. Create a file called `Sankey.js` under `/components`

### components/Sankey.js
```jsx
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
```

3. Modify App.js

Add this line
```jsx
import { Sankey } from './components/Sankey';
```

Remove the content under the `<header>` tag and put in `<Sankey/>`. This is what your `App.js` will look like after the changes:

### App.js
```jsx
import './App.css';
import { Sankey } from './components/Sankey';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Sankey/>
      </header>
    </div>
  );
}

export default App;
```

4. Restart the React app

```
npm start
```
