import { STORAGE_KEYS } from "../constants";
import type {
	AvailabilityMap,
	DeskEntity,
	Marker,
	RoomEntity,
	OfficeData,
	OfficeOnMap,
} from "../types";

const readJson = <T>(key: string, fallback: T): T => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
};

const writeJson = (key: string, value: unknown) => {
	localStorage.setItem(key, JSON.stringify(value));
};

// === ТЕКУЩИЙ ОФИС ===
export const getCurrentSpaceId = () =>
	localStorage.getItem(STORAGE_KEYS.currentSpaceId) || "";
export const setCurrentSpaceId = (spaceId: string) =>
	localStorage.setItem(STORAGE_KEYS.currentSpaceId, spaceId);

// === МНОГООФИСНАЯ СИСТЕМА ===
export const getAllOffices = (): Record<string, OfficeData> =>
	readJson(STORAGE_KEYS.offices, {});

export const getOffice = (spaceId: string): OfficeData | null => {
	const offices = getAllOffices();
	return offices[spaceId] || null;
};

export const saveOffice = (officeData: OfficeData) => {
	const offices = getAllOffices();
	offices[officeData.spaceId] = officeData;
	writeJson(STORAGE_KEYS.offices, offices);
};

export const removeOffice = (spaceId: string) => {
	const offices = getAllOffices();
	delete offices[spaceId];
	writeJson(STORAGE_KEYS.offices, offices);
};

// === КАРТА ОФИСОВ ===
export const getOfficesOnMap = (): OfficeOnMap[] =>
	readJson(STORAGE_KEYS.officesOnMap, []);

export const saveOfficeOnMap = (office: OfficeOnMap) => {
	const offices = getOfficesOnMap();
	const existingIndex = offices.findIndex((o) => o.id === office.id);
	if (existingIndex >= 0) {
		offices[existingIndex] = office;
	} else {
		offices.push(office);
	}
	writeJson(STORAGE_KEYS.officesOnMap, offices);
};

export const removeOfficeFromMap = (spaceId: string) => {
	const offices = getOfficesOnMap().filter((o) => o.id !== spaceId);
	writeJson(STORAGE_KEYS.officesOnMap, offices);
};

// === CONVENIENCE МЕТОДЫ ДЛЯ ТЕКУЩЕГО ОФИСА ===
const getCurrentOfficeData = (): OfficeData | null => {
	const currentSpaceId = getCurrentSpaceId();
	if (!currentSpaceId) return null;
	const office = getOffice(currentSpaceId);
	return office;
};

const updateCurrentOffice = (updates: Partial<OfficeData>) => {
	const currentSpaceId = getCurrentSpaceId();
	if (!currentSpaceId) return;

	const currentData = getOffice(currentSpaceId);
	if (!currentData) return;

	const updatedData = { ...currentData, ...updates };
	saveOffice(updatedData);
};

// === API ДЛЯ ТЕКУЩЕГО ОФИСА ===
export const getMarkers = (): Marker[] => {
	const office = getCurrentOfficeData();
	return office?.markers || [];
};

export const setMarkers = (markers: Marker[]) => {
	updateCurrentOffice({ markers });
};

export const getRooms = (): RoomEntity[] => {
	const office = getCurrentOfficeData();
	return office?.rooms || [];
};

export const setRooms = (rooms: RoomEntity[]) => {
	updateCurrentOffice({ rooms });
};

export const getDesks = (): DeskEntity[] => {
	const office = getCurrentOfficeData();
	return office?.desks || [];
};

export const setDesks = (desks: DeskEntity[]) => {
	updateCurrentOffice({ desks });
};

export const getRoomsAvailability = (): AvailabilityMap => {
	const office = getCurrentOfficeData();
	return office?.availabilityRooms || {};
};

export const setRoomsAvailability = (availabilityRooms: AvailabilityMap) => {
	updateCurrentOffice({ availabilityRooms });
};

export const getDesksAvailability = (): AvailabilityMap => {
	const office = getCurrentOfficeData();
	return office?.availabilityDesks || {};
};

export const setDesksAvailability = (availabilityDesks: AvailabilityMap) => {
	updateCurrentOffice({ availabilityDesks });
};

export const toggleAvailability = (type: "room" | "desk", id: string) => {
	if (type === "room") {
		const m = getRoomsAvailability();
		m[id] = !m[id];
		setRoomsAvailability(m);
	} else {
		const m = getDesksAvailability();
		m[id] = !m[id];
		setDesksAvailability(m);
	}
};

export const getRoomsInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData();
	return office?.inclusionRooms || {};
};

export const setRoomsInclusion = (inclusionRooms: Record<string, boolean>) => {
	updateCurrentOffice({ inclusionRooms });
};

export const getDesksInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData();
	return office?.inclusionDesks || {};
};

export const setDesksInclusion = (inclusionDesks: Record<string, boolean>) => {
	updateCurrentOffice({ inclusionDesks });
};

export const getMarkersInclusion = (): Record<string, boolean> => {
	const office = getCurrentOfficeData();
	return office?.inclusionMarkers || {};
};

export const setMarkersInclusion = (
	inclusionMarkers: Record<string, boolean>
) => {
	updateCurrentOffice({ inclusionMarkers });
};

// === ИНИЦИАЛИЗАЦИЯ НОВОГО ОФИСА ===
export const initializeNewOffice = (
	spaceId: string,
	name: string,
	city: string = "Unknown"
): OfficeData => {
	const officeData: OfficeData = {
		spaceId,
		name,
		city,
		markers: [],
		rooms: [],
		desks: [],
		availabilityRooms: {},
		availabilityDesks: {},
		inclusionRooms: {},
		inclusionDesks: {},
		inclusionMarkers: {},
	};

	saveOffice(officeData);
	setCurrentSpaceId(spaceId);

	return officeData;
};

// === ФИНАЛИЗАЦИЯ ОФИСА (после Review этапа) ===
export const finalizeOfficeData = (coordinates?: {
	lat: number;
	lng: number;
}) => {
	const currentSpaceId = getCurrentSpaceId();
	if (!currentSpaceId) return;

	const officeData = getOffice(currentSpaceId);
	if (!officeData) return;

	// Обновляем координаты если они предоставлены
	if (coordinates) {
		updateCurrentOffice({ coordinates });
	}

	// Сохраняем офис на карту если есть координаты
	const finalData = getOffice(currentSpaceId);
	if (finalData?.coordinates) {
		const officeOnMap: OfficeOnMap = {
			id: finalData.spaceId,
			name: finalData.name,
			city: finalData.city,
			lat: finalData.coordinates.lat,
			lng: finalData.coordinates.lng,
		};
		saveOfficeOnMap(officeOnMap);
	}
};
