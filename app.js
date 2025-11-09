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
    // Also delete all results for this client
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
      // ОРИЕНТИРОВКА ВО ВРЕМЕНИ (5 баллов)
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
      // ОРИЕНТИРОВКА В МЕСТЕ (5 баллов)
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
      // ВОСПРИЯТИЕ (3 балла)
      {
        question: 'Повторите три слова: ЯБЛОКО, СТОЛ, МОНЕТА (первая попытка)',
        options: [
          { text: 'Повторил все 3 слова', score: 3 },
          { text: 'Повторил 2 слова', score: 2 },
          { text: 'Повторил 1 слово', score: 1 },
          { text: 'Не повторил ни одного', score: 0 }
        ]
      },
      // ВНИМАНИЕ И СЧЕТ (5 баллов)
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
      // ПАМЯТЬ (3 балла)
      {
        question: 'Вспомните три слова, которые я просил запомнить',
        options: [
          { text: 'Вспомнил все 3 слова', score: 3 },
          { text: 'Вспомнил 2 слова', score: 2 },
          { text: 'Вспомнил 1 слово', score: 1 },
          { text: 'Не вспомнил ни одного', score: 0 }
        ]
      },
      // РЕЧЬ (2 балла)
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
      // ПОВТОРЕНИЕ ФРАЗЫ (1 балл)
      {
        question: 'Повторите фразу: "Никаких если, и или но"',
        options: [
          { text: 'Повторил правильно', score: 1 },
          { text: 'Не смог повторить', score: 0 }
        ]
      },
      // ПОНИМАНИЕ КОМАНД (3 балла)
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
      // ЧТЕНИЕ (1 балл)
      {
        question: 'Прочитайте и выполните: "ЗАКРОЙТЕ ГЛАЗА"',
        options: [
          { text: 'Прочитал и выполнил', score: 1 },
          { text: 'Не выполнил', score: 0 }
        ]
      },
      // ПИСЬМО (1 балл)
      {
        question: 'Напишите любое предложение',
        options: [
          { text: 'Написал осмысленное предложение', score: 1 },
          { text: 'Не написал', score: 0 }
        ]
      },
      // РИСОВАНИЕ (1 балл)
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
          { text: 'Да, это так, но страх не очень сильный', score: 2 },
          { text: 'Иногда, но это меня не беспокоит', score: 1 },
          { text: 'Совсем не испытываю', score: 0 }
        ]
      },
      {
        question: '4. Я способен рассмеяться и увидеть в том или ином событии смешное',
        options: [
          { text: 'Определенно это так', score: 0 },
          { text: 'Наверное, это так', score: 1 },
          { text: 'Лишь в очень малой степени', score: 2 },
          { text: 'Совсем не способен', score: 3 }
        ]
      },
      {
        question: '5. Беспокойные мысли крутятся у меня в голове',
        options: [
          { text: 'Постоянно', score: 3 },
          { text: 'Большую часть времени', score: 2 },
          { text: 'Время от времени', score: 1 },
          { text: 'Только иногда', score: 0 }
        ]
      },
      {
        question: '6. Я испытываю бодрость',
        options: [
          { text: 'Совсем не испытываю', score: 3 },
          { text: 'Очень редко', score: 2 },
          { text: 'Иногда', score: 1 },
          { text: 'Практически все время', score: 0 }
        ]
      },
      {
        question: '7. Я легко могу сесть и расслабиться',
        options: [
          { text: 'Определенно это так', score: 0 },
          { text: 'Наверное, это так', score: 1 },
          { text: 'Лишь изредка это так', score: 2 },
          { text: 'Совсем не могу', score: 3 }
        ]
      },
      {
        question: '8. Мне кажется, что я стал все делать очень медленно',
        options: [
          { text: 'Практически все время', score: 3 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 1 },
          { text: 'Совсем нет', score: 0 }
        ]
      },
      {
        question: '9. Я испытываю внутреннее напряжение или дрожь',
        options: [
          { text: 'Совсем не испытываю', score: 0 },
          { text: 'Иногда', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Очень часто', score: 3 }
        ]
      },
      {
        question: '10. Я не слежу за своей внешностью',
        options: [
          { text: 'Определенно это так', score: 3 },
          { text: 'Я не уделяю этому столько времени, сколько нужно', score: 2 },
          { text: 'Может быть, я стал меньше уделять этому внимания', score: 1 },
          { text: 'Я слежу за собой так же, как и раньше', score: 0 }
        ]
      },
      {
        question: '11. Я испытываю неусидчивость, словно мне постоянно нужно двигаться',
        options: [
          { text: 'Определенно это так', score: 3 },
          { text: 'Наверное, это так', score: 2 },
          { text: 'Лишь в некоторой степени', score: 1 },
          { text: 'Совсем не испытываю', score: 0 }
        ]
      },
      {
        question: '12. Я считаю, что мои дела (занятия, увлечения) могут принести мне чувство удовлетворения',
        options: [
          { text: 'Точно так же, как и обычно', score: 0 },
          { text: 'Да, но не в той степени, как раньше', score: 1 },
          { text: 'Значительно меньше, чем обычно', score: 2 },
          { text: 'Совсем не считаю', score: 3 }
        ]
      },
      {
        question: '13. У меня бывает внезапное чувство паники',
        options: [
          { text: 'Очень часто', score: 3 },
          { text: 'Довольно часто', score: 2 },
          { text: 'Не так уж часто', score: 1 },
          { text: 'Совсем не бывает', score: 0 }
        ]
      },
      {
        question: '14. Я могу получить удовольствие от хорошей книги, радио- или телепрограммы',
        options: [
          { text: 'Часто', score: 0 },
          { text: 'Иногда', score: 1 },
          { text: 'Редко', score: 2 },
          { text: 'Очень редко', score: 3 }
        ]
      }
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
      {
        question: '1. Я чувствую подавленность',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '2. Утром я чувствую себя лучше всего',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '3. У меня бывают периоды плача или близости к слезам',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '4. У меня плохой ночной сон',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '5. Я ем столько же, сколько и раньше',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '6. Я получаю удовольствие от того, что нахожусь среди привлекательных женщин/мужчин или общаюсь с ними',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '7. Я замечаю, что теряю вес',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '8. Меня беспокоят запоры',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '9. Мое сердце бьется быстрее, чем обычно',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '10. Я устаю без всякой причины',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '11. Мой ум также ясен, как и раньше',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '12. Мне легко делать то, что я умею',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '13. Я чувствую беспокойство и не могу усидеть на месте',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '14. У меня есть надежды на будущее',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '15. Я более раздражителен, чем обычно',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '16. Мне легко принимать решения',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '17. Я чувствую, что полезен и в моих услугах нуждаются',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '18. Я живу достаточно полной жизнью',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      },
      {
        question: '19. Я чувствую, что другим людям станет лучше, если я умру',
        options: [
          { text: 'Никогда или изредка', score: 1 },
          { text: 'Иногда', score: 2 },
          { text: 'Часто', score: 3 },
          { text: 'Почти всегда или постоянно', score: 4 }
        ]
      },
      {
        question: '20. Я все еще получаю удовольствие от того, что мне нравилось и раньше',
        options: [
          { text: 'Почти всегда или постоянно', score: 1 },
          { text: 'Часто', score: 2 },
          { text: 'Иногда', score: 3 },
          { text: 'Никогда или изредка', score: 4 }
        ]
      }
    ],
    interpret: (score) => {
      const index = Math.round((score / 80) * 100);
      if (index < 50) return `Нормальное состояние (индекс ${index}, сумма баллов ${score})`;
      if (index < 60) return `Легкая депрессия (индекс ${index}, сумма баллов ${score})`;
      if (index < 70) return `Умеренная депрессия (индекс ${index}, сумма баллов ${score})`;
      return `Тяжелая депрессия (индекс ${index}, сумма баллов ${score})`;
    }
  }
};

