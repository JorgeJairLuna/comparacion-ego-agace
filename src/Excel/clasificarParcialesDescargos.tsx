/**
 * Clasifica los registros parciales de Descargos: aquellos donde hay información de Descargos pero no de AGACE.
 * @param data Array de objetos agrupados (salida de agruparDatos)
 * @returns { parcialesDescargos: any[], otros: any[] }
 */
export function clasificarParcialesDescargos(data: any[]): { parcialesDescargos: any[], otros: any[] } {
  const parcialesDescargos: any[] = [];
  const otros: any[] = [];

  data.forEach(row => {
    // Detectar columnas comparables (terminan en -AGACE y -Descargos)
    const baseCols = Object.keys(row)
      .filter(col => col.endsWith('-AGACE'))
      .map(col => col.replace('-AGACE', ''));
    // Si al menos un campo de Descargos tiene valor y el correspondiente de AGACE está vacío
    let esParcialDescargos = false;
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
    if (!tieneAGACE && tieneDescargos) {
      esParcialDescargos = true;
    }
    if (esParcialDescargos) {
      parcialesDescargos.push(row);
    } else {
      otros.push(row);
    }
  });

  return { parcialesDescargos, otros };
}
