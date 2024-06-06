import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../css/CalendarComponent.css" 

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const onChange = date => {
    setDate(date);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
    
      <Calendar
        onChange={onChange}
        value={date}
        className="custom-calendar"
      />
     
    </div>
  );
};

export default CalendarComponent;