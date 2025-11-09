// ============ AI MODULE ============

class AI {
  static API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  
  static PROMPT_TEMPLATE = `
Ты — опытный клинический психолог с 15-летним стажем работы с пожилыми пациентами.

ДАННЫЕ КЛИЕНТА:
- ФИО: {clientName}
- Возраст: {clientAge} лет
- Дата обследования: {testDate}

РЕЗУЛЬТАТЫ ПСИХОДИАГНОСТИКИ:

{testResults}

ЗАДАНИЕ:
Проанализируй результаты и составь профессиональное психологическое заключение.

ТРЕБОВАНИЯ К ЗАКЛЮЧЕНИЮ:

1. Структура (строго):
   
   ## КОГНИТИВНЫЙ СТАТУС
   [Детальный анализ когнитивных тестов (MMSE и подобных):
   - Конкретные цифры и отклонения от нормы
   - Какие функции нарушены (память, внимание, речь и т.д.)
   - Степень выраженности нарушений
   - Возможные причины с учётом возраста]
   
   ## ЭМОЦИОНАЛЬНОЕ СОСТОЯНИЕ
   [Анализ эмоциональных тестов (HADS, Цунга и подобных):
   - Уровень тревоги и/или депрессии
   - Как это влияет на повседневную жизнь
   - Связь с когнитивными показателями]
   
   ## ВЗАИМОСВЯЗИ И ДИНАМИКА
   [Как показатели разных тестов связаны между собой:
   - Влияет ли когнитивное снижение на эмоции
   - Влияет ли депрессия/тревога на когнитивные функции
   - {hasDynamics}]
   
   ## ФАКТОРЫ РИСКА
   [Что может ухудшить текущее состояние:
   - Медицинские факторы (сопутствующие заболевания, лекарства)
   - Психосоциальные факторы (одиночество, стресс, потеря близких)
   - Образ жизни (недостаток активности, плохое питание, нарушения сна)
   - Возрастные факторы
   - Отсутствие лечения или наблюдения]
   
   ## РЕКОМЕНДАЦИИ
   [Минимум 5 конкретных рекомендаций с обоснованием:
   - К каким специалистам обратиться (невролог, психиатр, психотерапевт)
   - Какие дополнительные обследования провести (МРТ, анализы и т.д.)
   - Методы психотерапии (КПТ, поддерживающая терапия и т.д.)
   - Когнитивный тренинг и упражнения
   - Медикаментозная поддержка (если показана)
   - Социальная поддержка и активность]
   
   ## ПРОГНОЗ
   [Ожидаемая динамика состояния:
   - Благоприятный сценарий (при выполнении рекомендаций)
   - Вероятное течение без вмешательства
   - Факторы, влияющие на прогноз
   - Временные рамки ожидаемых изменений]
   
   ## ПЛАН НАБЛЮДЕНИЯ
   [Конкретный план мониторинга:
   - Когда повторить психодиагностическое тестирование (через 3/6/12 месяцев)
   - Какие тесты повторить обязательно
   - Какие дополнительные тесты провести
   - Частота консультаций со специалистами
   - Критерии улучшения/ухудшения, требующие внимания]
   
   ## ОСОБЫЕ ОТМЕТКИ
   [Что требует срочного/приоритетного внимания, срочные риски]

2. Стиль написания:
   - Профессиональный медицинский язык, но понятный для коллег
   - Конкретные цифры, проценты, ссылки на нормативы
   - БЕЗ общих фраз типа "обратитесь к врачу" — только конкретика
   - Учитывай возраст клиента и возрастные нормы
   - Избегай категоричных диагнозов, используй "возможно", "вероятно"

3. Примеры ХОРОШИХ рекомендаций:
   ✅ "Консультация невролога для дифференциальной диагностики между сосудистой деменцией и болезнью Альцгеймера. Рекомендовано МРТ головного мозга с контрастом"
   ✅ "Когнитивно-поведенческая терапия 2 раза в неделю по 50 минут с фокусом на работе с тревожными мыслями и поведенческой активации"
   ✅ "Медикаментозная поддержка: рассмотреть назначение донепезила 5мг/сут после консультации с психиатром/неврологом"
   ✅ "Когнитивный тренинг: упражнения на кратковременную память (запоминание списков, игры на внимание) 20-30 минут ежедневно"

4. Примеры ПЛОХИХ рекомендаций (не пиши так):
   ❌ "Обратитесь к врачу"
   ❌ "Рекомендуется лечение"
   ❌ "Необходима терапия"
   ❌ "Нужно обследование"

5. Обязательно учитывай:
   - Возраст клиента (норма для 70 лет ≠ норма для 50 лет)
   - Комбинацию симптомов (когнитивное снижение + депрессия часто усиливают друг друга)
   - Риск прогрессирования
   - Качество жизни пациента
   - Реалистичность прогноза

Генерируй ТОЛЬКО текст заключения в формате Markdown, без вступлений и пояснений.
Начинай сразу с "## КОГНИТИВНЫЙ СТАТУС".
`;

  static async generateAnalysis(clientId) {
    const apiKey = Settings.getAIKey();
    
    if (!apiKey) {
      throw new Error('API ключ не настроен. Перейдите в Настройки → AI-ассистент');
    }

    const client = DB.getClient(clientId);
    const results = DB.getClientResults(clientId);
    
    if (results.length === 0) {
      throw new Error('Нет результатов тестов для анализа');
    }

    const age = Math.floor((new Date() - new Date(client.birthDate)) / (365.25 * 24 * 60 * 60 * 1000));
    const testDate = new Date().toLocaleDateString('ru-RU');

    const testResults = results.map(result => {
      const test = TESTS[result.testId];
      return test.name + ' (' + test.description + '):\nБалл: ' + result.score + '\nДата: ' + new Date(result.date).toLocaleDateString('ru-RU') + '\nИнтерпретация: ' + result.interpretation;
    }).join('\n\n');

    const hasDynamics = this.checkDynamics(results);
    const dynamicsText = hasDynamics 
      ? 'Проанализируй динамику: сравни результаты с предыдущими тестированиями и оцени изменения (улучшение/ухудшение/стабильность)'
      : 'Динамический анализ не требуется (первичное обследование)';

    const prompt = this.PROMPT_TEMPLATE
      .replace('{clientName}', client.name)
      .replace('{clientAge}', age)
      .replace('{testDate}', testDate)
      .replace('{testResults}', testResults)
      .replace('{hasDynamics}', dynamicsText);

    const response = await fetch(this.API_URL + '?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 3000
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error('Ошибка API: ' + data.error.message);
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Не удалось получить ответ от AI. Попробуйте позже.');
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    const analysis = {
      id: Date.now().toString(),
      clientId: clientId,
      date: new Date().toISOString(),
      text: analysisText,
      testResultsIds: results.map(r => r.id)
    };

    const analyses = Storage.get('ai-analyses', []);
    analyses.push(analysis);
    Storage.set('ai-analyses', analyses);

    return analysis;
  }

  static checkDynamics(results) {
    const testGroups = {};
    results.forEach(result => {
      if (!testGroups[result.testId]) {
        testGroups[result.testId] = [];
      }
      testGroups[result.testId].push(result);
    });
    return Object.values(testGroups).some(group => group.length > 1);
  }

  static getAnalyses(clientId) {
    const analyses = Storage.get('ai-analyses', []);
    return analyses.filter(a => a.clientId === clientId);
  }

  static getAnalysis(id) {
    const analyses = Storage.get('ai-analyses', []);
    return analyses.find(a => a.id === id);
  }
}
