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

📚 Contexto Adicional y Herramientas (Investigación)
Para solidificar la comprensión del proyecto y las prácticas de código utilizadas, realicé una breve revisión de conceptos técnicos clave.

1. Prácticas de Código y Node.js
La base de este proyecto es Node.js y Express. Para asegurar que el código fuera moderno y eficiente:

Asincronía con async/await: Se prioriza el uso de async/await en lugar de callbacks o .then() encadenados para manejar operaciones largas (como la conexión a la BD o las llamadas a las APIs) de forma limpia y legible. Esto hace que el código se sienta más "síncrono" y fácil de seguir.

Manejo de módulos: Se mantiene el código organizado usando módulos (db.js, server.js) y require() para una arquitectura limpia.

2. Gestión de la Base de Datos (MySQL)
Al usar mysql2/promise para la persistencia, se siguieron estas prácticas:

Uso de Pools de Conexión: En lugar de abrir y cerrar una conexión por cada solicitud, se usa un pool (piscina) de conexiones. Esto mejora drásticamente el rendimiento de la aplicación, ya que las conexiones se reutilizan.

Idempotencia con ON DUPLICATE KEY UPDATE: Para garantizar que al llamar varias veces al endpoint de la NASA, no se dupliquen los datos, se usa esta cláusula. Si un registro ya existe (el sol ya está en la BD), solo se actualiza; si no existe, se crea. Esto es crucial para la estabilidad de la API.

3. Principios de la IA (RAG)
El corazón de la funcionalidad es el mecanismo RAG (Retrieval-Augmented Generation). Este principio es clave en la IA moderna y es lo que hace que tu proyecto funcione:

RAG: Simplemente significa que, antes de preguntar a la IA, tú recuperas la información específica que necesitas (todos los datos de Marte de tu MySQL) y se la aumentas (añades) al prompt.

Ventaja: En lugar de dejar que Gemini use su conocimiento general, lo obligas a usar tus datos. Esto garantiza que la respuesta sea precisa y trazable a la base de datos de tu proyecto. El modelo actúa como una capa de consulta analítica sobre tu MySQL.