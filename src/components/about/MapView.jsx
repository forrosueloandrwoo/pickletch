import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// TODO: replace with your court's exact coordinates
// (right-click the spot on Google Maps -> the numbers that pop up are lat, lng)
export const COURT_LAT = 8.2386;
export const COURT_LNG = 122.9986;

export default function MapView() {
  const mapInstanceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView([COURT_LAT, COURT_LNG], 15);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // re-enable scroll-zoom only once the user clicks into the map, so scrolling
    // the page past it doesn't accidentally trap/zoom the map
    map.on("click", () => map.scrollWheelZoom.enable());
    map.getContainer().addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

    const pin = L.divIcon({
      className: "",
      html: `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
               <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0Z" fill="#16a34a"/>
               <circle cx="17" cy="17" r="7.5" fill="#fde047" stroke="#ca8a04" stroke-width="1"/>
             </svg>`,
      iconSize: [34, 44],
      iconAnchor: [17, 44],
      popupAnchor: [0, -38],
    });

    L.marker([COURT_LAT, COURT_LNG], { icon: pin })
      .addTo(map)
      .bindPopup("<strong>Pickletch</strong><br>Sindangan, Zamboanga del Norte")
      .openPopup();

    // Leaflet doesn't clean itself up automatically -- without this, navigating
    // away and back (or React StrictMode's double-invoke in dev) would throw
    // "Map container is already initialized."
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative isolate z-0 h-[260px] sm:h-[360px] lg:h-[500px] rounded-xl overflow-hidden border border-gray-200"
    />
  );
}