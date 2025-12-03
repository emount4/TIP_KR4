import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import styles from "./HomePage.module.css";

const HomePage = ({ roadmap, updateItem }) => {
  const [viewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const getStatusConfig = (status) => {
    switch (status) {
      case "done":
        return {
          text: "Выполнено",
          icon: CheckCircleIcon,
          priority: 3,
        };
      case "in_progress":
        return {
          text: "В работе",
          icon: ArrowPathIcon,
          priority: 2,
        };
      case "not_started":
      default:
        return {
          text: "Не начат",
          icon: ClockIcon,
          priority: 1,
        };
    }
  };

  const filteredItems = roadmap.items.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "status": {
        const statusA = getStatusConfig(a.status).priority;
        const statusB = getStatusConfig(b.status).priority;
        return statusB - statusA;
      }
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      default:
        return 0;
    }
  });

  const handleStatusChange = (itemId, newStatus) => {
    updateItem(itemId, { status: newStatus });
  };

  const handleQuickStatusToggle = (itemId, currentStatus) => {
    const statusOrder = ["not_started", "in_progress", "done"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    updateItem(itemId, { status: nextStatus });
  };

  const stats = {
    total: roadmap.items.length,
    done: roadmap.items.filter((item) => item.status === "done").length,
    inProgress: roadmap.items.filter((item) => item.status === "in_progress")
      .length,
    notStarted: roadmap.items.filter((item) => item.status === "not_started")
      .length,
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.roadmapHeader}>
        <div className={styles.roadmapInfo}>
          <h1 className={styles.roadmapTitle}>{roadmap.title}</h1>
          {roadmap.description && (
            <p className={styles.roadmapDescription}>{roadmap.description}</p>
          )}
        </div>

        <div className={styles.roadmapStats}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.total}</div>
            <div className={styles.statLabel}>Всего тем</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statNumber} ${styles.statDone}`}>
              {stats.done}
            </div>
            <div className={styles.statLabel}>Выполнено</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statNumber} ${styles.statInProgress}`}>
              {stats.inProgress}
            </div>
            <div className={styles.statLabel}>В работе</div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statNumber} ${styles.statNotStarted}`}>
              {stats.notStarted}
            </div>
            <div className={styles.statLabel}>Осталось</div>
          </div>
        </div>
      </div>

      <div className={styles.controlsPanel}>
        <div className={styles.viewControls}>
          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label htmlFor="filterStatus" className={styles.filterLabel}>
                Фильтр по статусу:
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Все статусы</option>
                <option value="done">Выполнено</option>
                <option value="in_progress">В работе</option>
                <option value="not_started">Не начат</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="sortBy" className={styles.filterLabel}>
                Сортировка:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="default">По умолчанию</option>
                <option value="title">По названию</option>
                <option value="status">По статусу</option>
                <option value="dueDate">По дате завершения</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendTitle}>Легенда:</div>
          <div className={styles.legendItems}>
            <div className={styles.legendItem}>
              <span className={`${styles.legendColor} ${styles.done}`}></span>
              <span>Выполнено</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendColor} ${styles.inProgress}`}
              ></span>
              <span>В работе</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={`${styles.legendColor} ${styles.notStarted}`}
              ></span>
              <span>Не начат</span>
            </div>
          </div>
        </div>
      </div>

      {/* Отображение карточек */}
      <div
        className={`${styles.itemsContainer} ${
          viewMode === "grid" ? styles.gridView : styles.listView
        }`}
      >
        {sortedItems.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <MagnifyingGlassIcon aria-hidden="true" />
            </div>
            <h3>Темы не найдены</h3>
            <p>Попробуйте изменить параметры фильтрации</p>
            <button
              onClick={() => setFilterStatus("all")}
              className={styles.resetFilterButton}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          sortedItems.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={item.id}
                className={`${styles.itemCard} ${
                  styles[`status-${item.status}`]
                } ${viewMode === "list" ? styles.listCard : ""}`}
              >
                {/* Заголовок карточки */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleSection}>
                    <Link to={`/item/${item.id}`} className={styles.itemLink}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                    </Link>
                    <div
                      className={`${styles.statusBadge} ${
                        styles[`status-${item.status}`]
                      }`}
                    >
                      <span className={styles.statusIcon}>
                        <StatusIcon aria-hidden="true" />
                      </span>
                      <span className={styles.statusText}>
                        {statusConfig.text}
                      </span>
                    </div>
                  </div>

                  <div className={styles.quickActions}>
                    <button
                      onClick={() =>
                        handleQuickStatusToggle(item.id, item.status)
                      }
                      className={styles.quickStatusButton}
                      title="Сменить статус"
                    >
                      <ArrowPathRoundedSquareIcon aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Описание */}
                <div className={styles.cardBody}>
                  <p className={styles.itemDescription}>{item.description}</p>

                  {/* Превью заметки */}
                  <div className={styles.notePreview}>
                    <div className={styles.notePreviewHeader}>
                      <span className={styles.noteIcon}>
                        <PencilSquareIcon aria-hidden="true" />
                      </span>
                      <span className={styles.noteLabel}>Заметка:</span>
                    </div>
                    <p className={styles.notePreviewText}>
                      {item.userNote && item.userNote.trim() ? (
                        item.userNote.length > 80 ? (
                          `${item.userNote.substring(0, 80)}...`
                        ) : (
                          item.userNote
                        )
                      ) : (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          Заметки нет
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Футер карточки */}
                <div className={styles.cardFooter}>
                  <div className={styles.metaInfo}>
                    {item.dueDate ? (
                      <div className={styles.dueDateInfo}>
                        <span className={styles.dueDateIcon}>
                          <CalendarDaysIcon aria-hidden="true" />
                        </span>
                        <span className={styles.dueDateText}>
                          До:{" "}
                          {new Date(item.dueDate).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                    ) : (
                      <div className={styles.noDueDate}>Без срока</div>
                    )}

                    {item.links && item.links.length > 0 && (
                      <div className={styles.linksInfo}>
                        <span className={styles.linksIcon}>
                          <LinkIcon aria-hidden="true" />
                        </span>
                        <span className={styles.linksCount}>
                          {item.links.length} ссылок
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <Link
                      to={`/item/${item.id}`}
                      className={styles.detailsButton}
                    >
                      Подробнее →
                    </Link>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className={`${styles.statusSelect} ${
                        styles[`status-${item.status}`]
                      }`}
                    >
                      <option value="not_started">Не начат</option>
                      <option value="in_progress">В работе</option>
                      <option value="done">Выполнено</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomePage;
