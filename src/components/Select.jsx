"use client";
import style from "../app/page.module.css";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Asegúrate de importar Bootstrap
import * as XLSX from "xlsx"; // Importa la librería xlsx para leer archivos

function Select() {
  const [selectedDrogueria, setSelectedDrogueria] = useState("1");
  const [file, setFile] = useState(null); // Para almacenar el archivo cargado

  const handleChange = (event) => {
    setSelectedDrogueria(event.target.value);
  };

  // Función para manejar la carga del archivo
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0]; // Obtiene el primer archivo
    if (uploadedFile) {
      setFile(uploadedFile);
      processFile(uploadedFile); // Procesa el archivo cuando se carga
    }
  };

  // Función para procesar el archivo Excel
  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Supongamos que queremos trabajar con la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convierte la hoja en formato JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData); // Aquí tienes los datos del archivo
      // Puedes hacer algo con los datos según la droguería seleccionada
    };
    reader.readAsBinaryString(file); // Lee el archivo como una cadena binaria
  };

  // Función para manejar el clic en el botón "Convertir"
  const handleConvertClick = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo antes de convertir.");
      return;
    }

    // Verifica la droguería seleccionada y emite el mensaje correspondiente
    switch (selectedDrogueria) {
      case "1":
        alert("Hola soy Disval");
        break;
      case "2":
        alert("Hola soy Monroe");
        break;
      default:
        alert("Droguería seleccionada no tiene un mensaje definido.");
        break;
    }
  };

  return (
    <div className="container-fluid mt-5 d-flex flex-column justify-content-center">
      <label className="text-light">Seleccionar drogueria</label>
      <select
        className="form-select"
        id="Select"
        aria-label="Seleccionar Drogueria"
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

        {/* Campo de entrada de archivo */}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>

      {/* Envolvemos el botón en un div centrado */}
      <div className="d-flex justify-content-center mt-3">
        <button className="btn btn-secondary col-3" onClick={handleConvertClick}>
          Convertir
        </button>
      </div>
    </div>
  );
}

export default Select;
