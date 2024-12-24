const warnings = new Set();

const showWarningOnce = data => {
  const message = data instanceof Error ? data.message : String(data);
  if (!warnings.has(message)) {
    console.warn(data);
    warnings.add(message);
  }
};

const clearAllWarnings = () => {
  warnings.clear();
};

export default {
  showWarningOnce,
  clearAllWarnings
};
