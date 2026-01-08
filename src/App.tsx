import Grid from '@mui/material/Grid'
import ExcelDropzone from './Excel/ExcelDropzone'
import { useState } from 'react'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import './App.css'
import { extractSubdata } from './Excel/SubdataExtractor';
import { agruparDatos } from './Excel/agruparDatos';
import DynamicTable from './Excel/DynamicTable'
import { clasificarCorrectos } from './Excel/clasificarCorrectos'
import { clasificarParcialesAGACE } from './Excel/clasificarParcialesAGACE'
import { clasificarParcialesDescargos } from './Excel/clasificarParcialesDescargos'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [dataAGACE, setDataAGACE] = useState<any[]>([]);
  const [dataDescargos, setDataDescargos] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [dataCorrectos, setDataCorrectos] = useState<any[]>([]);
  const [dataIncorrectos, setDataIncorrectos] = useState<any[]>([]);
  const [dataParcialesAGACE, setDataParcialesAGACE] = useState<any[]>([]);
  const [dataParcialesDescargos, setDataParcialesDescargos] = useState<any[]>([]);
  const [value, setValue] = useState(0);

  // Función para procesar y agrupar los datos al hacer clic
  const handleProcesarDatos = () => {
    const resultado = agruparDatos(dataAGACE, dataDescargos);
    setData(resultado);
    const { correctos, otros } = clasificarCorrectos(resultado);
    setDataCorrectos(correctos);
    const { parcialesAGACE, otros: otrosParciales } = clasificarParcialesAGACE(otros);
    const { parcialesDescargos, otros: otrosDescargos } = clasificarParcialesDescargos(otrosParciales);
    setDataParcialesAGACE(parcialesAGACE);
    setDataParcialesDescargos(parcialesDescargos);
    setDataIncorrectos(otrosDescargos);
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
    const result = extractSubdata(data, columns, 5)
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
    const result = extractSubdata(data, columns, 5)
    setDataDescargos(result as any[][]);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h2" color="initial" sx={{ mb: 2 }}>Comparación AGACE vs Descargos</Typography>
      <Typography variant="body2" color="initial" sx={{ mb: 5 }}>
        Esta aplicación permite comparar datos entre dos conjuntos de Excel: AGACE y Descargos.
        Sube ambos archivos, procesa los datos y muestra una tabla comparativa.
      </Typography>
      <Grid container spacing={3} columns={12}>
        <Grid size={6}>
          <Typography variant="h4" color="initial">AGACE</Typography>
          <ExcelDropzone onData={handleAGACE} />
        </Grid>
        <Grid size={6}>
          <Typography variant="h4" color="initial">Descargos</Typography>
          <ExcelDropzone onData={handleDescargos} />
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleProcesarDatos}>
        Procesar datos
      </Button>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Todos los datos" {...a11yProps(0)} />
          <Tab label="Correctos" {...a11yProps(1)} />
          <Tab label="Incorrectos" {...a11yProps(2)} />
          <Tab label="Parciales AGACE" {...a11yProps(3)} />
          <Tab label="Parciales Descargos" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {/* Todos los datos */}
        <DynamicTable data={data} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {/* Correctos */}
        <DynamicTable data={dataCorrectos} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {/* Incorrectos */}
        <DynamicTable data={dataIncorrectos} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        {/* Parciales AGACE */}
        <DynamicTable data={dataParcialesAGACE} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        {/* Parciales Descargos */}
        <DynamicTable data={dataParcialesDescargos} />
      </CustomTabPanel>
    </Box>
  )
}

export default App
