/* Mockup guard: runs before the live site's scripts so nothing in this mockup can
   reach Station's real back end (lead forms, cart checkout, partner beacons,
   analytics). Every blocked call is logged to the console instead of sent. */
(function () {
  if (window.__stationMockupGuard) return
  window.__stationMockupGuard = true
  var BLOCK = /hstgr\.cloud|station\.solutions\/(api|webhook)|leadconnectorhq|stripe\.com\/v1/i
  var note = function (what, url) {
    console.info("[mockup] blocked " + what + " -> " + url)
  }
  var realFetch = window.fetch ? window.fetch.bind(window) : null
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || ""
    if (BLOCK.test(url)) {
      note("fetch", url)
      return Promise.resolve(new Response(JSON.stringify({ ok: false, mockup: true }), {
        status: 200, headers: { "Content-Type": "application/json" },
      }))
    }
    return realFetch ? realFetch(input, init) : Promise.reject(new Error("no fetch"))
  }
  if (navigator.sendBeacon) {
    var realBeacon = navigator.sendBeacon.bind(navigator)
    navigator.sendBeacon = function (url, data) {
      if (BLOCK.test(String(url))) { note("beacon", url); return true }
      return realBeacon(url, data)
    }
  }
  var realOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url) {
    if (BLOCK.test(String(url))) { note("xhr", url); arguments[1] = "data:application/json,{}" }
    return realOpen.apply(this, arguments)
  }
  // Forms: stop real submissions, let the page's own handlers run and show their states.
  document.addEventListener("submit", function (e) {
    var f = e.target
    if (f && f.tagName === "FORM") {
      e.preventDefault()
      note("form submit", f.getAttribute("action") || "(script handler)")
    }
  }, true)
})()
