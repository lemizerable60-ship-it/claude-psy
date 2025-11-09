// ============ SETTINGS LAYER ============

class Settings {
  static getTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  static setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  static getFontSize() {
    return localStorage.getItem('fontSize') || 'medium';
  }

  static setFontSize(size) {
    localStorage.setItem('fontSize', size);
    document.body.setAttribute('data-font-size', size);
  }

  static init() {
    this.setTheme(this.getTheme());
    this.setFontSize(this.getFontSize());
  }

  static getAIKey() {
    return localStorage.getItem('ai-api-key') || '';
  }

  static setAIKey(key) {
    localStorage.setItem('ai-api-key', key);
  }
}

// ============ DATA LAYER ============

class Storage {
  static get(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
}

class DB {
  static getClients() {
    return Storage.get('clients', []);
  }

  static saveClients(clients) {
    Storage.set('clients', clients);
  }

  static addClient(client) {
    const clients = this.getClients();
    clients.push(client);
    this.saveClients(clients);
  }

  static updateClient(id, updatedData) {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updatedData };
      this.saveClients(clients);
    }
  }

  static deleteClient(id) {
    const clients = this.getClients().filter(c => c.id !== id);
    this.saveClients(clients);
    const results = this.getResults().filter(r => r.clientId !== id);
    this.saveResults(results);
  }

  static getResults() {
    return Storage.get('results', []);
  }

  static saveResults(results) {
    Storage.set('results', results);
  }

  static addResult(result) {
    const results = this.getResults();
    results.push(result);
    this.saveResults(results);
  }

  static getClientResults(clientId) {
    return this.getResults().filter(r => r.clientId === clientId);
  }

  static getClient(id) {
    return this.getClients().find(c => c.id === id);
  }

  static getResult(id) {
    return this.getResults().find(r => r.id === id);
  }
}

// ============ TESTS CONFIGURATION ============

