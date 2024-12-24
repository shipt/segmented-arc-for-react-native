export class SegmentedArcError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SegmentedArc';
  }
}
