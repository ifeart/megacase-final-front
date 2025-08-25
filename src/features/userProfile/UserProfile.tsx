import { formatBookingDate, getUserBookings } from "@/services/storage";
import { userStorage } from "@/services/storageUser";
import { useState, useEffect, useMemo } from "react";
import type { BookingData } from "@/types";
import BookingTicket from "@/components/BookingTicket";

// Функция для форматирования продолжительности бронирования
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

export function UserProfile() {
  const user = userStorage.getUser();
  const [activeBookings, setActiveBookings] = useState<BookingData[]>([]);
  const [pastBookings, setPastBookings] = useState<BookingData[]>([]);

  const stableUser = useMemo(() => user, [user?.id]);

  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  useEffect(() => {
    if (!stableUser) return;
    const allBookings = getUserBookings(stableUser.id);
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const active: BookingData[] = [];
    const past: BookingData[] = [];

    allBookings.forEach((booking) => {
      if (booking.timeSlot.date >= today) {
        active.push({ ...booking, status: "active" });
      } else {
        past.push({ ...booking, status: "completed" });
      }
    });

    setActiveBookings(active);
    setPastBookings(past);
  }, [stableUser]); // Зависим от стабильного объекта пользователя

  const handleBookingClick = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsTicketOpen(true);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0 gap-5 pb-6 border-b border-gray-200">
        <img
          src="/profile.svg"
          alt={user?.name || "Профиль"}
          className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover shadow-md mx-auto sm:mx-0"
        />
        <div className="text-center sm:text-left space-y-2 mt-4 sm:mt-0">
          <h2 className="font-['PPRader'] text-[24px] sm:text-[28px] lg:text-[32px] text-black tracking-tight">
            {user?.name}
          </h2>
          <p className="font-['PPRader'] text-[14px] sm:text-[16px] text-gray-600">
            {user?.role}
          </p>
          <p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500 break-all">
            {user?.email}
          </p>
          <p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500">
            {user?.phone}
          </p>
        </div>
      </header>

      <section className="space-y-6 pb-6 border-b border-gray-200">
        <h3 className="font-['PPRader'] text-[18px] sm:text-[20px] text-black">
          Текущие бронирования
        </h3>
        {!activeBookings.length ? (
          <p className="font-['PPRader'] text-[15px] sm:text-[16px] text-black">
            У вас нет активных бронирований
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBookings.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 space-y-1 cursor-pointer"
                onClick={() => handleBookingClick(item)}
              >
                <p className="font-['PPRader'] text-[15px] sm:text-[16px] text-black">
                  {item.placeType === "room" ? "Комната" : "Стол"}{" "}
                  {item.placeName || item.placeId}
                </p>
                <p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-600">
                  {item.city && `${item.city}, `}
                  {item.officeName && `Офис ${item.officeName}, `}
                  {item.placeLevel && `Этаж ${item.placeLevel}`}
                </p>
                <p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500">
                  {item.timeSlot.date
                    ? formatBookingDate(item.timeSlot.date)
                    : ""}{" "}
                  • {item.timeSlot.time}
                </p>
                <p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500">
                  Длительность: {formatDuration(item.timeSlot.duration)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h3 className="font-['PPRader'] text-[18px] sm:text-[20px] text-black">
          История бронирований
        </h3>
        {!pastBookings.length ? (
          <p className="font-['PPRader'] text-[15px] sm:text-[16px] text-black">
            У вас нет истории бронирований
          </p>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-3"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {booking.placeType === "room" ? "Комната" : "Стол"}{" "}
                    {booking.placeName || booking.placeId}
                  </span>
                  <span className="text-sm text-gray-500">
                    {booking.timeSlot.date
                      ? formatBookingDate(booking.timeSlot.date)
                      : ""}{" "}
                    • {booking.timeSlot.time}
                  </span>
                  <span className="text-xs text-gray-500">
                    {booking.city && `${booking.city}, `}
                    {booking.officeName && `Офис ${booking.officeName}`}
                  </span>
                </div>

                <div className="mt-2 md:mt-0 text-sm text-gray-700">
                  {booking.status === "completed" ? (
                    <span className="border-b-2 border-green-600">
                      Завершено
                    </span>
                  ) : booking.status === "cancelled" ? (
                    <span className="border-b-2 border-red-600">Отменено</span>
                  ) : (
                    <span className="border-b-2 border-gray-600">Архив</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {isTicketOpen && selectedBooking && (
        <BookingTicket
          booking={selectedBooking}
          onClose={() => setIsTicketOpen(false)}
        />
      )}
    </div>
  );
}
