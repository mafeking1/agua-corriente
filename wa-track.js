/*
 * Medición de clics en WhatsApp — sitios Torcua (mismo archivo en los tres).
 * Al hacer clic en cualquier enlace a wa.me:
 *   1. agrega al final del mensaje un código corto ("Ref. 7K2P"), distinto en cada clic;
 *   2. envía al dataLayer el evento "click_whatsapp" con el mismo código, el sitio,
 *      la ubicación del botón y la página.
 * Así se pueden cruzar los clics registrados contra los mensajes que llegan:
 * un código que está en GA4 pero nunca llegó por WhatsApp es un mensaje no enviado.
 */
(function () {
  "use strict";

  var SITIOS = {
    "agua-corriente.torcua.com.ar": "agua",
    "mecanica.torcua.com.ar": "mecanica",
    "mosquiteros.torcua.com.ar": "mosquiteros"
  };
  var sitio = SITIOS[location.hostname] || location.hostname;
  var ALFABETO = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin 0/O ni 1/I para evitar confusiones
  var REF_FINAL = /\s*Ref\. [A-Z0-9]{4}\s*$/;

  function codigo() {
    var s = "", n = 4, i, a;
    if (window.crypto && crypto.getRandomValues) {
      a = new Uint8Array(n); crypto.getRandomValues(a);
      for (i = 0; i < n; i++) s += ALFABETO.charAt(a[i] % ALFABETO.length);
    } else {
      for (i = 0; i < n; i++) s += ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length));
    }
    return s;
  }

  function ubicacion(el) {
    if (el.getAttribute("data-wa-loc")) return el.getAttribute("data-wa-loc");
    if (el.closest(".wa-float")) return "flotante";
    if (el.closest(".hero")) return "hero";
    if (el.closest("header, .top, nav")) return "encabezado";
    if (el.closest("footer")) return "pie";
    if (el.closest(".cotizador")) return "cotizador";
    if (el.closest(".pkg")) return "paquete";
    if (el.closest("form")) return "formulario";
    if (el.closest(".cta-box")) return "cierre";
    if (el.closest(".price-box")) return "precio";
    return "contenido";
  }

  function decorar(url, cod) {
    var i = url.indexOf("?text=");
    if (i < 0) return url;
    var texto = "";
    try { texto = decodeURIComponent(url.slice(i + 6).replace(/\+/g, " ")); } catch (e) { return url; }
    texto = texto.replace(REF_FINAL, "");
    return url.slice(0, i) + "?text=" + encodeURIComponent(texto + "\n\nRef. " + cod);
  }

  function registrar(cod, loc, etiqueta) {
    (window.dataLayer = window.dataLayer || []).push({
      event: "click_whatsapp",
      wa_sitio: sitio,
      wa_ubicacion: loc,
      wa_codigo: cod,
      wa_pagina: location.pathname,
      wa_texto: (etiqueta || "").replace(/\s+/g, " ").trim().slice(0, 60)
    });
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (!a || a.classList.contains("apagado")) return;
    var cod = codigo();
    a.href = decorar(a.href, cod);
    registrar(cod, ubicacion(a), a.getAttribute("aria-label") || a.textContent);
  }, true);

  // Para botones que abren WhatsApp por script (por ejemplo, un formulario).
  window.torcuaWA = {
    abrir: function (url, loc) {
      var cod = codigo();
      registrar(cod, loc || "formulario", "");
      window.open(decorar(url, cod), "_blank");
    }
  };
})();
