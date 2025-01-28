const checkWebsiteStatus = () => {
    // Check if the browser is online or offline
    const isOnline = navigator.onLine;
  
    // Get the current hostname
    const hostname = window.location.hostname;
  
    // Check if running locally
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  
    // Determine the status
    if (!isOnline) {
      return "Offline";
    } else if (isLocal) {
      return "Local";
    } else {
      return "Online";
    }
  };
  
  // Export the function for use in your React app
  export default checkWebsiteStatus;