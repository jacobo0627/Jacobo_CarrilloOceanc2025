🚀 [JacoboCarrilloOceanc2025] - Proyecto Finalizado: El Clima de Marte con IA
¡Hola! Este es el resultado de mi microproyecto técnico, donde logré integrar datos del espacio exterior con la inteligencia artificial de Gemini. El objetivo era crear una aplicación que pudiera responder preguntas sobre datos que tú mismo has guardado, y ¡lo conseguí!

La aplicación consiste en un backend (servidor Node.js) que hace todo el trabajo pesado, y una interfaz sencilla para interactuar.

🎯 Objetivo Logrado
El objetivo principal de esta aplicación es demostrar la implementación de un flujo de RAG (Retrieval-Augmented Generation) ligero:

Trae los datos: Se conecta a la API de la NASA para obtener los últimos registros del clima de Marte (temperaturas, presión, etc.).

Guarda los datos: Almacena esa información fresca en una base de datos MySQL de forma segura, asegurando que no haya datos repetidos.

Responde preguntas con IA (La parte inteligente): Aquí es donde brilla. Cuando haces una pregunta (ej. "¿Cuál fue la temperatura máxima que guardé?"), el sistema le envía TODOS tus datos guardados a Gemini, y él te da la respuesta basada únicamente en tu información, ¡no en conocimiento general!

🛠️ Herramientas Usadas (Mi Caja de Herramientas)
Usé tecnologías modernas y estables para construir el proyecto:

Componente	Tecnología	Razón / Práctica Destacada
Servidor	Node.js con Express	Rápido y eficiente para la arquitectura de la API.
Base de Datos	MySQL (mysql2/promise)	Uso de pooling y consultas seguras (con parámetros) para optimizar recursos.
IA/LLM	Google Gemini API (@google/genai SDK)	Integración profesional y estable. Uso el modelo gemini-2.5-flash por su velocidad para tareas de resumen (RAG).
Datos	API de InSight de la NASA	Fuente oficial de datos.