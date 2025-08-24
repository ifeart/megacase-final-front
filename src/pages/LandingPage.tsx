import Auth from '@/components/Auth'
import Silk from '@/components/Silk'
import { useAuth } from '@/context/AuthContext'
import { userStorage } from '@/services/storageUser'
import { ROLES } from '@/types'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function LandingPage() {
	const [isOverlayVisible, setIsOverlayVisible] = useState(false)
	const navigate = useNavigate()
	const { user, logout } = useAuth()
	const location = useLocation()

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const isAdmin =
		userStorage.getUser()?.role === ROLES.ADMIN ||
		userStorage.getUser()?.role === ROLES.PROJECT_ADMIN ||
		userStorage.getUser()?.role === ROLES.WORKSPACE_ADMIN

	useEffect(() => {
		if (location.state?.from && !user) {
			setIsOverlayVisible(true)
		}
	}, [location, user])

	const handleLoginClick = () => {
		setIsOverlayVisible(true)
	}

	const handleLogoutClick = () => {
		logout()
	}

	const handleCloseOverlay = () => {
		setIsOverlayVisible(false)
	}

	const handleAuthComplete = () => {
		setIsOverlayVisible(false)
		navigate('/booking')
	}

	const closeMobileMenu = () => setIsMobileMenuOpen(false)

	return (
		<div className='fixed inset-0 bg-white overflow-hidden'>
			<header className='fixed top-6 left-4 right-4 z-20 flex items-center justify-between'>
				{/* ЛОГО */}
				<Link to='/' className='flex items-center gap-3'>
					<svg
						width='62'
						height='24'
						viewBox='0 0 82 32'
						fill='none'
						className='bg-transparent transition-all duration-300 hover:scale-105'
						preserveAspectRatio='xMidYMid meet'
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
							className='transition-colors duration-300 hover:fill-[#0f8cd4]'
						/>
					</svg>

					{/* ВОТ ЭТОТ РАЗДЕЛИТЕЛЬ */}
					<span className='text-gray-300 select-none'>|</span>

					<span className='text-[20px] font-medium text-black hover:text-[#1daff7] transition-colors duration-300'>
						OFFICE SPACE
					</span>
				</Link>

				{/* Десктопное меню (>=768px) */}
				<nav className="hidden md:flex items-center gap-6 font-['PPRader'] text-[20px]">
					<Link
						to='/booking'
						className="relative text-black cursor-pointer 
                     after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:w-0 after:h-[2px] after:bg-[#1daff7] 
                     after:transition-all after:duration-300 
                     hover:after:w-full hover:after:left-0 hover:text-[#1daff7]"
					>
						Забронировать
					</Link>

					<span className='text-gray-400 select-none text-[16px]'>///</span>

					<Link
						to='/search/employees'
						className="relative text-black cursor-pointer 
                     after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:w-0 after:h-[2px] after:bg-[#1daff7] 
                     after:transition-all after:duration-300 
                     hover:after:w-full hover:after:left-0 hover:text-[#1daff7]"
					>
						Поиск
					</Link>

					{isAdmin && (
						<>
							<span className='text-gray-400 select-none text-[16px]'>///</span>
							<Link
								to='/setup'
								className="relative text-black cursor-pointer 
                         after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                         after:w-0 after:h-[2px] after:bg-[#1daff7] 
                         after:transition-all after:duration-300 
                         hover:after:w-full hover:after:left-0 hover:text-[#1daff7]"
							>
								Управление
							</Link>
						</>
					)}

					<span className='text-gray-400 select-none text-[16px]'>///</span>

					<Link
						to='/user/profile'
						className="relative text-black cursor-pointer 
                     after:content-[''] after:absolute after:bottom-0 after:left-1/2 
                     after:w-0 after:h-[2px] after:bg-[#1daff7] 
                     after:transition-all after:duration-300 
                     hover:after:w-full hover:after:left-0 hover:text-[#1daff7]"
					>
						Профиль
					</Link>
				</nav>

				{/* Кнопка Войти/Выйти (>=768px) */}
				<div className='hidden md:block'>
					{!user ? (
						<button
							onClick={handleLoginClick}
							className="text-black px-4 py-2 font-['PPRader'] text-[20px] hover:text-[#1daff7] transition"
						>
							Войти →
						</button>
					) : (
						<button
							onClick={handleLogoutClick}
							className="text-black px-4 py-2 font-['PPRader'] text-[20px] hover:text-[#1daff7] transition"
						>
							← Выйти
						</button>
					)}
				</div>

				{/* Бургер для <768px */}
				<button
					onClick={() => setIsMobileMenuOpen(true)}
					className='md:hidden flex flex-col justify-between w-8 h-6'
				>
					<span className='w-full h-[3px] bg-black'></span>
					<span className='w-full h-[3px] bg-black'></span>
					<span className='w-full h-[3px] bg-black'></span>
				</button>
			</header>

			{/* АСАЙД - мобильное меню */}
			<aside
				className={`md:hidden fixed inset-0 bg-white z-50 transition-transform duration-300 ease-in-out 
   		  ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
				role='dialog'
				aria-modal='true'
			>
				<nav className="flex flex-col items-end justify-center h-full font-['PPRader'] space-y-6 sm:space-y-8 pr-8">
					{/* Мобильные ссылки */}
					<div className='flex flex-col items-end space-y-6 sm:space-y-8'>
						<Link
							to='/booking'
							onClick={() => setIsMobileMenuOpen(false)}
							className='text-[24px] sm:text-[26px] hover:text-[#1daff7] text-right'
						>
							Забронировать
						</Link>
						<Link
							to='/search/employees'
							onClick={() => setIsMobileMenuOpen(false)}
							className='text-[24px] sm:text-[26px] hover:text-[#1daff7] text-right'
						>
							Поиск
						</Link>
						{isAdmin && (
							<Link
								to='/setup'
								onClick={() => setIsMobileMenuOpen(false)}
								className='text-[24px] sm:text-[26px] hover:text-[#1daff7] text-right'
							>
								Управление
							</Link>
						)}
						<Link
							to='/user/profile'
							onClick={() => setIsMobileMenuOpen(false)}
							className='text-[24px] sm:text-[26px] hover:text-[#1daff7] text-right'
						>
							Профиль
						</Link>

						<hr className='border-t border-gray-200 w-48 sm:w-64 my-4' />

						{!user ? (
							<button
								onClick={() => {
									handleLoginClick()
									setIsMobileMenuOpen(false)
								}}
								className='text-right hover:text-[#1daff7] text-[26px] sm:text-[28px] py-2 px-4'
							>
								Войти →
							</button>
						) : (
							<button
								onClick={() => {
									handleLogoutClick()
									setIsMobileMenuOpen(false)
								}}
								className='text-right hover:text-[#1daff7] text-[26px] sm:text-[28px] py-2 px-4'
							>
								← Выйти
							</button>
						)}
					</div>

					{/* Кнопка закрытия */}
					<button
						onClick={() => setIsMobileMenuOpen(false)}
						className='absolute top-6 sm:top-8 right-6 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 flex flex-col justify-center items-center transition-all duration-300 hover:scale-110'
						aria-label='Закрыть меню'
					>
						<span className='w-6 sm:w-7 h-0.5 bg-black rotate-45 translate-y-1.5 transition-all duration-300'></span>
						<span className='w-6 sm:w-7 h-0.5 bg-black -rotate-45 -translate-y-1.5 transition-all duration-300'></span>
					</button>
				</nav>
			</aside>

			<div className='min-h-screen pt-33 bg-white overflow-hidden'>
				<main className='max-w-[1920px] h-full mx-auto px-13'>
					<div className='flex justify-center'>
						<div className='relative w-full max-w-[100%] h-[100vh] rounded-[30px] overflow-hidden z-[5]'>
							<Silk
								speed={5}
								scale={1}
								color='#1daff7'
								noiseIntensity={2.5}
								rotation={0}
							/>
						</div>
					</div>
				</main>
			</div>

			<Auth
				isVisible={isOverlayVisible}
				onClose={handleCloseOverlay}
				onAuthComplete={handleAuthComplete}
			/>
		</div>
	)
}
