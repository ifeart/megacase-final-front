import { STORAGE_KEYS } from '../constants'
import type {
	AvailabilityMap,
	BookingData,
	BookingsMap,
	DeskEntity,
	Marker,
	OfficeData,
	OfficeMeta,
	OfficeOnMap,
	ROLE,
	RoomEntity,
	TimeSlot,
} from '../types'
import { ROLES } from '../types'

const readJson = <T>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key)
		if (!raw) return fallback
		const parsed = JSON.parse(raw)
		return parsed as T
	} catch {
		return fallback
	}
}

const writeJson = (key: string, value: unknown) => {
	localStorage.setItem(key, JSON.stringify(value))
}

// === УПРАВЛЕНИЕ МЕТА-ДАННЫМИ ОФИСОВ ===
export const getAllOfficesMeta = (): OfficeMeta[] =>
	readJson(STORAGE_KEYS.OFFICES_META, [])

export const getOfficeMeta = (nameId: string): OfficeMeta | null => {
	const offices = getAllOfficesMeta()
	return offices.find(office => office.nameId === nameId) || null
}

export const saveOfficeMeta = (meta: OfficeMeta) => {
	const offices = getAllOfficesMeta()
	const existingIndex = offices.findIndex(o => o.nameId === meta.nameId)

	if (existingIndex >= 0) {
		offices[existingIndex] = meta
	} else {
		offices.push(meta)
	}

	writeJson(STORAGE_KEYS.OFFICES_META, offices)
}

export const removeOfficeMeta = (nameId: string) => {
	const offices = getAllOfficesMeta().filter(o => o.nameId !== nameId)
	writeJson(STORAGE_KEYS.OFFICES_META, offices)
}

// === ТЕКУЩИЙ ОФИС ===
export const getCurrentOfficeId = (): string =>
	localStorage.getItem(STORAGE_KEYS.CURRENT_OFFICE) || ''

export const setCurrentOfficeId = (nameId: string) =>
	localStorage.setItem(STORAGE_KEYS.CURRENT_OFFICE, nameId)

// === ДАННЫЕ КОНКРЕТНОГО ОФИСА ===
export const getOfficeData = (nameId: string): Partial<OfficeData> => {
	const meta = getOfficeMeta(nameId)
	if (!meta) return {}

	// Получаем данные из общих хранилищ
	const allMarkers = readJson<Record<string, Marker[]>>(
		STORAGE_KEYS.ALL_MARKERS,
		{}
	)
	const allRooms = readJson<Record<string, RoomEntity[]>>(
		STORAGE_KEYS.ALL_ROOMS,
		{}
	)
	const allDesks = readJson<Record<string, DeskEntity[]>>(
		STORAGE_KEYS.ALL_DESKS,
		{}
	)
	const allAvailabilityRooms = readJson<
		Record<string, Record<string, boolean>>
	>(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, {})
	const allAvailabilityDesks = readJson<
		Record<string, Record<string, boolean>>
	>(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, {})
	const allInclusionRooms = readJson<Record<string, Record<string, boolean>>>(
		STORAGE_KEYS.ALL_INCLUSION_ROOMS,
		{}
	)
	const allInclusionDesks = readJson<Record<string, Record<string, boolean>>>(
		STORAGE_KEYS.ALL_INCLUSION_DESKS,
		{}
	)
	const allInclusionMarkers = readJson<Record<string, Record<string, boolean>>>(
		STORAGE_KEYS.ALL_INCLUSION_MARKERS,
		{}
	)
	const allBookingsRooms = readJson<Record<string, BookingsMap>>(
		STORAGE_KEYS.ALL_BOOKINGS_ROOMS,
		{}
	)
	const allBookingsDesks = readJson<Record<string, BookingsMap>>(
		STORAGE_KEYS.ALL_BOOKINGS_DESKS,
		{}
	)

	return {
		meta,
		markers: allMarkers[nameId] || [],
		rooms: allRooms[nameId] || [],
		desks: allDesks[nameId] || [],
		availabilityRooms: allAvailabilityRooms[nameId] || {},
		availabilityDesks: allAvailabilityDesks[nameId] || {},
		inclusionRooms: allInclusionRooms[nameId] || {},
		inclusionDesks: allInclusionDesks[nameId] || {},
		inclusionMarkers: allInclusionMarkers[nameId] || {},
		bookingsRooms: allBookingsRooms[nameId] || {},
		bookingsDesks: allBookingsDesks[nameId] || {},
	}
}

