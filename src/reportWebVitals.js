// reportWebVitals.js
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
      onPerfEntry(getCLS);
      onPerfEntry(getFID);
      onPerfEntry(getLCP);
    });
  }
};

export default reportWebVitals;