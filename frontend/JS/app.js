// Referencias a elementos del DOM
const btnFetch = document.getElementById('btnFetch');
const btnLoad = document.getElementById('btnLoad');
const btnClear = document.getElementById('btnClear');
const btnExample = document.getElementById('btnExample');
const dataArea = document.getElementById('dataArea');
const askForm = document.getElementById('askForm');
const questionInput = document.getElementById('question');
const answerArea = document.getElementById('answerArea');

// ---------------------------------------
// 1. Descargar datos de la NASA y guardar
// ---------------------------------------
async function fetchNASA() {
  bloquearBotones(true);
  mostrarMensajeEnData('Descargando datos de la NASA...');
  
  try {
    const res = await fetch('/api/fetch-nasa', { method: 'POST' });
    const j = await res.json();
    mostrarMensajeEnData(JSON.stringify(j, null, 2));
    await loadData();
  } catch (error) {
    mostrarMensajeEnData('Error al descargar: ' + error.message);
  } finally {
    bloquearBotones(false);
  }
}

// ---------------------------------------
// 2. Cargar datos guardados desde la BD
// ---------------------------------------
async function loadData() {
  dataArea.innerHTML = 'Cargando...';
  try {
    const res = await fetch('/api/data');
    const j = await res.json();

    if (!j.sols || j.sols.length === 0) {
      dataArea.textContent = 'No hay registros en la base de datos todavía.';
      return;
    }

    // Crear tabla
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Sol</th>
          <th>Fecha</th>
          <th>T. Promedio</th>
          <th>T. Mínima</th>
          <th>T. Máxima</th>
          <th>Presión</th>
          <th>Viento</th>
        </tr>
      </thead>
    `;
    const tbody = document.createElement('tbody');

    j.sols.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.sol}</td>
        <td>${r.date || ''}</td>
        <td>${formatear(r.avg_temp)}</td>
        <td>${formatear(r.min_temp)}</td>
        <td>${formatear(r.max_temp)}</td>
        <td>${formatear(r.pressure)}</td>
        <td>${formatear(r.wind_speed)}</td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    dataArea.innerHTML = '';
    dataArea.appendChild(table);

  } catch (error) {
    dataArea.textContent = 'Error al cargar datos: ' + error.message;
  }
}

// ---------------------------------------
// 3. Enviar pregunta a la IA
// ---------------------------------------
askForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pregunta = questionInput.value.trim();
  if (!pregunta) return;

  answerArea.textContent = 'Consultando IA...';

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ question: pregunta })
    });
    const j = await res.json();
    
    if (j.answer) {
      answerArea.textContent = j.answer;
    } else {
      answerArea.textContent = 'No se pudo obtener una respuesta.';
    }

  } catch (error) {
    answerArea.textContent = 'Error al consultar la IA: ' + error.message;
  }
});

// ---------------------------------------
// Botón de ejemplo de pregunta
// ---------------------------------------
btnExample.addEventListener('click', () => {
  questionInput.value = '¿Cuál fue la temperatura máxima registrada en los datos guardados?';
});

// ---------------------------------------
// Limpiar vista de resultados
// ---------------------------------------
btnClear.addEventListener('click', () => {
  dataArea.innerHTML = 'Vista limpia.';
  answerArea.innerHTML = '';
});

// ---------------------------------------
// Asignación de eventos a los botones
// ---------------------------------------
btnFetch.addEventListener('click', fetchNASA);
btnLoad.addEventListener('click', loadData);

// ---------------------------------------
// Funciones auxiliares
// ---------------------------------------
function formatear(valor) {
  if (valor === null || valor === undefined) return '—';
  return Math.round(valor * 100) / 100;
}

function mostrarMensajeEnData(msg) {
  dataArea.innerHTML = '';
  const pre = document.createElement('pre');
  pre.textContent = msg;
  dataArea.appendChild(pre);
}

function bloquearBotones(bloquear) {
  btnFetch.disabled = bloquear;
  btnLoad.disabled = bloquear;
  btnClear.disabled = bloquear;
}

// Cargar datos al inicio
loadData();