// ============ ROUTER ============

class Router {
  static currentScreen = null;
  static params = {};

  static navigate(screen, params = {}) {
    this.currentScreen = screen;
    this.params = params;
    this.render();
  }

  static render() {
    const app = document.getElementById('app');
    
    switch (this.currentScreen) {
      case 'home':
        app.innerHTML = HomeScreen();
        break;
      case 'settings':
        app.innerHTML = SettingsScreen();
        setTimeout(() => this.attachSettingsListeners(), 0);
        break;
      case 'clients':
        app.innerHTML = ClientsScreen();
        setTimeout(() => this.attachClientListeners(), 0);
        break;
      case 'addClient':
        app.innerHTML = AddClientScreen();
        setTimeout(() => this.attachAddClientListeners(), 0);
        break;
      case 'editClient':
        app.innerHTML = EditClientScreen();
        setTimeout(() => this.attachEditClientListeners(), 0);
        break;
      case 'selectClient':
        app.innerHTML = SelectClientScreen();
        break;
      case 'selectTest':
        app.innerHTML = SelectTestScreen();
        break;
      case 'runTest':
        app.innerHTML = RunTestScreen();
        setTimeout(() => this.attachTestListeners(), 0);
        break;
      case 'results':
        app.innerHTML = ResultsScreen();
        break;
      case 'viewResult':
        app.innerHTML = ViewResultScreen();
        break;
      case 'createReport':
        app.innerHTML = CreateReportScreen();
        setTimeout(() => this.attachReportListeners(), 0);
        break;
      default:
        app.innerHTML = HomeScreen();
    }
  }

