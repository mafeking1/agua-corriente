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

  // Botón flotante: halo suave permanente y burbuja de texto que aparece solo al pasar el puntero.
  // (Todo vive acá para que los tres sitios se vean exactamente igual.)
  function flotante() {
    var botones = document.querySelectorAll(".wa-float");
    if (!botones.length) return;
    var css = document.createElement("style");
    css.textContent =
      ".wa-float{overflow:visible}" +
      ".wa-float::before{content:'';position:absolute;inset:-9px;border-radius:50%;background:#178043;opacity:.22;z-index:-1;animation:wa-halo 2.4s ease-out infinite}" +
      "@keyframes wa-halo{0%{transform:scale(.8);opacity:.35}100%{transform:scale(1.25);opacity:0}}" +
      ".wa-float-tip{position:absolute;right:calc(100% + 14px);top:50%;transform:translate(8px,-50%);background:#fff;color:#132226;" +
      "border-radius:14px;padding:12px 18px;box-shadow:0 6px 24px rgba(0,0,0,.18);white-space:nowrap;text-align:left;line-height:1.25;" +
      "opacity:0;visibility:hidden;pointer-events:none;transition:opacity .18s ease,transform .18s ease,visibility .18s}" +
      ".wa-float-tip span{display:block;font-size:15px;font-weight:400}" +
      ".wa-float-tip strong{display:block;font-size:17px;font-weight:700}" +
      "@media (hover:hover) and (pointer:fine){.wa-float:hover .wa-float-tip,.wa-float:focus-visible .wa-float-tip{opacity:1;visibility:visible;transform:translate(0,-50%)}}" +
      "@media (prefers-reduced-motion:reduce){.wa-float::before{animation:none;opacity:.18}.wa-float-tip{transition:none}}";
    document.head.appendChild(css);
    for (var i = 0; i < botones.length; i++) {
      var tip = document.createElement("span");
      tip.className = "wa-float-tip";
      tip.setAttribute("aria-hidden", "true");
      tip.innerHTML = "<span>¿Necesitás ayuda?</span><strong>Chateá con nosotros</strong>";
      botones[i].appendChild(tip);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", flotante);
  else flotante();

  // Para botones que abren WhatsApp por script (por ejemplo, un formulario).
  window.torcuaWA = {
    abrir: function (url, loc) {
      var cod = codigo();
      registrar(cod, loc || "formulario", "");
      window.open(decorar(url, cod), "_blank");
    }
  };
})();
