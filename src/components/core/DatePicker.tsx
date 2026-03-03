import { useState } from "react";

interface BirthDatePickerProps {
  onConfirm?: (date: Date) => void;
}

const formatDate = (date: Date): string =>
  String(date.getDate()).padStart(2, "0") +
  "/" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "/" +
  date.getFullYear();

const MONTHS: string[] = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

const DAYS: string[] = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];

type View = "day" | "month" | "year";

export const DatePicker = ({ onConfirm }: BirthDatePickerProps) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState<Date>(new Date(2000, 0, 1));
  const [selected, setSelected] = useState<Date | null>(null);
  const [view, setView] = useState<View>("day");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const year: number = viewDate.getFullYear();
  const month: number = viewDate.getMonth();
  const firstDay: number = new Date(year, month, 1).getDay();
  const offset: number = (firstDay + 6) % 7;
  const daysInMonth: number = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const years: number[] = Array.from(
    { length: today.getFullYear() - 1900 + 1 },
    (_, i) => today.getFullYear() - i,
  );

  const isSelected = (d: number | null): boolean =>
    !!selected &&
    selected.getDate() === d &&
    selected.getMonth() === month &&
    selected.getFullYear() === year;

  const handleDay = (d: number | null): void => {
    if (!d) return;
    const date = new Date(year, month, d);
    setSelected(date);
    onConfirm?.(date);
    setIsOpen(false);
  };
  const prevMonth = (): void => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = (): void => {
    if (year === today.getFullYear() && month === today.getMonth()) return;
    setViewDate(new Date(year, month + 1, 1));
  };
  const handleMonthSelect = (i: number): void => {
    setViewDate(new Date(year, i, 1));
    setView("day");
  };
  const handleYearSelect = (y: number): void => {
    setViewDate(new Date(y, month, 1));
    setView("day");
  };
  const toggleView = (target: View): void => {
    setView((prev) => (prev === target ? "day" : target));
  };

  const baseBtn =
    "text-sm cursor-pointer outline-none focus:outline-none focus-visible:outline-none transition-colors";
  const navBtn = baseBtn + " font-semibold px-3 py-1.5 rounded-xl";

  return (
    <div className="relative w-80">
      {/* Input trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 bg-white rounded border border-gray-300 cursor-pointer outline-none focus:outline-none focus-visible:outline-none hover:border-gray-300 transition-colors"
      >
        <span
          className={
            selected
              ? "text-gray-900 text-sm font-medium"
              : "text-gray-400 text-sm"
          }
        >
          {selected ? formatDate(selected) : "Seleziona data di nascita"}
        </span>
        <svg
          className={
            "w-4 h-4 text-gray-400 transition-transform " +
            (isOpen ? "rotate-180" : "")
          }
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 z-50 bg-white rounded-3xl p-6 w-80 shadow-xl">
          {/* Nav */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              type="button"
              className={
                baseBtn +
                " text-gray-300 hover:text-gray-500 text-xl px-3 py-1 rounded-lg"
              }
            >
              &lsaquo;
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => toggleView("month")}
                type="button"
                className={
                  navBtn +
                  (view === "month"
                    ? " bg-gray-900 text-white"
                    : " bg-gray-100 text-gray-900 hover:bg-gray-200")
                }
              >
                {MONTHS[month]}
              </button>
              <button
                onClick={() => toggleView("year")}
                type="button"
                className={
                  navBtn +
                  (view === "year"
                    ? " bg-gray-900 text-white"
                    : " bg-gray-100 text-gray-900 hover:bg-gray-200")
                }
              >
                {year}
              </button>
            </div>
            <button
              onClick={nextMonth}
              type="button"
              className={
                baseBtn +
                " text-gray-300 hover:text-gray-500 text-xl px-3 py-1 rounded-lg"
              }
            >
              &rsaquo;
            </button>
          </div>

          {/* Month picker */}
          {view === "month" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthSelect(i)}
                  className={
                    baseBtn +
                    " py-2.5 rounded-xl " +
                    (i === month
                      ? "bg-gray-900 text-white font-bold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  }
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Year picker */}
          {view === "year" && (
            <div className="max-h-56 overflow-y-auto grid grid-cols-4 gap-1.5">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => handleYearSelect(y)}
                  className={
                    baseBtn +
                    " py-2 rounded-xl " +
                    (y === year
                      ? "bg-gray-900 text-white font-bold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                  }
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Day grid */}
          {view === "day" && (
            <>
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs text-gray-300 font-semibold py-1 tracking-wide"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDay(d)}
                    disabled={!d}
                    className={
                      baseBtn +
                      " aspect-square rounded-xl " +
                      (isSelected(d)
                        ? "bg-gray-900 text-white font-bold"
                        : d
                          ? "hover:bg-gray-100 text-gray-900"
                          : "cursor-default")
                    }
                  >
                    {d ?? ""}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
