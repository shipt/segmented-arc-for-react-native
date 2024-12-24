import { ensureDefaultSegmentScale } from '../scale';

describe('ensureDefaultSegmentScale function', () => {
  it('returns an empty array when no segments are provided', () => {
    const segmentsResult = ensureDefaultSegmentScale([]);
    expect(segmentsResult).toEqual([]);
  });

  it('replaces 0/NaN/undefined/null scales with the default scale', () => {
    const segmentsResult = ensureDefaultSegmentScale([
      { scale: NaN },
      { scale: null },
      { scale: undefined },
      { scale: 0 },
      { scale: 0.3 }
    ]);
    expect(segmentsResult).toEqual([
      { scale: 0.175 },
      { scale: 0.175 },
      { scale: 0.175 },
      { scale: 0.175 },
      { scale: 0.3 }
    ]);
  });

  it('does not modify segments that already have scale defined, even if the sum is not 1', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: 0.3 }, { scale: 0.5 }]);
    expect(segmentsResult).toEqual([{ scale: 0.3 }, { scale: 0.5 }]);
  });

  it('distributes scale among to the single segment without a scale', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: 0.3 }, {}]);
    expect(segmentsResult).toEqual([{ scale: 0.3 }, { scale: 0.7 }]);
  });

  it('distributes scale evenly among multiple segments without a scale', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: 0.3 }, {}, {}]);
    expect(segmentsResult).toEqual([{ scale: 0.3 }, { scale: 0.35 }, { scale: 0.35 }]);
  });

  it('does not not change the scale when the total allocated scale is already 1, but set any missing one to 0', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: 1 }, {}]);
    expect(segmentsResult).toEqual([{ scale: 1 }, { scale: 0 }]);
  });

  it('sets a default scale for missing value and having a negative scale', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: -0.6 }, {}]);
    expect(segmentsResult).toEqual([{ scale: -0.6 }, { scale: 1.6 }]);
  });

  it('sets a default scale for missing value and total allocated scale bigger than 1', () => {
    const segmentsResult = ensureDefaultSegmentScale([{ scale: 1 }, { scale: 2 }, {}]);
    expect(segmentsResult).toEqual([{ scale: 1 }, { scale: 2 }, { scale: -2 }]);
  });
});
