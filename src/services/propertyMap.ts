import type { Coordinates } from "../models/climora";

type MapView = {
  setView: (point: Coordinates, zoom: number) => MapView;
  fitBounds: (
    points: Coordinates[],
    options: { padding: [number, number]; maxZoom: number },
  ) => void;
  on: (
    event: "click",
    handler: (event: { latlng: Coordinates }) => void,
  ) => void;
  remove: () => void;
};

type Pin = {
  addTo: (map: MapView) => Pin;
  bindTooltip: (
    label: string,
    options: { permanent: boolean; direction: "top" },
  ) => Pin;
  remove: () => void;
};

type Leaflet = {
  map: (element: HTMLElement, options: { scrollWheelZoom: boolean }) => MapView;
  tileLayer: (
    url: string,
    options: { maxZoom: number; noWrap: boolean; attribution: string },
  ) => {
    on: (event: "tileerror" | "tileload", handler: () => void) => void;
    addTo: (map: MapView) => void;
  };
  polygon: (
    points: Coordinates[],
    options: { color: string; fillOpacity: number; interactive: boolean },
  ) => {
    addTo: (map: MapView) => void;
    remove: () => void;
  };
  circleMarker: (
    point: Coordinates,
    options: {
      radius: number;
      color: string;
      fillColor: string;
      fillOpacity: number;
      weight: number;
      interactive: boolean;
    },
  ) => Pin;
};

let loading: Promise<Leaflet> | undefined;

export function loadLeaflet() {
  if (loading) return loading;

  const base = "https://unpkg.com/leaflet@1.9.4/dist/";
  loading = new Promise<Leaflet>((resolve, reject) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = base + "leaflet.css";
    style.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    style.crossOrigin = "anonymous";

    const script = document.createElement("script");
    script.src = base + "leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "anonymous";

    const fail = () => {
      window.clearTimeout(timeout);
      style.remove();
      script.remove();
      reject(new Error("Falha ao carregar o Leaflet"));
    };

    let styleReady = false;
    let leaflet: Leaflet | undefined;
    const finish = () => {
      if (styleReady && leaflet) {
        window.clearTimeout(timeout);
        resolve(leaflet);
      }
    };
    const timeout = window.setTimeout(fail, 12000);
    style.onload = () => {
      styleReady = true;
      finish();
    };
    style.onerror = script.onerror = fail;
    script.onload = () => {
      leaflet = (window as Window & { L?: Leaflet }).L;
      if (leaflet) finish();
      else fail();
    };
    document.head.append(style, script);
  }).catch((error) => {
    loading = undefined;
    throw error;
  });
  return loading;
}
