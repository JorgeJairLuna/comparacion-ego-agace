/**
 * Clasifica los datos agrupados en correctos y el resto.
 * Un registro es correcto si todos los campos (excepto claves) de AGACE y Descargos son iguales.
 * @param data Array de objetos agrupados (salida de agruparDatos)
 * @returns { correctos: any[], otros: any[] }
 */
export function clasificarCorrectos(data: any[]): { correctos: any[], otros: any[] } {
  const correctos: any[] = [];
  const otros: any[] = [];

  data.forEach(row => {
    // Detectar columnas comparables (terminan en -AGACE y -Descargos)
    const baseCols = Object.keys(row)
      .filter(col => col.endsWith('-AGACE'))
      .map(col => col.replace('-AGACE', ''));
    let esCorrecto = true;
    for (const base of baseCols) {
      if (row[`${base}-AGACE`] !== row[`${base}-Descargos`]) {
        esCorrecto = false;
        break;
      }
    }
    if (esCorrecto) {
      correctos.push(row);
    } else {
      otros.push(row);
    }
  });

  return { correctos, otros };
}
