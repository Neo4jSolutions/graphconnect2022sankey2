
# Instructions

1. Create a folder under `/src` called `/components`

2. Create a file called `Hello.js` under `/components`

### components/Hello.js
```
import React, { useState } from "react";

export function Hello (props) {

    const [name, setName] = useState('Eric');

    return (
        <h1>Hello, {name}</h1>
    )
}
```

3. Modify App.js

Add this line
```
import { Hello } from './components/Hello';
```

Remove the content under `<header>` tag and put in `<Hello/>`

### App.js
```
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