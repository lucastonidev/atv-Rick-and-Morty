 const queue = [];
    const usedIds = new Set();
    const maxCharacters = 826;

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

    function getRandomId() {
      let id;
      do {
        id = Math.floor(Math.random() * maxCharacters) + 1;
      } while (usedIds.has(id) && usedIds.size < maxCharacters);
      usedIds.add(id);
      return id;
    }

    async function fetchRandomCharacter() {
      const id = getRandomId();
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      if (!response.ok) throw new Error('Erro ao buscar personagem');
      return response.json();
    }

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

    function updateUI() {
      renderCurrent();
      renderQueue();
    }

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

    function serveCharacter() {
      if (queue.length === 0) return;
      const served = queue.shift();
      servedBox.textContent = `Último atendido: ${served.name} • ${served.species} • ${served.status}`;
      serveSound.currentTime = 0;
      serveSound.play().catch(() => {});
      updateUI();
    }

    function clearQueue() {
      queue.length = 0;
      updateUI();
      servedBox.textContent = 'Último atendido: nenhum';
    }

    addBtn.addEventListener('click', addCharacter);
    serveBtn.addEventListener('click', serveCharacter);
    clearBtn.addEventListener('click', clearQueue);

    updateUI();