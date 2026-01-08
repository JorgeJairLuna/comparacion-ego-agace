# comparacion-ego-agace

Esta aplicación ayuda a comparar dos documentos clave para la empresa Ego:

- **AGACE**: Documento entregado por el SAT.
- **Reporte de Descargos**: Documento que Ego entrega al SAT.

La herramienta permite cargar ambos archivos Excel, agrupar y comparar la información relevante de cada uno, mostrando las diferencias y coincidencias de manera clara y ordenada. Es útil para auditoría, conciliación y control interno.

## ¿Cómo funciona?
1. Sube el archivo AGACE (SAT) y el reporte de descargos (Ego).
2. La app extrae, agrupa y compara los datos clave de ambos documentos.
3. Visualiza la comparación en una tabla dinámica para su análisis.

Ideal para áreas de comercio exterior, fiscal y auditoría en Ego.

# Arquitectura y descripción general

Esta aplicación está diseñada para comparar dos documentos clave para la empresa Ego: el archivo AGACE (SAT) y el reporte de descargos (Ego). La arquitectura es modular y cada función/componente tiene una responsabilidad clara.

## Componentes y funciones principales

### 1. ExcelDropzone
*Componente React que permite al usuario arrastrar y soltar (o seleccionar) un archivo Excel (.xlsx o .xls). Procesa el archivo usando SheetJS (xlsx) y retorna los datos extraídos en formato JSON a través de la prop onData. Muestra el nombre del archivo seleccionado y un área visualmente atractiva para la carga.*
- **Entrada:** Archivo Excel.
- **Salida:** Array JSON (matriz de filas y columnas crudas del Excel).
- **No modifica los datos, solo los extrae.**

### 2. extractSubdata
*Función que toma el JSON crudo de Excel y extrae solo las columnas relevantes, mapeando por letra de columna (A, B, ... AB, etc.). Convierte fechas seriales de Excel a formato ISO si es necesario.*
- **Entrada:** Array crudo de Excel, mapeo de columnas, fila de inicio.
- **Salida:** Array de objetos con solo los campos requeridos.
- **Soporta letras de columna simples y compuestas.**

### 3. agruparDatos
*Función que agrupa y compara los datos de AGACE y Descargos según las claves entrada, salida y claveInsumo. Renombra las columnas para que cada campo tenga su versión -AGACE y -Descargos, y las ordena para facilitar la comparación.*
- **Entrada:** Arrays de objetos de AGACE y Descargos.
- **Salida:** Array de objetos agrupados y comparados, listo para mostrar en tabla.
- **Ordena las columnas según la lógica de negocio.*

### 4. DynamicTable
*Componente React que recibe un array de objetos y genera una tabla dinámica usando Material UI. Los encabezados se generan automáticamente y las filas se muestran de forma responsiva.*
- **Entrada:** Array de objetos (la tabla agrupada).
- **Salida:** Tabla visual en pantalla.
- **No modifica los datos, solo los muestra.**

### 5. App
*Componente principal que orquesta el flujo: recibe los archivos, extrae los datos, los procesa y muestra la tabla comparativa. Gestiona el estado y las interacciones del usuario.*
- **Entrada:** Interacción del usuario (carga de archivos, clic en procesar).
- **Salida:** Visualización de la tabla comparativa.

### 6. Funciones de clasificación
*Permiten segmentar los resultados agrupados para un análisis más detallado y útil.*
- **clasificarCorrectos:** identifica registros donde los datos de AGACE y Descargos son iguales en todos los campos relevantes.
- **clasificarParcialesAGACE:** identifica registros donde solo hay información en AGACE y no en Descargos.
- **clasificarParcialesDescargos:** identifica registros donde solo hay información en Descargos y no en AGACE.

Estas funciones permiten mostrar tablas separadas para coincidencias exactas, diferencias y registros parciales, facilitando la revisión y auditoría de los datos.

---

Esta arquitectura permite separar claramente la extracción, transformación, agrupación y visualización de los datos, facilitando el mantenimiento y la extensión de la aplicación.
