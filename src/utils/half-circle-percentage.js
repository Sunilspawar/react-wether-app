const TRIANGLE_ANGLES_SUM = 180;

export const toRadians = (angle) => {
  return angle * (Math.PI / TRIANGLE_ANGLES_SUM);
};

export const getXYCoordinatesOfOrb = (radius, percentage) => {
  const r = radius;
  const alpha = TRIANGLE_ANGLES_SUM * percentage;
  const beta = (TRIANGLE_ANGLES_SUM - alpha) / 2;
  const tgBeta = Math.tan(toRadians(beta));
  const x = (2 * r) / (Math.pow(tgBeta, 2) + 1);
  const y = tgBeta * x;
  return { x, y };
};
