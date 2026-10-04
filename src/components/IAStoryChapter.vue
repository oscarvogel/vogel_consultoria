<script setup>
import NarrativeChapter from './NarrativeChapter.vue';
import assistant from '../assets/ia/ai-automation-assistant.webp';
const steps=[
 {title:'Tarea.',mode:'order',text:'Si te pasa esto, la IA ya puede ayudarte. Partimos de una tarea concreta y de la información que necesita tu equipo.',items:['Tenés datos pero no sabés qué decisiones tomar','Dependés demasiado de Excel','Tu equipo pierde tiempo en tareas repetitivas','Necesitás respuestas rápidas y no llegan','Querés usar IA pero no sabés por dónde empezar']},
 {title:'Asistencia.',mode:'connect',image:assistant,text:'Llevamos la inteligencia artificial a tu negocio de forma simple y aplicada. Diseñamos soluciones concretas para tu operación.'},
 {title:'Supervisión.',mode:'automate',text:'Definimos usos concretos, revisión humana y un alcance de implementación claro. La asistencia se integra en el proceso y el equipo conserva el criterio de decisión.'},
 {title:'Aplicación.',mode:'decide',text:'Enfoque de negocio: definimos primero el resultado que necesitás lograr y recién después elegimos la tecnología necesaria para conseguirlo.'},
];
</script>
<template><NarrativeChapter id="problema-ia" chapter="connect" title="Una tarea concreta. Un uso de IA definido." description="De la información disponible a una asistencia que el equipo puede aplicar y supervisar." :steps="steps" /></template>
