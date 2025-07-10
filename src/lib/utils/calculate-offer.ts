export function calculateOffer({ distance, duration }: { distance: number; duration: number }) {
  let recommendedOffer = 10;
  const basePrice = 10;
  const pricePerMinute = 0.5;
  const pricePerKilometer = 1.5;
  if (distance > 0 && duration > 0) {
    recommendedOffer = basePrice + pricePerMinute * duration + pricePerKilometer * distance;
  }
  return Math.round(recommendedOffer);
}
