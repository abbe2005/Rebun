const getHostingInfo = () => {
    // Get the current hostname
    const hostname = window.location.hostname;
  
    // Check if running locally (React development server)
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "Your website is running locally on a React development server.";
    }
  
    // Check if hosted on Netlify
    if (hostname.includes("netlify.app")) {
      return "Your website is hosted on Netlify.";
    }
  
    // Check if hosted on Vercel
    if (hostname.includes("vercel.app")) {
      return "Your website is hosted on Vercel.";
    }
  
    // Check if hosted on GitHub Pages
    if (hostname.includes("github.io")) {
      return "Your website is hosted on GitHub Pages.";
    }
  
    // Check if hosted on Firebase
    if (hostname.includes("web.app") || hostname.includes("firebaseapp.com")) {
      return "Your website is hosted on Firebase.";
    }
  
    // Check if hosted on AWS (Amazon Web Services)
    if (hostname.includes("amazonaws.com")) {
      return "Your website is hosted on AWS.";
    }
  
    // Default case for unknown hosting
    return `Your website is hosted on an unknown platform. Hostname: ${hostname}`;
  };
  
  // Export the function for use in your React app
  export default getHostingInfo;