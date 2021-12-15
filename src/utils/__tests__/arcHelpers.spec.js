import { polarToCartesian, drawArc } from '../arcHelpers';

describe('arc helpers', () => {
  it('converts polar coordinates to cartesian coordinates', () => {
    expect(polarToCartesian(100, 100, 100, 90)).toEqual({ x: 100, y: 0 });
  });

  it('returns d path for an arc', () => {
    expect(drawArc(152, 152, 104, 136.5, 158)).toEqual(
      'M 248.4271208749459 113.04091428474516 A 104 104 0 0 0 227.43893458527793 80.41112412784959'
    );
  });

  it('returns d path for an arc - opposite angle needed for ratings range display', () => {
    expect(drawArc(152, 152, 104, 136.5, 158, true)).toEqual(
      'M 248.4271208749459 113.04091428474516 A 104 104 0 0 1 227.43893458527793 80.41112412784959'
    );
  });
});
