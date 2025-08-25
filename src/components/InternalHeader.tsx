import { useAuth } from '@/context/AuthContext'
import { userStorage } from '@/services/storageUser'
import { ROLES } from '@/types'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function InternalHeader() {
	const loc = useLocation()
	const navigate = useNavigate()
	const { logout } = useAuth()
	const canGoBack = loc.pathname !== '/setup'
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

	const isAdmin =
		userStorage.getUser()?.role === ROLES.ADMIN ||
		userStorage.getUser()?.role === ROLES.PROJECT_ADMIN ||
		userStorage.getUser()?.role === ROLES.WORKSPACE_ADMIN

	const handleGoBack = () => {
		if (loc.key !== 'default') {
			navigate(-1)
		} else {
			navigate('/')
		}
	}

	return (
		<>
			{/* HEADER */}
			<header className='fixed top-0 inset-x-0 h-16 z-50 glass-panel'>
				<div className='h-full mx-auto max-w-7xl flex items-center justify-between px-4'>
					<div className='flex items-center gap-6'>
						{canGoBack && (
							<button
								onClick={handleGoBack}
								className='hidden sm:block text-[16px] cursor-pointer text-gray-700 hover:text-[#1daff7] transition-colors duration-300'
							>
								← Назад
							</button>
						)}
						<Link to='/' className='flex items-center gap-4'>
							{/* ЛОГО */}
							<svg
								width='82'
								height='32'
								viewBox='0 0 82 32'
								fill='none'
								className='bg-transparent transition-all duration-300 hover:scale-105'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M72.8093 6.35938H53.6667V10.5987H61.1186V25.5731H65.3573V10.5987H72.8093V6.35938Z'
									fill='black'
								/>
								<path
									d='M81.2094 6.29425H76.8333V10.6019V25.5763H81.2094V6.29425Z'
									fill='black'
								/>
								<path
									d='M19.2051 12.7863H31.9212V19.2821H19.2051V32H12.7786V19.2137H0.0625V12.7179H12.7786V0H19.2051V12.7863ZM38.3476 0V32H44.7741V0H38.3476Z'
									fill='#1DAFF7'
									className='transition-fill duration-300 hover:fill-[#0f8cd4]'
								/>
							</svg>
							<span className='text-gray-300 select-none'>|</span>
							<span className='text-[25px] font-medium text-black hover:text-[#1daff7] transition-colors duration-300'>
								OFFICE SPACE
							</span>
						</Link>
					</div>

					{/* ДЕСКТОП НАВИГАЦИЯ */}
					<nav className='hidden md:flex items-center gap-8'>
						<Link
							to='/booking'
							className='text-[16px] underline-hover text-gray-600 cursor-pointer'
						>
							Забронировать
						</Link>
						<span className='text-gray-300 select-none'>///</span>
						<Link
							to='/search/employees'
							className='text-[16px] underline-hover text-gray-600 cursor-pointer'
						>
							Поиск
						</Link>
						<span className='text-gray-300 select-none'>///</span>
						{isAdmin && (
							<>
								<Link
									to='/management'
									className='text-[16px] underline-hover text-gray-600 cursor-pointer'
								>
									Управление
								</Link>
								<span className='text-gray-300 select-none'>///</span>
							</>
						)}
						<Link
							to='/user/profile'
							className='text-[16px] underline-hover text-gray-600 cursor-pointer'
						>
							Профиль
						</Link>
						<span className='text-gray-300 select-none'>///</span>
						<button
							onClick={logout}
							className='text-[16px] underline-hover text-gray-600 cursor-pointer flex items-center gap-2'
						>
							<span className='text-[#1daff7] text-[24px]'>←</span>Выйти
						</button>
					</nav>

					{/* МОБИЛЬНЫЙ БУРГЕР */}
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className='md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg hover:bg-gray-100 transition'
						aria-label='Открыть меню'
					>
						<span className='w-6 h-0.5 bg-black'></span>
						<span className='w-6 h-0.5 bg-black'></span>
						<span className='w-6 h-0.5 bg-black'></span>
					</button>
				</div>
			</header>

			{/* МОБИЛЬНОЕ МЕНЮ */}
			<aside
				className={`md:hidden fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
				role='dialog'
				aria-modal='true'
			>
				<nav className="flex flex-col items-end justify-center h-full font-['PPRader'] space-y-6 sm:space-y-8 pr-8">
					<Link
						to='/booking'
						onClick={() => setIsMobileMenuOpen(false)}
						className='text-[24px] hover:text-[#1daff7]'
					>
						Забронировать
					</Link>
					<Link
						to='/search/employees'
						onClick={() => setIsMobileMenuOpen(false)}
						className='text-[24px] hover:text-[#1daff7]'
					>
						Поиск
					</Link>
					{isAdmin && (
						<Link
							to='/management'
							onClick={() => setIsMobileMenuOpen(false)}
							className='text-[24px] hover:text-[#1daff7]'
						>
							Управление
						</Link>
					)}
					<Link
						to='/user/profile'
						onClick={() => setIsMobileMenuOpen(false)}
						className='text-[24px] hover:text-[#1daff7]'
					>
						Профиль
					</Link>

					<hr className='border-t border-gray-200 w-48 my-4' />

					<button
						onClick={() => {
							logout()
							setIsMobileMenuOpen(false)
						}}
						className='text-[26px] hover:text-[#1daff7]'
					>
						← Выйти
					</button>
				</nav>

				{/* Кнопка закрытия */}
				<button
					onClick={() => setIsMobileMenuOpen(false)}
					className='absolute top-6 right-6 w-8 h-8 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110'
					aria-label='Закрыть меню'
				>
					<span className='w-6 h-0.5 bg-black rotate-45 translate-y-1.5'></span>
					<span className='w-6 h-0.5 bg-black -rotate-45 -translate-y-1.5'></span>
				</button>
			</aside>
		</>
	)
}
