const Security = {
  sanitizeInput(t) {
    let e = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return t.replace(/[&<>"'/]/gi, (t) => e[t]);
  },
  validateSession() {
    let t = localStorage.getItem("sessionId");
    return t && /^[a-zA-Z0-9]{9}$/.test(t)
      ? t
      : Math.random().toString(36).substr(2, 9);
  },
  initRateLimit() {
    let t = {
      count: 0,
      lastReset: Date.now(),
      maxRequests: 10,
      timeWindow: 6e4,
    };
    return t;
  },
  checkRateLimit(t) {
    let e = Date.now();
    return (
      e - t.lastReset > t.timeWindow && ((t.count = 0), (t.lastReset = e)),
      !(t.count >= t.maxRequests) && (t.count++, !0)
    );
  },
};
