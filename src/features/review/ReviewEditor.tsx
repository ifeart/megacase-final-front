/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SpaceViewer } from "../../components/SpaceViewer";
import { CLIENT_TOKEN } from "../../constants";
import {
  getRooms,
  getDesks,
  getMarkers,
  getRoomsInclusion,
  setRoomsInclusion,
  getDesksInclusion,
  setDesksInclusion,
  getMarkersInclusion,
  setMarkersInclusion,
} from "../../services/storage";

type Props = { spaceId: string; onNext: () => void };
type ReviewTab = "rooms" | "desks" | "markers";

export const ReviewEditor: React.FC<Props> = ({ spaceId, onNext }) => {
  const spaceRef = useRef<any>(null);
  const roomsCtrlRef = useRef<any>(null);
  const desksCtrlRef = useRef<any>(null);
  const markersCtrlRef = useRef<any>(null);
  const [tab, setTab] = useState<ReviewTab>("rooms");
  const [_, setViewerReady] = useState(false);

  const rooms = useMemo(() => getRooms(), []);
  const desks = useMemo(() => getDesks(), []);
  const markers = useMemo(() => getMarkers(), []);

  const [roomsInc, setRoomsInc] = useState<Record<string, boolean>>(() =>
    getRoomsInclusion()
  );
  const [desksInc, setDesksInc] = useState<Record<string, boolean>>(() =>
    getDesksInclusion()
  );
  const [markersInc, setMarkersInc] = useState<Record<string, boolean>>(() =>
    getMarkersInclusion()
  );

  const bulk = (which: ReviewTab, value: boolean) => {
    if (which === "rooms") {
      const m = Object.fromEntries(rooms.map((r) => [r.id, value]));
      setRoomsInc(m);
      setRoomsInclusion(m);
    } else if (which === "desks") {
      const m = Object.fromEntries(desks.map((d) => [d.id, value]));
      setDesksInc(m);
      setDesksInclusion(m);
    } else {
      const m = Object.fromEntries(markers.map((x) => [x.id, value]));
      setMarkersInc(m);
      setMarkersInclusion(m);
    }
  };

  const list = tab === "rooms" ? rooms : tab === "desks" ? desks : markers;
  const incMap =
    tab === "rooms" ? roomsInc : tab === "desks" ? desksInc : markersInc;

  const setOne = (id: string, v: boolean) => {
    if (tab === "rooms") {
      const m = { ...roomsInc, [id]: v };
      setRoomsInc(m);
      setRoomsInclusion(m);
    } else if (tab === "desks") {
      const m = { ...desksInc, [id]: v };
      setDesksInc(m);
      setDesksInclusion(m);
    } else {
      const m = { ...markersInc, [id]: v };
      setMarkersInc(m);
      setMarkersInclusion(m);
    }
  };

  const onReady = (space: any) => {
    spaceRef.current = space;
    setViewerReady(true);

    // Комнаты: показываем только включённые
    roomsCtrlRef.current = space.addPolygonDataLayer({
      id: "rooms-review",
      data: rooms.filter((r) => roomsInc[r.id] !== false),
      height: 2.9,
      alpha: 0.8,
      color: "#48B695",
      tooltip: (d: any) => d.name ?? d.id,
    });

    // Столы: независимая инклюзия
    desksCtrlRef.current = space.addFurnitureDataLayer({
      id: "desks-review",
      data: desks
        .filter((d) => desksInc[d.id] !== false)
        .map((x) => ({ ...x, furnitureId: x.furnitureId })),
      color: "#50b268",
      tooltip: (d: any) => d.name ?? d.id,
    });

    // Маркеры: оставляем данные, цвет по инклюзии
    markersCtrlRef.current = space.addPointDataLayer({
      id: "markers-review",
      shape: "sphere",
      data: markers,
      diameter: 0.6,
      anchor: "bottom",
      color: (d: any) =>
        markersInc[d.id] !== false ? d.color ?? "#2393d4" : "#94a3b8",
      tooltip: (d: any) => d.name ?? d.id,
    });
  };

  // Обновление слоёв
  useEffect(() => {
    if (!roomsCtrlRef.current) return;
    roomsCtrlRef.current.update({
      data: rooms.filter((r) => roomsInc[r.id] !== false),
      color: "#48B695",
    });
  }, [roomsInc, rooms]);

  useEffect(() => {
    if (!desksCtrlRef.current) return;
    desksCtrlRef.current.update({
      data: desks
        .filter((d) => desksInc[d.id] !== false)
        .map((x) => ({ ...x, furnitureId: x.furnitureId })),
      color: "#50b268",
    });
  }, [desksInc, desks]);

  useEffect(() => {
    if (!markersCtrlRef.current) return;
    markersCtrlRef.current.update({
      data: markers,
      color: (d: any) =>
        markersInc[d.id] !== false ? d.color ?? "#2393d4" : "#94a3b8",
    });
  }, [markersInc, markers]);

  useEffect(() => {
    return () => {
      try {
        spaceRef.current?.removeDataLayer?.("rooms-review");
        spaceRef.current?.removeDataLayer?.("desks-review");
        spaceRef.current?.removeDataLayer?.("markers-review");
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-white">
      <SpaceViewer
        spaceId={spaceId}
        clientToken={CLIENT_TOKEN}
        onReady={onReady}
        renderOptions={{ backgroundColor: "#f6f7f9" }}
      />

      {/* Нижняя панель действий */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t-0">
        <div className="mx-auto max-w-6xl px-8 py-2 flex items-center gap-6">
          <div className="text-gray-500 text-[16px]">Проверка и настройка</div>
          <div className="flex-1" />
          <div className="text-[14px] text-gray-500">
            Выберите элементы для итогов
          </div>
          <button
            className="px-6 py-3 text-[16px] primary-button hover-lift"
            onClick={onNext}
          >
            Далее
          </button>
        </div>
      </div>

      {/* Правая панель редактирования */}
      <div className="fixed top-16 right-0 bottom-0 w-full max-w-md z-40 glass-panel border-l-0 border-r-0">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <button
              className={`px-4 py-2 text-[14px] rounded-[8px] border transition-all duration-300 ${
                tab === "rooms"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#1daff7] hover:text-[#1daff7]"
              }`}
              onClick={() => setTab("rooms")}
            >
              Комнаты
            </button>
            <button
              className={`px-4 py-2 text-[14px] rounded-[8px] border transition-all duration-300 ${
                tab === "desks"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#1daff7] hover:text-[#1daff7]"
              }`}
              onClick={() => setTab("desks")}
            >
              Столы
            </button>
            <button
              className={`px-4 py-2 text-[14px] rounded-[8px] border transition-all duration-300 ${
                tab === "markers"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-[#1daff7] hover:text-[#1daff7]"
              }`}
              onClick={() => setTab("markers")}
            >
              Маркеры
            </button>
            <div className="flex-1" />
            <button
              className="px-3 py-2 text-[12px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift mr-2"
              onClick={() => bulk(tab, true)}
            >
              Все
            </button>
            <button
              className="px-3 py-2 text-[12px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift"
              onClick={() => bulk(tab, false)}
            >
              Ничего
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-gray-100">
              {list.map((item: any) => (
                <label
                  key={item.id}
                  className="px-6 py-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#1daff7] border-gray-300 rounded focus:ring-[#1daff7]"
                    checked={incMap[item.id] !== false}
                    onChange={(e) => setOne(item.id, e.target.checked)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[16px] font-medium text-black truncate">
                      {item.name || item.id}
                    </div>
                    <div className="text-[12px] text-gray-500 truncate">
                      {tab === "rooms"
                        ? `Уровень ${(item.levelIndex ?? 0) + 1}`
                        : tab === "desks"
                        ? `Стол ${item.furnitureId}`
                        : `Маркер ${item.id}`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
