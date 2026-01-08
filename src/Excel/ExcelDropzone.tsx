/**
 * ExcelDropzone
 *
 * Resumen:
 * Este componente React permite al usuario arrastrar y soltar (o seleccionar) un archivo Excel (.xlsx o .xls),
 * lo procesa usando SheetJS (xlsx) y retorna los datos extraídos en formato JSON a través de la prop onData.
 * Muestra el nombre del archivo seleccionado y un área visualmente atractiva para la carga.
 *
 * Props:
 * - onData: función callback que recibe los datos extraídos del archivo Excel como un array.
 */
import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import * as XLSX from 'xlsx';

/**
 * Props para ExcelDropzone
 * @property onData - Callback que recibe los datos extraídos del Excel
 */
interface props {
  onData: (data: any[]) => void;
}


/**
 * Componente para cargar archivos Excel mediante drag & drop o selección manual.
 * Procesa el archivo y envía los datos extraídos al callback onData.
 */
const ExcelDropzone: React.FC<props> = ({ onData }) => {
  // Estado para el nombre del archivo seleccionado
  const [fileName, setFileName] = useState<string | null>(null);
  // Estado para resaltar el área de drop cuando hay un archivo encima
  const [dragActive, setDragActive] = useState(false);

  /**
   * Maneja el evento cuando un archivo es arrastrado sobre el área
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /**
   * Maneja el evento cuando el archivo sale del área de drop
   */
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /**
   * Maneja el drop del archivo sobre el área
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      extractExcel(file);
    }
  };

  /**
   * Maneja la selección manual de archivo
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      extractExcel(file);
    }
  };

  /**
   * Extrae los datos del archivo Excel y los envía al callback
   */
  const extractExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      // Lee el archivo Excel y convierte la primera hoja a JSON
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      onData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Paper
        elevation={dragActive ? 8 : 2}
        sx={{
          p: 4,
          border: dragActive ? '2px solid #1976d2' : '2px dashed #90caf9',
          backgroundColor: dragActive ? '#e3f2fd' : '#fafafa',
          transition: 'all 0.2s',
          width: 400,
          textAlign: 'center',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Icono de carga */}
        <CloudUploadIcon color={dragActive ? 'primary' : 'action'} sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Arrastra tu archivo Excel aquí
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          o
        </Typography>
        {/* Botón para seleccionar archivo manualmente */}
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Seleccionar archivo
          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {/* Muestra el nombre del archivo seleccionado */}
        {fileName && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Archivo seleccionado: <b>{fileName}</b>
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ExcelDropzone;