const saveOfficeData = (nameId: string, data: Partial<OfficeData>) => {
	if (data.meta) {
		saveOfficeMeta(data.meta)
	}

	// Обновляем данные в общих хранилищах
	if (data.markers) {
		const allMarkers = readJson<Record<string, Marker[]>>(
			STORAGE_KEYS.ALL_MARKERS,
			{}
		)
		allMarkers[nameId] = data.markers
		writeJson(STORAGE_KEYS.ALL_MARKERS, allMarkers)
	}
	if (data.rooms) {
		const allRooms = readJson<Record<string, RoomEntity[]>>(
			STORAGE_KEYS.ALL_ROOMS,
			{}
		)
		allRooms[nameId] = data.rooms
		writeJson(STORAGE_KEYS.ALL_ROOMS, allRooms)
	}
	if (data.desks) {
		const allDesks = readJson<Record<string, DeskEntity[]>>(
			STORAGE_KEYS.ALL_DESKS,
			{}
		)
		allDesks[nameId] = data.desks
		writeJson(STORAGE_KEYS.ALL_DESKS, allDesks)
	}
	if (data.availabilityRooms) {
		const allAvailabilityRooms = readJson<
			Record<string, Record<string, boolean>>
		>(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, {})
		allAvailabilityRooms[nameId] = data.availabilityRooms
		writeJson(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, allAvailabilityRooms)
	}
	if (data.availabilityDesks) {
		const allAvailabilityDesks = readJson<
			Record<string, Record<string, boolean>>
		>(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, {})
		allAvailabilityDesks[nameId] = data.availabilityDesks
		writeJson(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, allAvailabilityDesks)
	}
	if (data.inclusionRooms) {
		const allInclusionRooms = readJson<Record<string, Record<string, boolean>>>(
			STORAGE_KEYS.ALL_INCLUSION_ROOMS,
			{}
		)
		allInclusionRooms[nameId] = data.inclusionRooms
		writeJson(STORAGE_KEYS.ALL_INCLUSION_ROOMS, allInclusionRooms)
	}
	if (data.inclusionDesks) {
		const allInclusionDesks = readJson<Record<string, Record<string, boolean>>>(
			STORAGE_KEYS.ALL_INCLUSION_DESKS,
			{}
		)
		allInclusionDesks[nameId] = data.inclusionDesks
		writeJson(STORAGE_KEYS.ALL_INCLUSION_DESKS, allInclusionDesks)
	}
	if (data.inclusionMarkers) {
		const allInclusionMarkers = readJson<
			Record<string, Record<string, boolean>>
		>(STORAGE_KEYS.ALL_INCLUSION_MARKERS, {})
		allInclusionMarkers[nameId] = data.inclusionMarkers
		writeJson(STORAGE_KEYS.ALL_INCLUSION_MARKERS, allInclusionMarkers)
	}
	if (data.bookingsRooms) {
		const allBookingsRooms = readJson<Record<string, BookingsMap>>(
			STORAGE_KEYS.ALL_BOOKINGS_ROOMS,
			{}
		)
		allBookingsRooms[nameId] = data.bookingsRooms
		writeJson(STORAGE_KEYS.ALL_BOOKINGS_ROOMS, allBookingsRooms)
	}
	if (data.bookingsDesks) {
		const allBookingsDesks = readJson<Record<string, BookingsMap>>(
			STORAGE_KEYS.ALL_BOOKINGS_DESKS,
			{}
		)
		allBookingsDesks[nameId] = data.bookingsDesks
		writeJson(STORAGE_KEYS.ALL_BOOKINGS_DESKS, allBookingsDesks)
	}
}

// === CONVENIENCE МЕТОДЫ ДЛЯ ТЕКУЩЕГО ОФИСА ===
const getCurrentOfficeData = (): Partial<OfficeData> => {
	const currentOfficeId = getCurrentOfficeId()
	if (!currentOfficeId) return {}
	return getOfficeData(currentOfficeId)
}

const updateCurrentOffice = (updates: Partial<OfficeData>) => {
	const currentOfficeId = getCurrentOfficeId()
	if (!currentOfficeId) return

	const currentData = getOfficeData(currentOfficeId)
	const updatedData = { ...currentData, ...updates }
	saveOfficeData(currentOfficeId, updatedData)
}

// === API ДЛЯ РАБОТЫ С ДАННЫМИ ТЕКУЩЕГО ОФИСА ===
export const getMarkers = (): Marker[] => {
	const office = getCurrentOfficeData()
	return office.markers || []
}

