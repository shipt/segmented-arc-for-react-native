import WarningManager from '../warningManager';

describe('WarningManager', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    WarningManager.clearAllWarnings();
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

  describe('showWarningOnce', () => {
    it('shows a warning once for the same error message', () => {
      const error1 = new Error('same message');
      const error2 = new Error('same message');

      WarningManager.showWarningOnce(error1);
      WarningManager.showWarningOnce(error2);

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(error1);
    });

    it('shows warning more than once if the error message are different', () => {
      const error1 = new Error('message 1');
      const error2 = new Error('message 2');

      WarningManager.showWarningOnce(error1);
      WarningManager.showWarningOnce(error2);

      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenCalledWith(error1);
      expect(console.warn).toHaveBeenCalledWith(error2);
    });

    it('shows multiple warnings for different messages', () => {
      const message1 = 'First warning message';
      const message2 = 'Second warning message';

      WarningManager.showWarningOnce(message1);
      WarningManager.showWarningOnce(message2);

      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(console.warn).toHaveBeenCalledWith(message1);
      expect(console.warn).toHaveBeenCalledWith(message2);
    });

    it('allows showing a warning again after clearing warnings', () => {
      const message1 = 'First warning message';
      const message2 = 'Second warning message';

      WarningManager.showWarningOnce(message1);
      WarningManager.showWarningOnce(message2);

      WarningManager.clearAllWarnings();

      WarningManager.showWarningOnce(message1);

      expect(console.warn).toHaveBeenCalledTimes(3);
      expect(console.warn).toHaveBeenCalledWith(message1);
    });
  });
});
