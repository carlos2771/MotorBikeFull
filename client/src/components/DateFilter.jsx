import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function DateFilter({ onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = () => {
    if (startDate && endDate) {
      onDateChange(startDate, endDate);
    } else {
      // Puedes manejar el caso en el que las fechas no estén seleccionadas
      console.warn("Seleccione ambas fechas para filtrar");
    }
  };

  return (
    <div>
      <label>Fecha de Inicio:</label>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        isClearable
        placeholderText="Seleccione fecha"
      />

      <label>Fecha de Fin:</label>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        isClearable
        placeholderText="Seleccione fecha"
      />

      <button onClick={handleDateChange}>Filtrar</button>
    </div>
  );
}
