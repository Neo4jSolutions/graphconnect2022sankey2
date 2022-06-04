
# Instructions

1. Create a folder under `/src` called `/components`

2. Create a file called `Hello.js` under `/components`

### components/Hello.js
```jsx
import React, { useState } from "react";

export function Hello (props) {

    const [name, setName] = useState('Eric');

    return (
        <h1>Hello, {name}</h1>
    )
}
```

Change your name from `Eric` to your name. 

We are using React `useState`. The `useState` function takes an optional initialization argument, in this case `Eric`, and returns an array of 2 items:

* name: the state variable that holds the data
* setState: a function that allows you to update the value of `name`

The `name` variable is used in the return, and we reference it using the `{name}` syntax. React uses JSX, a way to mix HTML and Javascript. The `{` and `}` braces let's us use Javascript code mixed in with the HTML.

We won't use `setState` yet, we'll see how it's used in a future exercise.


3. Modify App.js

Add this line
```jsx
import { Hello } from './components/Hello';
```

Remove the content under the `<header>` tag and put in `<Hello/>`. This is what your `App.js` will look like after the changes:

### App.js
```jsx
import './App.css';
import { Hello } from './components/Hello';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Hello/>
      </header>
    </div>
  );
}

export default App;
```

Your browser will automatically refresh with the latest code changes.