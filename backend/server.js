require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const pool = require('../db');
const { OpenAIApi, Configuration } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const NASA_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const OPENAI_KEY = process.env.OPENAI_API_KEY || null;

// Configurar OpenAI solo si hay clave
let openai = null;
if (OPENAI_KEY) {
  const config = new Configuration({ apiKey: OPENAI_KEY });
  openai = new OpenAIApi(config);
  console.log("OpenAI configurado.");
} else {
  console.log("No hay OPENAI_API_KEY en .env");
}

// Inicializar base de datos
async function initDB() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS sols (
      sol INT PRIMARY KEY,
      date VARCHAR(50),
      max_temp FLOAT,
      min_temp FLOAT,
      avg_temp FLOAT,
      pressure FLOAT,
      wind_speed FLOAT,
      raw_json TEXT
    );
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(createTableQuery);
    connection.release();
    console.log("Tabla 'sols' lista en la base de datos.");
  } catch (error) {
    console.error("Error al inicializar DB:", error);
  }
}

initDB();

// Ruta 1: Descargar datos de la NASA y guardar
app.post('/api/fetch-nasa', async (req, res) => {
  try {
    const url = `https://api.nasa.gov/insight_weather/?api_key=${NASA_KEY}&feedtype=json&ver=1.0`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ error: 'Error al consumir la NASA API' });
    }

    const data = await response.json();
    const sols = data.sol_keys || [];

    const connection = await pool.getConnection();

    for (const sol of sols) {
      const entry = data[sol];
      const info = {
        sol: Number(sol),
        date: entry?.First_UTC ?? null,
        max_temp: entry?.AT?.mx ?? null,
        min_temp: entry?.AT?.mn ?? null,
        avg_temp: entry?.AT?.av ?? null,
        pressure: entry?.PRE?.av ?? null,
        wind_speed: entry?.HWS?.av ?? null,
        raw_json: JSON.stringify(entry)
      };

      const sql = `
        INSERT INTO sols (sol, date, max_temp, min_temp, avg_temp, pressure, wind_speed, raw_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          date = VALUES(date),
          max_temp = VALUES(max_temp),
          min_temp = VALUES(min_temp),
          avg_temp = VALUES(avg_temp),
          pressure = VALUES(pressure),
          wind_speed = VALUES(wind_speed),
          raw_json = VALUES(raw_json);
      `;
      await connection.query(sql, [
        info.sol,
        info.date,
        info.max_temp,
        info.min_temp,
        info.avg_temp,
        info.pressure,
        info.wind_speed,
        info.raw_json
      ]);
    }

    connection.release();
    res.json({ mensaje: "Datos de NASA guardados", cantidad: sols.length });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fallo interno del servidor" });
  }
});

// Ruta 2: Obtener datos guardados
app.get('/api/data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(`
      SELECT sol, date, max_temp, min_temp, avg_temp, pressure, wind_speed
      FROM sols
      ORDER BY sol DESC
    `);
    connection.release();
    res.json({ count: result.length, sols: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
});

// Ruta 3: Preguntar a la IA
app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Falta 'question'" });

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM sols ORDER BY sol DESC`);
    connection.release();

    if (!rows.length) {
      return res.status(400).json({ error: 'No hay datos guardados.' });
    }

    const resumen = rows.slice(0, 10).map(r =>
      `Sol ${r.sol}: fecha=${r.date}, prom=${r.avg_temp}, min=${r.min_temp}, max=${r.max_temp}`
    ).join('\n');

    const prompt = `
Tienes datos meteorológicos de InSight en Marte:
${resumen}

Pregunta del usuario: "${question}"

Responde en español usando únicamente los datos provistos.
`;

    if (!openai) {
      return res.json({
        answer: 'No se configuró OPENAI_API_KEY. Agrega tu clave para activar la IA.',
        usedOpenAI: false
      });
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente en español." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.2
    });

    const respuesta = completion.data.choices[0].message.content.trim();
    res.json({ answer: respuesta, usedOpenAI: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al conectar con IA" });
  }
});

// Ruta 4: Ping
app.get('/api/ping', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
