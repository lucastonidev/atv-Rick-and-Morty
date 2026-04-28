// Guarda os personagens que estão na fila de atendimento.
// O primeiro item do array é sempre o personagem que será atendido primeiro.
const queue = [];

// Evita repetir personagens, guardando os IDs que já foram usados.
const usedIds = new Set();

// Quantidade total de personagens existentes na API oficial.
const maxCharacters = 826;

// Referências dos elementos da tela onde vamos mostrar as informações.
const currentImage = document.getElementById('currentImage');
const currentName = document.getElementById('currentName');
const currentSpecies = document.getElementById('currentSpecies');
const currentStatus = document.getElementById('currentStatus');
const currentDescription = document.getElementById('currentDescription');
const queueList = document.getElementById('queueList');
const servedBox = document.getElementById('servedBox');
const serveSound = document.getElementById('serveSound');

const addBtn = document.getElementById('addBtn');
const serveBtn = document.getElementById('serveBtn');
const clearBtn = document.getElementById('clearBtn');

// Gera um ID aleatório que ainda não foi usado.
// Isso ajuda a evitar repetir personagens na fila.
function getRandomId() {
  let id;
  do {
    id = Math.floor(Math.random() * maxCharacters) + 1;
  } while (usedIds.has(id) && usedIds.size < maxCharacters);

  usedIds.add(id);
  return id;
}

// Busca um personagem aleatório na API usando o ID gerado.
async function fetchRandomCharacter() {
  const id = getRandomId();
  const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

  if (!response.ok) throw new Error('Erro ao buscar personagem');

  return response.json();
}

// Atualiza a área do personagem em atendimento.
// Se a fila estiver vazia, mostra uma mensagem padrão.
function renderCurrent() {
  if (queue.length === 0) {
    currentImage.removeAttribute('src');
    currentImage.alt = 'Sem personagem';
    currentName.textContent = 'Nenhum personagem na fila';
    currentSpecies.textContent = 'Espécie: -';
    currentStatus.textContent = 'Status: -';
    currentSpecies.className = 'badge';
    currentStatus.className = 'badge';
    currentDescription.textContent = 'Adicione personagens à fila para começar o atendimento.';
    serveBtn.disabled = true;
    return;
  }

  const char = queue[0];
  currentImage.src = char.image;
  currentImage.alt = char.name;
  currentName.textContent = char.name;
  currentSpecies.textContent = `Espécie: ${char.species}`;
  currentStatus.textContent = `Status: ${char.status}`;

  currentSpecies.className = `badge ${char.status.toLowerCase()}`;
  currentStatus.className = `badge ${char.status.toLowerCase()}`;

  currentDescription.textContent = `Próximo a ser atendido: ${char.name}.`;
  serveBtn.disabled = false;
}

// Atualiza a lista visual dos personagens aguardando.
function renderQueue() {
  if (queue.length === 0) {
    queueList.innerHTML = '<div class="empty">A fila está vazia.</div>';
    return;
  }

  queueList.innerHTML = queue.map((char, index) => `
    <div class="queue-item ${index === 0 ? 'serving' : ''}">
      <img src="${char.image}" alt="${char.name}">
      <div>
        <p class="name">${index + 1}. ${char.name}</p>
        <div class="meta">${char.species} • ${char.status}</div>
      </div>
    </div>
  `).join('');
}

// Recoloca a interface em estado correto após qualquer alteração na fila.
function updateUI() {
  renderCurrent();
  renderQueue();
}

// Adiciona um novo personagem aleatório ao final da fila.
async function addCharacter() {
  addBtn.disabled = true;
  addBtn.textContent = 'Carregando...';

  try {
    const character = await fetchRandomCharacter();
    queue.push(character);
    updateUI();
  } catch (error) {
    alert('Não foi possível carregar um personagem.');
  } finally {
    addBtn.disabled = false;
    addBtn.textContent = 'Adicionar personagem aleatório';
  }
}

// Remove o primeiro personagem da fila e atualiza o atendimento.
// Também toca um som para deixar a ação mais divertida.
function serveCharacter() {
  if (queue.length === 0) return;

  const served = queue.shift();
  servedBox.textContent = `Último atendido: ${served.name} • ${served.species} • ${served.status}`;

  serveSound.currentTime = 0;
  serveSound.play().catch(() => {});

  updateUI();
}

// Limpa toda a fila e volta a interface para o estado inicial.
function clearQueue() {
  queue.length = 0;
  updateUI();
  servedBox.textContent = 'Último atendido: nenhum';
}

addBtn.addEventListener('click', addCharacter);
serveBtn.addEventListener('click', serveCharacter);
clearBtn.addEventListener('click', clearQueue);

updateUI();
