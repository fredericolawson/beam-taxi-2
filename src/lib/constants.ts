export const baseMapOptions = {
  mapTypeId: 'hybrid',
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.business',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.park',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.place_of_worship',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.school',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi.sports_complex',
      stylers: [{ visibility: 'off' }],
    },
  ],
};
