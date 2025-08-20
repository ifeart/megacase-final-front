import { IconX } from '@tabler/icons-react'
import React, { useState } from 'react'

interface BookingFormProps {
	isOpen?: boolean
	onClose?: () => void
	placeBooking: 'room' | 'table'
	userId: string
	placeBookingId: string
}

export const BookingForm: React.FC<BookingFormProps> = ({
	isOpen = true,
	onClose,
	placeBooking = 'table',
	userId = 'sdfsdfsdfsdf',
	placeBookingId = 'dfdsfsdfsdf',
}) => {
	const [selectedDay, setSelectedDay] = useState<
		'today' | 'tomorrow' | 'dayAfter'
	>('')
	const [selectedTime, setSelectedTime] = useState<string>('')
	const [selectedDuration, setSelectedDuration] = useState<
		'30min' | '1hour' | '1.5hour' | '2hour' | 'toTheEndWorkDay' | ''
	>('')

	const timeSlots = [
		'9:00',
		'9:30',
		'10:00',
		'10:30',
		'11:00',
		'11:30',
		'12:00',
		'12:30',
		'13:00',
		'13:30',
		'14:00',
		'14:30',
		'15:00',
		'15:30',
		'16:00',
		'16:30',
		'17:00',
		'17:30',
		'18:00',
	]

	const durationBookingOfRoom = [
		{ key: '30min', label: '30 минут' },
		{ key: '1hour', label: '1 час' },
		{ key: '1.5hour', label: '1,5 часа' },
	]

	const durationBookingOfTable = [
		{ key: '1hour', label: '1 час' },
		{ key: '2hour', label: '2 часа' },
		{ key: 'toTheEndWorkDay', label: 'До 18:00' },
	]

	const handleBooking = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Бронирование:', {
			userId,
			placeBookingId,
			day: selectedDay,
			time: selectedTime,
			duration: selectedDuration,
		})
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center z-50'>
			<form
				onSubmit={handleBooking}
				className='bg-white w-full max-w-[500px] p-3 sm:p-6 md:p-10 space-y-4 sm:space-y-8 rounded-2xl shadow-2xl border border-gray-200 relative'
			>
				<button
					type='button'
					onClick={onClose}
					className='absolute top-2 right-2 md:top-4 md:right-4 p-3 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-colors'
					aria-label='Закрыть окно'
				>
					<IconX size={24} stroke={2} />
				</button>

				<header className='text-center space-y-2'>
					<h2 className="font-['PPRader'] text-[clamp(18px,5vw,28px)] text-black tracking-tight">
						Этаж 2, Комната 301
					</h2>
				</header>

				<fieldset className='space-y-3'>
					<legend className='sr-only'>Выберите день</legend>
					<div className='bg-gray-100 rounded-xl p-1 flex'>
						{[
							{ key: 'today', label: 'Сегодня' },
							{ key: 'tomorrow', label: 'Завтра' },
							{ key: 'dayAfter', label: 'Послезавтра' },
						].map(({ key, label }) => (
							<button
								key={key}
								type='button'
								onClick={() => setSelectedDay(key as typeof selectedDay)}
								aria-pressed={selectedDay === key}
								className={`flex-1 py-3 px-4 font-['PPRader'] text-[14px] rounded-lg transition-all duration-300 ${
									selectedDay === key
										? 'bg-black text-white shadow-sm'
										: 'text-gray-500 hover:text-black'
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</fieldset>

				<fieldset className='space-y-3'>
					<legend className="font-['PPRader'] text-[16px] text-gray-500">
						Время
					</legend>
					<div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2'>
						{timeSlots.map(time => (
							<button
								key={time}
								type='button'
								onClick={() => setSelectedTime(time)}
								aria-pressed={selectedTime === time}
								className={`py-2 px-3 font-['PPRader'] text-[12px] border transition-all duration-300 ${
									selectedTime === time
										? 'bg-black text-white border-black'
										: 'bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black'
								}`}
							>
								{time}
							</button>
						))}
					</div>
				</fieldset>

				<fieldset className='space-y-3'>
					<legend className='sr-only'>Продолжительность</legend>
					<div className='bg-gray-100 rounded-xl p-1 flex'>
						{placeBooking === 'room'
							? durationBookingOfRoom.map(({ key, label }) => (
									<button
										key={key}
										type='button'
										onClick={() =>
											setSelectedDuration(key as typeof selectedDuration)
										}
										aria-pressed={selectedDuration === key}
										className={`flex-1 py-3 px-4 font-['PPRader'] text-[14px] rounded-lg transition-all duration-300 ${
											selectedDuration === key
												? 'bg-black text-white shadow-sm'
												: 'text-gray-500 hover:text-black'
										}`}
									>
										{label}
									</button>
							  ))
							: durationBookingOfTable.map(({ key, label }) => (
									<button
										key={key}
										type='button'
										onClick={() =>
											setSelectedDuration(key as typeof selectedDuration)
										}
										aria-pressed={selectedDuration === key}
										className={`flex-1 py-3 px-4 font-['PPRader'] text-[14px] rounded-lg transition-all duration-300 ${
											selectedDuration === key
												? 'bg-black text-white shadow-sm'
												: 'text-gray-500 hover:text-black'
										}`}
									>
										{label}
									</button>
							  ))}
					</div>
				</fieldset>

				<div className='space-y-4'>
					<button
						type='submit'
						className="w-full py-4 bg-black text-white font-['PPRader'] text-[16px] hover:bg-gray-800 transition-all duration-300 transform hover:translate-y-[-2px]"
						onClick={onClose}
					>
						Забронировать
					</button>
				</div>
			</form>
		</div>
	)
}
