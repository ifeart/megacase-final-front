import { STORAGE_KEYS } from "../constants";
import type {
  AvailabilityMap,
  DeskEntity,
  Marker,
  RoomEntity,
  OfficeData,
  OfficeMeta,
  OfficeOnMap,
} from "../types";

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// === УПРАВЛЕНИЕ МЕТА-ДАННЫМИ ОФИСОВ ===
export const getAllOfficesMeta = (): OfficeMeta[] =>
  readJson(STORAGE_KEYS.OFFICES_META, []);

export const getOfficeMeta = (nameId: string): OfficeMeta | null => {
  const offices = getAllOfficesMeta();
  return offices.find(office => office.nameId === nameId) || null;
};

export const saveOfficeMeta = (meta: OfficeMeta) => {
  const offices = getAllOfficesMeta();
  const existingIndex = offices.findIndex(o => o.nameId === meta.nameId);
  
  if (existingIndex >= 0) {
    offices[existingIndex] = meta;
  } else {
    offices.push(meta);
  }
  
  writeJson(STORAGE_KEYS.OFFICES_META, offices);
};

export const removeOfficeMeta = (nameId: string) => {
  const offices = getAllOfficesMeta().filter(o => o.nameId !== nameId);
  writeJson(STORAGE_KEYS.OFFICES_META, offices);
};

// === ТЕКУЩИЙ ОФИС ===
export const getCurrentOfficeId = (): string =>
  localStorage.getItem(STORAGE_KEYS.CURRENT_OFFICE) || "";

export const setCurrentOfficeId = (nameId: string) =>
  localStorage.setItem(STORAGE_KEYS.CURRENT_OFFICE, nameId);

// === ДАННЫЕ КОНКРЕТНОГО ОФИСА ===
export const getOfficeData = (nameId: string): Partial<OfficeData> => {
  const meta = getOfficeMeta(nameId);
  if (!meta) return {};

  // Получаем данные из общих хранилищ
  const allMarkers = readJson<Record<string, Marker[]>>(STORAGE_KEYS.ALL_MARKERS, {});
  const allRooms = readJson<Record<string, RoomEntity[]>>(STORAGE_KEYS.ALL_ROOMS, {});
  const allDesks = readJson<Record<string, DeskEntity[]>>(STORAGE_KEYS.ALL_DESKS, {});
  const allAvailabilityRooms = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, {});
  const allAvailabilityDesks = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, {});
  const allInclusionRooms = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_ROOMS, {});
  const allInclusionDesks = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_DESKS, {});
  const allInclusionMarkers = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_MARKERS, {});

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
  };
};

const saveOfficeData = (nameId: string, data: Partial<OfficeData>) => {
  if (data.meta) {
    saveOfficeMeta(data.meta);
  }
  
  // Обновляем данные в общих хранилищах
  if (data.markers) {
    const allMarkers = readJson<Record<string, Marker[]>>(STORAGE_KEYS.ALL_MARKERS, {});
    allMarkers[nameId] = data.markers;
    writeJson(STORAGE_KEYS.ALL_MARKERS, allMarkers);
  }
  if (data.rooms) {
    const allRooms = readJson<Record<string, RoomEntity[]>>(STORAGE_KEYS.ALL_ROOMS, {});
    allRooms[nameId] = data.rooms;
    writeJson(STORAGE_KEYS.ALL_ROOMS, allRooms);
  }
  if (data.desks) {
    const allDesks = readJson<Record<string, DeskEntity[]>>(STORAGE_KEYS.ALL_DESKS, {});
    allDesks[nameId] = data.desks;
    writeJson(STORAGE_KEYS.ALL_DESKS, allDesks);
  }
  if (data.availabilityRooms) {
    const allAvailabilityRooms = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, {});
    allAvailabilityRooms[nameId] = data.availabilityRooms;
    writeJson(STORAGE_KEYS.ALL_AVAILABILITY_ROOMS, allAvailabilityRooms);
  }
  if (data.availabilityDesks) {
    const allAvailabilityDesks = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, {});
    allAvailabilityDesks[nameId] = data.availabilityDesks;
    writeJson(STORAGE_KEYS.ALL_AVAILABILITY_DESKS, allAvailabilityDesks);
  }
  if (data.inclusionRooms) {
    const allInclusionRooms = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_ROOMS, {});
    allInclusionRooms[nameId] = data.inclusionRooms;
    writeJson(STORAGE_KEYS.ALL_INCLUSION_ROOMS, allInclusionRooms);
  }
  if (data.inclusionDesks) {
    const allInclusionDesks = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_DESKS, {});
    allInclusionDesks[nameId] = data.inclusionDesks;
    writeJson(STORAGE_KEYS.ALL_INCLUSION_DESKS, allInclusionDesks);
  }
  if (data.inclusionMarkers) {
    const allInclusionMarkers = readJson<Record<string, Record<string, boolean>>>(STORAGE_KEYS.ALL_INCLUSION_MARKERS, {});
    allInclusionMarkers[nameId] = data.inclusionMarkers;
    writeJson(STORAGE_KEYS.ALL_INCLUSION_MARKERS, allInclusionMarkers);
  }
};

