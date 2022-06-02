import React, { useState } from "react";

export function Hello (props) {

    const [name, setName] = useState('Eric');

    return (
        <h1>Hello, {name}</h1>
    )
}
