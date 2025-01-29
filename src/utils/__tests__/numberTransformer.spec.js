import { parseNumberProps, parseNumberSafe } from '../numberTransformer';
import { SegmentedArcError } from '../segmentedArcErrors';
import WarningManager from '../warningManager';

describe('parseNumberSafe', () => {
  beforeEach(() => {
    jest.spyOn(WarningManager, 'showWarning').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns isInvalid as true when input is an invalid number', () => {
    expect(parseNumberSafe(NaN).isInvalid).toBe(true);
  });

  it('returns isInvalid as false when input is a valid number', () => {
    expect(parseNumberSafe(123).isInvalid).toBe(false);
  });

  it('returns the parsed number when input is already a number', () => {
    expect(parseNumberSafe(0).value).toBe(0);
    expect(parseNumberSafe(123.45).value).toBe(123.45);
    expect(parseNumberSafe(0.45).value).toBe(0.45);
    expect(parseNumberSafe(-99.99).value).toBe(-99.99);
    expect(parseNumberSafe(1e3).value).toBe(1_000);
    expect(parseNumberSafe(Infinity).value).toBe(Infinity);
    expect(parseNumberSafe(-Infinity).value).toBe(-Infinity);
    expect(parseNumberSafe(1.5).value).toBe(1.5);
  });

  it('returns the parsed number when input is a valid parsable numeric string ', () => {
    expect(parseNumberSafe('0').value).toBe(0);
    expect(parseNumberSafe('123.45').value).toBe(123.45);
    expect(parseNumberSafe('.45').value).toBe(0.45);
    expect(parseNumberSafe('-99.99').value).toBe(-99.99);
    expect(parseNumberSafe('1e3').value).toBe(1_000);
    expect(parseNumberSafe('Infinity').value).toBe(Infinity);
    expect(parseNumberSafe('-Infinity').value).toBe(-Infinity);
    expect(parseNumberSafe('   1.5  ').value).toBe(1.5);
    expect(parseNumberSafe('123abc').value).toBe(123);
    expect(parseNumberSafe('1,500.9').value).toBe(1);
    expect(parseNumberSafe(' 1a1 ').value).toBe(1);
  });

  it('returns the default value when input is an invalid numeric string', () => {
    expect(parseNumberSafe('NaN').value).toBe(0);
    expect(parseNumberSafe('$123').value).toBe(0);
    expect(parseNumberSafe(' ').value).toBe(0);
  });

  it('allows to return a custom default value when input is invalid or empty', () => {
    expect(parseNumberSafe('', '').value).toBe('');
    expect(parseNumberSafe('', null).value).toBe(null);
    expect(parseNumberSafe('', 1000).value).toBe(1000);
    expect(parseNumberSafe('a1b2c', '-').value).toBe('-');
  });

  it('parses unexpected inputs without error or returns default value', () => {
    expect(parseNumberSafe(NaN).value).toBe(0);
    expect(parseNumberSafe([1, 2]).value).toBe(1);
    expect(parseNumberSafe(0 / 0).value).toBe(0);
    expect(parseNumberSafe(1 / 0).value).toBe(Infinity);
    expect(parseNumberSafe({}).value).toBe(0);
    expect(parseNumberSafe(true).value).toBe(0);
    expect(parseNumberSafe(false).value).toBe(0);
    expect(parseNumberSafe(null).value).toBe(0);
    expect(parseNumberSafe(undefined).value).toBe(0);
    expect(parseNumberSafe().value).toBe(0);
  });

  describe('parseNumberProps', () => {
    it('does not log warning in production', () => {
      const currentGlobalDev = global.__DEV__;
      global.__DEV__ = false;

      parseNumberProps(undefined);
      expect(WarningManager.showWarning).not.toHaveBeenCalled();
      global.__DEV__ = currentGlobalDev;
    });

    it('logs a warning in development mode if the parsed value is NaN (WITH property name and WITH custom defaultValue)', () => {
      parseNumberProps(undefined, 'any property name', 1000);
      expect(WarningManager.showWarning).toHaveBeenCalledTimes(1);
      expect(WarningManager.showWarning).toHaveBeenCalledWith(
        new SegmentedArcError(
          `The value 'undefined' is not a valid number and has been set to the default value of 1000 for the props "any property name".\nPlease change to a valid numeric value.`
        )
      );
    });

    it('logs a warning in development mode if the parsed value is NaN (WITHOUT property name and WITHOUT custom default value)', () => {
      parseNumberProps(undefined);
      expect(WarningManager.showWarning).toHaveBeenCalledTimes(1);
      expect(WarningManager.showWarning).toHaveBeenCalledWith(
        new SegmentedArcError(
          `The value 'undefined' is not a valid number and has been set to the default value of 0.\nPlease change to a valid numeric value.`
        )
      );
    });

    it('returns the originalValue equal to the input value', () => {
      expect(parseNumberProps(123).originalValue).toBe(123);
    });
  });
});
