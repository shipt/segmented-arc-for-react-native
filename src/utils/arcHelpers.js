export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

export const drawArc = (x, y, radius, startAngle, endAngle, range = false) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const midPoint = polarToCartesian(x, y, radius, (startAngle + endAngle) / 2);
  const end = polarToCartesian(x, y, radius, startAngle);

  const sweepFlag = range ? 1 : 0;

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    0,
    sweepFlag,
    midPoint.x,
    midPoint.y,
    'A',
    radius,
    radius,
    0,
    0,
    sweepFlag,
    end.x,
    end.y
  ].join(' ');
  return d;
};
