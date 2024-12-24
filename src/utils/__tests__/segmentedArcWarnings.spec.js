import {
  createAllocatedScaleError,
  createInvalidScaleValueError,
  warnAboutInvalidSegmentsData
} from '../segmentedArcWarnings';
import WarningManager from '../warningManager';

describe('warnAboutInvalidSegmentsData', () => {
  beforeEach(() => {
    jest.spyOn(WarningManager, 'showWarningOnce').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid Segments', () => {
    it('should not show any warning for valid segments', () => {
      const segments = [{ arcDegreeScale: 0.5 }, { scale: 0.5 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).not.toHaveBeenCalled();
    });

    it('should not show warning when total scale sum is between 0 and 1 inclusive', () => {
      const segments = [
        { scale: 0.4, arcDegreeScale: 0.5 },
        { scale: 0.5, arcDegreeScale: 0.5 }
      ];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).not.toHaveBeenCalled();
    });

    it('should handle empty segments array without warnings', () => {
      const segments = [];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).not.toHaveBeenCalled();
    });

    it('should handle undefined segments without warnings', () => {
      const segments = undefined;

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Scale Values', () => {
    it('should show warning for scale values not between 0 and 1 inclusive', () => {
      const segments = [{ scale: -0.5 }, { scale: 1.1 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(2);
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('scale', -0.5));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('scale', 1.1));
    });

    it('should show warning for NaN scale values', () => {
      const segments = [{ scale: NaN }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('scale', NaN));
    });

    it('should show multiple warnings for invalid scale and allocated scale not between 0 and 1 inclusive', () => {
      const segments = [{ scale: 20 }, { scale: -10 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(3);
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('scale', 20));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('scale', -10));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createAllocatedScaleError('scale', 20 + -10));
    });
  });

  describe('Invalid arcDegreeScale Values', () => {
    it('should show warning for scale values not between 0 and 1 inclusive', () => {
      const segments = [{ arcDegreeScale: -0.5 }, { arcDegreeScale: 1.1 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(2);
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', -0.5));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', 1.1));
    });

    it('should show warning for NaN arcDegreeScale values', () => {
      const segments = [{ arcDegreeScale: NaN }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', NaN));
    });

    it('should show multiple warnings for invalid arcDegreeScale and allocated arcDegreeScale not between 0 and 1 inclusive', () => {
      const segments = [{ arcDegreeScale: 20 }, { arcDegreeScale: -10 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(3);
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', 20));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', -10));
      expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(
        createAllocatedScaleError('arcDegreeScale', 20 + -10)
      );
    });
  });
});