export const setMarkers = (markers: Marker[]) => {
	updateCurrentOffice({ markers })
}

export const getRooms = (): RoomEntity[] => {
	const office = getCurrentOfficeData()
	return office.rooms || []
}

export const setRooms = (rooms: RoomEntity[]) => {
	updateCurrentOffice({ rooms })
}

export const getDesks = (): DeskEntity[] => {
	const office = getCurrentOfficeData()
	return office.desks || []
}

export const setDesks = (desks: DeskEntity[]) => {
	updateCurrentOffice({ desks })
}

export const getRoomsAvailability = (): AvailabilityMap => {
	const office = getCurrentOfficeData()
	return office.availabilityRooms || {}
}

export const setRoomsAvailability = (availabilityRooms: AvailabilityMap) => {
	updateCurrentOffice({ availabilityRooms })
}

export const getDesksAvailability = (): AvailabilityMap => {
	const office = getCurrentOfficeData()
	return office.availabilityDesks || {}
}

export const setDesksAvailability = (availabilityDesks: AvailabilityMap) => {
	updateCurrentOffice({ availabilityDesks })
}

export const toggleAvailability = (type: 'room' | 'desk', id: string) => {
	if (type === 'room') {
		const m = getRoomsAvailability()
		m[id] = !m[id]
		setRoomsAvailability(m)
	} else {
		const m = getDesksAvailability()
		m[id] = !m[id]
		setDesksAvailability(m)
	}
}

export const getRoomsInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData()
	return office.inclusionRooms || {}
}

export const setRoomsInclusion = (inclusionRooms: Record<string, boolean>) => {
	updateCurrentOffice({ inclusionRooms })
}

export const getDesksInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData()
	return office.inclusionDesks || {}
}

export const setDesksInclusion = (inclusionDesks: Record<string, boolean>) => {
	updateCurrentOffice({ inclusionDesks })
}

export const getMarkersInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData()
	return office.inclusionMarkers || {}
}

export const setMarkersInclusion = (
	inclusionMarkers: Record<string, boolean>
) => {
	updateCurrentOffice({ inclusionMarkers })
}

// === ИНИЦИАЛИЗАЦИЯ НОВОГО ОФИСА ===
export const initializeNewOffice = (
	nameId: string,
	spaceId: string,
	displayName: string,
	city: string = 'Unknown',
	isPublished: boolean = true
): OfficeMeta => {
	const meta: OfficeMeta = {
		nameId,
		spaceId,
		displayName,
		name: displayName, // Техническое имя совпадает с отображаемым при создании
		city,
		isPublished,
	}

	const officeData: OfficeData = {
		meta,
		markers: [],
		rooms: [],
		desks: [],
		availabilityRooms: {},
		availabilityDesks: {},
		inclusionRooms: {},
		inclusionDesks: {},
		inclusionMarkers: {},
		bookingsRooms: {},
		bookingsDesks: {},
	}

	saveOfficeData(nameId, officeData)
	setCurrentOfficeId(nameId)

	return meta
}

// === ФИНАЛИЗАЦИЯ ОФИСА (после Review этапа) ===
export const finalizeOfficeData = (coordinates?: {
	lat: number
	lng: number
}) => {
	const currentOfficeId = getCurrentOfficeId()
	if (!currentOfficeId) return

	const officeData = getOfficeData(currentOfficeId)
	if (!officeData.meta) return

	// Обновляем координаты и публикуем офис если они предоставлены
	if (coordinates) {
		const updatedMeta: OfficeMeta = {
			...officeData.meta,
			coordinates,
			isPublished: true, // Автоматически публикуем офис при установке координат
		}
		saveOfficeMeta(updatedMeta)
	}

	// Обновляем список офисов на карте
	const allOffices = getAllOfficesMeta()
	const publishedOffices = allOffices
		.filter(office => office.isPublished && office.coordinates)
		.map(office => ({
			id: office.nameId,
			name: office.displayName,
			city: office.city,
			lat: office.coordinates!.lat,
			lng: office.coordinates!.lng,
		}))

	writeJson(STORAGE_KEYS.OFFICES_ON_MAP, publishedOffices)
}

// === КАРТА ОФИСОВ ===
export const getOfficesForMap = (): OfficeOnMap[] => {
	return readJson(STORAGE_KEYS.OFFICES_ON_MAP, [])
}

