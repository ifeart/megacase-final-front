import {
  createBooking,
  cancelBooking,
  canCancelBooking,
  convertRelativeDateToISO,
  formatBookingDate,
  getDesksBookings,
  getRoomsBookings,
} from "@/services/storage";
import type { BookingData, TimeSlot } from "@/types";
import { IconX, IconTrash } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  placeBooking: "room" | "table" | null;
  userId: string | null;
  placeBookingId: string | null;
  placeName?: string;
  placeLevel?: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
  placeBooking = "table",
  userId,
  placeBookingId,
  placeName = "Неизвестное место",
  placeLevel = 1,
}) => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<
    "today" | "tomorrow" | "dayAfter" | ""
  >("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<
    "30min" | "1hour" | "1.5hour" | "2hour" | "toTheEndWorkDay" | ""
  >("");
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [error, setError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Загружаем существующие бронирования
  useEffect(() => {
    if (!placeBookingId || !placeBooking) return;

    const type = placeBooking === "room" ? "room" : "desk";
    const allBookings =
      type === "room" ? getRoomsBookings() : getDesksBookings();

    const placeBookings = allBookings[placeBookingId] || [];
    setBookings(placeBookings);
  }, [placeBookingId, placeBooking]);

  // Проверяем валидность формы
  useEffect(() => {
    setIsFormValid(
      selectedDay !== "" && selectedTime !== "" && selectedDuration !== ""
    );
  }, [selectedDay, selectedTime, selectedDuration]);

  const timeSlots = [
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ];

  const durationBookingOfRoom = [
    { key: "30min", label: "30 минут" },
    { key: "1hour", label: "1 час" },
    { key: "1.5hour", label: "1,5 часа" },
  ];

  const durationBookingOfTable = [
    { key: "1hour", label: "1 час" },
    { key: "2hour", label: "2 часа" },
    { key: "toTheEndWorkDay", label: "До 18:00" },
  ];

  const durations =
    placeBooking === "room" ? durationBookingOfRoom : durationBookingOfTable;

  // Проверяем, доступно ли время для бронирования
  const isTimeSlotAvailable = (day: string, time: string): boolean => {
    // Преобразуем относительный день в дату ISO
    const date = convertRelativeDateToISO(
      day as "today" | "tomorrow" | "dayAfter"
    );

    return !bookings.some((booking) => {
      // Проверяем по date если она есть, иначе по day
      const bookingDate =
        booking.timeSlot.date ||
        (booking.timeSlot.day
          ? convertRelativeDateToISO(booking.timeSlot.day)
          : "");

      return bookingDate === date && booking.timeSlot.time === time;
    });
  };

  // Обработчик бронирования
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeBookingId || !userId || !user) return;

    // Проверяем доступность времени
    if (!isTimeSlotAvailable(selectedDay, selectedTime)) {
      setError("Это время уже забронировано. Выберите другое время.");
      return;
    }

    // Преобразуем относительный день в ISO дату
    const date = convertRelativeDateToISO(
      selectedDay as "today" | "tomorrow" | "dayAfter"
    );

    const timeSlot: TimeSlot = {
      date: date, // Сохраняем реальную дату
      day: selectedDay as "today" | "tomorrow" | "dayAfter", // Сохраняем также относительный день для совместимости
      time: selectedTime,
      duration: selectedDuration as
        | "30min"
        | "1hour"
        | "1.5hour"
        | "2hour"
        | "toTheEndWorkDay",
    };

    // Создаем бронирование
    createBooking(
      placeBooking === "room" ? "room" : "desk",
      placeBookingId,
      userId,
      user.name,
      timeSlot,
      placeName,
      placeLevel
    );

    onClose();
  };

  // Обработчик отмены бронирования
  const handleCancelBooking = (bookingId: string) => {
    if (!placeBookingId || !user) return;

    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Проверяем права на отмену бронирования
    if (!canCancelBooking(user.id, user.role, booking.userId)) {
      setError("У вас нет прав для отмены этого бронирования");
      return;
    }

    // Отменяем бронирование
    cancelBooking(
      placeBooking === "room" ? "room" : "desk",
      placeBookingId,
      bookingId
    );

    // Обновляем список бронирований
    setBookings(bookings.filter((b) => b.id !== bookingId));
  };

  // Форматирование даты
  const formatDay = (day: string): string => {
    const today = new Date();

    switch (day) {
      case "today":
        return `Сегодня (${today.toLocaleDateString("ru-RU")})`;
      case "tomorrow":
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        return `Завтра (${tomorrow.toLocaleDateString("ru-RU")})`;
      case "dayAfter":
        const dayAfter = new Date();
        dayAfter.setDate(today.getDate() + 2);
        return `Послезавтра (${dayAfter.toLocaleDateString("ru-RU")})`;
      default:
        return day;
    }
  };

  // Форматирование продолжительности
  const formatDuration = (duration: string): string => {
    switch (duration) {
      case "30min":
        return "30 минут";
      case "1hour":
        return "1 час";
      case "1.5hour":
        return "1,5 часа";
      case "2hour":
        return "2 часа";
      case "toTheEndWorkDay":
        return "До конца рабочего дня";
      default:
        return duration;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-[500px] p-3 sm:p-6 md:p-10 space-y-4 sm:space-y-8 rounded-2xl shadow-2xl border border-gray-200 relative z-10">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 p-3 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          aria-label="Закрыть окно"
        >
          <IconX size={24} stroke={2} />
        </button>

        <header className="text-center space-y-2">
          <h2 className="font-['PPRader'] text-[clamp(18px,5vw,28px)] text-black tracking-tight">
            Этаж {placeLevel}, {placeName}
          </h2>
        </header>

        {/* Существующие бронирования */}
        {bookings.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-['PPRader'] text-[18px] text-black">
              Текущие бронирования
            </h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 border border-gray-200 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-['PPRader'] text-[14px] text-black">
                      {booking.timeSlot.date
                        ? formatBookingDate(booking.timeSlot.date)
                        : booking.timeSlot.day
                        ? formatDay(booking.timeSlot.day)
                        : "Неизвестная дата"}
                      , {booking.timeSlot.time}
                    </p>
                    <p className="font-['PPRader'] text-[12px] text-gray-500">
                      {formatDuration(booking.timeSlot.duration)}
                    </p>
                    <p className="font-['PPRader'] text-[12px] text-gray-500">
                      Забронировал: {booking.userName}
                    </p>
                  </div>
                  {user &&
                    (user.id === booking.userId || user.role !== "USER") && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        title="Отменить бронирование"
                      >
                        <IconTrash size={18} />
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Форма нового бронирования */}
        <form onSubmit={handleBooking} className="space-y-6">
          <h3 className="font-['PPRader'] text-[18px] text-black">
            Новое бронирование
          </h3>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          <fieldset className="space-y-3">
            <legend className="font-['PPRader'] text-[16px] text-gray-500">
              Выберите день
            </legend>
            <div className="bg-gray-100 rounded-xl p-1 flex">
              {[
                { key: "today", label: "Сегодня" },
                { key: "tomorrow", label: "Завтра" },
                { key: "dayAfter", label: "Послезавтра" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(key as typeof selectedDay)}
                  aria-pressed={selectedDay === key}
                  className={`flex-1 py-3 px-4 font-['PPRader'] text-[14px] rounded-lg transition-all duration-300 ${
                    selectedDay === key
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-['PPRader'] text-[16px] text-gray-500">
              Время
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {timeSlots.map((time) => {
                const isAvailable = selectedDay
                  ? isTimeSlotAvailable(selectedDay, time)
                  : true;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    disabled={!isAvailable}
                    aria-pressed={selectedTime === time}
                    className={`py-2 px-3 font-['PPRader'] text-[12px] border transition-all duration-300 ${
                      selectedTime === time
                        ? "bg-black text-white border-black"
                        : isAvailable
                        ? "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-['PPRader'] text-[16px] text-gray-500">
              Продолжительность
            </legend>
            <div className="bg-gray-100 rounded-xl p-1 flex">
              {durations.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setSelectedDuration(key as typeof selectedDuration)
                  }
                  aria-pressed={selectedDuration === key}
                  className={`flex-1 py-3 px-4 font-['PPRader'] text-[14px] rounded-lg transition-all duration-300 ${
                    selectedDuration === key
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 font-['PPRader'] text-[16px] transition-all duration-300 transform hover:translate-y-[-2px] ${
                isFormValid
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
