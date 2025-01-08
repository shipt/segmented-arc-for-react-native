const warnings = new Set();

const showWarningOnce = data => {
  const key = data instanceof Error ? data.message : String(data);

  if (!warnings.has(key)) {
    console.warn(data);
    warnings.add(key);
  }
};

const clearAllWarnings = () => {
  warnings.clear();
};

const showWarning = data => {
  console.warn(data);
};

export default {
  showWarning,
  showWarningOnce,
  clearAllWarnings
};
