import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  LinkIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import styles from "./DetailPage.module.css";

const DetailPage = ({ roadmap, updateItem }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [userNote, setUserNote] = useState("");
  const [status, setStatus] = useState("not_started");
  const [dueDate, setDueDate] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    if (!roadmap || !id) {
      navigate("/");
      return;
    }

    const foundItem = roadmap.items.find((item) => item.id === id);
    if (!foundItem) {
      navigate("/");
      return;
    }

    setItem(foundItem);
    setUserNote(foundItem.userNote || "");
    setStatus(foundItem.status || "not_started");
    setDueDate(foundItem.dueDate || "");
  }, [roadmap, id, navigate]);

  const handleSaveNote = () => {
    if (item) {
      updateItem(item.id, { userNote });
      setIsEditingNote(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (item) {
      setStatus(newStatus);
      updateItem(item.id, { status: newStatus });
    }
  };

  const handleDueDateChange = (newDate) => {
    if (item) {
      setDueDate(newDate);
      updateItem(item.id, { dueDate: newDate });
    }
  };

  const handleDeleteNote = () => {
    if (confirm("Удалить заметку?")) {
      setUserNote("");
      if (item) {
        updateItem(item.id, { userNote: "" });
      }
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "done":
        return {
          label: "Выполнено",
          icon: CheckCircleIcon,
          color: "#6ee7b7",
          bgColor: "rgba(52, 211, 153, 0.15)",
        };
      case "in_progress":
        return {
          label: "В работе",
          icon: ArrowPathIcon,
          color: "#fcd34d",
          bgColor: "rgba(251, 191, 36, 0.18)",
        };
      case "not_started":
      default:
        return {
          label: "Не начат",
          icon: ClockIcon,
          color: "#94a3b8",
          bgColor: "rgba(148, 163, 184, 0.18)",
        };
    }
  };

  if (!item) {
    return (
      <div className={styles.loading}>
        <p>Загрузка...</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(status);
  const StatusGlyph = statusInfo.icon;

  return (
    <div className={styles.detailPage}>
      <div className={styles.backButton}>
        <Link to="/" className={styles.backLink}>
          ← Назад к списку
        </Link>
      </div>

      <div className={styles.detailContent}>
        <div className={styles.itemHeader}>
          <h1>{item.title}</h1>
          <div
            className={styles.statusIndicator}
            style={{
              backgroundColor: statusInfo.bgColor,
              color: statusInfo.color,
              borderColor: statusInfo.color,
            }}
          >
            <StatusGlyph aria-hidden="true" className={styles.statusGlyph} />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        <div className={styles.itemDescription}>
          <h3>Описание</h3>
          <p>{item.description}</p>
        </div>

        {item.links && item.links.length > 0 && (
          <div className={styles.linksSection}>
            <h3>
              <LinkIcon aria-hidden="true" className={styles.sectionIcon} />
              Полезные ссылки
            </h3>
            <ul className={styles.linksList}>
              {item.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkItem}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.controlsSection}>
          <div className={styles.controlGroup}>
            <h3>Статус изучения</h3>
            <div className={styles.statusControls}>
              {["not_started", "in_progress", "done"].map((statusOption) => {
                const info = getStatusInfo(statusOption);
                const StatusIcon = info.icon;
                return (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusChange(statusOption)}
                    className={`${styles.statusButton} ${
                      status === statusOption ? styles.active : ""
                    }`}
                    style={{
                      backgroundColor:
                        status === statusOption ? info.color : info.bgColor,
                      color: status === statusOption ? "#0b1220" : info.color,
                      borderColor: info.color,
                    }}
                  >
                    <StatusIcon aria-hidden="true" />
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <h3>Планирование</h3>
            <div className={styles.dateControl}>
              <label htmlFor="dueDate" className={styles.dateLabel}>
                <CalendarDaysIcon
                  aria-hidden="true"
                  className={styles.sectionIcon}
                />
                Дата завершения:
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className={styles.dateInput}
              />
              {dueDate && (
                <button
                  onClick={() => handleDueDateChange("")}
                  className={styles.clearButton}
                >
                  Очистить
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.notesSection}>
          <div className={styles.notesHeader}>
            <h3>
              <PencilSquareIcon
                aria-hidden="true"
                className={styles.sectionIcon}
              />
              Ваши заметки
            </h3>
            <div className={styles.notesActions}>
              {isEditingNote ? (
                <>
                  <button
                    onClick={handleSaveNote}
                    className={styles.saveButton}
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className={styles.cancelButton}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className={styles.editButton}
                  >
                    {userNote ? "Редактировать" : "Добавить заметку"}
                  </button>
                  {userNote && (
                    <button
                      onClick={handleDeleteNote}
                      className={styles.deleteButton}
                    >
                      Удалить
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {isEditingNote ? (
            <textarea
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              className={styles.noteTextarea}
              placeholder="Введите вашу заметку здесь..."
              rows={6}
            />
          ) : (
            <div className={styles.noteDisplay}>
              {userNote ? (
                <pre className={styles.noteContent}>{userNote}</pre>
              ) : (
                <p className={styles.noNote}>
                  Заметок пока нет. Нажмите "Добавить заметку" чтобы создать
                  первую.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
