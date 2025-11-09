if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('[App] SW registered:', registration);
        
        // Проверяем обновления каждые 60 секунд
        setInterval(() => {
          registration.update();
        }, 60000);
        
        // Слушаем событие обновления
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('[App] New SW found, installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New SW installed, prompting reload');
              
              // Показываем уведомление пользователю
              if (confirm('Доступна новая версия приложения! Обновить?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(err => {
        console.error('[App] SW registration failed:', err);
      });
    
    // Перезагружаем страницу когда новый SW активируется
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
