/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useId, useState } from "react";
import { loadSmplr } from "../services/smplr";
import { CLIENT_TOKEN } from "../constants";
import { setSpaceStatusPublished } from "../services/smplr";

type Props = {
  spaceId: string;
  onReady?: () => void;
  onNext?: () => void;
};

export const EditorView: React.FC<Props> = ({ spaceId, onReady, onNext }) => {
  const containerId = useId().replace(/:/g, "-");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    let editor: any;
    loadSmplr()
      .then((smplr) => {
        editor = new smplr.Editor({
          spaceId,
          clientToken: CLIENT_TOKEN,
          user: { id: "admin-1", name: "Admin" },
          containerId,
        });
        editor.startSession({ onReady: () => onReady?.() });
      })
      .catch(console.error);
    return () => {
      try {
        editor?.remove?.();
      } catch {}
    };
  }, [spaceId]);

  return (
    <div className="relative h-full w-full bg-white">
      <div className="relative h-full w-full bg-gray-50">
        <div id={containerId} className="absolute inset-0" />
      </div>

      {/* Нижняя панель действий */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t-0">
        <div className="mx-auto max-w-6xl px-8 py-2 flex items-center gap-6">
          <div className="text-gray-500 text-[16px]">Редактор пространства</div>
          <div className="flex-1" />
          <div className="text-[14px] text-gray-500">
            Постройте свой офис: стены, двери, окна, мебель
          </div>
          <button
            className="px-6 py-3 text-[16px] primary-button hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={publishing}
            onClick={async () => {
              try {
                setPublishing(true);
                await setSpaceStatusPublished(spaceId);
              } catch {
                // опционально: уведомление об ошибке
              } finally {
                setPublishing(false);
                onNext?.();
              }
            }}
          >
            {publishing ? "Сохраняется..." : "Далее"}
          </button>
        </div>
      </div>
    </div>
  );
};
