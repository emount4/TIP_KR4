// src/utils/exportUtils.js

/**
 * Экспорт дорожной карты в JSON файл
 * @param {Object} roadmapData - данные дорожной карты
 */
export const exportRoadmap = (roadmapData) => {
  if (!roadmapData || !roadmapData.items) {
    alert('Нет данных для экспорта');
    return;
  }

  try {
    // Создаем структуру для экспорта
    const exportData = {
      ...roadmapData,
      exportedAt: new Date().toISOString(),
      exportTool: 'Personal Technology Tracker',
      version: '1.0'
    };

    // Конвертируем в JSON с форматированием
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Создаем Blob
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Создаем URL для скачивания
    const url = URL.createObjectURL(blob);
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = url;
    
    // Генерируем имя файла
    const fileName = `roadmap-${roadmapData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${new Date().toISOString().split('T')[0]}.json`;
    
    link.download = fileName;
    
    // Добавляем ссылку в DOM и кликаем
    document.body.appendChild(link);
    link.click();
    
    // Очищаем
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Дорожная карта экспортирована:', fileName);
    return fileName;
    
  } catch (error) {
    console.error('Ошибка при экспорте:', error);
    alert('Произошла ошибка при экспорте файла');
    return null;
  }
};

/**
 * Копирование дорожной карты в буфер обмена
 * @param {Object} roadmapData - данные дорожной карты
 */
export const copyToClipboard = async (roadmapData) => {
  try {
    const jsonString = JSON.stringify(roadmapData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (error) {
    console.error('Ошибка копирования:', error);
    return false;
  }
};

/**
 * Валидация данных перед экспортом
 * @param {Object} roadmapData - данные дорожной карты
 */
export const validateExportData = (roadmapData) => {
  const errors = [];
  
  if (!roadmapData) {
    errors.push('Данные дорожной карты отсутствуют');
    return errors;
  }
  
  if (!roadmapData.title || roadmapData.title.trim() === '') {
    errors.push('Отсутствует название дорожной карты');
  }
  
  if (!roadmapData.items || !Array.isArray(roadmapData.items)) {
    errors.push('Отсутствует или неверный формат списка пунктов');
  } else if (roadmapData.items.length === 0) {
    errors.push('Дорожная карта не содержит пунктов');
  }
  
  return errors;
};

/**
 * Создание примера JSON структуры
 */
export const createSampleRoadmap = () => {
  return {
    title: "Пример дорожной карты",
    description: "Это пример структуры JSON файла для импорта",
    items: [
      {
        id: "1",
        title: "Первый пункт",
        description: "Описание первого пункта для изучения",
        links: ["https://example.com"],
        userNote: "",
        status: "not_started",
        dueDate: null
      },
      {
        id: "2",
        title: "Второй пункт",
        description: "Описание второго пункта",
        links: [],
        userNote: "Моя заметка",
        status: "in_progress",
        dueDate: "2024-12-31"
      }
    ]
  };
};