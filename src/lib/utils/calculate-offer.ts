export function calculateOffer({ distance, duration }: { distance: number; duration: number }) {
  let recommendedOffer = 10;
  const basePrice = 10;
  const pricePerMinute = 0.5;
  const pricePerKilometer = 1.5;
  if (distance > 0 && duration > 0) {
    const durationMin = duration / 60;
    const distanceKm = distance / 1000;
    recommendedOffer = basePrice + pricePerMinute * durationMin + pricePerKilometer * distanceKm;
  }
  return Math.round(recommendedOffer);
}
