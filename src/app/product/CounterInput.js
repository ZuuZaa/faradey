import React, { useState } from 'react';

const CounterInput = ({ initialValue = 0, min = 0, max = 10 }) => {
    const [count, setCount] = useState(initialValue);

    const handleIncrement = () => {
        if (count < max) {
            setCount(prevCount => prevCount + 1);
        }
    };

    const handleDecrement = () => {
        if (count > min) {
            setCount(prevCount => prevCount - 1);
        }
    };

    return (
        <div className='minus-plus-wrap inline-flex'>
            <button onClick={handleDecrement} disabled={count <= min}>-</button>
            <input type="text" value={count} readOnly />
            <button onClick={handleIncrement} disabled={count >= max}>+</button>
        </div>
    );
};

export default CounterInput;