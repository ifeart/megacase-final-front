// src/features/admin/AnnotateMarkers.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { CLIENT_TOKEN } from "../../constants";
import { SpaceViewer } from "../../components/SpaceViewer";
import type { Marker } from "../../types";
import {
  getMarkers,
  setMarkers,
  setDesks,
  setRooms,
  setDesksAvailability,
  setRoomsAvailability,
  setRoomsInclusion,
  setDesksInclusion,
  setMarkersInclusion,
} from "../../services/storage";
import { extractDesks, extractRoomsAllLevels } from "../../services/smplr";

type Props = { spaceId: string; onNext: () => void };

export const AnnotateMarkers: React.FC<Props> = ({ spaceId, onNext }) => {
  const spaceRef = useRef<any>(null);
  const markersCtrlRef = useRef<any>(null);

  const [ready, setReady] = useState(false);
  const [list, setList] = useState<Marker[]>(getMarkers());
  const [picking, setPicking] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // enable/disable picking mode
  useEffect(() => {
    if (!ready || !spaceRef.current) return;
    if (picking) {
      spaceRef.current.enablePickingMode({
        onPick: ({ coordinates }: any) => {
          const newMarker: Marker = {
            id: crypto.randomUUID(),
            name: `Marker ${list.length + 1}`,
            position: {
              ...coordinates,
              elevation: coordinates.elevation ?? 3,
            },
            color: "#2393d4",
          };
          const next = [...list, newMarker];
          setList(next);
          setMarkers(next);
          setSelectedId(newMarker.id);
        },
      });
    } else {
      spaceRef.current.disablePickingMode();
    }
  }, [ready, picking, list]);

  // add/update layer
  useEffect(() => {
    if (!ready || !spaceRef.current) return;
    if (!markersCtrlRef.current) {
      markersCtrlRef.current = spaceRef.current.addPointDataLayer({
        id: "markers",
        shape: "sphere",
        data: list,
        diameter: 0.6,
        anchor: "bottom",
        color: (d: any) => d.color ?? "#2393d4",
        tooltip: (d: any) => d.name,
        onDrop: ({ data, position }: any) => {
          const next = list.map((m) =>
            m.id === data.id
              ? {
                  ...m,
                  position: {
                    ...position,
                    elevation: position.elevation ?? m.position.elevation ?? 3,
                  },
                }
              : m
          );
          setList(next);
          setMarkers(next);
        },
        onClick: (d: any) => setSelectedId(d.id),
      });
    } else {
      markersCtrlRef.current.update({
        data: list,
        color: (d: any) => d.color ?? "#2393d4",
      });
    }
  }, [ready, list]);

  useEffect(() => {
    return () => {
      try {
        spaceRef.current?.removeDataLayer?.("markers");
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  const onReady = (space: any) => {
    spaceRef.current = space;
    setReady(true);
  };

  const updateMarker = (id: string, updates: Partial<Marker>) => {
    const next = list.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setList(next);
    setMarkers(next);
    // визуально обновим слой
    markersCtrlRef.current?.update?.({ data: next });
  };

  return (
    <div className="relative h-full w-full bg-white">
      <SpaceViewer
        spaceId={spaceId}
        clientToken={CLIENT_TOKEN}
        onReady={onReady}
        viewerOptions={{ controlsPosition: "center-left" }}
      />

      {/* Нижняя панель действий */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t-0">
        <div className="mx-auto max-w-6xl px-8 py-2 flex items-center gap-6">
          <button
            className="px-6 py-3 text-[16px] border border-gray-300 text-gray-700 hover:border-[#1daff7] hover:text-[#1daff7] transition-all duration-300 hover-lift"
            onClick={() => setPicking((v) => !v)}
          >
            {picking ? "Ostanovit" : "Razmestit marker"}
          </button>
          <div className="text-gray-500 text-[16px]">
            Markerov: {list.length}
          </div>
          <div className="flex-1" />
          <button
            className="px-6 py-3 text-[16px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift"
            onClick={async () => {
              try {
                // console.log(
                // 	"Извлекаем геометрию для spaceId:",
                // 	spaceId
                // );

                const [rooms, desks] = await Promise.all([
                  extractRoomsAllLevels(spaceId),
                  extractDesks(spaceId),
                ]);

                // console.log("Извлечено:", {
                // 	rooms: rooms.length,
                // 	desks: desks.length,
                // });

                // Сохраняем данные
                setRooms(rooms);
                setDesks(desks);

                // Инициализируем availability (все доступно)
                const roomsAvailability = Object.fromEntries(
                  rooms.map((r) => [r.id, true])
                );
                const desksAvailability = Object.fromEntries(
                  desks.map((d) => [d.id, true])
                );

                setRoomsAvailability(roomsAvailability);
                setDesksAvailability(desksAvailability);

                // Инициализируем inclusion (все включено)
                const roomsInclusion = Object.fromEntries(
                  rooms.map((r) => [r.id, true])
                );
                const desksInclusion = Object.fromEntries(
                  desks.map((d) => [d.id, true])
                );
                const markersInclusion = Object.fromEntries(
                  list.map((m) => [m.id, true])
                );

                setRoomsInclusion(roomsInclusion);
                setDesksInclusion(desksInclusion);
                setMarkersInclusion(markersInclusion);

                // console.log("Все данные сохранены в storage");

                alert(
                  `Извлечено: ${rooms.length} комнат, ${desks.length} столов`
                );
              } catch (error) {
                console.error("Ошибка при извлечении геометрии:", error);
                alert("Ошибка при извлечении геометрии");
              }
            }}
          >
            Izvlech geometriyu
          </button>
          <button
            className="px-6 py-3 text-[16px] primary-button hover-lift"
            onClick={onNext}
          >
            Dalee
          </button>
        </div>
      </div>

      {/* Правая панель: редактирование маркеров */}
      <div className="fixed top-16 right-0 bottom-0 w-full max-w-sm z-40 glass-panel border-l-0 border-r-0">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="text-[20px] font-medium text-black">Markery</div>
            <div className="flex-1" />
            {selectedId && (
              <button
                className="px-3 py-2 text-[14px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300"
                onClick={() => setSelectedId(null)}
              >
                Otmenit
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            <div className="divide-y divide-gray-100">
              {list.map((m) => {
                const isSel = selectedId === m.id;
                return (
                  <div key={m.id} className="px-6 py-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded border-2 border-gray-200"
                        style={{
                          background: m.color ?? "#1daff7",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <input
                          className="w-full px-0 py-2 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300"
                          value={m.name}
                          onChange={(e) =>
                            updateMarker(m.id, {
                              name: e.target.value,
                            })
                          }
                          onFocus={() => setSelectedId(m.id)}
                        />
                        <div className="text-[12px] text-gray-500 truncate mt-1">
                          {m.id}
                        </div>
                      </div>
                      <input
                        type="color"
                        className="w-8 h-8 p-0 border-2 border-gray-200 rounded cursor-pointer"
                        value={m.color ?? "#1daff7"}
                        onChange={(e) =>
                          updateMarker(m.id, {
                            color: e.target.value,
                          })
                        }
                        onFocus={() => setSelectedId(m.id)}
                        title="Tsvet markera"
                      />
                    </div>
                    {isSel && (
                      <div className="text-[12px] text-gray-500">
                        Podskazka: peretaschite marker na stsene dlya
                        peremescheniya.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
