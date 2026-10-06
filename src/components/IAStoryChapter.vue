<script setup>
import NarrativeChapter from './NarrativeChapter.vue';
const steps=[
 {title:'Elegir la tarea.',mode:'order',text:'Priorizamos una actividad repetida o difícil de revisar y acordamos quién usará el resultado.'},
 {title:'Preparar el contexto.',mode:'connect',text:'Definimos las fuentes, permisos e instrucciones que necesita la asistencia.'},
 {title:'Revisar la salida.',mode:'automate',text:'El equipo verifica respuestas, corrige excepciones y conserva la decisión final.'},
 {title:'Volver al proceso.',mode:'decide',text:'Integramos la salida validada al trabajo habitual y dejamos documentados sus límites.'},
];
</script>
<template><NarrativeChapter id="problema-ia" chapter="connect" title="Del contexto a una asistencia revisable." description="Una secuencia para decidir dónde sumar IA y mantener el control del equipo." :steps="steps" /></template>