const TESTS = {
  mmse: {
    id: 'mmse',
    name: 'MMSE',
    description: 'Краткая шкала оценки психического статуса',
    questions: [
      { question: 'Какой сейчас год?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Какое сейчас время года?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Какое сегодня число?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Какой сегодня день недели?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Какой сейчас месяц?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'В какой мы стране?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'В какой области/крае мы находимся?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'В каком городе мы находимся?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Как называется это учреждение?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'На каком мы этаже?', options: [{ text: 'Правильный ответ', score: 1 }, { text: 'Неправильный ответ', score: 0 }] },
      { question: 'Повторите три слова: ЯБЛОКО, СТОЛ, МОНЕТА', options: [{ text: 'Повторил все 3 слова', score: 3 }, { text: 'Повторил 2 слова', score: 2 }, { text: 'Повторил 1 слово', score: 1 }, { text: 'Не повторил ни одного', score: 0 }] },
      { question: 'Серийный счет: от 100 отнять 7 (первый раз)', options: [{ text: 'Правильно: 93', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'От результата отнять еще 7 (второй раз)', options: [{ text: 'Правильно: 86', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Продолжайте вычитать по 7 (третий раз)', options: [{ text: 'Правильно: 79', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Продолжайте вычитать по 7 (четвертый раз)', options: [{ text: 'Правильно: 72', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Продолжайте вычитать по 7 (пятый раз)', options: [{ text: 'Правильно: 65', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Вспомните три слова, которые я просил запомнить', options: [{ text: 'Вспомнил все 3 слова', score: 3 }, { text: 'Вспомнил 2 слова', score: 2 }, { text: 'Вспомнил 1 слово', score: 1 }, { text: 'Не вспомнил ни одного', score: 0 }] },
      { question: 'Покажите ручку. Как это называется?', options: [{ text: 'Правильно назвал', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Покажите часы. Как это называется?', options: [{ text: 'Правильно назвал', score: 1 }, { text: 'Неправильно', score: 0 }] },
      { question: 'Повторите фразу: "Никаких если, и или но"', options: [{ text: 'Повторил правильно', score: 1 }, { text: 'Не смог повторить', score: 0 }] },
      { question: 'Трехэтапная команда: "Возьмите лист бумаги правой рукой"', options: [{ text: 'Выполнил правильно', score: 1 }, { text: 'Не выполнил', score: 0 }] },
      { question: 'Сложите его пополам', options: [{ text: 'Выполнил правильно', score: 1 }, { text: 'Не выполнил', score: 0 }] },
      { question: 'Положите его на стол', options: [{ text: 'Выполнил правильно', score: 1 }, { text: 'Не выполнил', score: 0 }] },
      { question: 'Прочитайте и выполните: "ЗАКРОЙТЕ ГЛАЗА"', options: [{ text: 'Прочитал и выполнил', score: 1 }, { text: 'Не выполнил', score: 0 }] },
      { question: 'Напишите любое предложение', options: [{ text: 'Написал осмысленное предложение', score: 1 }, { text: 'Не написал', score: 0 }] },
      { question: 'Перерисуйте рисунок (два пересекающихся пятиугольника)', options: [{ text: 'Перерисовал правильно', score: 1 }, { text: 'Не справился', score: 0 }] }
    ],
    interpret: (score) => {
      if (score >= 28) return 'Норма (28-30 баллов): Когнитивные функции в пределах нормы';
      if (score >= 24) return 'Преддементные когнитивные нарушения (24-27 баллов)';
      if (score >= 20) return 'Деменция легкой степени (20-23 балла)';
      if (score >= 11) return 'Деменция умеренной степени (11-19 баллов)';
      return 'Тяжелая деменция (0-10 баллов)';
    }
  },

  hads: {
    id: 'hads',
    name: 'HADS',
    description: 'Госпитальная шкала тревоги и депрессии',
    questions: [
      { question: '1. Я испытываю напряжение, мне не по себе', options: [{ text: 'Все время', score: 3 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 1 }, { text: 'Совсем не испытываю', score: 0 }] },
      { question: '2. То, что приносило мне удовольствие, и сейчас вызывает то же чувство', options: [{ text: 'Определенно это так', score: 0 }, { text: 'Наверное, это так', score: 1 }, { text: 'Лишь в очень малой степени', score: 2 }, { text: 'Это совсем не так', score: 3 }] },
      { question: '3. Я испытываю страх, кажется, будто что-то ужасное может вот-вот случиться', options: [{ text: 'Определенно это так, и страх очень сильный', score: 3 }, { text: 'Да, это так, но страх не очень сильный', score: 2 }, { text: 'Иногда, но это меня не беспокоит', score: 1 }, { text: 'Совсем не испытываю', score: 0 }] },
      { question: '4. Я способен рассмеяться и увидеть в том или ином событии смешное', options: [{ text: 'Определенно это так', score: 0 }, { text: 'Наверное, это так', score: 1 }, { text: 'Лишь в очень малой степени', score: 2 }, { text: 'Совсем не способен', score: 3 }] },
      { question: '5. Беспокойные мысли крутятся у меня в голове', options: [{ text: 'Постоянно', score: 3 }, { text: 'Большую часть времени', score: 2 }, { text: 'Время от времени', score: 1 }, { text: 'Только иногда', score: 0 }] },
      { question: '6. Я испытываю бодрость', options: [{ text: 'Совсем не испытываю', score: 3 }, { text: 'Очень редко', score: 2 }, { text: 'Иногда', score: 1 }, { text: 'Практически все время', score: 0 }] },
      { question: '7. Я легко могу сесть и расслабиться', options: [{ text: 'Определенно это так', score: 0 }, { text: 'Наверное, это так', score: 1 }, { text: 'Лишь изредка это так', score: 2 }, { text: 'Совсем не могу', score: 3 }] },
      { question: '8. Мне кажется, что я стал все делать очень медленно', options: [{ text: 'Практически все время', score: 3 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 1 }, { text: 'Совсем нет', score: 0 }] },
      { question: '9. Я испытываю внутреннее напряжение или дрожь', options: [{ text: 'Совсем не испытываю', score: 0 }, { text: 'Иногда', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Очень часто', score: 3 }] },
      { question: '10. Я не слежу за своей внешностью', options: [{ text: 'Определенно это так', score: 3 }, { text: 'Я не уделяю этому столько времени, сколько нужно', score: 2 }, { text: 'Может быть, я стал меньше уделять этому внимания', score: 1 }, { text: 'Я слежу за собой так же, как и раньше', score: 0 }] },
      { question: '11. Я испытываю неусидчивость, словно мне постоянно нужно двигаться', options: [{ text: 'Определенно это так', score: 3 }, { text: 'Наверное, это так', score: 2 }, { text: 'Лишь в некоторой степени', score: 1 }, { text: 'Совсем не испытываю', score: 0 }] },
      { question: '12. Я считаю, что мои дела могут принести мне чувство удовлетворения', options: [{ text: 'Точно так же, как и обычно', score: 0 }, { text: 'Да, но не в той степени, как раньше', score: 1 }, { text: 'Значительно меньше, чем обычно', score: 2 }, { text: 'Совсем не считаю', score: 3 }] },
      { question: '13. У меня бывает внезапное чувство паники', options: [{ text: 'Очень часто', score: 3 }, { text: 'Довольно часто', score: 2 }, { text: 'Не так уж часто', score: 1 }, { text: 'Совсем не бывает', score: 0 }] },
      { question: '14. Я могу получить удовольствие от хорошей книги', options: [{ text: 'Часто', score: 0 }, { text: 'Иногда', score: 1 }, { text: 'Редко', score: 2 }, { text: 'Очень редко', score: 3 }] }
    ],
    interpret: (score) => {
      if (score <= 7) return 'Норма (0-7 баллов): Отсутствие достоверно выраженных симптомов тревоги и депрессии';
      if (score <= 10) return 'Субклинически выраженная тревога/депрессия (8-10 баллов)';
      return 'Клинически выраженная тревога/депрессия (11+ баллов)';
    }
  },

  zung: {
    id: 'zung',
    name: 'Шкала Цунга',
    description: 'Шкала самооценки депрессии',
    questions: [
      { question: '1. Я чувствую подавленность', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '2. Утром я чувствую себя лучше всего', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '3. У меня бывают периоды плача или близости к слезам', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '4. У меня плохой ночной сон', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '5. Я ем столько же, сколько и раньше', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '6. Я получаю удовольствие от общения', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '7. Я замечаю, что теряю вес', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '8. Меня беспокоят запоры', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '9. Мое сердце бьется быстрее, чем обычно', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '10. Я устаю без всякой причины', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '11. Мой ум также ясен, как и раньше', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '12. Мне легко делать то, что я умею', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '13. Я чувствую беспокойство и не могу усидеть на месте', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '14. У меня есть надежды на будущее', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '15. Я более раздражителен, чем обычно', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '16. Мне легко принимать решения', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '17. Я чувствую, что полезен и в моих услугах нуждаются', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '18. Я живу достаточно полной жизнью', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] },
      { question: '19. Я чувствую, что другим людям станет лучше, если я умру', options: [{ text: 'Никогда или изредка', score: 1 }, { text: 'Иногда', score: 2 }, { text: 'Часто', score: 3 }, { text: 'Почти всегда или постоянно', score: 4 }] },
      { question: '20. Я все еще получаю удовольствие от того, что мне нравилось раньше', options: [{ text: 'Почти всегда или постоянно', score: 1 }, { text: 'Часто', score: 2 }, { text: 'Иногда', score: 3 }, { text: 'Никогда или изредка', score: 4 }] }
    ],
    interpret: (score) => {
      const index = Math.round((score / 80) * 100);
      if (index < 50) return 'Нормальное состояние (индекс ' + index + ', сумма баллов ' + score + ')';
      if (index < 60) return 'Легкая депрессия (индекс ' + index + ', сумма баллов ' + score + ')';
      if (index < 70) return 'Умеренная депрессия (индекс ' + index + ', сумма баллов ' + score + ')';
      return 'Тяжелая депрессия (индекс ' + index + ', сумма баллов ' + score + ')';
    }
  }
};

// ============ ROUTER ============

class Router {
  static currentScreen = null;
  static params = {};
  static testState = { currentQuestion: 0, answers: [] };

  static navigate(screen, params = {}) {
    this.currentScreen = screen;
    this.params = params;
    this.render();
  }

  static render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    switch (this.currentScreen) {
      case 'home':
        app.innerHTML = this.HomeScreen();
        break;
      case 'settings':
        app.innerHTML = this.SettingsScreen();
        setTimeout(() => this.attachSettingsListeners(), 0);
        break;
      case 'clients':
        app.innerHTML = this.ClientsScreen();
        setTimeout(() => this.attachClientListeners(), 0);
        break;
      case 'addClient':
        app.innerHTML = this.AddClientScreen();
        setTimeout(() => this.attachAddClientListeners(), 0);
        break;
      case 'editClient':
        app.innerHTML = this.EditClientScreen();
        setTimeout(() => this.attachEditClientListeners(), 0);
        break;
      case 'selectClient':
        app.innerHTML = this.SelectClientScreen();
        break;
      case 'selectTest':
        app.innerHTML = this.SelectTestScreen();
        break;
      case 'runTest':
        app.innerHTML = this.RunTestScreen();
        setTimeout(() => this.attachTestListeners(), 0);
        break;
      case 'results':
        app.innerHTML = this.ResultsScreen();
        break;
      case 'viewResult':
        app.innerHTML = this.ViewResultScreen();
        break;
      case 'createReport':
        app.innerHTML = this.CreateReportScreen();
        setTimeout(() => this.attachReportListeners(), 0);
        break;
      case 'aiAnalysis':
        app.innerHTML = this.AIAnalysisScreen();
        setTimeout(() => this.attachAIListeners(), 0);
        break;
      case 'aiResult':
        app.innerHTML = this.AIResultScreen();
        break;
      default:
        app.innerHTML = this.HomeScreen();
    }
  }

  static attachSettingsListeners() {
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        Settings.setTheme(btn.dataset.themeOption);
        this.render();
      });
    });
    document.querySelectorAll('[data-fontsize-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        Settings.setFontSize(btn.dataset.fontsizeOption);
        this.render();
      });
    });
  }

  static attachClientListeners() {
    document.querySelectorAll('[data-edit-client]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Router.navigate('editClient', { clientId: btn.dataset.editClient });
      });
    });
    document.querySelectorAll('[data-delete-client]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const client = DB.getClient(btn.dataset.deleteClient);
        if (confirm('Удалить клиента "' + client.name + '"?\n\nВнимание: Будут удалены все результаты тестов этого клиента!')) {
          DB.deleteClient(btn.dataset.deleteClient);
          Router.render();
        }
      });
    });
  }

  static attachAddClientListeners() {
    const form = document.getElementById('addClientForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        DB.addClient({
          id: Date.now().toString(),
          name: document.getElementById('clientName').value,
          birthDate: document.getElementById('clientBirthDate').value,
          addedDate: new Date().toISOString()
        });
        Router.navigate('clients');
      });
    }
  }

  static attachEditClientListeners() {
    const form = document.getElementById('editClientForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        DB.updateClient(this.params.clientId, {
          name: document.getElementById('clientName').value,
          birthDate: document.getElementById('clientBirthDate').value
        });
        Router.navigate('clients');
      });
    }
  }

  static attachTestListeners() {
    const test = TESTS[this.params.testId];
    document.querySelectorAll('.answer-option').forEach(option => {
      option.addEventListener('click', () => {
        const score = parseInt(option.dataset.score);
        this.testState.answers.push(score);
        if (this.testState.currentQuestion < test.questions.length - 1) {
          this.testState.currentQuestion++;
          setTimeout(() => this.render(), 300);
        } else {
          const totalScore = this.testState.answers.reduce((a, b) => a + b, 0);
          DB.addResult({
            id: Date.now().toString(),
            clientId: this.params.clientId,
            testId: this.params.testId,
            date: new Date().toISOString(),
            score: totalScore,
            answers: [...this.testState.answers],
            interpretation: test.interpret(totalScore)
          });
          this.testState = { currentQuestion: 0, answers: [] };
          Router.navigate('results', { clientId: this.params.clientId });
        }
      });
    });
    const backBtn = document.getElementById('testBackBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (this.testState.currentQuestion > 0) {
          this.testState.currentQuestion--;
          this.testState.answers.pop();
          this.render();
        } else {
          this.testState = { currentQuestion: 0, answers: [] };
          Router.navigate('selectTest', { clientId: this.params.clientId });
        }
      });
    }
  }

  static attachReportListeners() {
    const form = document.getElementById('reportForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedIds = Array.from(document.querySelectorAll('input[name="resultIds"]:checked')).map(cb => cb.value);
        if (selectedIds.length === 0) {
          alert('Выберите хотя бы один результат');
          return;
        }
        this.downloadReport(selectedIds);
      });
    }
  }

  static attachAIListeners() {
    const generateBtn = document.getElementById('generateAIBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        const statusEl = document.getElementById('aiStatus');
        const btnEl = document.getElementById('generateAIBtn');
        
        statusEl.innerHTML = '<div style="text-align:center; padding: 2rem; font-size: var(--fs-lg);">🤖 AI анализирует результаты...<br><br>⏳ Это займёт 5-10 секунд</div>';
        btnEl.disabled = true;
        btnEl.style.opacity = '0.5';
        
        try {
          const analysis = await AI.generateAnalysis(Router.params.clientId);
          Router.navigate('aiResult', { analysisId: analysis.id });
        } catch (err) {
          statusEl.innerHTML = '<div style="color: var(--danger); padding: 2rem; text-align: center; font-size: var(--fs-lg);">❌ Ошибка: ' + err.message + '</div>';
          btnEl.disabled = false;
          btnEl.style.opacity = '1';
        }
      });
    }
  }

  static downloadReport(resultIds) {
    const client = DB.getClient(this.params.clientId);
    const results = resultIds.map(id => DB.getResult(id)).filter(Boolean);
    let report = 'ПРОТОКОЛ ПСИХОЛОГИЧЕСКОГО ОБСЛЕДОВАНИЯ\n';
    report += '============================================================\n\n';
    report += 'Клиент: ' + client.name + '\n';
    report += 'Дата рождения: ' + new Date(client.birthDate).toLocaleDateString('ru-RU') + '\n';
    report += 'Дата обследования: ' + new Date().toLocaleDateString('ru-RU') + '\n\n';
    report += '============================================================\n\n';
    results.forEach(result => {
      const test = TESTS[result.testId];
      report += 'МЕТОДИКА: ' + test.name + '\n';
      report += test.description + '\n';
      report += 'Дата проведения: ' + new Date(result.date).toLocaleString('ru-RU') + '\n\n';
      report += 'Итоговый балл: ' + result.score + '\n\n';
      report += 'ИНТЕРПРЕТАЦИЯ:\n' + result.interpretation + '\n\n';
      report += '============================================================\n\n';
    });
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'protocol_' + client.name + '_' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    Router.navigate('results', { clientId: this.params.clientId });
  }

  static exportToExcel() {
    const clients = DB.getClients();
    const results = DB.getResults();
    let csv = '\uFEFF';
    csv += 'ФИО;Дата рождения;Возраст;Название теста;Дата проведения;Балл;Результат;Рекомендации\n';
    clients.forEach(client => {
      const clientResults = results.filter(r => r.clientId === client.id);
      const age = Math.floor((new Date() - new Date(client.birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
      if (clientResults.length === 0) {
        csv += '"' + client.name + '";"' + new Date(client.birthDate).toLocaleDateString('ru-RU') + '";"' + age + '";"Нет тестов";"";"";"";""\n';
      } else {
        clientResults.forEach(result => {
          const test = TESTS[result.testId];
          const rec = this.getRecommendations(result.testId, result.score);
          csv += '"' + client.name + '";';
          csv += '"' + new Date(client.birthDate).toLocaleDateString('ru-RU') + '";';
          csv += '"' + age + '";';
          csv += '"' + test.name + '";';
          csv += '"' + new Date(result.date).toLocaleDateString('ru-RU') + ' ' + new Date(result.date).toLocaleTimeString('ru-RU') + '";';
          csv += '"' + result.score + '";';
          csv += '"' + result.interpretation.replace(/"/g, '""') + '";';
          csv += '"' + rec.replace(/"/g, '""') + '"\n';
        });
      }
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psychosuite_database_' + new Date().toISOString().slice(0,10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  static getRecommendations(testId, score) {
    if (testId === 'mmse') {
      if (score >= 28) return 'Рекомендации не требуются. Когнитивные функции в норме.';
      if (score >= 24) return 'Рекомендуется динамическое наблюдение, когнитивный тренинг.';
      if (score >= 20) return 'Необходима консультация невролога, комплексная нейропсихологическая диагностика.';
      if (score >= 11) return 'Необходима консультация психиатра/невролога, медикаментозная терапия, постоянный уход.';
      return 'Необходима консультация психиатра, медикаментозная терапия, постоянный квалифицированный уход.';
    }
    if (testId === 'hads') {
      if (score <= 7) return 'Рекомендации не требуются. Психоэмоциональное состояние в норме.';
      if (score <= 10) return 'Рекомендуется психологическая консультация, техники релаксации, нормализация режима дня.';
      return 'Рекомендуется консультация психотерапевта/психиатра, возможна медикаментозная поддержка, психотерапия.';
    }
    if (testId === 'zung') {
      const index = Math.round((score / 80) * 100);
      if (index < 50) return 'Рекомендации не требуются. Депрессивная симптоматика отсутствует.';
      if (index < 60) return 'Рекомендуется психологическая консультация, психотерапия, режим труда и отдыха.';
      if (index < 70) return 'Рекомендуется консультация психотерапевта/психиатра, психотерапия, возможна медикаментозная терапия.';
      return 'Необходима срочная консультация психиатра, комплексная терапия, возможна госпитализация.';
    }
    return 'Требуется индивидуальная консультация специалиста.';
  }

  static saveAIKey() {
    const key = document.getElementById('aiKeyInput').value.trim();
    Settings.setAIKey(key);
    alert(key ? '✅ API ключ сохранён!' : '⚠️ API ключ удалён');
  }

  static downloadAIReport(analysisId) {
    const analysis = AI.getAnalysis(analysisId);
    const client = DB.getClient(analysis.clientId);
    let report = 'AI-ЗАКЛЮЧЕНИЕ ПСИХОЛОГА\n';
    report += '============================================================\n\n';
    report += 'Клиент: ' + client.name + '\n';
    report += 'Дата анализа: ' + new Date(analysis.date).toLocaleString('ru-RU') + '\n\n';
    report += '============================================================\n\n';
    report += analysis.text;
    report += '\n\n============================================================\n';
    report += 'Сгенерировано AI-ассистентом PsychoSuite\n';
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_analysis_' + client.name + '_' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  static formatMarkdown(text) {
    return text
      .replace(/## (.+)/g, '<h3 style="color: var(--primary); margin-top: 1.5rem; margin-bottom: 1rem; font-size: var(--fs-xl);">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.+)/g, '<div style="margin-left: 1rem; margin-bottom: 0.5rem;">• $1</div>')
      .replace(/\n\n/g, '<br><br>');
  }

  static HomeScreen() {
    const hasData = DB.getClients().length > 0;
    return '<div class="card"><h2>Главное меню</h2>' +
      '<button class="btn-primary" onclick="Router.navigate(\'selectClient\', {action:\'test\'})">Провести тестирование</button>' +
      '<button class="btn-success" onclick="Router.navigate(\'clients\')">Управление клиентами</button>' +
      '<button class="btn-outline" onclick="Router.navigate(\'selectClient\', {action:\'results\'})">Просмотр результатов</button>' +
      (hasData ? '<button class="btn-success" onclick="Router.exportToExcel()" style="margin-top: 2rem; background: #2ECC71;">📊 Экспорт всей базы в Excel</button>' : '') +
      '</div>';
  }

  static SettingsScreen() {
    const theme = Settings.getTheme();
    const size = Settings.getFontSize();
    const aiKey = Settings.getAIKey();
    return '<div class="card"><h2>Настройки</h2>' +
      '<div class="settings-group"><h3>🤖 AI-ассистент</h3>' +
      '<label>API ключ Google Gemini:</label>' +
      '<input type="text" id="aiKeyInput" value="' + aiKey + '" placeholder="AIzaSy..." style="margin-bottom: 0.5rem;">' +
      '<button class="btn-primary btn-small" onclick="Router.saveAIKey()">💾 Сохранить ключ</button>' +
      '<p style="font-size: var(--fs-base); color: var(--text-light); margin-top: 0.5rem;">' +
      '📌 <a href="https://aistudio.google.com/apikey" target="_blank" style="color: var(--primary);">Получить бесплатный ключ</a> (2 минуты)</p></div>' +
      '<div class="settings-group"><h3>Тема оформления</h3>' +
      '<div class="setting-option ' + (theme === 'light' ? 'active' : '') + '" data-theme-option="light">☀️ Светлая тема</div>' +
      '<div class="setting-option ' + (theme === 'dark' ? 'active' : '') + '" data-theme-option="dark">🌙 Темная тема</div>' +
      '<div class="setting-option ' + (theme === 'contrast' ? 'active' : '') + '" data-theme-option="contrast">⚡ Высокая контрастность</div></div>' +
      '<div class="settings-group"><h3>Размер шрифта</h3>' +
      '<div class="setting-option ' + (size === 'small' ? 'active' : '') + '" data-fontsize-option="small">Маленький (A)</div>' +
      '<div class="setting-option ' + (size === 'medium' ? 'active' : '') + '" data-fontsize-option="medium">Средний (A)</div>' +
      '<div class="setting-option ' + (size === 'large' ? 'active' : '') + '" data-fontsize-option="large">Большой (A)</div>' +
      '<div class="setting-option ' + (size === 'xlarge' ? 'active' : '') + '" data-fontsize-option="xlarge">Очень большой (A)</div></div>' +
      '<button class="btn-outline" onclick="Router.navigate(\'home\')">← Назад</button></div>';
  }

  static ClientsScreen() {
    const clients = DB.getClients();
    let html = '<div class="card"><h2>Список клиентов</h2>' +
      '<button class="btn-primary" onclick="Router.navigate(\'addClient\')">+ Добавить клиента</button>';
    if (clients.length > 0) {
      html += '<button class="btn-success" onclick="Router.exportToExcel()">📊 Экспорт в Excel (CSV)</button>';
    }
    if (clients.length === 0) {
      html += '<div class="empty-state">Нет клиентов.<br>Добавьте первого клиента.</div>';
    } else {
      clients.forEach(client => {
        html += '<div class="list-item"><div class="list-item-content"><strong>' + client.name + '</strong>' +
          '<div class="list-item-info">ДР: ' + new Date(client.birthDate).toLocaleDateString('ru-RU') + '</div></div>' +
          '<div class="list-item-actions">' +
          '<button class="icon-btn" data-edit-client="' + client.id + '" title="Редактировать">✏️</button>' +
          '<button class="icon-btn" data-delete-client="' + client.id + '" title="Удалить">🗑️</button></div></div>';
      });
    }
    html += '<button class="btn-outline" onclick="Router.navigate(\'home\')">← Назад</button></div>';
    return html;
  }

  static AddClientScreen() {
    return '<div class="card"><h2>Добавить клиента</h2><form id="addClientForm">' +
      '<label>ФИО</label><input type="text" id="clientName" placeholder="Иванов Иван Иванович" required>' +
      '<label>Дата рождения</label><input type="date" id="clientBirthDate" required>' +
      '<button type="submit" class="btn-primary">Сохранить</button>' +
      '<button type="button" class="btn-outline" onclick="Router.navigate(\'clients\')">Отмена</button></form></div>';
  }

  static EditClientScreen() {
    const client = DB.getClient(this.params.clientId);
    return '<div class="card"><h2>Редактировать клиента</h2><form id="editClientForm">' +
      '<label>ФИО</label><input type="text" id="clientName" value="' + client.name + '" required>' +
      '<label>Дата рождения</label><input type="date" id="clientBirthDate" value="' + client.birthDate + '" required>' +
      '<button type="submit" class="btn-primary">Сохранить</button>' +
      '<button type="button" class="btn-outline" onclick="Router.navigate(\'clients\')">Отмена</button></form></div>';
  }

  static SelectClientScreen() {
    const clients = DB.getClients();
    const action = this.params.action || 'test';
    let html = '<div class="card"><h2>Выберите клиента</h2>';
    if (clients.length === 0) {
      html += '<div class="empty-state">Нет клиентов.<br>Сначала добавьте клиента.</div>' +
        '<button class="btn-primary" onclick="Router.navigate(\'addClient\')">+ Добавить клиента</button>';
    } else {
      clients.forEach(client => {
        const nav = action === 'test' ? 'selectTest' : 'results';
        html += '<div class="list-item" onclick="Router.navigate(\'' + nav + '\', {clientId:\'' + client.id + '\'})">' +
          '<div><strong>' + client.name + '</strong>' +
          '<div class="list-item-info">ДР: ' + new Date(client.birthDate).toLocaleDateString('ru-RU') + '</div></div></div>';
      });
    }
    html += '<button class="btn-outline" onclick="Router.navigate(\'home\')">← Назад</button></div>';
    return html;
  }

  static SelectTestScreen() {
    let html = '<div class="card"><h2>Выберите методику</h2>';
    Object.values(TESTS).forEach(test => {
      html += '<div class="list-item" onclick="Router.navigate(\'runTest\', {clientId:\'' + this.params.clientId + '\', testId:\'' + test.id + '\'})">' +
        '<div><strong>' + test.name + '</strong><div class="list-item-info">' + test.description + '</div></div></div>';
    });
    html += '<button class="btn-outline" onclick="Router.navigate(\'selectClient\', {action:\'test\'})">← Назад</button></div>';
    return html;
  }

  static RunTestScreen() {
    const test = TESTS[this.params.testId];
    const q = this.testState.currentQuestion;
    const question = test.questions[q];
    const progress = ((q + 1) / test.questions.length) * 100;
    let html = '<div class="card"><div class="question-screen"><div>' +
      '<div class="progress-bar"><div class="progress-fill" style="width: ' + progress + '%"></div></div>' +
      '<div class="question-number">Вопрос ' + (q + 1) + ' из ' + test.questions.length + '</div></div>' +
      '<div><div class="question-text">' + question.question + '</div><div>';
    question.options.forEach(opt => {
      html += '<div class="answer-option" data-score="' + opt.score + '">' + opt.text + '</div>';
    });
    html += '</div></div><div><button class="btn-outline" id="testBackBtn">← ' + (q > 0 ? 'Предыдущий вопрос' : 'Отменить тест') + '</button></div></div></div>';
    return html;
  }

  static ResultsScreen() {
    const client = DB.getClient(this.params.clientId);
    const results = DB.getClientResults(this.params.clientId);
    const hasKey = Settings.getAIKey() !== '';
    let html = '<div class="card"><h2>Результаты: ' + client.name + '</h2>';
    if (results.length > 0) {
      html += '<button class="btn-success" onclick="Router.navigate(\'createReport\', {clientId:\'' + client.id + '\'})">📄 Создать сводный протокол</button>';
      html += '<button class="btn-primary" onclick="Router.navigate(\'aiAnalysis\', {clientId:\'' + client.id + '\'})" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">🤖 Получить AI-заключение' + (hasKey ? '' : ' (требуется настройка)') + '</button>';
    }
    if (results.length === 0) {
      html += '<div class="empty-state">Нет результатов тестирования</div>';
    } else {
      results.forEach(result => {
        const test = TESTS[result.testId];
        html += '<div class="result-card" onclick="Router.navigate(\'viewResult\', {resultId:\'' + result.id + '\'})">' +
          '<h3 style="font-size: var(--fs-xl); margin-bottom: 0.5rem">' + test.name + '</h3>' +
          '<p style="opacity: 0.9">' + new Date(result.date).toLocaleString('ru-RU') + '</p>' +
          '<div class="result-score">Балл: ' + result.score + '</div>' +
          '<div class="result-interpretation">' + result.interpretation + '</div></div>';
      });
    }
    html += '<button class="btn-outline" onclick="Router.navigate(\'selectClient\', {action:\'results\'})">← Назад</button></div>';
    return html;
  }

  static ViewResultScreen() {
    const result = DB.getResult(this.params.resultId);
    const client = DB.getClient(result.clientId);
    const test = TESTS[result.testId];
    return '<div class="card"><h2>Результат теста</h2>' +
      '<div style="margin-bottom: 2rem">' +
      '<p style="margin-bottom: 0.5rem"><strong>Клиент:</strong> ' + client.name + '</p>' +
      '<p style="margin-bottom: 0.5rem"><strong>Тест:</strong> ' + test.name + '</p>' +
      '<p style="margin-bottom: 0.5rem"><strong>Дата:</strong> ' + new Date(result.date).toLocaleString('ru-RU') + '</p></div>' +
      '<div class="result-card"><div class="result-score">Итоговый балл: ' + result.score + '</div>' +
      '<div class="result-interpretation">' + result.interpretation + '</div></div>' +
      '<button class="btn-outline" onclick="Router.navigate(\'results\', {clientId:\'' + client.id + '\'})">← Назад</button></div>';
  }

  static CreateReportScreen() {
    const client = DB.getClient(this.params.clientId);
    const results = DB.getClientResults(this.params.clientId);
    let html = '<div class="card"><h2>Создать протокол</h2>' +
      '<p style="margin-bottom: 1.5rem; color: var(--text-light)">Выберите результаты для включения в протокол</p>' +
      '<form id="reportForm">';
    results.forEach(result => {
      const test = TESTS[result.testId];
      html += '<div class="checkbox-item">' +
        '<input type="checkbox" name="resultIds" value="' + result.id + '" id="res_' + result.id + '">' +
        '<label for="res_' + result.id + '"><strong>' + test.name + '</strong>' +
        '<div class="list-item-info">' + new Date(result.date).toLocaleDateString('ru-RU') + ' • Балл: ' + result.score + '</div></label></div>';
    });
    html += '<button type="submit" class="btn-success" style="margin-top: 1rem">📥 Скачать протокол (TXT)</button>' +
      '<button type="button" class="btn-outline" onclick="Router.navigate(\'results\', {clientId:\'' + client.id + '\'})">Отмена</button></form></div>';
    return html;
  }

  static AIAnalysisScreen() {
    const client = DB.getClient(this.params.clientId);
    const results = DB.getClientResults(this.params.clientId);
    const hasKey = Settings.getAIKey() !== '';
    if (!hasKey) {
      return '<div class="card"><h2>🤖 AI-ассистент</h2>' +
        '<p style="color: var(--danger); margin-bottom: 2rem;">⚠️ API ключ не настроен!</p>' +
        '<p style="margin-bottom: 2rem;">Для использования AI-ассистента нужен бесплатный API ключ от Google Gemini.</p>' +
        '<button class="btn-primary" onclick="Router.navigate(\'settings\')">⚙️ Перейти в настройки</button>' +
        '<button class="btn-outline" onclick="Router.navigate(\'results\', {clientId:\'' + this.params.clientId + '\'})">← Назад</button></div>';
    }
    return '<div class="card"><h2>🤖 AI-анализ результатов</h2>' +
      '<p style="margin-bottom: 1rem;"><strong>Клиент:</strong> ' + client.name + '</p>' +
      '<p style="margin-bottom: 2rem;"><strong>Тестов:</strong> ' + results.length + '</p>' +
      '<p style="margin-bottom: 2rem; color: var(--text-light);">AI-психолог проанализирует все результаты и составит детальное заключение с рекомендациями, прогнозом и планом наблюдения.</p>' +
      '<div id="aiStatus"></div>' +
      '<button id="generateAIBtn" class="btn-primary">🚀 Сгенерировать заключение</button>' +
      '<button class="btn-outline" onclick="Router.navigate(\'results\', {clientId:\'' + this.params.clientId + '\'})">← Назад</button></div>';
  }

  static AIResultScreen() {
    const analysis = AI.getAnalysis(this.params.analysisId);
    const client = DB.getClient(analysis.clientId);
    return '<div class="card"><h2>🤖 AI-заключение</h2>' +
      '<p style="margin-bottom: 1rem;"><strong>Клиент:</strong> ' + client.name + '</p>' +
      '<p style="margin-bottom: 2rem;"><strong>Дата:</strong> ' + new Date(analysis.date).toLocaleString('ru-RU') + '</p>' +
      '<div style="background: var(--bg); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; white-space: pre-wrap; line-height: 1.8;">' +
      this.formatMarkdown(analysis.text) + '</div>' +
      '<button class="btn-success" onclick="Router.downloadAIReport(\'' + analysis.id + '\')">📥 Скачать заключение (TXT)</button>' +
      '<button class="btn-outline" onclick="Router.navigate(\'results\', {clientId:\'' + client.id + '\'})">← Назад к результатам</button></div>';
  }
}

// ============ INIT APP ============

Settings.init();
Router.navigate('home');
