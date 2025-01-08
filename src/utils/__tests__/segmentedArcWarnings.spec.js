import {
  createAllocatedScaleError,
  createInvalidScaleValueError,
  warnAboutInvalidSegmentsData
} from '../segmentedArcWarnings';
import WarningManager from '../warningManager';

describe('warnAboutInvalidSegmentsData', () => {
  const INVALID_SCALE_VALUES = [true, false, null, NaN, Infinity, -Infinity, 'string', '', {}, []];

  beforeEach(() => {
    jest.spyOn(WarningManager, 'showWarning').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid Segments', () => {
    it('does not show warning for segments between 0 and 1 inclusive', () => {
      warnAboutInvalidSegmentsData([{ arcDegreeScale: 0 }, { scale: 0 }]);
      expect(WarningManager.showWarning).not.toHaveBeenCalled();

      warnAboutInvalidSegmentsData([{ arcDegreeScale: 0.99999 }, { scale: 0.99999 }]);
      expect(WarningManager.showWarning).not.toHaveBeenCalled();

      warnAboutInvalidSegmentsData([{ arcDegreeScale: 1.00001 }, { scale: 1.00001 }]);
      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });

    it('does not show warning when total scale sum and total arcDegreeScale sum is between 0 and 1 inclusive', () => {
      const segments = [
        { scale: 0.50001, arcDegreeScale: 0.50001 },
        { scale: 0.5, arcDegreeScale: 0.5 }
      ];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });

    it('does not show warning for empty segments', () => {
      const segments = [];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });

    it('does not show warning for undefined segments', () => {
      const segments = undefined;

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Scale Values', () => {
    it('shows multiple warnings for invalid scale and allocated scale not between 0 and 1 inclusive', () => {
      const segments = [{ scale: 20 }, { scale: -10 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).toHaveBeenCalledTimes(3);
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createInvalidScaleValueError('scale', 20));
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createInvalidScaleValueError('scale', -10));
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createAllocatedScaleError('scale', 20 + -10));
    });

    it('does not show warning for scale with value 0 or undefined', () => {
      const segments = [{ scale: 0 }, { scale: undefined }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });

    describe('when the scale is an invalid number', () => {
      INVALID_SCALE_VALUES.forEach(invalidValue => {
        describe(`with the value: "${invalidValue}"`, () => {
          it('shows a warning about invalid scale', () => {
            const segments = [{ scale: invalidValue }];

            warnAboutInvalidSegmentsData(segments);

            expect(WarningManager.showWarning).toHaveBeenCalledWith(
              createInvalidScaleValueError('scale', invalidValue)
            );
          });
        });
      });
    });
  });

  describe('Invalid arcDegreeScale Values', () => {
    it('shows multiple warnings for invalid arcDegreeScale and allocated arcDegreeScale not between 0 and 1 inclusive', () => {
      const segments = [{ arcDegreeScale: 20 }, { arcDegreeScale: -10 }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).toHaveBeenCalledTimes(3);
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', 20));
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createInvalidScaleValueError('arcDegreeScale', -10));
      expect(WarningManager.showWarning).toHaveBeenCalledWith(createAllocatedScaleError('arcDegreeScale', 20 + -10));
    });

    it('does not warning for arcDegreeScale with value 0 or undefined', () => {
      const segments = [{ arcDegreeScale: 0 }, { arcDegreeScale: undefined }];

      warnAboutInvalidSegmentsData(segments);

      expect(WarningManager.showWarning).not.toHaveBeenCalled();
    });

    describe('when the arcDegreeScale is an invalid number', () => {
      INVALID_SCALE_VALUES.forEach(invalidValue => {
        describe(`with the value: "${invalidValue}"`, () => {
          it('shows a warning about invalid arcDegreeScale', () => {
            const segments = [{ arcDegreeScale: invalidValue }];

            warnAboutInvalidSegmentsData(segments);

            expect(WarningManager.showWarning).toHaveBeenCalledWith(
              createInvalidScaleValueError('arcDegreeScale', invalidValue)
            );
          });
        });
      });
    });
  });
});
