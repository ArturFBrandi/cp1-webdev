import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "watchly:watched-list";

function loadWatchedList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function itemKey(tipo, id) {
  return `${tipo}-${id}`;
}

export function useWatchedList() {
  const [watchedList, setWatchedList] = useState(loadWatchedList);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedList));
  }, [watchedList]);

  const getWatchedItem = useCallback(
    (tipo, id) => watchedList.find((item) => itemKey(item.tipo, item.id) === itemKey(tipo, id)),
    [watchedList]
  );

  const isWatched = useCallback(
    (tipo, id) => Boolean(getWatchedItem(tipo, id)),
    [getWatchedItem]
  );

  const markAsWatched = useCallback((item) => {
    setWatchedList((current) => {
      const key = itemKey(item.tipo, item.id);
      const withoutItem = current.filter((existing) => itemKey(existing.tipo, existing.id) !== key);
      return [
        ...withoutItem,
        {
          ...item,
          nota: item.nota ?? 0,
          assistidoEm: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const setRating = useCallback((tipo, id, nota) => {
    setWatchedList((current) =>
      current.map((item) =>
        itemKey(item.tipo, item.id) === itemKey(tipo, id) ? { ...item, nota } : item
      )
    );
  }, []);

  const removeWatched = useCallback((tipo, id) => {
    setWatchedList((current) =>
      current.filter((item) => itemKey(item.tipo, item.id) !== itemKey(tipo, id))
    );
  }, []);

  return { watchedList, isWatched, getWatchedItem, markAsWatched, setRating, removeWatched };
}
