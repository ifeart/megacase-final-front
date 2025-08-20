import {
	IconChevronLeft,
	IconChevronRight,
	IconDots,
} from '@tabler/icons-react'
import React from 'react'

interface PaginationProps {
	currentPage?: number
	totalPages: number
	onPageChange: (page: number) => void
	maxVisiblePages?: number
}

export function Pagination ({
	currentPage = 1,
	totalPages,
	onPageChange,
	maxVisiblePages = 5,
}: PaginationProps ) {
	const generatePageNumbers = (): (number | string)[] => {
		const pages: (number | string)[] = []
		const halfVisible = Math.floor(maxVisiblePages / 2)

		let startPage = Math.max(1, currentPage - halfVisible)
		const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1)
		}

		// Добавляем первую страницу и троеточие если нужно
		if (startPage > 1) {
			pages.push(1)
			if (startPage > 2) {
				pages.push('...')
			}
		}

		// Добавляем видимые страницы
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i)
		}

		// Добавляем троеточие и последнюю страницу если нужно
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...')
			}
			pages.push(totalPages)
		}

		return pages
	}

	const handlePageClick = (page: number | string): void => {
		if (typeof page === 'number' && page !== currentPage) {
			onPageChange(page)
		}
	}

	const handlePrevious = (): void => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNext = (): void => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const pages = generatePageNumbers()

	return (
		<div className='flex items-center justify-center space-x-1'>
			{/* Кнопка "Назад" */}
			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
					currentPage === 1
						? 'text-gray-400 cursor-not-allowed bg-gray-100'
						: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
				}`}
				type='button'
			>
				<IconChevronLeft size={16} className='mr-1' />
				Назад
			</button>

			{/* Номера страниц */}
			<div className='flex space-x-1'>
				{pages.map((page, index) => (
					<button
						key={`page-${index}`}
						onClick={() => handlePageClick(page)}
						className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
							page === currentPage
								? 'bg-blue-600 text-white shadow-md'
								: page === '...'
								? 'text-gray-400 cursor-default'
								: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
						}`}
						disabled={page === '...'}
						type='button'
					>
						{page === '...' ? <IconDots size={16} /> : page}
					</button>
				))}
			</div>

			{/* Кнопка "Вперед" */}
			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
					currentPage === totalPages
						? 'text-gray-400 cursor-not-allowed bg-gray-100'
						: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
				}`}
				type='button'
			>
				Вперед
				<IconChevronRight size={16} className='ml-1' />
			</button>
		</div>
	)
}
