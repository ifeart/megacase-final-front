/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useId, useRef } from "react";
import { loadSmplr } from "../services/smplr";

type Props = {
  spaceId: string;
  clientToken: string;
  onReady: (space: any, smplr: any) => void;
  onError?: (e: unknown) => void;
  onResize?: () => void;
  renderOptions?: any;
  viewerOptions?: any;
};

export const SpaceViewer: React.FC<Props> = ({
  spaceId,
  clientToken,
  onReady,
  onError,
  onResize,
  renderOptions,
  viewerOptions,
}) => {
  const containerId = useId().replace(/:/g, "-");
  const disposed = useRef(false);

  useEffect(() => {
    let space: any;
    loadSmplr()
      .then((smplr) => {
        space = new smplr.Space({ spaceId, clientToken, containerId });
        space.startViewer({
          preview: false,
          allowModeChange: true,
          ...(viewerOptions ?? {}),
          renderOptions,
          onReady: () => onReady(space, smplr),
          onError: (err: unknown) => onError?.(err),
          onResize,
        });
      })
      .catch(onError);
    return () => {
      disposed.current = true;
      try {
        space?.remove?.();
      } catch {}
    };
  }, [spaceId, clientToken]);

  return (
    <div className="relative h-full w-full bg-slate-100 overflow-hidden">
      <div id={containerId} className="absolute inset-0 h-[105%] w-full"/>
    </div>
  );
};
