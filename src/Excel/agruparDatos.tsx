interface Registro {
  entrada: string;
  salida: string;
  claveInsumo: string;
  [key: string]: any;
}

interface TablaAgrupada {
  entrada: string;
  salida: string;
  claveInsumo: string;
  [columna: string]: any;
}

/**
 * Agrupa y fusiona los datos de AGACE y Descargos según entrada, salida y claveInsumo.
 * Las columnas que no son clave se renombran como <columna>-AGACE y <columna>-Descargos.
 */
export function agruparDatos(
  dataAGACE: Registro[],
  dataDescargos: Registro[]
): TablaAgrupada[] {
  // Agrupar por claves
  const key = (r: Registro) => `${r.entrada}|${r.salida}|${r.claveInsumo}`;
  const agaceMap = new Map<string, Registro>();
  const descargosMap = new Map<string, Registro>();

  dataAGACE.forEach(r => agaceMap.set(key(r), r));
  dataDescargos.forEach(r => descargosMap.set(key(r), r));

  // Unir todas las claves únicas
  const allKeys = new Set([
    ...Array.from(agaceMap.keys()),
    ...Array.from(descargosMap.keys())
  ]);

  const resultado: TablaAgrupada[] = [];


  // Orden definido por el usuario
  const userOrder = [
    'insumo',
    'fraccion',
    'importado',
    'claveProducto',
    'producto',
    'utilizado',
  ];
  // Detectar si hay columnas extra y agregarlas al final
  const columnasAGACE = new Set<string>();
  const columnasDescargos = new Set<string>();
  dataAGACE.forEach(r => Object.keys(r).forEach(col => {
    if (!['entrada', 'salida', 'claveInsumo'].includes(col)) columnasAGACE.add(col);
  }));
  dataDescargos.forEach(r => Object.keys(r).forEach(col => {
    if (!['entrada', 'salida', 'claveInsumo'].includes(col)) columnasDescargos.add(col);
  }));
  const allBaseColumnsSet = new Set([
    ...Array.from(columnasAGACE),
    ...Array.from(columnasDescargos)
  ]);
  // Ordenar según userOrder y luego las extras
  const allBaseColumns = [
    ...userOrder.filter(col => allBaseColumnsSet.has(col)),
    ...Array.from(allBaseColumnsSet).filter(col => !userOrder.includes(col))
  ];

  allKeys.forEach(k => {
    const agace = agaceMap.get(k);
    const descargo = descargosMap.get(k);
    const [entrada, salida, claveInsumo] = k.split('|');
    const row: TablaAgrupada = { entrada, salida, claveInsumo };
    // Para cada columna base, poner AGACE y Descargos juntos
    allBaseColumns.forEach(base => {
      row[`${base}-AGACE`] = agace && agace[base] !== undefined ? agace[base] : '';
      row[`${base}-Descargos`] = descargo && descargo[base] !== undefined ? descargo[base] : '';
    });
    resultado.push(row);
  });

  return resultado;
}
