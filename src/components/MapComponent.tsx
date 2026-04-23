import { useEffect, useMemo, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FoodListing } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocateFixed, MapPin, Navigation, Search } from 'lucide-react';

interface MapComponentProps {
  listings: FoodListing[];
  onListingSelect: (listing: FoodListing) => void;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER: [number, number] = [-33.4489, -70.6693];
const RADIUS_OPTIONS = ['1', '3', '5', '10', '20'];

const userLocationIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: '<div style="width:18px;height:18px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 6px rgba(37,99,235,0.18);"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const createListingIcon = (isNearby: boolean) =>
  L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="width:20px;height:20px;border-radius:9999px;background:${isNearby ? '#16a34a' : '#6b7280'};border:3px solid white;box-shadow:0 0 0 4px ${isNearby ? 'rgba(22,163,74,0.2)' : 'rgba(107,114,128,0.18)'};"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const calculateDistanceKm = (from: Coordinates, to: Coordinates) => {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDistance = (distanceKm: number) =>
  distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;

const MapViewportController = ({
  focusLocation,
  listings,
  nearbyListings,
}: {
  focusLocation: Coordinates | null;
  listings: FoodListing[];
  nearbyListings: FoodListing[];
}) => {
  const map = useMap();

  useEffect(() => {
    if (focusLocation) {
      const points = [
        L.latLng(focusLocation.lat, focusLocation.lng),
        ...nearbyListings.map((listing) =>
          L.latLng(listing.coordinates.lat, listing.coordinates.lng)
        ),
      ];

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
      } else {
        map.flyTo([focusLocation.lat, focusLocation.lng], 14, { duration: 1.2 });
      }
      return;
    }

    if (listings.length > 0) {
      map.fitBounds(
        L.latLngBounds(
          listings.map((listing) => [listing.coordinates.lat, listing.coordinates.lng] as [number, number])
        ),
        { padding: [40, 40] }
      );
    }
  }, [focusLocation, listings, map, nearbyListings]);

  return null;
};

const MapComponent = ({ listings, onListingSelect }: MapComponentProps) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [radiusKm, setRadiusKm] = useState('5');
  const [referenceLocation, setReferenceLocation] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Usa tu ubicación o busca una comuna para ver donaciones cercanas.');

  const radiusInKm = Number(radiusKm);

  const nearbyListings = useMemo(() => {
    if (!referenceLocation) {
      return [];
    }

    return listings
      .map((listing) => ({
        ...listing,
        distanceKm: calculateDistanceKm(referenceLocation, listing.coordinates),
      }))
      .filter((listing) => listing.distanceKm <= radiusInKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [listings, radiusInKm, referenceLocation]);

  const nearbyListingIds = useMemo(
    () => new Set(nearbyListings.map((listing) => listing.id)),
    [nearbyListings]
  );

  const getListingDistance = (listing: FoodListing) => {
    if (!referenceLocation) {
      return null;
    }

    return calculateDistanceKm(referenceLocation, listing.coordinates);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setReferenceLocation(nextLocation);
        setStatusMessage('Mostrando donaciones cerca de tu ubicación actual.');
        setIsLocating(false);
      },
      () => {
        setStatusMessage('No pudimos acceder a tu ubicación. Revisa los permisos del navegador.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSearchLocation = async () => {
    const query = searchLocation.trim();
    if (!query) {
      setStatusMessage('Escribe una comuna, dirección o barrio para buscar cerca de esa zona.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();

      if (!Array.isArray(results) || results.length === 0) {
        setStatusMessage('No encontramos esa ubicación. Intenta con una dirección o comuna más específica.');
        return;
      }

      const nextLocation = {
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
      };

      setReferenceLocation(nextLocation);
      setStatusMessage(`Mostrando donaciones cercanas a ${results[0].display_name}.`);
    } catch {
      setStatusMessage('Ocurrió un problema al buscar la ubicación.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-green-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-green-800">Mapa interactivo de donaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex-1">
              <Input
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSearchLocation();
                  }
                }}
                placeholder="Buscar comuna, barrio o dirección"
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <Button
              onClick={() => void handleSearchLocation()}
              disabled={isSearching}
              className="bg-green-600 hover:bg-green-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Buscando...' : 'Buscar zona'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <LocateFixed className="mr-2 h-4 w-4" />
              {isLocating ? 'Ubicando...' : 'Cerca de mí'}
            </Button>
            <div className="w-full lg:w-44">
              <Select value={radiusKm} onValueChange={setRadiusKm}>
                <SelectTrigger className="border-green-200 focus:border-green-500">
                  <SelectValue placeholder="Radio" />
                </SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
            <p>{statusMessage}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white hover:bg-green-600">
                {referenceLocation ? `${nearbyListings.length} cercanas` : `${listings.length} disponibles`}
              </Badge>
              {referenceLocation && (
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  Radio: {radiusKm} km
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={12}
          scrollWheelZoom
          className="h-[500px] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewportController
            focusLocation={referenceLocation}
            listings={listings}
            nearbyListings={nearbyListings}
          />

          {referenceLocation && (
            <>
              <Circle
                center={[referenceLocation.lat, referenceLocation.lng]}
                radius={radiusInKm * 1000}
                pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.12 }}
              />
              <Marker position={[referenceLocation.lat, referenceLocation.lng]} icon={userLocationIcon}>
                <Popup>Tu zona de búsqueda</Popup>
              </Marker>
            </>
          )}

          {listings.map((listing) => {
            const distanceKm = getListingDistance(listing);
            const isNearby = nearbyListingIds.has(listing.id);

            return (
              <Marker
                key={listing.id}
                position={[listing.coordinates.lat, listing.coordinates.lng]}
                icon={createListingIcon(isNearby)}
              >
                <Popup>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-green-800">{listing.title}</h3>
                      <p className="text-sm text-gray-600">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-700">{listing.description}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p>Publica: {listing.userName}</p>
                      {distanceKm !== null && <p>Distancia: {formatDistance(distanceKm)}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => onListingSelect(listing)}
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Ver donación
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {referenceLocation && (
        <Card className="border-green-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-800">Donaciones cercanas</CardTitle>
          </CardHeader>
          <CardContent>
            {nearbyListings.length === 0 ? (
              <p className="text-sm text-gray-600">
                No hay publicaciones dentro del radio seleccionado. Prueba ampliando el radio o buscando otra zona.
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {nearbyListings.map((listing) => (
                  <button
                    key={listing.id}
                    type="button"
                    onClick={() => onListingSelect(listing)}
                    className="rounded-lg border border-green-100 p-4 text-left transition hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-green-800">{listing.title}</h3>
                      <Badge className="bg-green-600 text-white hover:bg-green-600">
                        {formatDistance(listing.distanceKm)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        {listing.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-green-600" />
                        Publicado por {listing.userName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapComponent;