"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import style from "../app/page.module.css";
import { redirect } from "next/dist/server/api-utils";

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

      // Aquí definimos la lógica de procesamiento basada en la droguería seleccionada
      switch (selectedDrogueria) {
        case "1": // Disval
          processDisvalData(jsonData);
          break;
        case "2": // Monroe (lógica diferente)
          processMonroeData(jsonData);
          break;
        case "3": // Asoprofarma (lógica diferente)
          processAsoprofarmaData(jsonData);
          alert("Droguería inhabilitada");
          window.location.reload(); // Reinicia la página

          break;
        case "4": // Suizo (lógica diferente)
          processSuizoData(jsonData);
          alert("Droguería inhabilitada");
          window.location.reload(); // Reinicia la página

          break;
        case "5": // Del Sud (lógica diferente)
          processDelSudData(jsonData);
          alert("Droguería inhabilitada");
          window.location.reload(); // Reinicia la página

          break;
        default:
          alert("Droguería inhabilitada");
          window.location.reload(); // Reinicia la página
          break;
      }
    };
    reader.readAsBinaryString(file);
  };

  const processDisvalData = (data) => {
    const selectedData = data.map((row) => [row[0], row[1], row[4], row[6]]);
    const truncatedData = selectedData.slice(0, selectedData.length - 4);

    if (truncatedData.length > 1) {
      const headers = truncatedData[0];
      const rows = truncatedData.slice(1);

      setTableHeaders(headers);
      setTableData(rows);
      formatTableData(rows); // Aplica la transformación específica de Disval
    } else {
      alert("El archivo no contiene suficientes datos válidos.");
    }
  };

  const processMonroeData = (data) => {
    // Eliminar las primeras dos filas (índices 0 y 1)
    const filteredData = data.slice(2);
  
    // Seleccionar las columnas M (12), N (13), S (18), T (19)
    const selectedData = filteredData.map((row) => [row[12], row[13], row[18], row[19]]);
  
    // Eliminar las últimas 4 filas si hay menos de 4 filas de datos
    const truncatedData = selectedData.slice(0, selectedData.length - 4);
  
    if (truncatedData.length > 1) {
      const headers = ["Codigo de barras", "Descripcion", "Total", "Cantidad"];
      const rows = truncatedData;
  
      setTableHeaders(headers);
      setTableData(rows);
      formatMonroeTableData(rows); // Llamamos a la nueva función de formateo para Monroe
    } else {
      alert("El archivo no contiene suficientes datos válidos.");
    }
  };
  

  const processAsoprofarmaData = (data) => {
    // Agregar lógica específica para Asoprofarma
    // Procesa el archivo según el formato de Asoprofarma
  };

  const processSuizoData = (data) => {
    // Agregar lógica específica para Suizo
    // Procesa el archivo según el formato de Suizo
  };

  const processDelSudData = (data) => {
    // Agregar lógica específica para Del Sud
    // Procesa el archivo según el formato de Del Sud
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
      Código: row[1],
      Descripción: row[0],
      Cantidad: row[2],
      Unidad: "UN",
      "Precio Unit.": "",
      Neto: formatNumber(row[3]),
      Cuf: "DEPFA",
      "Fec.Vto.": futureDate.toLocaleDateString("es-ES"),
      Lote: "",
      "N°Serie": "",
      "Col. Datos Partidas": "",
      "Col.Datos Atrib.": "",
    }));

    setFormattedData(formattedData);
  };

  const formatMonroeTableData = (data) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setFullYear(today.getFullYear() + 3);
  
    // Formato específico para Monroe
    const formattedData = data.map((row) => ({
      Código: row[0],
      Descripción: row[1],
      Cantidad: row[3],
      Unidad: "UN",
      "Precio Unit.": "",
      Neto: formatNumber(row[2]),
      Cuf: "DEPFA",
      "Fec.Vto.": futureDate.toLocaleDateString("es-ES"),
      Lote: "",
      "N°Serie": "",
      "Col. Datos Partidas": "",
      "Col.Datos Atrib.": "",
    }));
  
    setFormattedData(formattedData);
  };

  const exportToExcel = () => {
    if (formattedData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Compras");
      // Cambiar 'xlsx' por 'xls' en el tipo de libro
      XLSX.writeFile(wb, "COMPRAS.xls", { bookType: "xls" });
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
        <button className="btn btn-secondary col-3" onClick={exportToExcel}>
          Convertir
        </button>
      </div>

     {/*  {tableData.length > 0 && (
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
      )} */}
    </div>
  );
}

export default Select;
