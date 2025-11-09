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
      // ТРЕВОГА (нечетные вопросы)
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
      if (score <= 7) return 'Норма 
