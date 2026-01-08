/**
 * Clasifica los registros parciales de AGACE: aquellos donde hay información de AGACE pero no de Descargos.
 * @param data Array de objetos agrupados (salida de agruparDatos)
 * @returns { parcialesAGACE: any[], otros: any[] }
 */
export function clasificarParcialesAGACE(data: any[]): { parcialesAGACE: any[], otros: any[] } {
  const parcialesAGACE: any[] = [];
  const otros: any[] = [];

  data.forEach(row => {
    // Detectar columnas comparables (terminan en -AGACE y -Descargos)
    const baseCols = Object.keys(row)
      .filter(col => col.endsWith('-AGACE'))
      .map(col => col.replace('-AGACE', ''));
    // Si al menos un campo de AGACE tiene valor y el correspondiente de Descargos está vacío
    let esParcialAGACE = false;
    let tieneAGACE = false;
    let tieneDescargos = false;
    for (const base of baseCols) {
      if (row[`${base}-AGACE`] !== '' && row[`${base}-AGACE`] !== undefined) {
        tieneAGACE = true;
      }
      if (row[`${base}-Descargos`] !== '' && row[`${base}-Descargos`] !== undefined) {
        tieneDescargos = true;
      }
    }
    if (tieneAGACE && !tieneDescargos) {
      esParcialAGACE = true;
    }
    if (esParcialAGACE) {
      parcialesAGACE.push(row);
    } else {
      otros.push(row);
    }
  });

  return { parcialesAGACE, otros };
}
