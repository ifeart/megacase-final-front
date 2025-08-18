export type SmplrCoord2d = { levelIndex: number; x: number; z: number };
export type SmplrCoord3d = SmplrCoord2d & { elevation: number };

export type Marker = {
	id: string;
	name: string;
	position: SmplrCoord3d;
	color?: string; // новый цвет маркера (hex)
};

export type RoomEntity = {
	id: string; // ваш стабильный ID
	name: string;
	levelIndex: number;
	coordinates: SmplrCoord2d[];
};

export type DeskEntity = {
	id: string; // furnitureId
	furnitureId: string;
	name: string;
	levelIndex: number;
};

export type AvailabilityMap = Record<string, boolean>;

// Новые типы для многоофисной системы
export type OfficeOnMap = {
	id: string; // spaceId
	name: string;
	city: string;
	lat: number;
	lng: number;
};

export type OfficeData = {
	spaceId: string;
	name: string;
	city: string;
	coordinates?: { lat: number; lng: number };
	markers: Marker[];
	rooms: RoomEntity[];
	desks: DeskEntity[];
	availabilityRooms: AvailabilityMap;
	availabilityDesks: AvailabilityMap;
	inclusionRooms: Record<string, boolean>;
	inclusionDesks: Record<string, boolean>;
	inclusionMarkers: Record<string, boolean>;
};
