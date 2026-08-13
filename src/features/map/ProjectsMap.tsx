import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Coords, Project } from "../../data/types";
import { statusOf } from "../../lib/status";
import { STATUS_HEX, STATUS_META } from "../../lib/statusMeta";
import { PIN_META, precisionOf } from "../../lib/pinMeta";
import { ProgressBar } from "../../components/ProgressBar";
import { useSelection } from "../linking/SelectionContext";

// Build a small colored-dot marker so we don't depend on Leaflet's default
// icon images (which break under bundlers) and can color by status.
function statusMarker(hex: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${hex};border:2px solid #fff;box-shadow:0 0 0 1px rgba(15,23,42,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

interface Located extends Project {
  coords: Coords;
}

export function ProjectsMap({ projects }: { projects: Located[] }) {
  const { openProject } = useSelection();
  const bounds = projects.map(
    (p) => [p.coords.lat, p.coords.lng] as [number, number],
  );

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [48, 48] }}
      scrollWheelZoom
      className="h-full w-full"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satellite">
          <TileLayer
            attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {projects.map((p) => {
        const status = statusOf(p);
        const meta = STATUS_META[status];
        return (
          <Marker
            key={p.id}
            position={[p.coords.lat, p.coords.lng]}
            icon={statusMarker(STATUS_HEX[status])}
          >
            <Tooltip>{p.name}</Tooltip>
            <Popup>
              <div className="space-y-2" style={{ minWidth: 200 }}>
                <div>
                  <div className="font-medium text-slate-900">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.location}</div>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${PIN_META[precisionOf(p.coords)].badge}`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${PIN_META[precisionOf(p.coords)].dot}`}
                    />
                    {PIN_META[precisionOf(p.coords)].label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{meta.label}</span>
                  <span>{Math.round(p.progress)}%</span>
                </div>
                <ProgressBar value={p.progress} barClass={meta.bar} />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openProject(p.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View details →
                  </button>
                  <a
                    href={`https://maps.google.com/?cbll=${p.coords.lat},${p.coords.lng}&cbp=12,0,0,0,0&layer=c`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Imagery may predate the project — check the capture date in Maps and compare it against the project timeline"
                    className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    Street view ↗
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
