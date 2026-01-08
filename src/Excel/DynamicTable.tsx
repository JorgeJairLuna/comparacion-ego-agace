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
  highlightDiffs?: boolean;
}


/**
 * Componente de tabla dinámica que genera encabezados y filas a partir de los datos recibidos.
 * @param data Array de objetos a mostrar en la tabla
 */

const DynamicTable: React.FC<Props> = ({ data, highlightDiffs }) => {
  if (!data || data.length === 0) {
    return <div>No hay datos para mostrar.</div>;
  }

  const headers = Object.keys(data[0]);

  // Si se activa highlightDiffs, buscar pares base-AGACE/base-Descargos
  let diffMap: Record<string, boolean[]> = {};
  if (highlightDiffs) {
    // Para cada fila, para cada base, marcar si es diferente
    data.forEach((row, rowIdx) => {
      headers.forEach(header => {
        if (header.endsWith('-AGACE')) {
          const base = header.replace('-AGACE', '');
          const agaceVal = row[`${base}-AGACE`];
          const descVal = row[`${base}-Descargos`];
          if (!diffMap[`${base}-AGACE`]) diffMap[`${base}-AGACE`] = [];
          if (!diffMap[`${base}-Descargos`]) diffMap[`${base}-Descargos`] = [];
          const isDiff = agaceVal !== descVal;
          diffMap[`${base}-AGACE`][rowIdx] = isDiff;
          diffMap[`${base}-Descargos`][rowIdx] = isDiff;
        }
      });
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} align="center" sx={{ fontWeight: 'bold' }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((header) => (
                <TableCell
                  key={header}
                  align="center"
                  sx={highlightDiffs && diffMap[header]?.[idx] ? { color: 'red', fontWeight: 'bold' } : {}}
                >
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
