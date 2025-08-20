interface Booking {
	place: string
	date: string
	time: string
	status: 'active' | 'cancelled' | 'completed'
}

interface currentBooking extends Omit<Booking, 'status'> {
	id: number
	town: string
	office: string
	floor: number
	room: number
	desk?: number
}

const currentBookings: currentBooking[] = [
	{
		id: 1,
		place: 'Коворкинг',
		town: 'Москва',
		office: '5',
		floor: 3,
		room: 12,
		date: '17 апр. 2024',
		time: '09:00 – 11:00',
	},
]

const bookings: Booking[] = [
	{
		place: 'Коворкинг Сити',
		date: '2025-08-18',
		time: '10:00 – 14:00',
		status: 'completed',
	},
	{
		place: 'Офис Лофт',
		date: '2025-08-15',
		time: '12:00 – 18:00',
		status: 'completed',
	},
	{
		place: 'Бизнес Центр',
		date: '2025-08-12',
		time: '09:00 – 11:00',
		status: 'cancelled',
	},
]

export function UserProfile() {
	return (
		<div className='w-full max-w-[1200px] mx-auto px-4 py-8 space-y-10'>
			<header className='flex flex-col sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0 gap-5 pb-6 border-b border-gray-200'>
				<img
					src='/profile-photo.png'
					alt='Иван Петров'
					className='w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover shadow-md mx-auto sm:mx-0'
				/>
				<div className='text-center sm:text-left space-y-2 mt-4 sm:mt-0'>
					<h2 className="font-['PPRader'] text-[24px] sm:text-[28px] lg:text-[32px] text-black tracking-tight">
						Иван Петров
					</h2>
					<p className="font-['PPRader'] text-[14px] sm:text-[16px] text-gray-600">
						Менеджер
					</p>
					<p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500 break-all">
						ivan.petrov@example.com
					</p>
					<p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500">
						+7 123 456-78-90
					</p>
				</div>
			</header>

			<section className='space-y-6 pb-6 border-b border-gray-200'>
				<h3 className="font-['PPRader'] text-[18px] sm:text-[20px] text-black">
					Текущие бронирования
				</h3>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{currentBookings.map(item => (
						<div className='border border-gray-200 rounded-xl p-4 space-y-1'>
							<p className="font-['PPRader'] text-[15px] sm:text-[16px] text-black">
								{item.place}
							</p>
							<p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-600">
								{item.town}, Офис {item.office}, Этаж {item.floor}, Комната {item.room}, {item.desk ? `Стол ${item.desk}` : null}
							</p>
							<p className="font-['PPRader'] text-[13px] sm:text-[14px] text-gray-500">
								{item.date} • {item.time}
							</p>
						</div>
					))}
				</div>
			</section>

			<section className='space-y-6'>
				<h3 className="font-['PPRader'] text-[18px] sm:text-[20px] text-black">
					История бронирований
				</h3>
				<div className='w-full flex flex-col gap-4'>
					{bookings.map((booking, index) => (
						<div
							key={index}
							className='flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-3'
						>
							<div className='flex flex-col'>
								<span className='font-medium text-gray-900'>
									{booking.place}
								</span>
								<span className='text-sm text-gray-500'>
									{booking.date} • {booking.time}
								</span>
							</div>

							<div className='mt-2 md:mt-0 text-sm text-gray-700'>
								{booking.status === 'completed' ? (
									<span className='border-b-2 border-green-600'>Завершено</span>
								) : (
									<span className='border-b-2 border-red-600'>Отклонено</span>
								)}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
