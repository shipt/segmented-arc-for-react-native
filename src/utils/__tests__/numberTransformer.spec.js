import { parseNumberProps, parseFiniteNumberOrDefault } from '../numberTransformer';
import { SegmentedArcError } from '../segmentedArcErrors';
import WarningManager from '../warningManager';

describe('parseFiniteNumberOrDefault', () => {
  beforeEach(() => {
    jest.spyOn(WarningManager, 'showWarning').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns isInvalid as true when input is an invalid number', () => {
    expect(parseFiniteNumberOrDefault(NaN).isInvalid).toBe(true);
  });

  it('returns isInvalid as false when input is a valid number', () => {
    expect(parseFiniteNumberOrDefault(123.45).isInvalid).toBe(false);
  });

  it('returns the parsed number when input is already a number', () => {
    expect(parseFiniteNumberOrDefault(0).value).toBe(0);
    expect(parseFiniteNumberOrDefault(123.45).value).toBe(123.45);
    expect(parseFiniteNumberOrDefault(0.45).value).toBe(0.45);
    expect(parseFiniteNumberOrDefault(-99.99).value).toBe(-99.99);
    expect(parseFiniteNumberOrDefault(1e3).value).toBe(1_000);
    expect(parseFiniteNumberOrDefault(1.5).value).toBe(1.5);
  });

  it('returns the parsed number when input is a valid parsable numeric string ', () => {
    expect(parseFiniteNumberOrDefault('0').value).toBe(0);
    expect(parseFiniteNumberOrDefault('123.45').value).toBe(123.45);
    expect(parseFiniteNumberOrDefault('.45').value).toBe(0.45);
    expect(parseFiniteNumberOrDefault('-99.99').value).toBe(-99.99);
    expect(parseFiniteNumberOrDefault('1e3').value).toBe(1_000);
    expect(parseFiniteNumberOrDefault('   1.5  ').value).toBe(1.5);
    expect(parseFiniteNumberOrDefault('123abc').value).toBe(123);
    expect(parseFiniteNumberOrDefault('1,500.9').value).toBe(1);
    expect(parseFiniteNumberOrDefault(' 1a1 ').value).toBe(1);
  });

  it('returns the default value when input is an invalid numeric string', () => {
    expect(parseFiniteNumberOrDefault('NaN').value).toBe(0);
    expect(parseFiniteNumberOrDefault('$123').value).toBe(0);
    expect(parseFiniteNumberOrDefault(' ').value).toBe(0);
  });

  it('allows to return a custom default value when input is invalid or empty', () => {
    expect(parseFiniteNumberOrDefault('', '').value).toBe('');
    expect(parseFiniteNumberOrDefault('', null).value).toBe(null);
    expect(parseFiniteNumberOrDefault('', 1000).value).toBe(1000);
    expect(parseFiniteNumberOrDefault('a1b2c', '-').value).toBe('-');
  });

  it('parses unexpected inputs without error or returns default value', () => {
    expect(parseFiniteNumberOrDefault(NaN).value).toBe(0);
    expect(parseFiniteNumberOrDefault(Infinity).value).toBe(0);
    expect(parseFiniteNumberOrDefault(-Infinity).value).toBe(0);
    expect(parseFiniteNumberOrDefault([1, 2]).value).toBe(1);
    expect(parseFiniteNumberOrDefault(0 / 0).value).toBe(0);
    expect(parseFiniteNumberOrDefault(1 / 0).value).toBe(0);
    expect(parseFiniteNumberOrDefault({}).value).toBe(0);
    expect(parseFiniteNumberOrDefault(true).value).toBe(0);
    expect(parseFiniteNumberOrDefault(false).value).toBe(0);
    expect(parseFiniteNumberOrDefault(null).value).toBe(0);
    expect(parseFiniteNumberOrDefault(undefined).value).toBe(0);
    expect(parseFiniteNumberOrDefault().value).toBe(0);
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
