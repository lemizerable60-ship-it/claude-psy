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
      {
        question: 'Какой сейчас год?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Какое сейчас время года?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Какое сегодня число?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Какой сегодня день недели?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Какой сейчас месяц?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'В какой мы стране?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'В какой области/крае мы находимся?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'В каком городе мы находимся?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Как называется это учреждение?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'На каком мы этаже?',
        options: [
          { text: 'Правильный ответ', score: 1 },
          { text: 'Неправильный ответ', score: 0 }
        ]
      },
      {
        question: 'Повторите три слова: ЯБЛОКО, СТОЛ, МОНЕТА (первая попытка)',
        options: [
          { text: 'Повторил все 3 слова', score: 3 },
          { text: 'Повторил 2 слова', score: 2 },
          { text: 'Повторил 1 слово', score: 1 },
          { text: 'Не повторил ни одного', score: 0 }
        ]
      },
      {
        question: 'Серийный счет: от 100 отнять 7 (первый раз)',
        options: [
          { text: 'Правильно: 93', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'От результата отнять еще 7 (второй раз)',
        options: [
          { text: 'Правильно: 86', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Продолжайте вычитать по 7 (третий раз)',
        options: [
          { text: 'Правильно: 79', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Продолжайте вычитать по 7 (четвертый раз)',
        options: [
          { text: 'Правильно: 72', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Продолжайте вычитать по 7 (пятый раз)',
        options: [
          { text: 'Правильно: 65', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Вспомните три слова, которые я просил запомнить',
        options: [
          { text: 'Вспомнил все 3 слова', score: 3 },
          { text: 'Вспомнил 2 слова', score: 2 },
          { text: 'Вспомнил 1 слово', score: 1 },
          { text: 'Не вспомнил ни одного', score: 0 }
        ]
      },
      {
        question: 'Покажите ручку. Как это называется?',
        options: [
          { text: 'Правильно назвал', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Покажите часы. Как это называется?',
        options: [
          { text: 'Правильно назвал', score: 1 },
          { text: 'Неправильно', score: 0 }
        ]
      },
      {
        question: 'Повторите фразу: "Никаких если, и или но"',
        options: [
          { text: 'Повторил правильно', score: 1 },
          { text: 'Не смог повторить', score: 0 }
        ]
      },
      {
        question: 'Трехэтапная команда: "Возьмите лист бумаги правой рукой"',
        options: [
          { text: 'Выполнил правильно', score: 1 },
          { text: 'Не выполнил', score: 0 }
        ]
      },
      {
        question: 'Сложите его пополам',
        options: [
          { text: 'Выполнил правильно', score: 1 },
          { text: 'Не выполнил', score: 0 }
        ]
      },
      {
        question: 'Положите его на стол',
        options: [
          { text: 'Выполнил правильно', score: 1 },
          { text: 'Не выполнил', score: 0 }
        ]
      },
      {
        question: 'Прочитайте и выполните: "ЗАКРОЙТЕ ГЛАЗА"',
        options: [
          { text: 'Прочитал и выполнил', score: 1 },
          { text: 'Не выполнил', score: 0 }
        ]
      },
      {
        question: 'Напишите любое предложение',
        options: [
          { text: 'Написал осмысленное предложение', score: 1 },
          { text: 'Не написал', score: 0 }
        ]
      },
      {
        question: 'Перерисуйте рисунок (два пересекающихся пятиугольника)',
        options: [
          { text: 'Перерисовал правильно', score: 1 },
          { text: 'Не справился', score: 0 }
        ]
      }
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
      {
        question: '1. Я испытываю напряжение, мне не по себе',
        options: [
          { text: 'Все время', score: 3 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 1 },
          { text: 'Совсем не испытываю', score: 0 }
        ]
      },
      {
        question: '2. То, что приносило мне удовольствие, и сейчас вызывает то же чувство',
        options: [
          { text: 'Определенно это так', score: 0 },
          { text: 'Наверное, это так', score: 1 },
          { text: 'Лишь в очень малой степени', score: 2 },
          { text: 'Это совсем не так', score: 3 }
        ]
      },
      {
        question: '3. Я испытываю страх, кажется, будто что-то ужасное может вот-вот случиться',
        options: [
          { text: 'Определенно это так, и страх очень сильный', score: 3 },
          { text: 'Да, 