  static attachSettingsListeners() {
    // Theme options
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.themeOption;
        Settings.setTheme(theme);
        this.render();
      });
    });

    // Font size options
    document.querySelectorAll('[data-fontsize-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.fontsizeOption;
        Settings.setFontSize(size);
        this.render();
      });
    });
  }

  static attachClientListeners() {
    // Edit buttons
    document.querySelectorAll('[data-edit-client]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const clientId = btn.dataset.editClient;
        Router.navigate('editClient', { clientId });
      });
    });

    // Delete buttons
    document.querySelectorAll('[data-delete-client]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const clientId = btn.dataset.deleteClient;
        const client = DB.getClient(clientId);
        if (confirm(`Удалить клиента "${client.name}"?\n\nВнимание: Будут удалены все результаты тестов этого клиента!`)) {
          DB.deleteClient(clientId);
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
        const name = document.getElementById('clientName').value;
        const birthDate = document.getElementById('clientBirthDate').value;
        
        DB.addClient({
          id: Date.now().toString(),
          name,
          birthDate,
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
        const name = document.getElementById('clientName').value;
        const birthDate = document.getElementById('clientBirthDate').value;
        
        DB.updateClient(this.params.clientId, { name, birthDate });
        Router.navigate('clients');
      });
    }
  }

  static testState = {
    currentQuestion: 0,
    answers: []
  };

  static attachTestListeners() {
    const test = TESTS[this.params.testId];
    const options = document.querySelectorAll('.answer-option');
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        const score = parseInt(option.dataset.score);
        this.testState.answers.push(score);

        if (this.testState.currentQuestion < test.questions.length - 1) {
          this.testState.currentQuestion++;
          setTimeout(() => this.render(), 300);
        } else {
          // Finish test
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

    // Back button
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
        const checkboxes = document.querySelectorAll('input[name="resultIds"]:checked');
        const selectedIds = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedIds.length === 0) {
          alert('Выберите хотя бы один результат');
          return;
        }

        this.downloadReport(selectedIds);
      });
    }
  }

  static downloadReport(resultIds) {
    const client = DB.getClient(this.params.clientId);
    const results = resultIds.map(id => DB.getResult(id)).filter(Boolean);
    
    let report = `ПРОТОКОЛ ПСИХОЛОГИЧЕСКОГО ОБСЛЕДОВАНИЯ\n`;
    report += `${'='.repeat(60)}\n\n`;
    report += `Клиент: ${client.name}\n`;
    report += `Дата рождения: ${new Date(client.birthDate).toLocaleDateString('ru-RU')}\n`;
    report += `Дата обследования: ${new Date().toLocaleDateString('ru-RU')}\n\n`;
    report += `${'='.repeat(60)}\n\n`;

    results.forEach(result => {
      const test = TESTS[result.testId];
      report += `МЕТОДИКА: ${test.name}\n`;
      report += `${test.description}\n`;
      report += `Дата проведения: ${new Date(result.date).toLocaleString('ru-RU')}\n\n`;
      report += `Итоговый балл: ${result.score}\n\n`;
      report += `ИНТЕРПРЕТАЦИЯ:\n${result.interpretation}\n\n`;
      report += `${'='.repeat(60)}\n\n`;
    });

    // Download as TXT
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protocol_${client.name}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    Router.navigate('results', { clientId: this.params.clientId });
  }
}

// ============ SCREENS ============

function HomeScreen() {
  return `
    <div class="card">
      <h2>Главное меню</h2>
      <button class="btn-primary" onclick="Router.navigate('selectClient', {action:'test'})">
        Провести тестирование
      </button>
      <button class="btn-success" onclick="Router.navigate('clients')">
        Управление клиентами
      </button>
      <button class="btn-outline" onclick="Router.navigate('selectClient', {action:'results'})">
        Просмотр результатов
      </button>
    </div>
  `;
}

