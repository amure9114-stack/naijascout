import React, { useState, useEffect } from 'react';

const FootballCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateCursor);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      style={{
        width: '32px',
        height: '32px',
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <img
        src="/public/cursor.png"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default FootballCursor;
