import { useState } from "react";
import { createSpace, getSpaceIfExists } from "../../services/smplr";
import {
  getCurrentOfficeId,
  setCurrentOfficeId,
  initializeNewOffice,
  getOfficeData,
  getAllOfficesMeta,
} from "../../services/storage";

type Props = { onDone: (spaceId: string) => void };

interface OfficeFormData {
  nameId: string;
  displayName: string;
  city: string;
}

export const SpaceSetup: React.FC<Props> = ({ onDone }) => {
  const currentOfficeId = getCurrentOfficeId();
  const [spaceId, setSpaceId] = useState(currentOfficeId);
  const [formData, setFormData] = useState<OfficeFormData>({
    nameId: "",
    displayName: "",
    city: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateNameId = (nameId: string): boolean => {
    // Проверяем формат: только латинские буквы, цифры и дефис
    if (!/^[a-z0-9-]+$/.test(nameId)) {
      setError(
        "ID офиса может содержать только латинские буквы, цифры и дефис"
      );
      return false;
    }

    // Проверяем уникальность
    const existingOffices = getAllOfficesMeta();
    if (existingOffices.some((office) => office.nameId === nameId)) {
      setError("Офис с таким ID уже существует");
      return false;
    }

    setError(null);
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "nameId") {
      validateNameId(value);
    }
  };

  const saveAndNext = (nameId: string) => {
    setCurrentOfficeId(nameId);
    const officeMeta = getOfficeData(nameId)?.meta;
    if (officeMeta) {
      console.log('spaceId: ',  officeMeta.spaceId)
      onDone(officeMeta.spaceId);
    }
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
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
              />
              <button
                className="px-8 py-4 text-[16px] border border-gray-300 text-gray-700 hover:border-gray-400 transition-all duration-300 hover-lift disabled:opacity-50"
                disabled={!spaceId || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const smplrSpace = await getSpaceIfExists(spaceId.trim());
                    if (!smplrSpace) {
                      alert("Пространство не найдено");
                      return;
                    }

                    // Проверяем, есть ли этот офис в нашей системе
                    let officeData = getOfficeData(formData.nameId);
                    if (!officeData.meta) {
                      // Если офиса нет, инициализируем его
                      console.log(
                        "Инициализируем существующий офис:",
                        formData.nameId
                      );

                      initializeNewOffice(
                        formData.nameId,
                        spaceId.trim(),
                        formData.displayName,
                        formData.city,
                        false // isPublished
                      );
                    }

                    saveAndNext(formData.nameId);
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

          <div className="space-y-6">
            <h3 className="text-[20px] text-black">Создать новый офис</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-black mb-2">
                  ID офиса (для URL)
                </label>
                <input
                  name="nameId"
                  className="w-full px-0 py-3 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
                  placeholder="например: moscow-hq"
                  value={formData.nameId}
                  onChange={handleInputChange}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <div>
                <label className="block text-[14px] font-medium text-black mb-2">
                  Название офиса (публичное)
                </label>
                <input
                  name="displayName"
                  className="w-full px-0 py-3 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
                  placeholder="Московский офис"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-black mb-2">
                  Город
                </label>
                <input
                  name="city"
                  className="w-full px-0 py-3 text-[16px] text-black bg-transparent border-0 border-b border-gray-200 focus:border-[#1daff7] focus:outline-none transition-colors duration-300 placeholder-gray-400"
                  placeholder="Москва"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              className="w-full px-8 py-4 text-[16px] primary-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={
                busy ||
                !formData.nameId ||
                !formData.displayName ||
                !formData.city ||
                !!error
              }
              onClick={async () => {
                try {
                  setBusy(true);
                  console.log("Создаем новый офис:", formData.displayName);

                  // Создаем пространство в smplr
                  const newSpaceId = await createSpace(formData.displayName);
                  console.log("Получен новый ID пространства:", newSpaceId);

                  // Инициализируем офис в нашей системе
                  initializeNewOffice(
                    formData.nameId,
                    newSpaceId,
                    formData.displayName,
                    formData.city,
                    false // isPublished
                  );

                  console.log(
                    "Офис инициализирован в системе:",
                    formData.nameId,
                    newSpaceId
                  );
                  saveAndNext(formData.nameId);
                } catch (error) {
                  console.error("Ошибка при создании офиса:", error);
                  alert("Ошибка при создании пространства");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Создаю..." : "Создать офис"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
