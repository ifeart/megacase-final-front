/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_TOKEN } from "../../constants";
import { loadSmplr } from "../../services/smplr";
import {
  finalizeOfficeData,
  getOffice,
  getOfficesOnMap,
} from "../../services/storage";

type Props = {
  spaceId: string;
  onNext: () => void;
};

export const MapPlacement: React.FC<Props> = ({ spaceId, onNext }) => {
  const navigate = useNavigate();
  const containerId = useId().replace(/:/g, "-");
  const mapRef = useRef<any>(null);
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [officeName, setOfficeName] = useState("");
  const [cityName, setCityName] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Получаем данные текущего офиса
  const currentOffice = getOffice(spaceId);
  const existingOffices = getOfficesOnMap();

  // Инициализируем поля ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (currentOffice && !initialized) {
      setOfficeName(currentOffice.name);
      setCityName(currentOffice.city);
      setSelectedCoords(currentOffice.coordinates || null);
      setInitialized(true);
    }
  }, [currentOffice, initialized]);

  const handlePlaceOffice = () => {
    if (!selectedCoords) {
      alert("Пожалуйста, выберите место на карте");
      return;
    }

    if (!officeName.trim() || !cityName.trim()) {
      alert("Заполните название и город");
      return;
    }

    // Сохраняем все данные разом
    finalizeOfficeData(selectedCoords);
    onNext();
  };

  const handleCreateNewOffice = () => {
    navigate("/setup");
  };

  // Подготавливаем данные для существующих офисов на карте
  const pointsLayerData = existingOffices.map((office) => ({
    id: office.id,
    position: { lng: office.lng, lat: office.lat },
    name: office.name,
    city: office.city,
  }));

  useEffect(() => {
    let disposed = false;
    let map: any;

    loadSmplr()
      .then((smplr) => {
        if (disposed) return;

        map = new smplr.Map({
          clientToken: CLIENT_TOKEN,
          containerId,
        });

        mapRef.current = map;

        return map.startViewer({
          osmBuildings: false,
          hideControls: false,
          controlsPosition: "center-left",
          onReady: () => {
            map.setCameraPlacement({
              center: { lng: 55, lat: 61 },
              zoom: 3.2,
              pitch: 0,
              bearing: 0,
              animate: false,
            });

            // Добавляем существующие офисы
            if (pointsLayerData.length > 0) {
              map.addGeoPointDataLayer({
                id: "existing-offices",
                data: pointsLayerData,
                color: "#64748b",
                alpha: 0.8,
                label: (d: any) => d.name,
              });
            }

            // Добавляем выбранную позицию если есть
            if (selectedCoords) {
              map.addGeoPointDataLayer({
                id: "selected-position",
                data: [
                  {
                    id: "current",
                    position: {
                      lng: selectedCoords.lng,
                      lat: selectedCoords.lat,
                    },
                    name: officeName || "Новый офис",
                  },
                ],
                color: "#1daff7",
                alpha: 1,
                label: (d: any) => d.name,
              });
            }

            // Включаем режим выбора места
            map.enablePickingMode({
              onPick: ({ coordinates }: any) => {
                const newCoords = {
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                };
                setSelectedCoords(newCoords);

                // Обновляем слой с выбранной позицией
                map.removeDataLayer("selected-position");
                map.addGeoPointDataLayer({
                  id: "selected-position",
                  data: [
                    {
                      id: "current",
                      position: {
                        lng: newCoords.lng,
                        lat: newCoords.lat,
                      },
                      name: officeName || "Новый офис",
                    },
                  ],
                  color: "#1daff7",
                  alpha: 1,
                  label: (d: any) => d.name,
                });
              },
            });
          },
        });
      })
      .catch((e) => {
        console.error("Smplr map error:", e);
      });

    return () => {
      disposed = true;
      try {
        mapRef.current?.remove?.();
      } catch {}
      mapRef.current = null;
    };
  }, [containerId]);

  return (
    <div className="relative h-full w-full bg-white">
      <div id={containerId} className="absolute inset-0" />

      {/* Информационная панель */}
      <div className="absolute top-8 left-8 z-40 glass-panel rounded-[20px] p-6 max-w-sm hover-lift">
        <h3 className="text-[28px] text-black mb-2 tracking-tight">
          Razmestit ofis
        </h3>
        <p className="text-[16px] text-gray-500 mb-6">
          Vyberite mesto na karte dlya vashego ofisa
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-[14px] font-medium text-black mb-2">
              Nazvanie ofisa
            </label>
            <input
              type="text"
              className="w-full px-0 py-3 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              placeholder="Vvedite nazvanie"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-black mb-2">
              Gorod
            </label>
            <input
              type="text"
              className="w-full px-0 py-3 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Vvedite gorod"
            />
          </div>

          {selectedCoords && (
            <div className="text-[12px] text-gray-500 space-y-1">
              <div>Shirota: {selectedCoords.lat.toFixed(4)}</div>
              <div>Dolgota: {selectedCoords.lng.toFixed(4)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="absolute bottom-8 right-8 z-40 flex gap-4">
        <button
          className="px-6 py-4 text-[16px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift"
          onClick={handleCreateNewOffice}
        >
          Sozdat noviy ofis
        </button>
        <button
          className="px-6 py-4 text-[16px] primary-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={handlePlaceOffice}
          disabled={!selectedCoords || !officeName.trim() || !cityName.trim()}
        >
          Razmestit ofis
        </button>
      </div>

      {/* Инструкции */}
      <div className="absolute bottom-8 left-8 z-40 glass-panel rounded-[15px] p-4 text-[14px] max-w-xs">
        <div className="font-medium mb-2 text-black">Instruktsii:</div>
        <ul className="text-gray-600 space-y-1">
          <li>• Kliknite na karte dlya vybora mesta</li>
          <li>• Zapolnite nazvanie i gorod</li>
          <li>• Nazhmite "Razmestit ofis"</li>
        </ul>
      </div>
    </div>
  );
};
