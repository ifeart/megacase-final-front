export const ORGANIZATION_ID = "1982bd68-b6d9-4c77-902d-db72f7fd1d10";
export const CLIENT_TOKEN = "pub_afc48287d7404b059eb617435e348a46";

export const STORAGE_KEYS = {
  // Мета-информация об офисах
  OFFICES_META: "offices_meta", // Список всех офисов с их мета-данными
  OFFICES_ON_MAP: "offices_on_map", // Список офисов, отображаемых на карте
  CURRENT_OFFICE: "current_office", // Текущий выбранный офис

  // Данные всех офисов
  ALL_MARKERS: "all_markers", // { [officeId]: Marker[] }
  ALL_ROOMS: "all_rooms", // { [officeId]: Room[] }
  ALL_DESKS: "all_desks", // { [officeId]: Desk[] }
  ALL_AVAILABILITY_ROOMS: "all_availability_rooms", // { [officeId]: { [roomId]: boolean } }
  ALL_AVAILABILITY_DESKS: "all_availability_desks", // { [officeId]: { [deskId]: boolean } }
  ALL_INCLUSION_ROOMS: "all_inclusion_rooms", // { [officeId]: { [roomId]: boolean } }
  ALL_INCLUSION_DESKS: "all_inclusion_desks", // { [officeId]: { [deskId]: boolean } }
  ALL_INCLUSION_MARKERS: "all_inclusion_markers", // { [officeId]: { [markerId]: boolean } }
};

