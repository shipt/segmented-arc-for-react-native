import { ensureDefaultSegmentArcDegreeScale, ensureDefaultSegmentScale } from '../scale';

describe('ensureDefaultSegmentScale', () => {
  it('returns an empty array when no segments are provided', () => {
    const segmentsResult = ensureDefaultSegmentScale([]);
    expect(segmentsResult).toEqual([]);
  });

  it('distributes scale evenly for invalid scale values', () => {
    const validSegments = [{ scale: 0.2 }];
    const invalidSegments = [
      { scale: 0 },
      { scale: '0.3' },
      { scale: null },
      { scale: Infinity },
      { scale: -Infinity },
      { scale: undefined },
      { scale: NaN }
    ];
    const segments = [...validSegments, ...invalidSegments];

    const segmentsResult = ensureDefaultSegmentScale(segments);

    const defaultScale = (1 - validSegments.reduce((total, item) => total + item.scale, 0)) / invalidSegments.length;
    expect(segmentsResult).toEqual([
      ...validSegments,
      ...Array(invalidSegments.length).fill({
        scale: defaultScale
      })
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

describe('ensureDefaultSegmentArcDegreeScale ', () => {
  it('should handle the case when there are no segments', () => {
    const segments = [];
    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);
    expect(segmentsResult).toEqual([]);
  });

  it('does not modify the segments if all have valid arcDegreeScale values', () => {
    const segments = [{ arcDegreeScale: 0.4 }, { arcDegreeScale: 0.3 }, { arcDegreeScale: 0.3 }];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    expect(segmentsResult[0].arcDegreeScale).toBe(0.4);
    expect(segmentsResult[1].arcDegreeScale).toBe(0.3);
    expect(segmentsResult[2].arcDegreeScale).toBe(0.3);
  });

  it('handles the case where all segments are missing arcDegreeScale', () => {
    const segments = [{ arcDegreeScale: 0.4 }, { arcDegreeScale: undefined }, { arcDegreeScale: undefined }];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    expect(segmentsResult[0].arcDegreeScale).toBeCloseTo(0.4);
    expect(segmentsResult[1].arcDegreeScale).toBeCloseTo(0.6 / 2);
    expect(segmentsResult[2].arcDegreeScale).toBeCloseTo(0.6 / 2);
  });

  it('handles the case where the total arcDegreeScale exceeds 1', () => {
    const segments = [{ arcDegreeScale: 0.6 }, { arcDegreeScale: 0.5 }, { arcDegreeScale: undefined }];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    // The sum of arcDegreeScale is 1.1, so it will assign a negative value to the undefined segment
    expect(segmentsResult[2].arcDegreeScale).toBeCloseTo(-0.1);
  });

  it('sets 0 to invalid arcDegreeScale if total of provided arcDegreeScale exceeds 1', () => {
    const segments = [{ arcDegreeScale: 1 }, { arcDegreeScale: NaN }];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    expect(segmentsResult).toEqual([{ arcDegreeScale: 1 }, { arcDegreeScale: 0 }]);
  });

  it('sets distributes equally if all arcDegreeScale are invalid ', () => {
    const segments = [{ arcDegreeScale: NaN }, { arcDegreeScale: NaN }];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    expect(segmentsResult).toEqual([{ arcDegreeScale: 1 / 2 }, { arcDegreeScale: 1 / 2 }]);
  });

  it('distributes arcDegreeScale evenly for invalid arcDegreeScale values', () => {
    const validSegments = [{ arcDegreeScale: 0 }];
    const invalidSegments = [
      { arcDegreeScale: null },
      { arcDegreeScale: '0.3' },
      { arcDegreeScale: Infinity },
      { arcDegreeScale: -Infinity },
      { arcDegreeScale: undefined },
      { arcDegreeScale: NaN }
    ];
    const segments = [...validSegments, ...invalidSegments];

    const segmentsResult = ensureDefaultSegmentArcDegreeScale(segments);

    const defaultArcDegreeScale = 1 / invalidSegments.length;
    expect(segmentsResult).toEqual([
      ...validSegments,
      ...Array(invalidSegments.length).fill({
        arcDegreeScale: defaultArcDegreeScale
      })
    ]);
  });
});
