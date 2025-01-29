import WarningManager from '../warningManager';

describe('WarningManager', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('showWarning', () => {
    it('shows warning for error message', () => {
      const error = new Error('error message');

      WarningManager.showWarning(error);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(error);
    });

    it('shows warning for message', () => {
      const message = 'message';

      WarningManager.showWarning(message);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(message);
    });
  });
});
