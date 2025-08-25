import { IconArrowLeft, IconDownload, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import * as XLSX from "xlsx";


type Booking = {
	id: number
	date: string
	time: string
	user: string
	room: number
	office: string
	floor: number
}

const data = [
	{ day: 'Пн', count: 3 },
	{ day: 'Вт', count: 5 },
	{ day: 'Ср', count: 8 },
	{ day: 'Чт', count: 7 },
	{ day: 'Пт', count: 9 },
	{ day: 'Сб', count: 6 },
	{ day: 'Вс', count: 11 },
]

export default function AdminDashboard() {
	const [bookings, setBookings] = useState<Booking[]>([
		{
			id: 1,
			date: '17 апр.',
			time: '09:00 – 11:00',
			user: 'Иван Петров',
			room: 12,
			office: '1',
			floor: 1,
		},
		{
			id: 2,
			date: '20 апр.',
			time: '14:00 – 16:00',
			user: 'Анна Сидорова',
			room: 12,
			office: '1',
			floor: 1,
		},
	])

	const handleExportCSV = () => {
		// Заголовок
		const header = 'Дата;Время;Пользователь;Помещение\n'

		// Строки
		const rows = bookings
			.map(b => `${b.date};${b.time};${b.user};${b.room}`)
			.join('\n')

		// Финальный CSV: BOM + данные
		const csvContent = '\uFEFF' + header + rows

		// Создание файла
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)

		// Скачивание
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', 'bookings.csv')
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	const handleDelete = (id: number) => {
		setBookings(prev => prev.filter(b => b.id !== id))
	}

	return (
		<div className='w-full min-h-screen flex justify-center items-start py-6 sm:py-10 bg-white'>
			<div className='w-full max-w-6xl flex flex-col gap-6 px-2 sm:px-4'>
				{/* Заголовок */}
				<div className='flex items-center justify-between flex-wrap gap-3'>
					<Link
						to='/'
						className='flex items-center gap-1 px-3 py-2 rounded-full hover:bg-[#e6f7ff] transition sm:hidden'
					>
						<IconArrowLeft
							size={20}
							className='text-black group-hover:text-[#1daff7]'
						/>
					</Link>

					<h1 className="font-['PPRader'] text-[22px] sm:text-[28px] md:text-[36px] text-black tracking-tight text-center flex-1">
						Действующие бронирования
					</h1>

					<button
						onClick={handleExportCSV}
						className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-full hover:bg-[#1daff7] transition text-[14px] sm:text-[15px] font-['PPRader']"
					>
						<IconDownload size={16} className='shrink-0' />
						Экспорт в CSV
					</button>
				</div>

				{/* Таблица бронирований */}
				<section aria-labelledby='bookings-heading'>
					<h2 id='bookings-heading' className='sr-only'>
						Бронирования
					</h2>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[500px] border border-gray-200 rounded-xl overflow-hidden shadow-sm text-sm sm:text-base'>
							<thead className='bg-gray-50'>
								<tr>
									{['Дата', 'Время', 'Пользователь', 'Помещение'].map(
										(item, index) => (
											<th
												className="px-4 py-3 text-left text-sm font-['PPRader'] text-gray-700"
												key={index}
											>
												{item}
											</th>
										)
									)}
									<th className="px-4 py-3 w-20  text-sm font-['PPRader'] text-gray-700">
										Действия
									</th>
								</tr>
							</thead>

							<tbody className='divide-y divide-gray-200'>
								{bookings.map(b => (
									<tr key={b.id}>
										<td className="px-4 py-3 text-sm text-gray-700 font-['PPRader']">
											{b.date}
										</td>
										<td className="px-4 py-3 text-sm text-gray-700 font-['PPRader']">
											{b.time}
										</td>
										<td className="px-4 py-3 text-sm text-gray-700 font-['PPRader']">
											{b.user}
										</td>
										<td className="px-4 py-3 text-sm text-gray-700 font-['PPRader']">
											<div className='flex flex-col'>
												<span className='font-medium'>Офис: {b.office}</span>
												<span className='text-gray-500'>Этаж {b.floor}</span>
												<span className='text-gray-500'>Комната {b.room}</span>
											</div>
										</td>
										<td className='px-4 py-3 text-center'>
											<button
												onClick={() => handleDelete(b.id)}
												className='p-2 rounded-full hover:bg-red-100 transition flex items-center justify-center mx-auto'
												aria-label='Удалить бронирование'
											>
												<IconTrash size={18} className='text-red-500' />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>

				{/* Статистика */}
				<section
					aria-labelledby='stats-chart'
					className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'
				>
					<h2 id='stats-chart' className='sr-only'>
						Статистика и график
					</h2>

					{/* Свободные комнаты */}
					<article className='order-1 p-4 sm:p-6 border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center'>
						<h3 className="font-['PPRader'] text-[16px] sm:text-[18px] text-gray-500">
							Свободные комнаты
						</h3>
						<p className="font-['PPRader'] text-[28px] sm:text-[36px] text-black mt-2">
							5
						</p>
					</article>

					{/* Свободные столы */}
					<article className='order-2 p-4 sm:p-6 border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center'>
						<h3 className="font-['PPRader'] text-[16px] sm:text-[18px] text-gray-500">
							Свободные столы
						</h3>
						<p className="font-['PPRader'] text-[28px] sm:text-[36px] text-black mt-2">
							8
						</p>
					</article>

					{/* График */}
					<section
						aria-labelledby='chart-heading'
						className='order-3 lg:order-none p-4 sm:p-6 border border-gray-200 rounded-xl shadow-sm lg:row-span-2'
					>
						<h2
							id='chart-heading'
							className="font-['PPRader'] text-[16px] sm:text-[18px] text-black mb-3 sm:mb-4"
						>
							Загрузка рабочих мест по дням
						</h2>
						<div className='w-full h-60 sm:h-72'>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={data}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='day' />
									<YAxis />
									<Tooltip />
									<Bar dataKey='count' fill='#1daff7' radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</section>
				</section>
			</div>
		</div>
	)
}
