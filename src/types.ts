export type SmplrCoord2d = { levelIndex: number; x: number; z: number };
export type SmplrCoord3d = SmplrCoord2d & { elevation: number };

export const ROLES = {
		USER: 'USER',
		ADMIN: 'ADMIN',
		PROJECT_ADMIN: 'PROJECT_ADMIN',
		WORKSPACE_ADMIN: 'WORKSPACE_ADMIN'
  } as const;

export type ROLE = keyof typeof ROLES;

export type User = {
	id: string;
	name: string;
	role: ROLE;
	email: string;
	permissions?: {
		projectIds: string[];
		workspaceIds: string[];
	};
	avatar?: string;
};

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

export type OfficeMeta = {
  nameId: string;      // Публичный ID для URL (например, "moscow-hq")
  spaceId: string;     // ID карты в smplrspace (например, "spc_r2ta5nke")
  displayName: string; // Публичное название офиса для отображения
  name: string;        // Техническое название в smplrspace
  city: string;
  coordinates?: { lat: number; lng: number };
  isPublished: boolean; // Опубликован ли офис (виден ли на карте)
};

export type OfficeData = {
  meta: OfficeMeta;
  markers: Marker[];
  rooms: RoomEntity[];
  desks: DeskEntity[];
  availabilityRooms: AvailabilityMap;
  availabilityDesks: AvailabilityMap;
  inclusionRooms: Record<string, boolean>;
  inclusionDesks: Record<string, boolean>;
  inclusionMarkers: Record<string, boolean>;
};
