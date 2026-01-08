/**
 * SubdataExtractor
 *
 * Resumen:
 * Este módulo proporciona una función para extraer y transformar datos específicos de un arreglo crudo proveniente de Excel,
 * mapeando columnas por letra y convirtiendo fechas seriales de Excel a formato ISO (YYYY-MM-DD).
 * Ahora es completamente genérico: permite extraer cualquier conjunto de campos definidos dinámicamente en el mapeo.
 */

/**
 * Mapeo de columnas: relación entre nombre lógico y letra de columna de Excel
 * Ejemplo: { campo1: 'A', campo2: 'B', fecha: 'C' }
 */
export type ColumnMap = Record<string, string>;

/**
 * Extrae subdata de un array crudo de Excel según el mapeo de columnas y la fila de inicio.
 *
 * @param data Array de arrays (Excel crudo)
 * @param columnsMap Relación de datos con columnas (ej: { campo1: 'A', campo2: 'B', fecha: 'C' })
 * @param startRow Fila de inicio (1-indexed)
 * @returns Array de objetos con los datos extraídos y fechas en formato ISO si aplica
 */
export function extractSubdata(
  data: any[][],
  columnsMap: ColumnMap,
  startRow: number
): any[] {
  /**
   * Convierte letra de columna de Excel a índice numérico (A=0, B=1, ...)
   */
  // Soporta letras de columna simples y compuestas (A, Z, AA, AB, etc.)
  const colToIdx = (col: string) => {
    if (!col) return -1;
    let idx = 0;
    const letters = col.trim().toUpperCase();
    for (let i = 0; i < letters.length; i++) {
      idx *= 26;
      idx += letters.charCodeAt(i) - 65 + 1;
    }
    return idx - 1;
  };

  /**
   * Convierte número serial de Excel a string YYYY-MM-DD
   */
  const excelDateToString = (value: any) => {
    if (typeof value === 'number') {
      // Excel serial date: 1 Jan 1900 = 1
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      // Ajuste por zona horaria UTC
      const iso = date.toISOString().slice(0, 10);
      return iso;
    }
    return value;
  };

  const result: any[] = [];
  for (let i = startRow - 1; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;
    // Construye el objeto dinámicamente según el mapeo recibido
    const obj: Record<string, any> = {};
    for (const [field, colLetter] of Object.entries(columnsMap)) {
      const value = row[colToIdx(colLetter)] ?? '';
      // Si el nombre del campo incluye "fecha" o "date", intenta convertirlo a string ISO si es número
      if (/fecha|date/i.test(field)) {
        obj[field] = excelDateToString(value);
      } else {
        obj[field] = value;
      }
    }
    // Omite filas vacías
    if (Object.values(obj).every(v => v === '' || v === undefined)) continue;
    result.push(obj);
  }
  return result;
}
