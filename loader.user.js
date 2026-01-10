// ==UserScript==
// @name BC Responsive
// @namespace https://www.bondageprojects.com/
// @version 0.6.6
// @description An auto response script for Bondage Club
// @author Saki Saotome, dDeepLb
// @match https://bondageprojects.elementfx.com/*
// @match https://www.bondageprojects.elementfx.com/*
// @match https://bondage-europe.com/*
// @match https://www.bondage-europe.com/*
// @match https://bondageprojects.com/*
// @match https://www.bondageprojects.com/*
// @match http://localhost:*/*
// @match http://127.0.0.1:*/*
// @icon  https://user-images.githubusercontent.com/71733861/254577970-83fb14ab-79af-46b4-9490-ea8c85dc4097.png

// @grant none
// @run-at document-end
// ==/UserScript==

(function () {
  'use strict';
  const ending = 'main.js';
  const prodPath = 'https://protokink.github.io/Responsive/';
  const devPath = `${prodPath}dev/`;
  const localPath = 'http://localhost:45000/';

  const isDev = window.location.search.toLowerCase().includes('rsp=dev');
  const isLocal = window.location.search.toLowerCase().includes('rsp=local');
  const isPublic = isDev || !isLocal;

  let modLink = prodPath;
  if (isDev) modLink = devPath;
  else if (isLocal) modLink = localPath;

  const script = document.createElement('script');
  script.type = 'module';
  script.setAttribute('crossorigin', 'anonymous');
  script.src = `${modLink}${ending}${isPublic ? '?' + Date.now() : ''}`;
  document.head.appendChild(script);
})();
