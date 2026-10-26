import { useEffect, useState } from 'react';

export function useMarketplaceResource(key, loader) {
  const [resource, setResource] = useState({ key: null, state: 'loading', value: null });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    loader(controller.signal).then(result => {
      if (active) setResource({ key, state: 'ready', value: result });
    }).catch(() => {
      if (active) setResource({ key, state: 'error', value: null });
    }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [key, loader]);
  return resource.key === key ? resource : { state: 'loading', value: null };
}

const favoriteKey = 'match:favorites:v1';
function readFavorites() {
  try { const data = JSON.parse(localStorage.getItem(favoriteKey) || '[]'); return Array.isArray(data) ? data.filter(item => typeof item === 'string') : []; } catch (error) { return []; }
}
export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);
  function toggleFavorite(id) {
    const value = String(id);
    setFavorites(current => {
      const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      try { localStorage.setItem(favoriteKey, JSON.stringify(next)); } catch (error) { /* A seleção continua disponível nesta visita. */ }
      return next;
    });
  }
  return { favorites, toggleFavorite };
}
