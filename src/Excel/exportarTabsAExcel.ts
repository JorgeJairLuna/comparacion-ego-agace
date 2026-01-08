import * as XLSX from 'xlsx';

/**
 * Exporta los datos de los tabs a un archivo Excel, cada tab como una hoja.
 * @param tabs Array de objetos { nombre: string, datos: any[] }
 * @param nombreArchivo Nombre del archivo Excel a descargar
 */
export function exportarTabsAExcel(
  tabs: { nombre: string; datos: any[] }[],
  nombreArchivo: string = 'comparacion-ego.xlsx'
) {
  const wb = XLSX.utils.book_new();
  tabs.forEach(tab => {
    let ws;
    if (tab.datos && tab.datos.length > 0) {
      ws = XLSX.utils.json_to_sheet(tab.datos);
    } else {
      // Si no hay datos, crear una hoja con un mensaje
      ws = XLSX.utils.aoa_to_sheet([["Sin datos"]]);
    }
    XLSX.utils.book_append_sheet(wb, ws, tab.nombre);
  });
  XLSX.writeFile(wb, nombreArchivo);
}
