import React, { useEffect } from 'react';
import './CoinFallBackground.css';

const CoinFallBackground = () => {
  useEffect(() => {
    const createCoin = () => {
      const coinsContainer = document.querySelector('.coins-container');
      if (!coinsContainer) return;

      const coin = document.createElement('div');
      coin.classList.add('coin');

      // Randomize umbrella properties
      const size = Math.random() * 30 + 10; // Size between 10px and 40px
      const posX = Math.random() * 100; // Random position across width (%)
      const delay = Math.random() * 5; // Random delay for animation
      const duration = Math.random() * 10 + 5; // Fall duration between 5-15s
      const rotation = Math.random() * 360; // Random rotation

      // Expanded color selection for more umbrella varieties
      const colors = ['red', 'yellow', 'blue', 'green', 'purple', 'orange'];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      
      // Add the color class - for new colors, we'll fall back to the existing three
      if (['red', 'yellow', 'blue'].includes(colorClass)) {
        coin.classList.add(`coin-${colorClass}`);
      } else if (colorClass === 'green') {
        coin.classList.add('coin-blue'); // Use blue as base but modify color
        coin.style.filter = 'hue-rotate(120deg)';
      } else if (colorClass === 'purple') {
        coin.classList.add('coin-red'); // Use red as base but modify color
        coin.style.filter = 'hue-rotate(60deg)';
      } else if (colorClass === 'orange') {
        coin.classList.add('coin-yellow'); // Use yellow as base but modify color
        coin.style.filter = 'hue-rotate(-30deg)';
      }

      // Apply styles
      coin.style.width = `${size}px`;
      coin.style.height = `${size}px`;
      coin.style.left = `${posX}%`;
      coin.style.animationDelay = `${delay}s`;
      coin.style.animationDuration = `${duration}s`;
      coin.style.transform = `rotate(${rotation}deg)`;

      // Add umbrella to container
      coinsContainer.appendChild(coin);

      // Remove umbrella after animation completes
      setTimeout(() => {
        if (coin.parentNode === coinsContainer) {
          coinsContainer.removeChild(coin);
        }
      }, (delay + duration) * 1000);
    };

    // Create more initial umbrellas
    for (let i = 0; i < 8; i++) {
      createCoin();
    }

    // Continue creating umbrellas at a faster rate
    const coinInterval = setInterval(createCoin, 1000);

    return () => {
      clearInterval(coinInterval);
    };
  }, []);

  return <div className="coins-container"></div>;
};

export default CoinFallBackground;


/* if you want more umbrellas to show switch it out for this below

import React, { useEffect } from 'react';
import './CoinFallBackground.css';

const CoinFallBackground = () => {
  useEffect(() => {
    const createCoin = () => {
      const coinsContainer = document.querySelector('.coins-container');
      if (!coinsContainer) return;

      const coin = document.createElement('div');
      coin.classList.add('coin');

      // Randomize umbrella properties
      const size = Math.random() * 30 + 10; // Size between 10px and 40px
      const posX = Math.random() * 100; // Random position across width (%)
      const delay = Math.random() * 5; // Random delay for animation
      const duration = Math.random() * 10 + 5; // Fall duration between 5-15s
      const rotation = Math.random() * 360; // Random rotation

      // Expanded color selection for more umbrella varieties
      const colors = ['red', 'yellow', 'blue', 'green', 'purple', 'orange', 'pink', 'teal'];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      
      // Add the color class - for new colors, we'll fall back to the existing three
      if (['red', 'yellow', 'blue'].includes(colorClass)) {
        coin.classList.add(`coin-${colorClass}`);
      } else if (colorClass === 'green') {
        coin.classList.add('coin-blue'); // Use blue as base but modify color
        coin.style.filter = 'hue-rotate(120deg)';
      } else if (colorClass === 'purple') {
        coin.classList.add('coin-red'); // Use red as base but modify color
        coin.style.filter = 'hue-rotate(60deg)';
      } else if (colorClass === 'orange') {
        coin.classList.add('coin-yellow'); // Use yellow as base but modify color
        coin.style.filter = 'hue-rotate(-30deg)';
      } else if (colorClass === 'pink') {
        coin.classList.add('coin-red'); // Use red as base but modify color
        coin.style.filter = 'hue-rotate(-30deg) saturate(1.5)';
      } else if (colorClass === 'teal') {
        coin.classList.add('coin-blue'); // Use blue as base but modify color
        coin.style.filter = 'hue-rotate(30deg) saturate(1.2)';
      }

      // Apply styles
      coin.style.width = `${size}px`;
      coin.style.height = `${size}px`;
      coin.style.left = `${posX}%`;
      coin.style.animationDelay = `${delay}s`;
      coin.style.animationDuration = `${duration}s`;
      coin.style.transform = `rotate(${rotation}deg)`;

      // Add umbrella to container
      coinsContainer.appendChild(coin);

      // Remove umbrella after animation completes
      setTimeout(() => {
        if (coin.parentNode === coinsContainer) {
          coinsContainer.removeChild(coin);
        }
      }, (delay + duration) * 1000);
    };

    // Create many more initial umbrellas
    for (let i = 0; i < 20; i++) {
      createCoin();
    }

    // Create umbrellas in batches
    const createUmbrellaBatch = () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createCoin(), i * 100);
      }
    };

    // Continue creating umbrellas at a much faster rate
    const coinInterval = setInterval(createUmbrellaBatch, 500);

    return () => {
      clearInterval(coinInterval);
    };
  }, []);

  return <div className="coins-container"></div>;
};

export default CoinFallBackground;

*/