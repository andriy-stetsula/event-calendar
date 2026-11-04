import "./Calendar.css";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const COLORS = ["blue", "green", "red", "orange", "purple"];

export const Calendar = () => {
  return (
    <div className="calendar">
      <header className="calendar__header">
        <h1 className="calendar__title">Листопад 2026</h1>

        <div className="calendar__controls">
          <button className="btn btn--ghost">Сьогодні</button>
          <button className="btn btn--icon" aria-label="Попередній місяць">
            ‹
          </button>
          <button className="btn btn--icon" aria-label="Наступний місяць">
            ›
          </button>
          <button className="btn btn--primary">+ Подія</button>
        </div>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar__grid">{/* TODO: дні з'являться тут */}</div>

      {/* TODO: показувати модалку за умовою */}
      <div className="modal-overlay">
        <form className="modal">
          <div className="modal__header">
            <h2 className="modal__title">Нова подія</h2>
            <button
              type="button"
              className="btn btn--icon"
              aria-label="Закрити"
            >
              ✕
            </button>
          </div>

          <label className="field">
            <span className="field__label">Назва</span>
            <input className="field__input" placeholder="Що плануємо?" />
          </label>

          <div className="field-row">
            <label className="field">
              <span className="field__label">Дата</span>
              <input className="field__input" type="date" />
            </label>

            <label className="field">
              <span className="field__label">Час</span>
              <input className="field__input" type="time" />
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
                  className={`colors__item colors__item--${c}`}
                />
              ))}
            </div>
          </div>

          <label className="field">
            <span className="field__label">Опис</span>
            <textarea
              className="field__input field__input--textarea"
              rows={3}
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost">
              Скасувати
            </button>
            <button type="submit" className="btn btn--primary">
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
