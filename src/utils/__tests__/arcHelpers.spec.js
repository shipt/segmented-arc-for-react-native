import { polarToCartesian, drawArc } from '../arcHelpers';

describe('arc helpers', () => {
  it('converts polar coordinates to cartesian coordinates', () => {
    expect(polarToCartesian(100, 100, 100, 90)).toEqual({ x: 100, y: 0 });
  });

  it('returns d path for an arc', () => {
    expect(drawArc(152, 152, 104, 136.5, 158)).toMatchSnapshot();
  });

  it('returns d path for an arc - opposite angle needed for ratings range display', () => {
    expect(drawArc(152, 152, 104, 136.5, 158, true)).toMatchSnapshot();
  });
});
