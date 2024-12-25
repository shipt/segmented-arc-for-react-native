const warnings = new Set();

const showWarningOnce = (data, warnId = '') => {
  const message = data instanceof Error ? data.message : String(data);
  const key = message + warnId;

  if (!warnings.has(key)) {
    console.warn(data);
    warnings.add(key);
  }
};

const clearAllWarnings = () => {
  warnings.clear();
};

export default {
  showWarningOnce,
  clearAllWarnings
};
