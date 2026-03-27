import React, { useState, useEffect } from 'react';

interface UptimeProps {
  startDate: string; // Format: 'YYYY-MM-DD'
}

const UptimeCounter: React.FC<UptimeProps> = ({ startDate }) => {
  const [uptime, setUptime] = useState<string>("Initializing...");

  useEffect(() => {
    const calculate = () => {
      const start = new Date(startDate);
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      // Handle day rollover
      if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
      }

      // Handle month rollover
      if (months < 0) {
        years--;
        months += 12;
      }

      setUptime(`${years} years, ${months} months, ${days} days`);
    };

    calculate();
  }, [startDate]);

  return <span className="text-on-surface">{uptime}</span>;
};

export default UptimeCounter;
