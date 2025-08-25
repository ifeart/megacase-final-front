import { IconX } from "@tabler/icons-react";
import QRCode from "react-qr-code";
import { formatBookingDate } from "@/services/storage";
import type { BookingData } from "@/types";

// Функция для форматирования продолжительности бронирования
export const formatDuration = (duration: string): string => {
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

interface BookingTicketProps {
  booking: BookingData;
  onClose: () => void;
}

export default function BookingTicket({
  booking,
  onClose,
}: BookingTicketProps) {
  // Генерируем URL для подтверждения бронирования
  const bookingUrl = `${window.location.origin}/booking/confirm/${booking.placeId}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-['PPRader'] text-[24px] text-black">
            Детали бронирования
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <IconX size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Информация о бронировании */}
          <div className="space-y-4">
            <h3 className="font-['PPRader'] text-[20px] text-black mb-4">
              Информация о бронировании
            </h3>

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

          {/* QR-код */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="font-['PPRader'] text-[20px] text-black">
              QR-код для подтверждения
            </h3>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <QRCode value={bookingUrl} size={200} level="M" />
            </div>

            <p className="font-['PPRader'] text-[14px] text-gray-500 text-center max-w-xs">
              Отсканируйте этот QR-код для подтверждения бронирования
            </p>

            {/* <p className="font-['PPRader'] text-[12px] text-gray-400 text-center max-w-xs">
              Или перейдите по ссылке:{" "}
              <a
                href={bookingUrl}
                className="text-blue-500 hover:underline break-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {bookingUrl}
              </a>
            </p> */}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded hover:bg-[#1daff7] transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
