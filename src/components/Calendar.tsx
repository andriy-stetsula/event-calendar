import { useState } from "react";
import { uk } from "date-fns/locale";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store.ts";
import { addEvent } from "../store/eventsSlice.ts";
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

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const events = useSelector((state: RootState) => state.events);
  const dispatch = useDispatch<AppDispatch>();

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
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`day ${!isSameMonth(day, currentMonth) ? "day--outside" : ""} ${isToday(day) ? "day--today" : ""}`}
          >
            <span className="day__number">
              {format(day, "d")}

              <ul className="day__events">
                {events
                  .filter((ev) => ev.date === format(day, "yyyy-MM-dd"))
                  .map((ev) => (
                    <li key={ev.id} className={`event event--${ev.color}`}>
                      <span className="event__time">{ev.time}</span>
                      <span className="event__title">{ev.title}</span>
                    </li>
                  ))}
              </ul>
            </span>
          </div>
        ))}
      </div>

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
