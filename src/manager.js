import React, { useState } from 'react';
import { render } from 'react-dom';

const Inventory = () => {
  const [items, setitems] = useState([
    { id: 1, name: 'Cocoa', quantitylbs: 34, ppp: 20.01 },
    { id: 2, name: 'Almond Butter', quantitylbs:40.5, ppp: 10.88  },
    { id: 3, name: 'Almonds', quantitylbs: 47, ppp: 2.88 },
    { id: 4, name: 'Apple Blueberry Juice Blend', quantitylbs: 53.5, ppp: 30.58  },
    { id: 5, name: 'Apple Juice Blend', quantitylbs: 60, ppp: 22.015  },
  ]);

  return (
    <div>
      <h1>Inventory items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.quantitylbs}</p>
            <p>{item.ppp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};