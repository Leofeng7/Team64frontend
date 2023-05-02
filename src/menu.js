import React, { useState } from 'react';
import { render } from 'react-dom';

const Menu = () => {
  const [smoothies, setSmoothies] = useState([
    { id: 1, name: 'The Hulk', description: 'This one is packed with spinach, kale, mango, pineapple, and banana.' },
    { id: 2, name: 'Tropical Mango', description: 'This smoothie is a blend of mango, pineapple, orange juice, and non-fat vanilla frozen yogurt.' },
    { id: 3, name: 'Angel Food', description: 'This one has strawberries, bananas, and vanilla, making it taste like a dessert!' },
    { id: 4, name: 'Pineapple Surf', description: 'This one is a blend of pineapple, coconut, and non-fat vanilla frozen yogurt.' },
    { id: 5, name: 'The Activator', description: 'This smoothie is made with blueberries, strawberries, bananas, and protein.' },
  ]);

  return (
    <div>
      <h1>Smoothie King Menu</h1>
      <ul>
        {smoothies.map(smoothie => (
          <li key={smoothie.id}>
            <h2>{smoothie.name}</h2>
            <p>{smoothie.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};