export const updateOfficeCoordinates = (
	nameId: string,
	coordinates: { lat: number; lng: number }
) => {
	const meta = getOfficeMeta(nameId)
	if (meta) {
		saveOfficeMeta({
			...meta,
			coordinates,
		})
	}
}

export const publishOffice = (
	nameId: string,
	shouldPublish: boolean = true
) => {
	const meta = getOfficeMeta(nameId)
	if (meta) {
		saveOfficeMeta({
			...meta,
			isPublished: shouldPublish,
		})

		// Обновляем список офисов на карте
		const allOffices = getAllOfficesMeta()
		const publishedOffices = allOffices
			.filter(office => office.isPublished && office.coordinates)
			.map(office => ({
				id: office.nameId,
				name: office.displayName,
				city: office.city,
				lat: office.coordinates!.lat,
				lng: office.coordinates!.lng,
			}))

		writeJson(STORAGE_KEYS.OFFICES_ON_MAP, publishedOffices)
	}
}

// === УПРАВЛЕНИЕ БРОНИРОВАНИЯМИ ===
export const getRoomsBookings = (): BookingsMap => {
	const office = getCurrentOfficeData()
	return office.bookingsRooms || {}
}

export const setRoomsBookings = (bookingsRooms: BookingsMap) => {
	updateCurrentOffice({ bookingsRooms })
}

export const getDesksBookings = (): BookingsMap => {
	const office = getCurrentOfficeData()
	return office.bookingsDesks || {}
}

export const setDesksBookings = (bookingsDesks: BookingsMap) => {
	updateCurrentOffice({ bookingsDesks })
}

// Функция для преобразования относительной даты в абсолютную
export const convertRelativeDateToISO = (day: 'today' | 'tomorrow' | 'dayAfter'): string => {
	const date = new Date()
	
	switch (day) {
		case 'tomorrow':
			date.setDate(date.getDate() + 1)
			break
		case 'dayAfter':
			date.setDate(date.getDate() + 2)
			break
		// для 'today' ничего делать не нужно
	}
	
	// Форматируем дату в ISO формат YYYY-MM-DD
	return date.toISOString().split('T')[0]
}

// Функция для определения относительного дня из даты
export const getRelativeDayFromDate = (dateStr: string): 'today' | 'tomorrow' | 'dayAfter' | null => {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)
	
	const dayAfter = new Date(today)
	dayAfter.setDate(dayAfter.getDate() + 2)
	
	const date = new Date(dateStr)
	date.setHours(0, 0, 0, 0)
	
	if (date.getTime() === today.getTime()) return 'today'
	if (date.getTime() === tomorrow.getTime()) return 'tomorrow'
	if (date.getTime() === dayAfter.getTime()) return 'dayAfter'
	
	return null
}

// Функция для форматирования даты в удобочитаемый вид
export const formatBookingDate = (dateStr: string): string => {
	const relativeDay = getRelativeDayFromDate(dateStr)
	
	if (relativeDay) {
		switch (relativeDay) {
			case 'today': return 'Сегодня'
			case 'tomorrow': return 'Завтра'
			case 'dayAfter': return 'Послезавтра'
		}
	}
	
	// Если не относительная дата, форматируем как обычную дату
	const date = new Date(dateStr)
	return date.toLocaleDateString('ru-RU', { 
		day: 'numeric', 
		month: 'long', 
		year: 'numeric' 
	})
}

// Функция для создания нового бронирования
export const createBooking = (
	type: 'room' | 'desk', 
	placeId: string, 
	userId: string,
	userName: string,
	timeSlot: TimeSlot,
	placeName?: string,
	placeLevel?: number,
	officeId?: string
): BookingData => {
	// Если есть day, но нет date, преобразуем day в date
	let updatedTimeSlot = { ...timeSlot };
	if (timeSlot.day && !timeSlot.date) {
		updatedTimeSlot.date = convertRelativeDateToISO(timeSlot.day);
	}
	
	// Получаем информацию об офисе
	const currentOfficeId = getCurrentOfficeId();
	const officeMeta = getOfficeMeta(officeId || currentOfficeId);
	
	const bookingData: BookingData = {
		id: Date.now().toString(),
		userId,
		userName,
		placeType: type,
		placeId,
		placeName,
		placeLevel,
		officeId: officeId || currentOfficeId,
		officeName: officeMeta?.displayName,
		city: officeMeta?.city,
		timeSlot: updatedTimeSlot,
		createdAt: Date.now(),
		status: 'active',
	}

	if (type === 'room') {
		const bookings = getRoomsBookings()
		if (!bookings[placeId]) {
			bookings[placeId] = []
		}
		bookings[placeId].push(bookingData)
		setRoomsBookings(bookings)

		// Устанавливаем статус занятости
		const availability = getRoomsAvailability()
		availability[placeId] = false
		setRoomsAvailability(availability)
	} else {
		const bookings = getDesksBookings()
		if (!bookings[placeId]) {
			bookings[placeId] = []
		}
		bookings[placeId].push(bookingData)
		setDesksBookings(bookings)

		// Устанавливаем статус занятости
		const availability = getDesksAvailability()
		availability[placeId] = false
		setDesksAvailability(availability)
	}

	return bookingData
}