// === CONVENIENCE МЕТОДЫ ДЛЯ ТЕКУЩЕГО ОФИСА ===
const getCurrentOfficeData = (): Partial<OfficeData> => {
  const currentOfficeId = getCurrentOfficeId();
  if (!currentOfficeId) return {};
  return getOfficeData(currentOfficeId);
};

const updateCurrentOffice = (updates: Partial<OfficeData>) => {
  const currentOfficeId = getCurrentOfficeId();
  if (!currentOfficeId) return;
  
  const currentData = getOfficeData(currentOfficeId);
  const updatedData = { ...currentData, ...updates };
  saveOfficeData(currentOfficeId, updatedData);
};

// === API ДЛЯ РАБОТЫ С ДАННЫМИ ТЕКУЩЕГО ОФИСА ===
export const getMarkers = (): Marker[] => {
  const office = getCurrentOfficeData();
  return office.markers || [];
};

export const setMarkers = (markers: Marker[]) => {
  updateCurrentOffice({ markers });
};

export const getRooms = (): RoomEntity[] => {
  const office = getCurrentOfficeData();
  return office.rooms || [];
};

export const setRooms = (rooms: RoomEntity[]) => {
  updateCurrentOffice({ rooms });
};

export const getDesks = (): DeskEntity[] => {
  const office = getCurrentOfficeData();
  return office.desks || [];
};

export const setDesks = (desks: DeskEntity[]) => {
  updateCurrentOffice({ desks });
};

export const getRoomsAvailability = (): AvailabilityMap => {
  const office = getCurrentOfficeData();
  return office.availabilityRooms || {};
};

export const setRoomsAvailability = (availabilityRooms: AvailabilityMap) => {
  updateCurrentOffice({ availabilityRooms });
};

export const getDesksAvailability = (): AvailabilityMap => {
  const office = getCurrentOfficeData();
  return office.availabilityDesks || {};
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
  return office.inclusionRooms || {};
};

export const setRoomsInclusion = (inclusionRooms: Record<string, boolean>) => {
  updateCurrentOffice({ inclusionRooms });
};

export const getDesksInclusion = (): Record<string, boolean> => {
  const office = getCurrentOfficeData();
  return office.inclusionDesks || {};
};

export const setDesksInclusion = (inclusionDesks: Record<string, boolean>) => {
  updateCurrentOffice({ inclusionDesks });
};

export const getMarkersInclusion = (): Record<string, boolean> => {
  const office = getCurrentOfficeData();
  return office.inclusionMarkers || {};
};

export const setMarkersInclusion = (inclusionMarkers: Record<string, boolean>) => {
  updateCurrentOffice({ inclusionMarkers });
};

