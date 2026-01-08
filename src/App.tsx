import Grid from '@mui/material/Grid'
import ExcelDropzone from './Excel/ExcelDropzone'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import './App.css'
import { extractSubdata } from './Excel/SubdataExtractor';
import { agruparDatos } from './Excel/agruparDatos';
import DynamicTable from './Excel/DynamicTable'

function App() {
  const [dataAGACE, setDataAGACE] = useState<any[]>([]);
  const [dataDescargos, setDataDescargos] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);

  // Función para procesar y agrupar los datos al hacer clic
  const handleProcesarDatos = () => {
    const resultado = agruparDatos(dataAGACE, dataDescargos);
    setData(resultado);
  };

  const handleAGACE = (data: any[]) => {
    const columns = {
      entrada: 'B',
      claveInsumo: 'G',
      insumo: 'H',
      fraccion: 'J',
      importado: 'N',
      salida: 'P',
      claveProducto: 'T',
      producto: 'U',
      utilizado: 'AB'
    }
    console.error('AGACE actual', data);
    const result = extractSubdata(data, columns, 5)
    console.error('AGACE actualizados', result);
    setDataAGACE(result as any[][]);
  };

  const handleDescargos = (data: any[]) => {
    const columns = {
      entrada: 'A',
      claveInsumo: 'F',
      insumo: 'G',
      fraccion: 'J',
      importado: 'O',
      salida: 'P',
      claveProducto: 'T',
      producto: 'U',
      utilizado: 'AD'
    }
    console.error('Descargos actual', data);
    const result = extractSubdata(data, columns, 5)
    console.error('Descargos actualizados', result);
    setDataDescargos(result as any[][]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} columns={12}>
        <Grid size={6}>
          <ExcelDropzone onData={handleAGACE} />
        </Grid>
        <Grid size={6}>
          <ExcelDropzone onData={handleDescargos} />
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleProcesarDatos}>
        Procesar datos
      </Button>
      <Box sx={{ mt: 3 }}>
        <DynamicTable data={data} />
      </Box>
    </Box>
  )
}

export default App
