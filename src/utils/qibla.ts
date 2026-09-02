// Qibla direction & distance calculation

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export function calculateQiblaBearing(lat: number, lng: number): number {
  const phiK = (KAABA_LAT * Math.PI) / 180.0;
  const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
  const phi = (lat * Math.PI) / 180.0;
  const lambda = (lng * Math.PI) / 180.0;

  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

  return (psi + 360.0) % 360.0;
}

export function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLon = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function getBearingNameAr(bearing: number): string {
  const directions = [
    { name: 'شمال', min: 337.5, max: 360 },
    { name: 'شمال', min: 0, max: 22.5 },
    { name: 'شمال شرق', min: 22.5, max: 67.5 },
    { name: 'شرق', min: 67.5, max: 112.5 },
    { name: 'جنوب شرق', min: 112.5, max: 157.5 },
    { name: 'جنوب', min: 157.5, max: 202.5 },
    { name: 'جنوب غرب', min: 202.5, max: 247.5 },
    { name: 'غرب', min: 247.5, max: 292.5 },
    { name: 'شمال غرب', min: 292.5, max: 337.5 },
  ];

  for (const dir of directions) {
    if (bearing >= dir.min && bearing < dir.max) {
      return dir.name;
    }
  }
  return 'شمال';
}
