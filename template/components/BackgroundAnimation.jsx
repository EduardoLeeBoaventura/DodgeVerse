import React, { useState, useEffect } from 'react';

const BackgroundAnimation = () => {
  const [pixels, setPixels] = useState([]);

  useEffect(() => {
    const createPixel = () => {
      const id = Date.now() + Math.random();
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      return { id, size, left, top };
    };

    const interval = setInterval(() => {
      setPixels(prev => [...prev.slice(-29), createPixel()]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-animation">
      {pixels.map(pixel => (
        <div
          key={pixel.id}
          className="pixel"
          style={{
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            left: `${pixel.left}%`,
            top: `${pixel.top}%`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