// Функция для отмены бронирования
export const cancelBooking = (
	type: 'room' | 'desk', 
	placeId: string, 
	bookingId: string
): boolean => {
	if (type === 'room') {
		const bookings = getRoomsBookings()
		if (!bookings[placeId]) return false

		const index = bookings[placeId].findIndex(b => b.id === bookingId)
		if (index === -1) return false

		bookings[placeId].splice(index, 1)
		
		// Если больше нет бронирований, устанавливаем статус доступности
		if (bookings[placeId].length === 0) {
			const availability = getRoomsAvailability()
			availability[placeId] = true
			setRoomsAvailability(availability)
		}
		
		setRoomsBookings(bookings)
	} else {
		const bookings = getDesksBookings()
		if (!bookings[placeId]) return false

		const index = bookings[placeId].findIndex(b => b.id === bookingId)
		if (index === -1) return false

		bookings[placeId].splice(index, 1)
		
		// Если больше нет бронирований, устанавливаем статус доступности
		if (bookings[placeId].length === 0) {
			const availability = getDesksAvailability()
			availability[placeId] = true
			setDesksAvailability(availability)
		}
		
		setDesksBookings(bookings)
	}

	return true
}

// Функция для проверки, может ли пользователь отменить бронирование
export const canCancelBooking = (
	userId: string,
	userRole: ROLE,
	bookingUserId: string
): boolean => {
	// Админ или владелец бронирования может отменить
	return userId === bookingUserId || 
		userRole === ROLES.ADMIN || 
		userRole === ROLES.PROJECT_ADMIN || 
		userRole === ROLES.WORKSPACE_ADMIN
}

// Функция для получения всех бронирований пользователя
export const getUserBookings = (userId: string): BookingData[] => {
	const roomsBookings = getRoomsBookings()
	const desksBookings = getDesksBookings()
	
	const userRoomBookings = Object.values(roomsBookings)
		.flat()
		.filter(booking => booking.userId === userId)
	
	const userDeskBookings = Object.values(desksBookings)
		.flat()
		.filter(booking => booking.userId === userId)
	
	return [...userRoomBookings, ...userDeskBookings]
		.sort((a, b) => b.createdAt - a.createdAt)
}

// Добавим в storage.ts
export const getBookingById = (bookingId: string): BookingData | null => {
	const roomsBookings = getRoomsBookings();
	const desksBookings = getDesksBookings();
	
	const roomBooking = roomsBookings[bookingId];
	const deskBooking = desksBookings[bookingId];

	if (roomBooking) return roomBooking[0];
	if (deskBooking) return deskBooking[0];

	return null;
};

// === ПРОВЕРКА И ВОССТАНОВЛЕНИЕ ДАННЫХ ===
export const verifyAndRepairOfficeData = () => {
	const allOffices = getAllOfficesMeta()

	// Проверяем и обновляем данные на карте
	const officesOnMap = readJson<OfficeOnMap[]>(STORAGE_KEYS.OFFICES_ON_MAP, [])
	const validOfficesOnMap: OfficeOnMap[] = officesOnMap.filter(mapOffice => {
		const meta = allOffices.find(o => o.nameId === mapOffice.id)
		return meta?.isPublished && meta?.coordinates
	})

	// Добавляем опубликованные офисы, которых нет на карте
	allOffices.forEach(office => {
		if (office.isPublished && office.coordinates) {
			const existingOnMap = validOfficesOnMap.some(o => o.id === office.nameId)
			if (!existingOnMap) {
				validOfficesOnMap.push({
					id: office.nameId,
					name: office.displayName,
					city: office.city,
					lat: office.coordinates.lat,
					lng: office.coordinates.lng,
				})
			}
		}
	})

	// Сохраняем исправленные данные
	writeJson(STORAGE_KEYS.OFFICES_ON_MAP, validOfficesOnMap)
}
