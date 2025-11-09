static exportToExcel() {
  const clients = DB.getClients();
  const results = DB.getResults();
  
  // CSV Header
  let csv = '\uFEFF'; // BOM для правильной кодировки в Excel
  csv += 'ФИО;Дата рождения;Возраст;Название теста;Дата проведения;Балл;Результат;Рекомендации\n';
  
  clients.forEach(client => {
    const clientResults = results.filter(r => r.clientId === client.id);
    
    // Вычисляем возраст
    const birthDate = new Date(client.birthDate);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (clientResults.length === 0) {
      // Клиент без результатов
      csv += `"${client.name}";"${new Date(client.birthDate).toLocaleDateString('ru-RU')}";"${age}";"Нет тестов";"";"";"";""\n`;
    } else {
      // Клиент с результатами
      clientResults.forEach(result => {
        const test = TESTS[result.testId];
        const recommendations = this.getRecommendations(result.testId, result.score);
        
        csv += `"${client.name}";`;
        csv += `"${new Date(client.birthDate).toLocaleDateString('ru-RU')}";`;
        csv += `"${age}";`;
        csv += `"${test.name}";`;
        csv += `"${new Date(result.date).toLocaleDateString('ru-RU')} ${new Date(result.date).toLocaleTimeString('ru-RU')}";`;
        csv += `"${result.score}";`;
        csv += `"${result.interpretation.replace(/"/g, '""')}";`;
        csv += `"${recommendations.replace(/"/g, '""')}"\n`;
      });
    }
  });
  
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `psychosuite_database_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

static getRecommendations(testId, score) {
  switch(testId) {
    case 'mmse':
      if (score >= 28) return 'Рекомендации не требуются. Когнитивные функции в норме.';
      if (score >= 24) return 'Рекомендуется динамическое наблюдение, когнитивный тренинг.';
      if (score >= 20) return 'Необходима консультация невролога, комплексная нейропсихологическая диагностика.';
      if (score >= 11) return 'Необходима консультация психиатра/невролога, медикаментозная терапия, постоянный уход.';
      return 'Необходима консультация психиатра, медикаментозная терапия, постоянный квалифицированный уход.';
      
    case 'hads':
      if (score <= 7) return 'Рекомендации не требуются. Психоэмоциональное состояние в норме.';
      if (score <= 10) return 'Рекомендуется психологическая консультация, техники релаксации, нормализация режима дня.';
      return 'Рекомендуется консультация психотерапевта/психиатра, возможна медикаментозная поддержка, психотерапия.';
      
    case 'zung':
      const index = Math.round((score / 80) * 100);
      if (index < 50) return 'Рекомендации не требуются. Депрессивная симптоматика отсутствует.';
      if (index < 60) return 'Рекомендуется психологическая консультация, психотерапия, режим труда и отдыха.';
      if (index < 70) return 'Рекомендуется консультация психотерапевта/психиатра, психотерапия, возможна медикаментозная терапия.';
      return 'Необходима срочная консультация психиатра, комплексная терапия (медикаментозная + психотерапия), возможна госпитализация.';
      
    default:
      return 'Требуется индивидуальная консультация специалиста.';
  }
}
