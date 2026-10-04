<script setup>
import NarrativeChapter from './NarrativeChapter.vue';
const steps=[
 {title:'Planilla.',mode:'order',text:'Relevamos el circuito actual. La planilla operativa reúne los clientes activos y el período a consultar: una entrada controlada antes de ejecutar.'},
 {title:'Ejecución.',mode:'connect',text:'Armamos el flujo y las reglas. Seleccionamos el CUIT delegado y realizamos la consulta mensual dentro del alcance acordado.'},
 {title:'Revisión.',mode:'automate',text:'Ejecutamos con supervisión. Robot e IA operativa trabajan dentro de un proceso supervisado; la operación mantiene control humano y autorizaciones del estudio.'},
 {title:'Evidencia.',mode:'decide',text:'Entregamos evidencia y resumen. Carpetas por período y cliente, evidencia por CUIT y resumen del lote: una salida auditable para el control del estudio.'},
];
</script>
<template><NarrativeChapter id="circuito-arca" chapter="automate" title="Automatizacion con criterio de implementacion, no con magia" description="Partimos de un caso mensual acotado, dejamos el proceso documentado y medimos si el estudio realmente ahorra horas, errores y retrabajo." :steps="steps" /></template>