function SettingsScreen() {
  const currentTheme = Settings.getTheme();
  const currentFontSize = Settings.getFontSize();

  return `
    <div class="card">
      <h2>Настройки</h2>
      
      <div class="settings-group">
        <h3>Тема оформления</h3>
        <div class="setting-option ${currentTheme === 'light' ? 'active' : ''}" data-theme-option="light">
          ☀️ Светлая тема
        </div>
        <div class="setting-option ${currentTheme === 'dark' ? 'active' : ''}" data-theme-option="dark">
          🌙 Темная тема
        </div>
        <div class="setting-option ${currentTheme === 'contrast' ? 'active' : ''}" data-theme-option="contrast">
          ⚡ Высокая контрастность
        </div>
      </div>

      <div class="settings-group">
        <h3>Размер шрифта</h3>
        <div class="setting-option ${currentFontSize === 'small' ? 'active' : ''}" data-fontsize-option="small">
          Маленький (A)
        </div>
        <div class="setting-option ${currentFontSize === 'medium' ? 'active' : ''}" data-fontsize-option="medium">
          Средний (A)
        </div>
        <div class="setting-option ${currentFontSize === 'large' ? 'active' : ''}" data-fontsize-option="large">
          Большой (A)
        </div>
        <div class="setting-option ${currentFontSize === 'xlarge' ? 'active' : ''}" data-fontsize-option="xlarge">
          Очень большой (A)
        </div>
      </div>

      <button class="btn-outline" onclick="Router.navigate('home')">
        ← Назад
      </button>
    </div>
  `;
}

