import WarningManager from '../warningManager';

describe('WarningManager', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    WarningManager.clearAllWarnings();
    jest.clearAllMocks();
  });

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

  it('shows multiple warnings for same message with different id', () => {
    const message1 = 'same warning message';
    const message2 = 'same warning message';

    WarningManager.showWarningOnce(message1, 1);
    WarningManager.showWarningOnce(message2, 2);

    expect(console.warn).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledWith(message1);
    expect(console.warn).toHaveBeenCalledWith(message2);
  });

  it('shows multiple warnings for different messages with same id', () => {
    const message1 = 'First warning message';
    const message2 = 'Second warning message';

    WarningManager.showWarningOnce(message1, 1);
    WarningManager.showWarningOnce(message2, 1);

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
