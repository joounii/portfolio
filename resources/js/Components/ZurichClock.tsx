import React, { useState, useEffect } from 'react';

const ZurichClock: React.FC = () => {
  const [time, setTime] = useState<string>('--:--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const zurichTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Zurich',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      setTime(`${zurichTime}_UTC`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span>SYSTEM_TIME: {time}</span>;
};

export default ZurichClock;
