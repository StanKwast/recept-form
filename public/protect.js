(function () {
  // If no auth cookie and not already on login page, redirect to login.html
  if (!document.cookie.includes("auth=1") && !location.pathname.endsWith("/login.html")) {
    location.href = "/login.html";
  }
})();
