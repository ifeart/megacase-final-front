import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { getBookingById, formatBookingDate } from "@/services/storage";
import { formatDuration } from "@/components/BookingTicket";
import type { BookingData } from "@/types";

export default function BookingConfirm() {
  const { bookingId } = useParams<{ bookingId: string }>();
  console.log(bookingId);
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (bookingId) {
      const bookingData = getBookingById(bookingId);
      setBooking(bookingData);
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-['PPRader'] text-[18px] mb-4">
            Бронирование не найдено
          </p>
          <Link to="/" className="text-blue-500 hover:underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-black text-white">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-gray-300 transition"
          >
            <IconArrowLeft size={20} />
            <span className="font-['PPRader']">На главную</span>
          </Link>
          <h1 className="font-['PPRader'] text-[28px] mt-4">
            Подтверждение бронирования
          </h1>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="font-['PPRader'] text-[20px] text-black">
                Информация о бронировании
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    Тип места
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black">
                    {booking.placeType === "room" ? "Комната" : "Стол"}{" "}
                    {booking.placeName || booking.placeId}
                  </p>
                </div>

                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    Локация
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black">
                    {booking.city && `${booking.city}, `}
                    {booking.officeName && `Офис ${booking.officeName}, `}
                    {booking.placeLevel && `Этаж ${booking.placeLevel}`}
                  </p>
                </div>

                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    Дата и время
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black">
                    {booking.timeSlot.date
                      ? formatBookingDate(booking.timeSlot.date)
                      : ""}{" "}
                    • {booking.timeSlot.time}
                  </p>
                </div>

                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    Длительность
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black">
                    {formatDuration(booking.timeSlot.duration)}
                  </p>
                </div>

                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    Статус
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black capitalize">
                    {booking.status === "active" ? "Активное" : booking.status}
                  </p>
                </div>

                <div>
                  <p className="font-['PPRader'] text-[14px] text-gray-500">
                    ID бронирования
                  </p>
                  <p className="font-['PPRader'] text-[16px] text-black font-mono">
                    {booking.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="font-['PPRader'] text-[20px] text-black text-center">
                Бронирование подтверждено
              </h3>
              <p className="font-['PPRader'] text-[14px] text-gray-500 text-center">
                {booking.userName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
