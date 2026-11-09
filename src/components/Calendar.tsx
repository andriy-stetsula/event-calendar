import { useState } from "react";
import { uk } from "date-fns/locale";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store.ts";
import { addEvent, removeEvent } from "../store/eventsSlice.ts";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import "./Calendar.css";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const COLORS = ["blue", "green", "red", "orange", "purple"];

export const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("blue");
  const [description, setDescription] = useState("");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const events = useSelector((state: RootState) => state.events);
  const dispatch = useDispatch<AppDispatch>();

  const MAX_VISIBLE = 2;

  const getDayEvents = (day: Date) => {
    return events
      .filter((ev) => ev.date === format(day, "yyyy-MM-dd"))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      addEvent({
        id: crypto.randomUUID(),
        title,
        date,
        time,
        color,
        description,
      }),
    );
    setTitle("");
    setDate("");
    setTime("");
    setColor("blue");
    setDescription("");
    setIsModalOpen(false);
  };

  return (
    <div className="calendar">
      <header className="calendar__header">
        <h1 className="calendar__title">
          {format(currentMonth, "LLLL yyyy", { locale: uk })}
        </h1>

        <div className="calendar__controls">
          <button
            className="btn btn--ghost"
            onClick={() => setCurrentMonth(new Date())}
          >
            Сьогодні
          </button>
          <button
            className="btn btn--icon"
            aria-label="Попередній місяць"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ‹
          </button>
          <button
            className="btn btn--icon"
            aria-label="Наступний місяць"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            ›
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Подія
          </button>
        </div>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map((day) => {
          const dayEvents = getDayEvents(day);
          const hidden = dayEvents.length - MAX_VISIBLE;

          return (
            <div
              key={day.toISOString()}
              className={`day ${!isSameMonth(day, currentMonth) ? "day--outside" : ""} ${isToday(day) ? "day--today" : ""}`}
              onClick={() => dayEvents.length > 0 && setSelectedDay(day)}
            >
              <span className="day__number">{format(day, "d")}</span>

              <ul className="day__events">
                {dayEvents.slice(0, MAX_VISIBLE).map((ev) => (
                  <li key={ev.id} className={`event event--${ev.color}`}>
                    <span className="event__time">{ev.time}</span>
                    <span className="event__title">{ev.title}</span>
                    <button
                      type="button"
                      className="event__delete"
                      onClick={(event) => {
                        dispatch(removeEvent(ev.id));
                        event.stopPropagation();
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              {hidden > 0 && (
                <button
                  className="day__more"
                  onClick={(event) => {
                    setSelectedDay(day);
                    event.stopPropagation();
                  }}
                >
                  + ще {hidden}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {format(selectedDay, "d MMMM yyyy", { locale: uk })}
              </h2>
              <button
                type="button"
                className="btn btn--icon"
                aria-label="Закрити"
                onClick={() => setSelectedDay(null)}
              >
                ✕
              </button>
            </div>
            <ul className="day-modal__list">
              {getDayEvents(selectedDay).map((ev) => (
                <li
                  key={ev.id}
                  className={`day-modal__item day-modal__item--${ev.color}`}
                >
                  <div className="day-modal__top">
                    <span className="day-modal__dot"></span>
                    <span className="day-modal__name">{ev.title}</span>
                    <span className="day-modal__time">{ev.time}</span>
                    <button
                      type="button"
                      className="day-modal__delete"
                      aria-label="Видалити подію"
                      onClick={() => dispatch(removeEvent(ev.id))}
                    >
                      ✕
                    </button>
                  </div>
                  {ev.description && (
                    <p className="day-modal__desc">{ev.description}</p>
                  )}
                </li>
              ))}
            </ul>

            <button
              className="btn btn--ghost"
              onClick={() => setSelectedDay(null)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <form className="modal" onSubmit={handleSubmit}>
            <div className="modal__header">
              <h2 className="modal__title">Нова подія</h2>
              <button
                type="button"
                className="btn btn--icon"
                aria-label="Закрити"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <label className="field">
              <span className="field__label">Назва</span>
              <input
                className="field__input"
                placeholder="Що плануємо?"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Дата</span>
                <input
                  className="field__input"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>

              <label className="field">
                <span className="field__label">Час</span>
                <input
                  className="field__input"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </label>
            </div>

            <div className="field">
              <span className="field__label">Колір</span>
              <div className="colors">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    className={`colors__item colors__item--${c} ${color === c ? "is-active" : ""}`}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <label className="field">
              <span className="field__label">Опис</span>
              <textarea
                className="field__input field__input--textarea"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setIsModalOpen(false)}
              >
                Скасувати
              </button>
              <button type="submit" className="btn btn--primary">
                Зберегти
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