function ClientsScreen() {
  const clients = DB.getClients();
  
  return `
    <div class="card">
      <h2>Список клиентов</h2>
      <button class="btn-primary" onclick="Router.navigate('addClient')">
        + Добавить клиента
      </button>
      ${clients.length === 0 ? `
        <div class="empty-state">
          Нет клиентов.<br>Добавьте первого клиента.
        </div>
      ` : clients.map(client => `
        <div class="list-item">
          <div class="list-item-content">
            <strong>${client.name}</strong>
            <div class="list-item-info">
              ДР: ${new Date(client.birthDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          <div class="list-item-actions">
            <button class="icon-btn" data-edit-client="${client.id}" title="Редактировать">✏️</button>
            <button class="icon-btn" data-delete-client="${client.id}" title="Удалить">🗑️</button>
          </div>
        </div>
      `).join('')}
      <button class="btn-outline" onclick="Router.navigate('home')">
        ← Назад
      </button>
    </div>
  `;
}

function AddClientScreen() {
  return `
    <div class="card">
      <h2>Добавить клиента</h2>
      <form id="addClientForm">
        <label>ФИО</label>
        <input type="text" id="clientName" placeholder="Иванов Иван Иванович" required>
        
        <label>Дата рождения</label>
        <input type="date" id="clientBirthDate" required>
        
        <button type="submit" class="btn-primary">Сохранить</button>
        <button type="button" class="btn-outline" onclick="Router.navigate('clients')">
          Отмена
        </button>
      </form>
    </div>
  `;
}

function EditClientScreen() {
  const client = DB.getClient(Router.params.clientId);
  
  return `
    <div class="card">
      <h2>Редактировать клиента</h2>
      <form id="editClientForm">
        <label>ФИО</label>
        <input type="text" id="clientName" value="${client.name}" required>
        
        <label>Дата рождения</label>
        <input type="date" id="clientBirthDate" value="${client.birthDate}" required>
        
        <button type="submit" class="btn-primary">Сохранить</button>
        <button type="button" class="btn-outline" onclick="Router.navigate('clients')">
          Отмена
        </button>
      </form>
    </div>
  `;
}

function SelectClientScreen() {
  const clients = DB.getClients();
  const action = Router.params.action || 'test';
  
  return `
    <div class="card">
      <h2>Выберите клиента</h2>
      ${clients.length === 0 ? `
        <div class="empty-state">
          Нет клиентов.<br>Сначала добавьте клиента.
        </div>
        <button class="btn-primary" onclick="Router.navigate('addClient')">
          + Добавить клиента
        </button>
      ` : clients.map(client => `
        <div class="list-item" onclick="Router.navigate('${action === 'test' ? 'selectTest' : 'results'}', {clientId:'${client.id}'})">
          <div>
            <strong>${client.name}</strong>
            <div class="list-item-info">
              ДР: ${new Date(client.birthDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
      `).join('')}
      <button class="btn-outline" onclick="Router.navigate('home')">
        ← Назад
      </button>
    </div>
  `;
}

function SelectTestScreen() {
  return `
    <div class="card">
      <h2>Выберите методику</h2>
      ${Object.values(TESTS).map(test => `
        <div class="list-item" onclick="Router.navigate('runTest', {clientId:'${Router.params.clientId}', testId:'${test.id}'})">
          <div>
            <strong>${test.name}</strong>
            <div class="list-item-info">${test.description}</div>
          </div>
        </div>
      `).join('')}
      <button class="btn-outline" onclick="Router.navigate('selectClient', {action:'test'})">
        ← Назад
      </button>
    </div>
  `;
}

function RunTestScreen() {
  const test = TESTS[Router.params.testId];
  const q = Router.testState.currentQuestion;
  const question = test.questions[q];
  const progress = ((q + 1) / test.questions.length) * 100;

  return `
    <div class="card">
      <div class="question-screen">
        <div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="question-number">
            Вопрос ${q + 1} из ${test.questions.length}
          </div>
        </div>

        <div>
          <div class="question-text">${question.question}</div>
          <div>
            ${question.options.map((opt, i) => `
              <div class="answer-option" data-score="${opt.score}">
                ${opt.text}
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <button class="btn-outline" id="testBackBtn">
            ← ${q > 0 ? 'Предыдущий вопрос' : 'Отменить тест'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function ResultsScreen() {
  const client = DB.getClient(Router.params.clientId);
  const results = DB.getClientResults(Router.params.clientId);

  return `
    <div class="card">
      <h2>Результаты: ${client.name}</h2>
      
      ${results.length > 0 ? `
        <button class="btn-success" onclick="Router.navigate('createReport', {clientId:'${client.id}'})">
          📄 Создать сводный протокол
        </button>
      ` : ''}

      ${results.length === 0 ? `
        <div class="empty-state">
          Нет результатов тестирования
        </div>
      ` : results.map(result => {
        const test = TESTS[result.testId];
        return `
          <div class="result-card" onclick="Router.navigate('viewResult', {resultId:'${result.id}'})">
            <h3 style="font-size: var(--fs-xl); margin-bottom: 0.5rem">${test.name}</h3>
            <p style="opacity: 0.9">
              ${new Date(result.date).toLocaleString('ru-RU')}
            </p>
            <div class="result-score">Балл: ${result.score}</div>
            <div class="result-interpretation">${result.interpretation}</div>
          </div>
        `;
      }).join('')}
      
      <button class="btn-outline" onclick="Router.navigate('selectClient', {action:'results'})">
        ← Назад
      </button>
    </div>
  `;
}

function ViewResultScreen() {
  const result = DB.getResult(Router.params.resultId);
  const client = DB.getClient(result.clientId);
  const test = TESTS[result.testId];

  return `
    <div class="card">
      <h2>Результат теста</h2>
      <div style="margin-bottom: 2rem">
        <p style="margin-bottom: 0.5rem"><strong>Клиент:</strong> ${client.name}</p>
        <p style="margin-bottom: 0.5rem"><strong>Тест:</strong> ${test.name}</p>
        <p style="margin-bottom: 0.5rem"><strong>Дата:</strong> ${new Date(result.date).toLocaleString('ru-RU')}</p>
      </div>
      <div class="result-card">
        <div class="result-score">Итоговый балл: ${result.score}</div>
        <div class="result-interpretation">${result.interpretation}</div>
      </div>
      <button class="btn-outline" onclick="Router.navigate('results', {clientId:'${client.id}'})">
        ← Назад
      </button>
    </div>
  `;
}

function CreateReportScreen() {
  const client = DB.getClient(Router.params.clientId);
  const results = DB.getClientResults(Router.params.clientId);

  return `
    <div class="card">
      <h2>Создать протокол</h2>
      <p style="margin-bottom: 1.5rem; color: var(--text-light)">
        Выберите результаты для включения в протокол
      </p>
      
      <form id="reportForm">
        ${results.map(result => {
          const test = TESTS[result.testId];
          return `
            <div class="checkbox-item">
              <input type="checkbox" name="resultIds" value="${result.id}" id="res_${result.id}">
              <label for="res_${result.id}">
                <strong>${test.name}</strong>
                <div class="list-item-info">
                  ${new Date(result.date).toLocaleDateString('ru-RU')} • Балл: ${result.score}
                </div>
              </label>
            </div>
          `;
        }).join('')}
        
        <button type="submit" class="btn-success" style="margin-top: 1rem">
          📥 Скачать протокол (TXT)
        </button>
        <button type="button" class="btn-outline" onclick="Router.navigate('results', {clientId:'${client.id}'})">
          Отмена
        </button>
      </form>
    </div>
  `;
}

// ============ INIT APP ============

Settings.init();
Router.navigate('home');
