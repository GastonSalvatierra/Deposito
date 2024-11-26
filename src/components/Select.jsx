"use client";
import style from "../app/page.module.css";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";

function Select() {
  const [selectedDrogueria, setSelectedDrogueria] = useState("1");
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const handleChange = (event) => {
    setSelectedDrogueria(event.target.value);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile);
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const selectedData = jsonData.map((row) => [row[0], row[1], row[4], row[6]]);
      const truncatedData = selectedData.slice(0, selectedData.length - 4);

      if (truncatedData.length > 1) {
        const headers = truncatedData[0];
        const data = truncatedData.slice(1);

        setTableHeaders(headers);
        setTableData(data);
        formatTableData(data); // Formatear los datos para la nueva tabla
      } else {
        alert("El archivo no contiene suficientes datos válidos.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const formatNumber = (number) => {
    if (typeof number === "number") {
      return number.toFixed(2).replace(".", ","); // Reemplaza el punto por una coma
    }
    return number; // Devuelve el valor original si no es un número
  };
  
  const formatTableData = (data) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setFullYear(today.getFullYear() + 3);
  
    const formattedData = data.map((row) => ({
      Código: row[1], // Columna B
      Descripción: row[0],
      Cantidad: row[2], // Columna E
      Unidad: "UN", // Texto fijo
      "Precio Unit.": "", // Campo vacío
      Neto: formatNumber(row[3]), // Formatear Neto con la misma función
      Cuf: "DEPFA", // Texto fijo
      "Fec.Vto.": futureDate.toLocaleDateString("es-ES"), // Fecha actual + 3 años
      Lote: "", // Campo vacío
      "N°Serie": "", // Campo vacío
      "Col. Datos Partidas": "", // Campo vacío
      "Col.Datos Atrib.": "", // Campo vacío
    }));
  
    setFormattedData(formattedData);
  };
  
  const exportToExcel = () => {
    // Verificar si la tabla formateada tiene datos
    if (formattedData.length > 0) {
      // Convertir los datos a un formato de hoja de Excel
      const ws = XLSX.utils.json_to_sheet(formattedData);
  
      // Crear un libro de trabajo (workbook)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Compras");
  
      // Generar el archivo .xls y activarlo para la descarga
      XLSX.writeFile(wb, "COMPRAS.xlsx");
    } else {
      alert("No hay datos para exportar.");
    }
  };
  
  return (
    <div className="container-fluid mt-5 d-flex flex-column justify-content-center">
      <label className="text-light">Seleccionar droguería</label>
      <select
        className="form-select"
        id="Select"
        aria-label="Seleccionar Droguería"
        value={selectedDrogueria}
        onChange={handleChange}
      >
        <option value="1">Disval</option>
        <option value="2">Monroe</option>
        <option value="3">Asoprofarma</option>
        <option value="4">Suizo</option>
        <option value="5">Del Sud</option>
      </select>
  
      <div
        className={`${style.archivos} text-light d-flex flex-column align-items-center justify-content-center mt-3 p-3`}
      >
        <img
          src="/upload.svg"
          className="logo"
          alt="Upload Icon"
          style={{ maxWidth: "100px", color: "white" }}
        />
        <p className="upload-text">Subir archivo</p>
  
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>
  
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary col-3"
          onClick={exportToExcel} // Vinculamos la función de exportación
        >
          Convertir
        </button>
      </div>
  
      {tableData.length > 0 && (
        <div className="mt-5">
          <h5 className="text-light">Tabla Original</h5>
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex}>
                      {typeof cell === "number" ? formatNumber(cell) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
  
      {formattedData.length > 0 && (
        <div className="mt-5">
          <h5 className="text-light">Tabla Formateada</h5>
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                {Object.keys(formattedData[0]).map((key, index) => (
                  <th key={index}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formattedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell, colIndex) => (
                    <td key={colIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}

export default Select;
