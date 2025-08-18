import { useState } from "react";
import { createSpace, getSpaceIfExists } from "../../services/smplr";
import {
  getCurrentSpaceId,
  setCurrentSpaceId,
  initializeNewOffice,
  getOffice,
} from "../../services/storage";

type Props = { onDone: (spaceId: string) => void };

export const SpaceSetup: React.FC<Props> = ({ onDone }) => {
  const existing = getCurrentSpaceId();
  const [sid, setSid] = useState(existing);
  const [name, setName] = useState("My Office");
  const [busy, setBusy] = useState(false);

  const saveAndNext = (id: string) => {
    setCurrentSpaceId(id);
    // console.log("Установлен текущий офис:", id);
    onDone(id);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-2xl p-12 glass-panel rounded-[30px]">
        <div className="text-center mb-12">
          <h2 className="text-[48px] text-black tracking-tight mb-4">
            Настройка пространства
          </h2>
          <p className="text-[18px] text-gray-500">
            Выберите существующий офис или создайте новый
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[20px] text-black">
              Использовать существующий
            </h3>
            <div className="flex gap-4">
              <input
                className="flex-1 px-0 py-4 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
                placeholder="Space ID (spc_xxx)"
                value={sid}
                onChange={(e) => setSid(e.target.value)}
              />
              <button
                className="px-8 py-4 text-[16px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift disabled:opacity-50"
                disabled={!sid || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const exists = await getSpaceIfExists(sid.trim());
                    if (!exists) {
                      alert("Пространство не найдено");
                      return;
                    }

                    // Проверяем, есть ли этот офис в нашей системе
                    let office = getOffice(sid.trim());
                    if (!office) {
                      // Если офиса нет, инициализируем его
                      console.log(
                        "Инициализируем существующий офис:",
                        sid.trim()
                      );
                      office = initializeNewOffice(
                        sid.trim(),
                        exists.name || "Existing Office"
                      );
                    }

                    saveAndNext(sid.trim());
                  } catch (error) {
                    console.error("Ошибка при проверке офиса:", error);
                    alert("Ошибка при проверке офиса");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Использовать
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-[14px]">или</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[20px] text-black">Создать новый офис</h3>
            <div className="flex gap-4">
              <input
                className="flex-1 px-0 py-4 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
                placeholder="Название нового офиса"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="px-8 py-4 text-[16px] primary-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={busy || !name}
                onClick={async () => {
                  try {
                    setBusy(true);
                    console.log("Создаем новый офис:", name.trim());
                    const newId = await createSpace(name.trim());
                    console.log("Получен новый ID:", newId);
                    initializeNewOffice(newId, name.trim());
                    console.log("Офис инициализирован в новой системе");
                    saveAndNext(newId);
                  } catch (error) {
                    console.error("Ошибка при создании офиса:", error);
                    alert("Ошибка при создании пространства");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Создаю..." : "Создать"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