// === ИНИЦИАЛИЗАЦИЯ НОВОГО ОФИСА ===
export const initializeNewOffice = (
  nameId: string,
  spaceId: string,
  displayName: string,
  city: string = "Unknown",
  isPublished: boolean = true
): OfficeMeta => {
  const meta: OfficeMeta = {
    nameId,
    spaceId,
    displayName,
    name: displayName, // Техническое имя совпадает с отображаемым при создании
    city,
    isPublished
  };

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
  };

  saveOfficeData(nameId, officeData);
  setCurrentOfficeId(nameId);

  return meta;
};

// === ФИНАЛИЗАЦИЯ ОФИСА (после Review этапа) ===
export const finalizeOfficeData = (coordinates?: {
  lat: number;
  lng: number;
}) => {
  const currentOfficeId = getCurrentOfficeId();
  if (!currentOfficeId) return;

  const officeData = getOfficeData(currentOfficeId);
  if (!officeData.meta) return;

  // Обновляем координаты и публикуем офис если они предоставлены
  if (coordinates) {
    const updatedMeta: OfficeMeta = {
      ...officeData.meta,
      coordinates,
      isPublished: true // Автоматически публикуем офис при установке координат
    };
    saveOfficeMeta(updatedMeta);
  }

  // Обновляем список офисов на карте
  const allOffices = getAllOfficesMeta();
  const publishedOffices = allOffices
    .filter(office => office.isPublished && office.coordinates)
    .map(office => ({
      id: office.nameId,
      name: office.displayName,
      city: office.city,
      lat: office.coordinates!.lat,
      lng: office.coordinates!.lng,
    }));
  
  writeJson(STORAGE_KEYS.OFFICES_ON_MAP, publishedOffices);
  
};

// === КАРТА ОФИСОВ ===
export const getOfficesForMap = (): OfficeOnMap[] => {
  return readJson(STORAGE_KEYS.OFFICES_ON_MAP, []);
};

export const updateOfficeCoordinates = (
  nameId: string,
  coordinates: { lat: number; lng: number }
) => {
  const meta = getOfficeMeta(nameId);
  if (meta) {
    saveOfficeMeta({
      ...meta,
      coordinates,
    });
  }
};

export const publishOffice = (nameId: string, shouldPublish: boolean = true) => {
  const meta = getOfficeMeta(nameId);
  if (meta) {
    saveOfficeMeta({
      ...meta,
      isPublished: shouldPublish,
    });
    
    // Обновляем список офисов на карте
    const allOffices = getAllOfficesMeta();
    const publishedOffices = allOffices
      .filter(office => office.isPublished && office.coordinates)
      .map(office => ({
        id: office.nameId,
        name: office.displayName,
        city: office.city,
        lat: office.coordinates!.lat,
        lng: office.coordinates!.lng,
      }));
    
    writeJson(STORAGE_KEYS.OFFICES_ON_MAP, publishedOffices);
  }
};

// === ПРОВЕРКА И ВОССТАНОВЛЕНИЕ ДАННЫХ ===
export const verifyAndRepairOfficeData = () => {
  // Получаем все офисы
  const allOffices = getAllOfficesMeta();
  
  // Проверяем и обновляем данные на карте
  const officesOnMap = readJson<OfficeOnMap[]>(STORAGE_KEYS.OFFICES_ON_MAP, []);
  const validOfficesOnMap: OfficeOnMap[] = officesOnMap.filter(mapOffice => {
    const meta = allOffices.find(o => o.nameId === mapOffice.id);
    return meta?.isPublished && meta?.coordinates;
  });
  
  // Добавляем опубликованные офисы, которых нет на карте
  allOffices.forEach(office => {
    if (office.isPublished && office.coordinates) {
      const existingOnMap = validOfficesOnMap.some(o => o.id === office.nameId);
      if (!existingOnMap) {
        validOfficesOnMap.push({
          id: office.nameId,
          name: office.displayName,
          city: office.city,
          lat: office.coordinates.lat,
          lng: office.coordinates.lng,
        });
      }
    }
  });
  
  // Сохраняем исправленные данные
  writeJson(STORAGE_KEYS.OFFICES_ON_MAP, validOfficesOnMap);
};