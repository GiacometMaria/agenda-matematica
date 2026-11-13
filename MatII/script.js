document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reminder-form');
    const reminderText = document.getElementById('reminder-text');
    const reminderDay = document.getElementById('reminder-day');
    const remindersList = document.getElementById('reminders-list');
    const tabButtons = document.querySelectorAll('.tab-btn');


    // Chave para armazenamento no navegador
    const STORAGE_KEY = 'vintage_reminders_60s';


    // Estado atual da aba selecionada (padrão: segunda)
    let currentActiveDay = 'segunda';


    // Carregar lembretes salvos do localStorage
    let remindersData = loadReminders();


    // Evento de envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();


        const text = reminderText.value.trim();
        const day = reminderDay.value;


        if (!text || !day) return;


        // Objeto do novo lembrete
        const newReminder = {
            id: Date.now().toString(),
            text: text,
            day: day
        };


        // Adiciona ao array e salva
        remindersData.push(newReminder);
        saveReminders(remindersData);


        // Limpa o campo de texto
        reminderText.value = '';


        // Muda automaticamente para a aba do dia recém-adicionado para fácil visualização
        currentActiveDay = day;
        updateActiveTabUI();


        // Renderiza os lembretes
        renderReminders();
    });


    // Eventos de clique nas abas dos dias da semana
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentActiveDay = button.getAttribute('data-day');
            updateActiveTabUI();
            renderReminders();
        });
    });


    function updateActiveTabUI() {
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-day') === currentActiveDay) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }


    // Função para renderizar os lembretes da aba ativa
    function renderReminders() {
        remindersList.innerHTML = '';


        // Filtra os lembretes do dia selecionado
        const filteredReminders = remindersData.filter(item => item.day === currentActiveDay);


        if (filteredReminders.length === 0) {
            remindersList.innerHTML = `<p class="empty-message">Nenhum lembrete registrado para este dia.</p>`;
            return;
        }


        filteredReminders.forEach(reminder => {
            const card = document.createElement('div');
            card.className = 'reminder-card';


            const textSpan = document.createElement('span');
            textSpan.className = 'reminder-text-content';
            textSpan.textContent = reminder.text;


            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '✕';
            deleteBtn.title = 'Remover lembrete';
            deleteBtn.addEventListener('click', () => {
                deleteReminder(reminder.id);
            });


            card.appendChild(textSpan);
            card.appendChild(deleteBtn);
            remindersList.appendChild(card);
        });
    }


    // Função para excluir um lembrete
    function deleteReminder(id) {
        remindersData = remindersData.filter(item => item.id !== id);
        saveReminders(remindersData);
        renderReminders();
    }


    // Funções de Persistência (localStorage)
    function saveReminders(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }


    function loadReminders() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return [];
            }
        }
        return [];
    }


    // Inicialização da interface
    updateActiveTabUI();
    renderReminders();
});

