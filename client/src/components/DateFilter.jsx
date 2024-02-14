import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateFilter.css";

const colombianTimeZone = "America/Bogota";
Intl.DateTimeFormat().resolvedOptions().timeZone = colombianTimeZone;

export function DateFilter({ onDateChange }) {
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);

  const handleDateChange = () => {
    const formattedStartDate = new Intl.DateTimeFormat("es-CO", { timeZone: colombianTimeZone }).format(startDate);
    const formattedEndDate = new Intl.DateTimeFormat("es-CO", { timeZone: colombianTimeZone }).format(endDate);
    onDateChange(formattedStartDate, formattedEndDate);
  };

  return (
    <div className="date-filter-container">
      <label className="date-label">Fecha de Inicio:</label>
      <DatePicker
        className="date-picker"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        isClearable
        placeholderText="Seleccione fecha"
      />

      <label className="date-label">Fecha de Fin:</label>
      <DatePicker
        className="date-picker"
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        isClearable
        placeholderText="Seleccione fecha"
      />

      <button className="filter-button" onClick={handleDateChange}>
        Filtrar
      </button>
    </div>
  );
}
