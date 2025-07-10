import React, { useEffect } from 'react';
import './CoinFallBackground.css';

const CoinFallBackground = () => {
  useEffect(() => {
    const createCoin = () => {
      const coinsContainer = document.querySelector('.coins-container');
      if (!coinsContainer) return;

      const coin = document.createElement('div');
      coin.classList.add('coin');

      // Randomize coin properties
      const size = Math.random() * 30 + 10; // Size between 10px and 40px
      const posX = Math.random() * 100; // Random position across width (%)
      const delay = Math.random() * 5; // Random delay for animation
      const duration = Math.random() * 10 + 5; // Fall duration between 5-15s
      const rotation = Math.random() * 360; // Random rotation

      // Randomly select a color
      const colors = ['red', 'yellow', 'blue'];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      coin.classList.add(`coin-${colorClass}`);

      // Apply styles
      coin.style.width = `${size}px`;
      coin.style.height = `${size}px`;
      coin.style.left = `${posX}%`;
      coin.style.animationDelay = `${delay}s`;
      coin.style.animationDuration = `${duration}s`;
      coin.style.transform = `rotate(${rotation}deg)`;

      // Add coin to container
      coinsContainer.appendChild(coin);

      // Remove coin after animation completes
      setTimeout(() => {
        if (coin.parentNode === coinsContainer) {
          coinsContainer.removeChild(coin);
        }
      }, (delay + duration) * 1000);
    };

    // Create initial coins
    for (let i = 0; i < 20; i++) {
      createCoin();
    }

    // Continue creating coins at intervals
    const coinInterval = setInterval(createCoin, 500);

    return () => {
      clearInterval(coinInterval);
    };
  }, []);

  return <div className="coins-container"></div>;
};

export default CoinFallBackground;
