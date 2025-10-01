'use client';

import { useState, useEffect } from 'react';

export function BlinkingCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-accent font-mono" style={{ opacity: visible ? 1 : 0 }}>
      _
    </span>
  );
}
