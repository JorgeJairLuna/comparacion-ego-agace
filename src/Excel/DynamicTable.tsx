/**
 * DynamicTable
 *
 * Resumen:
 * Este componente React genera dinámicamente una tabla utilizando Material UI a partir de un arreglo de objetos.
 * Los encabezados se generan automáticamente a partir de las llaves del primer objeto del arreglo recibido como prop.
 * Si no hay datos, muestra un mensaje indicándolo. Es útil para mostrar datos tabulares de manera flexible y reutilizable.
 *
 * Props:
 * - data: Array de objetos, donde cada objeto representa una fila y sus propiedades son las columnas.
 */
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


/**
 * Props para DynamicTable
 * @property data - Array de objetos a mostrar en la tabla
 */
interface Props {
  data: any[];
}


/**
 * Componente de tabla dinámica que genera encabezados y filas a partir de los datos recibidos.
 * @param data Array de objetos a mostrar en la tabla
 */
const DynamicTable: React.FC<Props> = ({ data }) => {
  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  // Obtener las llaves del primer objeto para los encabezados de la tabla
  const headers = Object.keys(data[0]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {/* Renderiza los encabezados de la tabla */}
            {headers.map((header) => (
              <TableCell key={header} align="center" sx={{ fontWeight: 'bold' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Renderiza las filas de la tabla */}
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((header) => (
                <TableCell key={header} align="center">
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
