import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MapIcon } from "@heroicons/react/24/outline";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import styles from "./App.module.css";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [roadmap, setRoadmap] = useLocalStorage("roadmapTracker", null);
  const [progress, setProgress] = useState(0);
  const [exportHistory, setExportHistory] = useLocalStorage(
    "exportHistory",
    []
  );

  const calculateProgress = (items) => {
    if (!items || items.length === 0) return 0;

    const doneItems = items.filter((item) => item.status === "done").length;
    return Math.round((doneItems / items.length) * 100);
  };

  const handleRoadmapLoaded = (data) => {
    setRoadmap(data);
    const newProgress = calculateProgress(data.items);
    setProgress(newProgress);
    console.log("Дорожная карта загружена:", data.title);
  };

  const handleLoadNewRoadmap = () => {
    if (
      window.confirm("Загрузить новую дорожную карту? Текущая будет заменена.")
    ) {
      setRoadmap(null);
      setProgress(0);
    }
  };

  const updateItem = (itemId, updates) => {
    if (!roadmap) return;

    const updatedItems = roadmap.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    const updatedRoadmap = { ...roadmap, items: updatedItems };
    setRoadmap(updatedRoadmap);

    const newProgress = calculateProgress(updatedItems);
    setProgress(newProgress);
  };

  const handleExport = (fileName) => {
    setExportHistory((prev) => [
      ...prev,
      { fileName, timestamp: new Date().toISOString() },
    ]);
  };

  const clearAllData = () => {
    if (window.confirm("Удалить все данные? Это действие нельзя отменить.")) {
      setRoadmap(null);
      setProgress(0);
      setExportHistory([]);
    }
  };

  useEffect(() => {
    if (roadmap) {
      const newProgress = calculateProgress(roadmap.items);
      setProgress(newProgress);
    }
  }, [roadmap]);

  return (
    <Router>
      <div className={styles.app}>
        <Header
          roadmap={roadmap}
          progress={progress}
          onRoadmapLoaded={handleRoadmapLoaded}
          onExport={handleExport}
          onLoadNew={handleLoadNewRoadmap}
        />

        <main className={styles.main}>
          <div className={styles.container}>
            <Routes>
              <Route
                path="/"
                element={
                  roadmap ? (
                    <HomePage
                      roadmap={roadmap}
                      updateItem={updateItem}
                      onLoadNewRoadmap={handleLoadNewRoadmap}
                    />
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <MapIcon
                          aria-hidden="true"
                          className={styles.emptyIconSvg}
                        />
                      </div>
                      <h2 className={styles.emptyTitle}>
                        Загрузите дорожную карту
                      </h2>
                      <p className={styles.emptyText}>
                        Используйте панель вверху, чтобы импортировать JSON-файл
                        или создать пример. После загрузки вы сможете отмечать
                        статусы, вести заметки и отслеживать прогресс.
                      </p>
                      <ul className={styles.emptyList}>
                        <li>
                          Поддерживаются поля: <code>title</code>,{" "}
                          <code>description</code>, <code>items[]</code>
                        </li>
                        <li>
                          Каждый пункт должен содержать <code>id</code> и{" "}
                          <code>title</code>
                        </li>
                        <li>
                          Дополнительно можно указать <code>description</code>,{" "}
                          <code>links</code>, <code>status</code>,{" "}
                          <code>dueDate</code>, <code>userNote</code>
                        </li>
                      </ul>
                    </div>
                  )
                }
              />
              <Route
                path="/item/:id"
                element={
                  <DetailPage roadmap={roadmap} updateItem={updateItem} />
                }
              />
            </Routes>
          </div>
        </main>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <p>
              Персональный трекер технологий •{" "}
              {roadmap ? `${progress}% завершено` : "Загрузите дорожную карту"}
              {roadmap && (
                <button
                  onClick={clearAllData}
                  className={styles.clearDataButton}
                  title="Удалить все данные"
                >
                  ×
                </button>
              )}
            </p>
            {exportHistory.length > 0 && (
              <p className={styles.exportInfo}>
                Последний экспорт:{" "}
                {exportHistory[exportHistory.length - 1].fileName}
                <button
                  onClick={() => setExportHistory([])}
                  className={styles.clearHistoryButton}
                  title="Очистить историю"
                >
                  ×
                </button>
              </p>
            )}
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
