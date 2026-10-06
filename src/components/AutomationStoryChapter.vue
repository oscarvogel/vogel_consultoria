<script setup>
import NarrativeChapter from './NarrativeChapter.vue';
const steps=[
 {title:'Planilla.',mode:'order',text:'Se leen los clientes activos y el período a consultar antes de iniciar el lote.'},
 {title:'Consulta.',mode:'connect',text:'Se opera únicamente con clientes delegados y dentro del alcance acordado con el estudio.'},
 {title:'Revisión.',mode:'automate',text:'El estudio conserva sus autorizaciones y revisa el resultado antes de darlo por válido.'},
 {title:'Evidencia.',mode:'decide',text:'La salida reúne carpetas por período y cliente, evidencia por CUIT y un resumen del lote.'},
];
</script>
<template><NarrativeChapter id="circuito-arca" chapter="automate" title="El flujo mensual, paso a paso." description="Desde la entrada controlada hasta la evidencia que revisa el estudio." :steps="steps" /></template>
