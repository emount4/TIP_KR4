// src/components/Header.jsx
import React from "react";
import {
  RocketLaunchIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { exportRoadmap, copyToClipboard } from "../utils/exportUtils";
import styles from "./Header.module.css";

const Header = ({ roadmap, progress, onRoadmapLoaded, onExport }) => {
  const handleExport = async () => {
    if (!roadmap) {
      alert("Сначала загрузите дорожную карту");
      return;
    }

    const fileName = exportRoadmap(roadmap);
    if (fileName && onExport) {
      onExport(fileName);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!roadmap) {
      alert("Нет данных для копирования");
      return;
    }

    const success = await copyToClipboard(roadmap);
    if (success) {
      alert("Дорожная карта скопирована в буфер обмена!");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".json")) {
      alert("Пожалуйста, выберите файл с расширением .json");
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Минимальная валидация
      if (!data.title || !data.items || !Array.isArray(data.items)) {
        throw new Error("Неверный формат файла");
      }

      // Обработка данных
      const processedData = {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          userNote: item.userNote || "",
          status: item.status || "not_started",
          dueDate: item.dueDate || null,
          links: item.links || [],
        })),
      };

      onRoadmapLoaded(processedData);
      event.target.value = "";
    } catch (err) {
      console.error("Ошибка загрузки файла:", err);
      alert(`Ошибка загрузки файла: ${err.message}`);
    }
  };

  const handleCreateExample = async () => {
    try {
      // Импорт тестового JSON файла
      const response = await fetch('/test/test.json');
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить файл: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Валидация данных
      if (!data.title || !data.items || !Array.isArray(data.items)) {
        throw new Error("Неверный формат тестового файла");
      }

      // Обработка данных
      const processedData = {
        ...data,
        items: data.items.map((item) => ({
          ...item,
          userNote: item.userNote || "",
          status: item.status || "not_started",
          dueDate: item.dueDate || null,
          links: item.links || [],
        })),
      };

      onRoadmapLoaded(processedData);
      console.log("Тестовый файл успешно загружен:", data.title);
    } catch (err) {
      console.error("Ошибка загрузки тестового файла:", err);
      
      // Fallback: если файл не найден, создаем простой пример
      const fallbackExample = {
        title: "Пример дорожной карты: React",
        description: "Изучение React с нуля до продвинутого уровня",
        items: [
          {
            id: "1",
            title: "Основы JavaScript",
            description: "Синтаксис ES6+, асинхронность, DOM манипуляции",
            links: ["https://learn.javascript.ru/"],
            userNote: "",
            status: "not_started",
            dueDate: null,
          },
          {
            id: "2",
            title: "Компоненты и JSX",
            description: "Создание компонентов, работа с JSX, пропсы",
            links: ["https://reactjs.org/docs/introducing-jsx.html"],
            userNote: "",
            status: "in_progress",
            dueDate: "2024-12-20",
          },
          {
            id: "3",
            title: "Состояние и хуки",
            description: "useState, useEffect, кастомные хуки",
            links: ["https://reactjs.org/docs/hooks-state.html"],
            userNote: "Изучил базовые примеры",
            status: "done",
            dueDate: "2024-12-10",
          },
          {
            id: "4",
            title: "Маршрутизация",
            description: "React Router, навигация в SPA",
            links: ["https://reactrouter.com/en/main"],
            userNote: "",
            status: "not_started",
            dueDate: null,
          },
        ],
      };
      
      onRoadmapLoaded(fallbackExample);
      alert("Тестовый файл не найден. Загружен стандартный пример.");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoTitle}>
              <div className={styles.logoIcon}>
                <RocketLaunchIcon aria-hidden="true" />
              </div>
              <div>
                <h1>Персональный трекер технологий</h1>
                <p className={styles.subtitle}>
                  Отслеживайте свой прогресс в изучении новых технологий
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.controlsSection}>
          {roadmap ? (
            <div className={styles.loadedState}>
              <div className={styles.progressContainer}>
                <div className={styles.progressInfo}>
                  <span className={styles.progressLabel}>Общий прогресс:</span>
                  <span className={styles.progressValue}>{progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className={styles.actionsRow}>
                <div className={styles.exportButtons}>
                  <button
                    onClick={handleExport}
                    className={styles.exportButton}
                    title="Экспортировать дорожную карту в JSON файл"
                  >
                    <ArrowDownTrayIcon
                      aria-hidden="true"
                      className={styles.buttonIconSmall}
                    />
                    Экспорт JSON
                  </button>

                  <button
                    onClick={handleCopyToClipboard}
                    className={styles.copyButton}
                    title="Скопировать в буфер обмена"
                  >
                    <DocumentDuplicateIcon
                      aria-hidden="true"
                      className={styles.buttonIconSmall}
                    />
                    Копировать
                  </button>
                </div>

                {/* <div className={styles.roadmapInfo}>
                  <h3 className={styles.roadmapTitle}>{roadmap.title}</h3>
                  {roadmap.description && (
                    <p className={styles.roadmapDescription}>
                      {roadmap.description}
                    </p>
                  )}
                </div> */}
              </div>
            </div>
          ) : (
            <div className={styles.uploadControls}>
              <div className={styles.uploaderHeader}>
                <h3>Загрузка дорожной карты</h3>
                <p>Выберите JSON файл с дорожной картой или создайте пример</p>
              </div>

              <div className={styles.uploaderControls}>
                <label className={styles.fileInputLabel}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <span className={styles.fileInputButton}>
                    <ArrowUpTrayIcon
                      aria-hidden="true"
                      className={styles.buttonIcon}
                    />
                    Выбрать JSON файл
                  </span>
                </label>

                <button
                  className={styles.exampleButton}
                  onClick={handleCreateExample}
                >
                  <SparklesIcon
                    aria-hidden="true"
                    className={styles.buttonIcon}
                  />
                  Загрузить тестовый файл
                </button>
              </div>

              <div className={styles.fileRequirements}>
                <h4>Требования к формату файла:</h4>
                <ul>
                  <li>Файл должен быть в формате JSON</li>
                  <li>
                    Обязательные поля: <code>title</code>, <code>items</code>
                  </li>
                  <li>
                    Каждый пункт должен иметь: <code>id</code>,{" "}
                    <code>title</code>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;