import { useEffect, useRef } from 'react';

export const fetchNui = async (eventName: string, data: any = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'nui-frame-app';

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, options);
    const respFormatted = await resp.json();
    return respFormatted;
  } catch (error) {
    console.error(`Error fetching NUI event ${eventName}:`, error);
    return { status: 'ok', mock: true };
  }
};

export function useNuiEvent<T = any>(action: string, handler: (data: T) => void) {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const payload = event.data;
      if (!payload || payload.action !== action) return;
      savedHandler.current(payload.data);
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [action]);
}
