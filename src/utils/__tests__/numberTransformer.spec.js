import { parseNumberSafe } from '../numberTransformer';
import { SegmentedArcError } from '../segmentedArcErrors';
import WarningManager from '../warningManager';

describe('parseNumberSafe', () => {
  beforeEach(() => {
    jest.spyOn(WarningManager, 'showWarningOnce').mockImplementation();
  });

  afterEach(() => {
    WarningManager.clearAllWarnings();
    jest.clearAllMocks();
  });

  it('returns the parsed number when input is already a number', () => {
    expect(parseNumberSafe(0)).toBe(0);
    expect(parseNumberSafe(123.45)).toBe(123.45);
    expect(parseNumberSafe(0.45)).toBe(0.45);
    expect(parseNumberSafe(-99.99)).toBe(-99.99);
    expect(parseNumberSafe(1e3)).toBe(1_000);
    expect(parseNumberSafe(Infinity)).toBe(Infinity);
    expect(parseNumberSafe(-Infinity)).toBe(-Infinity);
    expect(parseNumberSafe(1.5)).toBe(1.5);
  });

  it('returns the parsed number when input is a valid parsable numeric string ', () => {
    expect(parseNumberSafe('0')).toBe(0);
    expect(parseNumberSafe('123.45')).toBe(123.45);
    expect(parseNumberSafe('.45')).toBe(0.45);
    expect(parseNumberSafe('-99.99')).toBe(-99.99);
    expect(parseNumberSafe('1e3')).toBe(1_000);
    expect(parseNumberSafe('Infinity')).toBe(Infinity);
    expect(parseNumberSafe('-Infinity')).toBe(-Infinity);
    expect(parseNumberSafe('   1.5  ')).toBe(1.5);
    expect(parseNumberSafe('123abc')).toBe(123);
    expect(parseNumberSafe('1,500.9')).toBe(1);
    expect(parseNumberSafe(' 1a1 ')).toBe(1);
  });

  it('returns the default value when input is an invalid numeric string', () => {
    expect(parseNumberSafe('NaN')).toBe(0);
    expect(parseNumberSafe('$123')).toBe(0);
    expect(parseNumberSafe(' ')).toBe(0);
  });

  it('allows to return a custom default value when input is invalid or empty', () => {
    expect(parseNumberSafe('', { defaultValue: '' })).toBe('');
    expect(parseNumberSafe('', { defaultValue: null })).toBe(null);
    expect(parseNumberSafe('', { defaultValue: 1000 })).toBe(1000);
    expect(parseNumberSafe('a1b2c', { defaultValue: '-' })).toBe('-');
  });

  it('parses unexpected inputs without error or returns default value', () => {
    expect(parseNumberSafe(NaN)).toBe(0);
    expect(parseNumberSafe([1, 2])).toBe(1);
    expect(parseNumberSafe(0 / 0)).toBe(0);
    expect(parseNumberSafe(1 / 0)).toBe(Infinity);
    expect(parseNumberSafe({})).toBe(0);
    expect(parseNumberSafe(true)).toBe(0);
    expect(parseNumberSafe(false)).toBe(0);
    expect(parseNumberSafe(null)).toBe(0);
    expect(parseNumberSafe(undefined)).toBe(0);
    expect(parseNumberSafe()).toBe(0);
  });

  it('does not log warning in production', () => {
    const currentGlobalDev = global.__DEV__;
    global.__DEV__ = false;

    parseNumberSafe(undefined);
    expect(WarningManager.showWarningOnce).not.toHaveBeenCalled();
    global.__DEV__ = currentGlobalDev;
  });

  it('logs a warning in development mode if the parsed value is NaN (WITH property name and WITH custom defaultValue)', () => {
    parseNumberSafe(undefined, { propertyName: 'any property name', defaultValue: 1000 });
    expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(1);
    expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(
      new SegmentedArcError(
        `The value 'undefined' is not a number and has been set to the default value of 1000 for the props "any property name".\nPlease change to a valid numeric value.`
      )
    );
  });

  it('logs a warning in development mode if the parsed value is NaN (WITHOUT property name and WITHOUT custom default value)', () => {
    parseNumberSafe(undefined);
    expect(WarningManager.showWarningOnce).toHaveBeenCalledTimes(1);
    expect(WarningManager.showWarningOnce).toHaveBeenCalledWith(
      new SegmentedArcError(
        `The value 'undefined' is not a number and has been set to the default value of 0.\nPlease change to a valid numeric value.`
      )
    );
  });
});
