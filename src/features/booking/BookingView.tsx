import { useAuth } from '@/context/AuthContext'
import { userStorage } from '@/services/storageUser'
import type { OfficeOnMap } from '@/types'
import { ROLES } from '@/types'
import React, {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { SpaceViewer } from '../../components/SpaceViewer'
import { CLIENT_TOKEN } from '../../constants'
import { loadSmplr } from '../../services/smplr'
import {
	getDesks,
	getDesksAvailability,
	getDesksInclusion,
	getMarkers,
	getMarkersInclusion,
	getOfficeMeta,
	getOfficesForMap,
	getRooms,
	getRoomsAvailability,
	getRoomsInclusion,
	setCurrentOfficeId,
	toggleAvailability,
	verifyAndRepairOfficeData,
} from '../../services/storage'
import { BookingForm } from '../bookingForm/BookingForm'

type Props = { officeNameId?: string }

type HoverTip = {
	kind: 'room' | 'desk'
	id: string
	name: string
	available: boolean
	x: number
	y: number
} | null

interface IBookingModalData {
	placeBooking: 'table' | 'room' | null
	isOpen: boolean
	userId?: string
	placeBookingId: string | null
}

export const BookingView: React.FC<Props> = ({ officeNameId }) => {
	const navigate = useNavigate()
	const containerId = useId().replace(/:/g, '-')
	const spaceRef = useRef<any>(null)
	const mapRef = useRef<any>(null)
	const roomsCtrlRef = useRef<any>(null)
	const desksCtrlRef = useRef<any>(null)
	const markersCtrlRef = useRef<any>(null)

	const [ready, setReady] = useState(false)
	const [hover, setHover] = useState<HoverTip>(null)
	const { user } = useAuth()
	console.log(user)

	const [bookingModalData, setBookingModalData] = useState<IBookingModalData>({
		placeBooking: null,
		isOpen: false,
		placeBookingId: null,
	})

	const [viewMode, setViewMode] = useState<'map' | 'space'>(
		officeNameId ? 'space' : 'map'
	)

	function handleCloseModal() {
		setBookingModalData({
			placeBooking: null,
			isOpen: false,
			placeBookingId: null,
		})
	}

	// Проверяем и восстанавливаем данные при загрузке
	useEffect(() => {
		verifyAndRepairOfficeData()
	}, [])

	// Устанавливаем текущий офис при прямом переходе по URL
	useEffect(() => {
		setViewMode(officeNameId ? 'space' : 'map')
	}, [officeNameId])
	//   if (officeNameId) {
	//     const officeMeta = getOfficeMeta(officeNameId);
	//     if (officeMeta) {
	//       setCurrentOfficeId(officeNameId);
	//     } else {
	//       // Если офис не найден, перенаправляем на общую карту
	//       navigate("/booking");
	//     }
	//   }
	// }, [officeNameId, navigate]);
	// console.log("viewMode", viewMode);

	const [selectedCity, setSelectedCity] = useState<string | null>(null)
	const [cityOffices, setCityOffices] = useState<OfficeOnMap[] | null>(null)

	const officesOnMap = getOfficesForMap()

	// console.log("officesOnMap", officesOnMap);
	// console.log("getOfficeMeta()", getOfficeMeta("moskow"));

	const pointsLayerData = useMemo(
		() =>
			officesOnMap.map(o => ({
				id: o.id,
				position: { lng: o.lng, lat: o.lat },
				name: o.name,
				city: o.city,
			})),
		[officesOnMap]
	)

	const handleOfficeSelect = useCallback(
		(nameId: string) => {
			const office = officesOnMap.find(o => o.id === nameId)
			if (!office) return

			const officesInCity = officesOnMap.filter(o => o.city === office.city)

			if (officesInCity.length > 1) {
				setSelectedCity(office.city)
				setCityOffices(officesInCity)
			} else {
				setCurrentOfficeId(nameId)
				navigate(`/booking/${nameId}`)
			}
		},
		[officesOnMap, navigate]
	)

	const handleCityOfficeSelect = useCallback(
		(nameId: string) => {
			setCurrentOfficeId(nameId)
			setSelectedCity(null)
			setCityOffices(null)
			navigate(`/booking/${nameId}`)
		},
		[navigate]
	)

	// Данные для текущего офиса (если выбран)
	const roomsData = useCallback(() => {
		const r = getRooms()
		const a = getRoomsAvailability()
		const inc = getRoomsInclusion()
		return r
			.filter(x => inc[x.id] !== false)
			.map(x => ({ ...x, available: !!a[x.id] }))
	}, [])

	const desksData = useCallback(() => {
		const d = getDesks()
		const a = getDesksAvailability()
		const inc = getDesksInclusion()
		return d
			.filter(x => inc[x.id] !== false)
			.map(x => ({ ...x, available: !!a[x.id] }))
	}, [])

	const markersData = useCallback(() => {
		const m = getMarkers()
		const inc = getMarkersInclusion()
		return m.filter(x => inc[x.id] !== false)
	}, [])

	const renderLayers = useCallback(() => {
		const space = spaceRef.current
		if (!space) return

		// Rooms: custom tooltip, click toggles
		roomsCtrlRef.current = space.addPolygonDataLayer({
			id: 'rooms',
			data: roomsData(),
			height: 2.9,
			alpha: 0.7,
			color: (d: any) => (d.available ? '#48B695' : '#E74157'),
			onHover: (d: any, e: any) => {
				setHover({
					kind: 'room',
					id: d.id,
					name: d.name,
					available: !!d.available,
					x: e.pointerX,
					y: e.pointerY,
				})
			},
			onHoverOut: () => setHover(null),
			onClick: (d: any) => {
				if (!d.available) {
					toggleAvailability('room', d.id)
					roomsCtrlRef.current?.update({ data: roomsData() })
					return
				}

				setBookingModalData({
					placeBooking: 'room',
					isOpen: true,
					placeBookingId: d.id,
					userId: userStorage.getUser()?.id,
				})
				// toggleAvailability('room', d.id)
				roomsCtrlRef.current?.update({ data: roomsData() })
			},
		})

		// Desks: custom tooltip, click toggles
		desksCtrlRef.current = space.addFurnitureDataLayer({
			id: 'desks',
			data: desksData().map(x => ({
				...x,
				furnitureId: x.furnitureId,
			})),
			color: (d: any) => (d.available ? '#50b268' : '#f75e56'),
			onHover: (d: any, e: any) => {
				setHover({
					kind: 'desk',
					id: d.id,
					name: d.name,
					available: !!d.available,
					x: e.pointerX,
					y: e.pointerY,
				})
			},
			onHoverOut: () => setHover(null),
			onClick: (d: any) => {
				if (!d.available) {
					toggleAvailability('desk', d.id)
					desksCtrlRef.current?.update({
						data: desksData().map(x => ({
							...x,
							furnitureId: x.furnitureId,
						})),
					})
					return
				}

				setBookingModalData({
					placeBooking: 'table',
					isOpen: true,
					placeBookingId: d.id,
					userId: userStorage.getUser()?.id,
				})
				desksCtrlRef.current?.update({
					data: desksData().map(x => ({
						...x,
						furnitureId: x.furnitureId,
					})),
				})
			},
		})

		// Markers: используем цвета из данных маркеров
		const markers = markersData()
		markersCtrlRef.current = space.addPointDataLayer({
			id: 'markers',
			shape: 'sphere',
			data: markers,
			diameter: 0.6,
			anchor: 'bottom',
			color: (d: any) => d.color || '#1daff7', // Используем цвет из маркера
			tooltip: (d: any) => d.name,
		})
	}, [roomsData, desksData, markersData, bookingModalData.isOpen])

	const onSpaceReady = useCallback((space: any) => {
		spaceRef.current = space
		setReady(true)
	}, [])

	const onBookToggle = useCallback(() => {
		if (!hover) return
		if (hover.kind === 'room') {
			toggleAvailability('room', hover.id)
			roomsCtrlRef.current?.update({ data: roomsData() })
		} else {
			toggleAvailability('desk', hover.id)
			desksCtrlRef.current?.update({
				data: desksData().map(x => ({
					...x,
					furnitureId: x.furnitureId,
				})),
			})
		}
	}, [hover, roomsData, desksData])

	// Инициализация слоев для пространства
	useEffect(() => {
		if (!ready || viewMode !== 'space') return
		renderLayers()
		return () => {
			try {
				spaceRef.current?.removeDataLayer?.('rooms')
				spaceRef.current?.removeDataLayer?.('desks')
				spaceRef.current?.removeDataLayer?.('markers')
			} catch (e) {
				console.error(e)
			}
		}
	}, [ready, viewMode, renderLayers])

	// Инициализация карты офисов - оптимизировано
	useEffect(() => {
		if (viewMode !== 'map') return

		let disposed = false
		let map: any

		loadSmplr()
			.then(smplr => {
				if (disposed) return

				map = new smplr.Map({
					clientToken: CLIENT_TOKEN,
					containerId,
				})

				mapRef.current = map

				return map.startViewer({
					osmBuildings: false,
					hideControls: false,
					controlsPosition: 'center-left',
				
					onReady: () => {
						map.setCameraPlacement({
							center: { lng: -90, lat: -90 },
							zoom: 0.5,
							pitch: 0,
							bearing: 90,
							animate: false,
						})

						setTimeout(() => {
							map.setCameraPlacement({
								center: { lng: 50, lat: 61 },
								zoom: 3.7,
								pitch: 0,
								bearing: 0,
								animate: true,
								speed: 0.5,
							})
						}, 100)

						map.addGeoPointDataLayer({
							id: 'offices',
							data: pointsLayerData as any,
							color: '#00aae6',
							alpha: 1,
							label: (d: any) => d.name,
							onClick: (d: any) => {
								if (d?.id) handleOfficeSelect(d.id)
							},
						})
					},
				})
			})
			.catch(e => {
				console.error('Smplr map error:', e)
			})

		return () => {
			disposed = true
			try {
				mapRef.current?.remove?.()
			} catch {}
			mapRef.current = null
		}
	}, [viewMode, containerId, pointsLayerData, handleOfficeSelect])

	const handleBackToMap = useCallback(() => {
		navigate('/booking')
	}, [navigate])

	const handleCreateNewOffice = useCallback(() => {
		navigate('/setup')
	}, [navigate])

	if (viewMode === 'map') {
		return (
			<div className='relative h-full w-full bg-white'>
				<div id={containerId} className='absolute inset-0' />

				{/* Панель выбора офиса */}
				{selectedCity && cityOffices && (
					<div className='absolute top-8 left-8 z-40 glass-panel rounded-[20px] p-6 max-w-sm hover-lift'>
						<h3 className='text-[24px] text-black mb-4 tracking-tight'>
							Выберите офис в городе {selectedCity}
						</h3>
						<div className='space-y-3'>
							{cityOffices.map(office => (
								<button
									key={office.id}
									className='w-full p-4 text-left hover:bg-gray-50 rounded-[10px] border border-gray-100 hover:border-[#1daff7] transition-all duration-300'
									onClick={() => handleCityOfficeSelect(office.id)}
								>
									<div className='text-[16px] font-medium text-black'>
										{office.name}
									</div>
									<div className='text-[12px] text-gray-500'>{office.city}</div>
								</button>
							))}
						</div>
						<button
							className='mt-4 text-[14px] text-gray-500 hover:text-black transition-colors duration-300'
							onClick={() => {
								setSelectedCity(null)
								setCityOffices(null)
							}}
						>
							Отменить
						</button>
					</div>
				)}

				{/* Кнопка создания нового офиса */}
				{user && user.role !== ROLES.USER ? (
					<div className='absolute bottom-8 right-8 z-40'>
						<button
							className='px-6 py-4 text-[16px] primary-button hover-lift'
							onClick={handleCreateNewOffice}
						>
							Создать новый офис
						</button>
					</div>
				) : null}

				{/* Приветственные сообщения */}
				{!selectedCity && officesOnMap.length === 0 && (
					<div className='absolute top-8 left-8 z-40 glass-panel rounded-[20px] p-6 max-w-sm'>
						<h3 className='text-[24px] text-black mb-3 tracking-tight'>
							Добро пожаловать!
						</h3>
						<p className='text-[16px] text-gray-600'>
							У вас пока нет офисов на карте.{' '}
							{user && user.role === ROLES.USER
								? ''
								: 'Нажмите "Создать новый офис" чтобы начать.'}
						</p>
					</div>
				)}

				{!selectedCity && officesOnMap.length > 0 && (
					<div className='absolute top-8 left-8 z-40 glass-panel rounded-[20px] p-6 max-w-sm'>
						<h3 className='text-[24px] text-black mb-3 tracking-tight'>
							Доступные офисы
						</h3>
						<p className='text-[16px] text-gray-600'>
							Выберите офис на карте для управления бронированием или создайте
							новый.
							{/* Выберите офисы на карте для управления бронированием */}
						</p>
					</div>
				)}
			</div>
		)
	}

	// Режим просмотра пространства
	return (
		<div className='relative h-full w-full bg-white'>
			<SpaceViewer
				spaceId={getOfficeMeta(officeNameId || '')?.spaceId || ''}
				clientToken={CLIENT_TOKEN}
				onReady={onSpaceReady}
				viewerOptions={{ controlsPosition: 'center-left' }}
			/>

			{bookingModalData.isOpen ? (
				<BookingForm
					isOpen={true}
					placeBooking={
						bookingModalData.placeBooking ? bookingModalData.placeBooking : null
					}
					placeBookingId={bookingModalData.placeBookingId}
					userId={bookingModalData.userId ? bookingModalData.userId : null}
					onClose={handleCloseModal}
				/>
			) : null}

			{hover && (
				<div
					className='absolute z-40'
					style={{
						top: hover.y + 8,
						left: hover.x + 8,
					}}
				>
					<div className='glass-panel rounded-[10px] px-4 py-3 text-[14px] hover-lift'>
						<div className='font-medium text-black mb-1'>{hover.name}</div>
						<div className='text-[12px] text-gray-500 mb-3'>
							{hover.available ? 'свободно' : 'занято'}
						</div>
						<button
							className='px-4 py-2 text-[14px] primary-button'
							onClick={onBookToggle}
						>
							{hover.available ? 'Забронировать' : 'Освободить'}
						</button>
					</div>
				</div>
			)}

			{/* Кнопка возврата к карте */}
			<div className='absolute top-8 left-8 z-40'>
				<button
					className='px-4 py-3 text-[16px] glass-panel rounded-[10px] hover-lift text-black'
					onClick={handleBackToMap}
				>
					← Вернуться к карте
				</button>
			</div>
		</div>
	)
}
