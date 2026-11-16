"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // <define:BUNDLED_PUBLIC_ASSET_MAP>
  var define_BUNDLED_PUBLIC_ASSET_MAP_default = {};

  // <define:MOD_INFO>
  var define_MOD_INFO_default = { name: "Responsive", fullName: "BC Responsive", repository: "https://github.com/ProtoKink/Responsive" };

  // node_modules/.pnpm/bc-deeplib@6.0.0_sass-embedded@1.93.3/node_modules/bc-deeplib/dist/deeplib.js
  var ye = Object.create;
  var J = Object.defineProperty;
  var Ge = Object.getOwnPropertyDescriptor;
  var Ce = Object.getOwnPropertyNames;
  var Be = Object.getPrototypeOf;
  var we = Object.prototype.hasOwnProperty;
  var r = /* @__PURE__ */ __name((t8, e) => J(t8, "name", { value: e, configurable: true }), "r");
  var Te = /* @__PURE__ */ __name((t8, e) => () => (e || t8((e = { exports: {} }).exports, e), e.exports), "Te");
  var Le = /* @__PURE__ */ __name((t8, e, n, i) => {
    if (e && typeof e == "object" || typeof e == "function") for (let o of Ce(e)) !we.call(t8, o) && o !== n && J(t8, o, { get: /* @__PURE__ */ __name(() => e[o], "get"), enumerable: !(i = Ge(e, o)) || i.enumerable });
    return t8;
  }, "Le");
  var oe = /* @__PURE__ */ __name((t8, e, n) => (n = t8 != null ? ye(Be(t8)) : {}, Le(e || !t8 || !t8.__esModule ? J(n, "default", { value: t8, enumerable: true }) : n, t8)), "oe");
  var $ = Te((de, U) => {
    (function(t8) {
      "use strict";
      var e = {};
      e.VERSION = "1.6.1";
      var n, i = {}, o = r(function(l, h) {
        return function() {
          return h.apply(l, arguments);
        };
      }, "bind"), s = r(function() {
        var l = arguments, h = l[0], T, v;
        for (v = 1; v < l.length; v++) for (T in l[v]) !(T in h) && l[v].hasOwnProperty(T) && (h[T] = l[v][T]);
        return h;
      }, "merge"), a = r(function(l, h) {
        return { value: l, name: h };
      }, "defineLogLevel");
      e.TRACE = a(1, "TRACE"), e.DEBUG = a(2, "DEBUG"), e.INFO = a(3, "INFO"), e.TIME = a(4, "TIME"), e.WARN = a(5, "WARN"), e.ERROR = a(8, "ERROR"), e.OFF = a(99, "OFF");
      var c = r(function(l) {
        this.context = l, this.setLevel(l.filterLevel), this.log = this.info;
      }, "ContextualLogger");
      c.prototype = { setLevel: r(function(l) {
        l && "value" in l && (this.context.filterLevel = l);
      }, "setLevel"), getLevel: r(function() {
        return this.context.filterLevel;
      }, "getLevel"), enabledFor: r(function(l) {
        var h = this.context.filterLevel;
        return l.value >= h.value;
      }, "enabledFor"), trace: r(function() {
        this.invoke(e.TRACE, arguments);
      }, "trace"), debug: r(function() {
        this.invoke(e.DEBUG, arguments);
      }, "debug"), info: r(function() {
        this.invoke(e.INFO, arguments);
      }, "info"), warn: r(function() {
        this.invoke(e.WARN, arguments);
      }, "warn"), error: r(function() {
        this.invoke(e.ERROR, arguments);
      }, "error"), time: r(function(l) {
        typeof l == "string" && l.length > 0 && this.invoke(e.TIME, [l, "start"]);
      }, "time"), timeEnd: r(function(l) {
        typeof l == "string" && l.length > 0 && this.invoke(e.TIME, [l, "end"]);
      }, "timeEnd"), invoke: r(function(l, h) {
        n && this.enabledFor(l) && n(h, s({ level: l }, this.context));
      }, "invoke") };
      var d = new c({ filterLevel: e.OFF });
      (function() {
        var l = e;
        l.enabledFor = o(d, d.enabledFor), l.trace = o(d, d.trace), l.debug = o(d, d.debug), l.time = o(d, d.time), l.timeEnd = o(d, d.timeEnd), l.info = o(d, d.info), l.warn = o(d, d.warn), l.error = o(d, d.error), l.log = l.info;
      })(), e.setHandler = function(l) {
        n = l;
      }, e.setLevel = function(l) {
        d.setLevel(l);
        for (var h in i) i.hasOwnProperty(h) && i[h].setLevel(l);
      }, e.getLevel = function() {
        return d.getLevel();
      }, e.get = function(l) {
        return i[l] || (i[l] = new c(s({ name: l }, d.context)));
      }, e.createDefaultHandler = function(l) {
        l = l || {}, l.formatter = l.formatter || r(function(x, w) {
          w.name && x.unshift("[" + w.name + "]");
        }, "defaultMessageFormatter");
        var h = {}, T = r(function(v, x) {
          Function.prototype.apply.call(v, console, x);
        }, "invokeConsoleMethod");
        return typeof console > "u" ? function() {
        } : function(v, x) {
          v = Array.prototype.slice.call(v);
          var w = console.log, Z;
          x.level === e.TIME ? (Z = (x.name ? "[" + x.name + "] " : "") + v[0], v[1] === "start" ? console.time ? console.time(Z) : h[Z] = (/* @__PURE__ */ new Date()).getTime() : console.timeEnd ? console.timeEnd(Z) : T(w, [Z + ": " + ((/* @__PURE__ */ new Date()).getTime() - h[Z]) + "ms"])) : (x.level === e.WARN && console.warn ? w = console.warn : x.level === e.ERROR && console.error ? w = console.error : x.level === e.INFO && console.info ? w = console.info : x.level === e.DEBUG && console.debug ? w = console.debug : x.level === e.TRACE && console.trace && (w = console.trace), l.formatter(v, x), T(w, v));
        };
      }, e.useDefaults = function(l) {
        e.setLevel(l && l.defaultLevel || e.DEBUG), e.setHandler(e.createDefaultHandler(l));
      }, e.setDefaults = e.useDefaults, typeof define == "function" && define.amd ? define(e) : typeof U < "u" && U.exports ? U.exports = e : (e._prevLogger = t8.Logger, e.noConflict = function() {
        return t8.Logger = e._prevLogger, e;
      }, t8.Logger = e);
    })(de);
  });
  var L = class {
    static {
      __name(this, "L");
    }
    static {
      r(this, "BaseModule");
    }
    get settingsScreen() {
      return null;
    }
    get settingsStorage() {
      return this.constructor.name;
    }
    get settings() {
      return this.settingsStorage ? (p.playerStorage ? p.playerStorage[this.settingsStorage] || this.registerDefaultSettings(p.playerStorage) : this.registerDefaultSettings(p.playerStorage), p.playerStorage[this.settingsStorage]) : null;
    }
    set settings(e) {
      this.settingsStorage && (p.playerStorage ? p.playerStorage[this.settingsStorage] || this.registerDefaultSettings(p.playerStorage) : this.registerDefaultSettings(p.playerStorage), p.playerStorage[this.settingsStorage] = e);
    }
    init() {
    }
    registerDefaultSettings(e) {
      e ??= p.playerStorage ?? {};
      let n = this.settingsStorage, i = this.defaultSettings;
      !n || !i || Object.entries(this.defaultSettings).length !== 0 && (e[n] = f(this.defaultSettings, e[n], { concatArrays: false, matchingOnly: true }));
    }
    get defaultSettings() {
      return null;
    }
    load() {
    }
    run() {
    }
    unload() {
    }
  };
  async function E(t8) {
    if (!M.instance) throw new Error("Attempt to set subscreen before init");
    let e = typeof t8 == "string" ? t8 : t8?.options.name, n = `${define_MOD_INFO_default.name}_${e}`;
    await CommonSetScreen("DeepLibMod", `${n}`);
  }
  __name(E, "E");
  r(E, "setSubscreen");
  var I = class t {
    static {
      __name(this, "t");
    }
    static {
      r(this, "BaseSubscreen");
    }
    static currentElements = [];
    static currentPage = 1;
    options;
    module;
    static id = CommonGenerateUniqueID();
    static subscreenOptions = { drawCharacter: true, name: "UNKNOWN", background: "Sheet", doShowExitButton: true, doShowTitle: true, settingsWidth: 1e3, forceUpCharacter: false };
    static menu = null;
    constructor(e) {
      e && (this.module = e);
      let n = this.constructor;
      this.options = { ...t.subscreenOptions, ...n.subscreenOptions };
      let i = this.options.name, o = `${define_MOD_INFO_default.name}_${i}`;
      O(`${o}Load`, this.load.bind(this)), O(`${o}Run`, this.run.bind(this)), O(`${o}Click`, this.click.bind(this)), O(`${o}Exit`, this.exit.bind(this)), O(`${o}Unload`, this.unload.bind(this)), O(`${o}Resize`, this.resize.bind(this)), O(`${o}Background`, this.options.background), CommonCSVCache[ScreenFileGetTranslation("DeepLibMod", o)] = [];
    }
    async setSubscreen(e) {
      return await E(e);
    }
    get settings() {
      return this.module.settings;
    }
    set settings(e) {
      this.module.settings = e;
    }
    get pageStructure() {
      return [[]];
    }
    get currentPage() {
      return this.pageStructure[Math.min(t.currentPage - 1, this.pageStructure.length - 1)];
    }
    getPageLabel() {
      return g("settings.page.label", { $currentPage$: t.currentPage, $totalPages$: this.pageStructure.length });
    }
    changePage(e, n) {
      let i = this.pageStructure.length;
      e > i && (e = 1), e < 1 && (e = i), t.currentPage = e, this.managePageElementsVisibility(), n(this.getPageLabel());
    }
    managePageElementsVisibility() {
      this.pageStructure.forEach((e, n) => {
        e.forEach((i) => {
          let o = ElementWrap(`${i.id}-container`) ?? ElementWrap(`${i.id}`);
          n !== t.currentPage - 1 ? o && S.hide(o) : o && S.unhide(o);
        });
      });
    }
    load() {
      for (let i of y()) i.settingsScreen && (!i.settings || !Object.keys(i.settings).length) && i.registerDefaultSettings(p.playerStorage);
      t.currentPage = 1, b.getSubscreen();
      let e = b.getSettingsDiv();
      if (b.appendToSubscreen(e), t.menu = ElementMenu.Create("deeplib-nav-menu", []), b.appendToSubscreen(t.menu), this.pageStructure.length > 1) {
        let i = u.createBackNext({ id: "deeplib-page-back-next", next: r(({ setLabel: o }) => this.changePage(t.currentPage + 1, o), "next"), initialNextTooltip: g("settings.button.next_button_hint"), back: r(({ setLabel: o }) => this.changePage(t.currentPage - 1, o), "back"), initialPrevTooltip: g("settings.button.prev_button_hint"), initialLabel: this.getPageLabel() });
        t.menu.prepend(i);
      }
      if (this.options.help) {
        let i = this.options.help.onClick, o = r(() => {
        }, "action");
        typeof i == "string" || i instanceof URL ? o = r(() => window.open(i, "_blank"), "action") : typeof i == "function" ? o = i : i instanceof t && (o = r(async () => await this.setSubscreen(i), "action")), this.options.help.tooltip ??= g("settings.button.help_button_hint"), this.options.help.icon ??= `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/bookmark.svg`;
        let s = u.createButton({ id: "deeplib-help", size: [90, 90], onClick: o, options: { image: this.options.help.icon, tooltip: this.options.help.tooltip } });
        t.menu.append(s);
      }
      if (this.options.doShowTitle) {
        let i = u.createLabel({ id: "deeplib-subscreen-title", label: g(`${this.options.name}.title`, { $ModVersion: "1.0.0 - 22a0cb39" }) });
        b.appendToSubscreen(i);
      }
      if (this.options.doShowExitButton) {
        let i = u.createButton({ id: "deeplib-exit", size: [90, 90], onClick: r(() => {
          this.exit();
        }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/exit.svg`, tooltip: g("settings.button.back_button_hint") } });
        t.menu.append(i);
      }
      let n = u.createTooltip();
      b.appendToSubscreen(n), this.pageStructure.forEach((i) => i.forEach((o) => {
        let s;
        switch (o.type) {
          case "text":
          case "number":
          case "color":
            s = u.createInput(o);
            break;
          case "checkbox":
            s = u.createCheckbox(o);
            break;
          case "button":
            s = u.createButton(o);
            break;
          case "label":
            s = u.createLabel(o);
            break;
          case "custom":
            s = u.createCustom(o);
            break;
          case "dropdown":
            s = u.createDropdown(o);
            break;
        }
        s.parentElement && s.parentElement !== e || b.appendToSettingsDiv(s);
      })), this.managePageElementsVisibility(), this.options.drawCharacter && this.options.forceUpCharacter ? CharacterAppearanceForceUpCharacter = Player.MemberNumber : CharacterAppearanceForceUpCharacter = -1;
    }
    run() {
      this.options.drawCharacter && DrawCharacter(Player, 50, 50, 0.9, false);
    }
    click() {
    }
    exit() {
      CharacterAppearanceForceUpCharacter = -1, CharacterLoadCanvas(Player);
      let e = CommonUnwrapThunk(this.options.returnScreen);
      e instanceof t || !e ? E(e ?? "mainmenu").then(() => {
        p.save();
      }) : Array.isArray(e) && CommonSetScreen(...e).then(() => {
        p.save();
      });
    }
    resize(e = false) {
      let n = this.options.drawCharacter ? 0 : 380, i = b.getSubscreen(), o = b.getSettingsDiv();
      ElementSetPosition(i, 0, 0), ElementSetSize(i, 2e3, 1e3), ElementSetFontSize(i, "auto"), ElementSetPosition(o, 530 - n, 170), ElementSetSize(o, this.options.settingsWidth ?? 1e3 + n, 660), this.options.doShowTitle && (ElementSetPosition("deeplib-subscreen-title", 530 - n, 75), ElementSetSize("deeplib-subscreen-title", 800, 90)), ElementSetPosition("deeplib-nav-menu", 1905, 75, "top-right"), ElementSetSize("deeplib-nav-menu", null, 90), ElementSetSize(u.getTooltip() || "", 1500), t.currentElements.forEach((s) => {
        let a = s[0], c = s[1];
        S.autoSetPosition(c.id ?? a.id, c.position), S.autoSetSize(c.id ?? a.id, c.size);
      }), o && (S.hasOverflow(o)?.vertical ? o.classList.add("deeplib-overflow-box") : o.classList.remove("deeplib-overflow-box"));
    }
    unload() {
      t.currentElements = [], b.removeSubscreen();
    }
  };
  var re = `.deeplib-subscreen,
.deeplib-modal {
  --deeplib-background-color: var(--tmd-main, white);
  --deeplib-element-color: var(--tmd-element, white);
  --deeplib-element-hover-color: var(--tmd-element-hover, cyan);
  --deeplib-accent-color: var(--tmd-accent, #FFFF88);
  --deeplib-blocked-color: var(--tmd-blocked, red);
  --deeplib-text-color: var(--tmd-text, black);
  --deeplib-icon-color: var(--tmd-accent, black);
  --deeplib-icon-hover-color: var(--tmd-accent-hover, black);
  --deeplib-border-color: var(--tmd-accent, black);
  --deeplib-border-width: min(0.2vh, 0.1vw);
  --deeplib-border-width: min(0.2dvh, 0.1dvw);
  --deeplib-border-radius: min(1vh, 0.5vw);
  --deeplib-border-radius: min(1dvh, 0.5dvw);
}

.deeplib-button {
  color: var(--deeplib-text-color);
  width: 100%;
  height: 100%;
}
.deeplib-button.button-styling, .deeplib-button.button-styling::before {
  border-radius: min(1dvh, 0.5dvw);
}
.deeplib-button img {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-position: left;
  background-color: var(--deeplib-icon-color);
  background-blend-mode: multiply;
  background-size: contain;
  mask-position: left;
  mask-size: contain;
  background-repeat: no-repeat;
  mask-repeat: no-repeat;
  color: transparent;
  background-image: var(--image);
  mask-image: var(--image);
  pointer-events: none;
}
.deeplib-button:hover img {
  background-color: var(--deeplib-icon-hover-color);
}
.deeplib-button .button-label {
  background-color: transparent !important;
  color: var(--deeplib-text-color);
  font-size: 0.9em;
  display: contents;
}
.deeplib-button .button-tooltip {
  border-radius: min(1dvh, 0.5dvw);
  pointer-events: none;
}

#deeplib-page-label {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

#deeplib-subscreen-title {
  text-align: left;
  color: var(--deeplib-text-color);
  user-select: none;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.deeplib-text {
  color: var(--deeplib-text-color);
}

.deeplib-label {
  color: var(--deeplib-text-color);
  user-select: none;
  pointer-events: none;
}

.deeplib-subscreen {
  padding: 0;
  margin: 0;
  pointer-events: none;
}

.deeplib-subscreen * {
  box-sizing: border-box;
  pointer-events: all;
}

.deeplib-settings {
  display: grid;
  grid-auto-rows: min-content;
  padding: min(1dvh, 0.5dvw);
  gap: 0.3em;
}

.deeplib-misc {
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  gap: min(1vh, 0.5vw);
}

.deeplib-tooltip {
  background-color: var(--deeplib-element-color);
  color: var(--deeplib-text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: min(1dvh, 0.5dvw);
  padding: min(1vh, 0.5vw);
  font-size: 0.8em;
  border: min(0.2vh, 0.1vw) solid var(--deeplib-border-color);
  z-index: 1;
}
.deeplib-tooltip.anchor-top {
  position: absolute;
  top: min(1vh, 0.5vw);
  left: 50%;
  transform: translateX(-50%);
}
.deeplib-tooltip.anchor-bottom {
  position: absolute;
  bottom: min(1vh, 0.5vw);
  left: 50%;
  transform: translateX(-50%);
}

.deeplib-overflow-box {
  border: var(--deeplib-border-color) solid var(--deeplib-border-width);
}

.deeplib-prev-next {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: min(2dvh, 1dvw);
  background-color: var(--deeplib-element-color);
  color: var(--deeplib-text-color);
  border-radius: min(1dvh, 0.5dvw);
  border: min(0.2vh, 0.1vw) solid var(--deeplib-border-color);
}
.deeplib-prev-next .deeplib-prev-next-button:hover {
  background-color: var(--deeplib-element-hover-color);
  border-radius: var(--deeplib-border-radius);
}
.deeplib-prev-next .deeplib-prev-next-button {
  height: 100%;
  aspect-ratio: 1;
}
.deeplib-prev-next .deeplib-prev-next-label {
  white-space: nowrap;
  user-select: none;
}

#deeplib-nav-menu {
  display: flex;
  flex-direction: row;
  gap: min(2dvh, 1dvw);
  z-index: 1;
}
#deeplib-nav-menu > .deeplib-button {
  flex: 1 1 auto;
  height: 100%;
  aspect-ratio: 1;
}

#deeplib-storage-meter {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--deeplib-element-color);
  border: var(--deeplib-border-width) solid var(--deeplib-border-color);
  border-radius: var(--deeplib-border-radius);
  z-index: -1;
}
#deeplib-storage-meter #deeplib-storage-bar {
  height: 100%;
  width: 0%;
  background: var(--deeplib-accent-color);
}

.deeplib-checkbox-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3em;
  width: fit-content;
}
.deeplib-checkbox-container span {
  user-select: none;
}
.deeplib-checkbox-container .deeplib-input {
  width: min(5vh, 2.5vw);
  height: min(5vh, 2.5vw);
  width: min(5dvh, 2.5dvw);
  height: min(5dvh, 2.5dvw);
  border-radius: min(1vh, 0.5vw);
  border-radius: min(1dvh, 0.5dvw);
}
.deeplib-checkbox-container .deeplib-input[type=checkbox]:checked::before {
  width: 80%;
  height: 80%;
}

.deeplib-input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3em;
  width: fit-content;
}
.deeplib-input-container span {
  user-select: none;
}
.deeplib-input-container:has(.deeplib-text) {
  margin-top: min(1vh, 0.5vw);
  margin-top: min(1dvh, 0.5dvw);
}
.deeplib-input-container .deeplib-input {
  font-size: 0.9em;
  padding: min(1vh, 0.5vw);
  padding: min(1dvh, 0.5dvw);
  outline: none;
  min-height: min(5vh, 2.5vw);
  min-height: min(5dvh, 2.5dvw);
  border-radius: min(1vh, 0.5vw);
  border-radius: min(1dvh, 0.5dvw);
}
.deeplib-input-container .deeplib-input[type=color] {
  padding: 0px;
  width: min(5vh, 2.5vw);
  height: min(5vh, 2.5vw);
  width: min(5dvh, 2.5dvw);
  height: min(5dvh, 2.5dvw);
  border-radius: 0px;
}
.deeplib-input-container .deeplib-input[type=color]:disabled {
  border: var(--deeplib-blocked-color) solid var(--deeplib-border-width);
  cursor: not-allowed;
}

.deeplib-dropdown-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: min(2vh, 1vw);
  gap: min(2dvh, 1dvw);
  color: var(--deeplib-text-color);
  width: fit-content;
}
.deeplib-dropdown-container select {
  padding: 0 min(1vh, 0.5vw);
  padding: 0 min(1dvh, 0.5dvw);
  border-radius: min(1vh, 0.5vw);
  border-radius: min(1dvh, 0.5dvw);
}
.deeplib-dropdown-container span {
  user-select: none;
}

.deeplib-checkbox-container.row,
.deeplib-input-container.row,
.deeplib-dropdown-container.row {
  flex-direction: row;
}
.deeplib-checkbox-container.column,
.deeplib-input-container.column,
.deeplib-dropdown-container.column {
  flex-direction: column;
}
.deeplib-checkbox-container.rowReverse,
.deeplib-input-container.rowReverse,
.deeplib-dropdown-container.rowReverse {
  flex-direction: row-reverse;
}
.deeplib-checkbox-container.columnReverse,
.deeplib-input-container.columnReverse,
.deeplib-dropdown-container.columnReverse {
  flex-direction: column-reverse;
}

.deeplib-highlight-text {
  font-weight: bold;
  color: rgb(203, 185, 23);
}

#TextAreaChatLog[data-colortheme=dark] div.ChatMessage.deeplib-message,
#TextAreaChatLog[data-colortheme=dark2] div.ChatMessage.deeplib-message {
  background-color: var(--deeplib-element-color);
  border: min(0.2dvh, 0.1dvw) solid var(--deeplib-border-color);
  color: var(--deeplib-text-color);
}

#TextAreaChatLog div.ChatMessage.deeplib-message {
  background-color: #eee;
  border: min(0.2dvh, 0.1dvw) solid #440171;
  color: #111;
  padding-left: min(0.6dvh, 0.3dvw);
  display: block;
  white-space: normal;
}

#TextAreaChatLog[data-colortheme=dark] div.ChatMessage.deeplib-message a,
#TextAreaChatLog[data-colortheme=dark2] div.ChatMessage.deeplib-message a {
  color: var(--deeplib-text-color);
}

#TextAreaChatLog div.ChatMessage.deeplib-message a {
  cursor: pointer;
  font-weight: bold;
  color: #111;
}

.deeplib-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  min-width: max(50dvw, 25dvh);
  font-size: 1em;
  padding: min(2dvh, 1dvw);
  background-color: var(--deeplib-element-color);
  border-radius: min(1.2dvh, 0.6dvw);
  border: min(0.2dvh, 0.1dvw) solid var(--deeplib-border-color);
  color: var(--deeplib-text-color);
  max-width: max(90dvw, 45dvh);
}
.deeplib-modal .deeplib-modal-input {
  width: 100%;
  font-size: 1em;
  border-radius: min(1dvh, 0.5dvw);
  padding: min(1dvh, 0.5dvw);
}
.deeplib-modal input.deeplib-modal-input {
  max-width: max(50dvh, 25dvw);
}
.deeplib-modal .deeplib-modal-button-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.5em;
  width: 100%;
}
.deeplib-modal .deeplib-modal-button-container .deeplib-button {
  font-size: 0.8em;
  display: flex;
  width: auto;
  padding: min(0.4vh, 0.2vw) min(2vh, 1vw);
}
.deeplib-modal .deeplib-modal-button-container .deeplib-button .button-label {
  display: contents;
}
.deeplib-modal .deeplib-modal-prompt-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.deeplib-modal-blocker {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
}

#deeplib-modal-import_export .deeplib-modal-checkbox-container {
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  gap: var(--half-gap);
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZhcnMuc2NzcyIsImJ1dHRvbnMuc2NzcyIsImVsZW1lbnRzLnNjc3MiLCJpbnB1dHMuc2NzcyIsIm1lc3NhZ2VzLnNjc3MiLCJtb2RhbC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FDZEY7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFFRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFFQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7O0FDNUNKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdFO0VBQ0U7RUFDQTs7QUFISjtFQU1FO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBOzs7QUN6SUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7O0FBT1I7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7OztBQU9GO0FBQUE7QUFBQTtFQUNFOztBQUdGO0FBQUE7QUFBQTtFQUNFOztBQUdGO0FBQUE7QUFBQTtFQUNFOztBQUdGO0FBQUE7QUFBQTtFQUNFOzs7QUMxR0o7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtFQUVFOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FDN0JGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUtOO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUlBO0VBQ0U7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIuZGVlcGxpYi1zdWJzY3JlZW4sXG4uZGVlcGxpYi1tb2RhbCB7XG4gIC0tZGVlcGxpYi1iYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10bWQtbWFpbiwgd2hpdGUpO1xuICAtLWRlZXBsaWItZWxlbWVudC1jb2xvcjogdmFyKC0tdG1kLWVsZW1lbnQsIHdoaXRlKTtcbiAgLS1kZWVwbGliLWVsZW1lbnQtaG92ZXItY29sb3I6IHZhcigtLXRtZC1lbGVtZW50LWhvdmVyLCBjeWFuKTtcbiAgLS1kZWVwbGliLWFjY2VudC1jb2xvcjogdmFyKC0tdG1kLWFjY2VudCwgI0ZGRkY4OCk7XG4gIC0tZGVlcGxpYi1ibG9ja2VkLWNvbG9yOiB2YXIoLS10bWQtYmxvY2tlZCwgcmVkKTtcbiAgLS1kZWVwbGliLXRleHQtY29sb3I6IHZhcigtLXRtZC10ZXh0LCBibGFjayk7XG4gIC0tZGVlcGxpYi1pY29uLWNvbG9yOiB2YXIoLS10bWQtYWNjZW50LCBibGFjayk7XG4gIC0tZGVlcGxpYi1pY29uLWhvdmVyLWNvbG9yOiB2YXIoLS10bWQtYWNjZW50LWhvdmVyLCBibGFjayk7XG4gIC0tZGVlcGxpYi1ib3JkZXItY29sb3I6IHZhcigtLXRtZC1hY2NlbnQsIGJsYWNrKTtcbiAgLS1kZWVwbGliLWJvcmRlci13aWR0aDogbWluKDAuMnZoLCAwLjF2dyk7XG4gIC0tZGVlcGxpYi1ib3JkZXItd2lkdGg6IG1pbigwLjJkdmgsIDAuMWR2dyk7XG4gIC0tZGVlcGxpYi1ib3JkZXItcmFkaXVzOiBtaW4oMXZoLCAwLjV2dyk7XG4gIC0tZGVlcGxpYi1ib3JkZXItcmFkaXVzOiBtaW4oMWR2aCwgMC41ZHZ3KTtcbn1cbiIsIi5kZWVwbGliLWJ1dHRvbiB7XG4gIGNvbG9yOiB2YXIoLS1kZWVwbGliLXRleHQtY29sb3IpO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuXG4gICYuYnV0dG9uLXN0eWxpbmcsXG4gICYuYnV0dG9uLXN0eWxpbmc6OmJlZm9yZSB7XG4gICAgYm9yZGVyLXJhZGl1czogbWluKDEuMGR2aCwgMC41ZHZ3KTtcbiAgfVxuXG4gIGltZyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogMCU7XG4gICAgbGVmdDogMCU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGxlZnQ7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVlcGxpYi1pY29uLWNvbG9yKTtcbiAgICBiYWNrZ3JvdW5kLWJsZW5kLW1vZGU6IG11bHRpcGx5O1xuICAgIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcbiAgICBtYXNrLXBvc2l0aW9uOiBsZWZ0O1xuICAgIG1hc2stc2l6ZTogY29udGFpbjtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIG1hc2stcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgY29sb3I6IHRyYW5zcGFyZW50O1xuXG4gICAgYmFja2dyb3VuZC1pbWFnZTogdmFyKC0taW1hZ2UpO1xuICAgIG1hc2staW1hZ2U6IHZhcigtLWltYWdlKTtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgfVxuXG4gICY6aG92ZXIgaW1nIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kZWVwbGliLWljb24taG92ZXItY29sb3IpO1xuICB9XG5cbiAgLmJ1dHRvbi1sYWJlbCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICBjb2xvcjogdmFyKC0tZGVlcGxpYi10ZXh0LWNvbG9yKTtcbiAgICBmb250LXNpemU6IDAuOWVtO1xuICAgIGRpc3BsYXk6IGNvbnRlbnRzO1xuICB9XG5cbiAgLmJ1dHRvbi10b29sdGlwIHtcbiAgICBib3JkZXItcmFkaXVzOiBtaW4oMS4wZHZoLCAwLjVkdncpO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG59IiwiI2RlZXBsaWItcGFnZS1sYWJlbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuI2RlZXBsaWItc3Vic2NyZWVuLXRpdGxlIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6IHZhcigtLWRlZXBsaWItdGV4dC1jb2xvcik7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmRlZXBsaWItdGV4dCB7XG4gIGNvbG9yOiB2YXIoLS1kZWVwbGliLXRleHQtY29sb3IpO1xufVxuXG4uZGVlcGxpYi1sYWJlbCB7XG4gIGNvbG9yOiB2YXIoLS1kZWVwbGliLXRleHQtY29sb3IpO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5kZWVwbGliLXN1YnNjcmVlbiB7XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5kZWVwbGliLXN1YnNjcmVlbiAqIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgcG9pbnRlci1ldmVudHM6IGFsbDtcbn1cblxuLmRlZXBsaWItc2V0dGluZ3Mge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLWF1dG8tcm93czogbWluLWNvbnRlbnQ7XG4gIHBhZGRpbmc6IG1pbigxLjBkdmgsIDAuNWR2dyk7XG4gIGdhcDogMC4zZW07XG59XG5cbi5kZWVwbGliLW1pc2Mge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XG4gIGdhcDogbWluKDF2aCwgMC41dncpO1xufVxuXG4uZGVlcGxpYi10b29sdGlwIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVlcGxpYi1lbGVtZW50LWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLWRlZXBsaWItdGV4dC1jb2xvcik7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiBtaW4oMS4wZHZoLCAwLjVkdncpO1xuICBwYWRkaW5nOiBtaW4oMXZoLCAwLjV2dyk7XG4gIGZvbnQtc2l6ZTogMC44ZW07XG4gIGJvcmRlcjogbWluKDAuMnZoLCAwLjF2dykgc29saWQgdmFyKC0tZGVlcGxpYi1ib3JkZXItY29sb3IpO1xuICB6LWluZGV4OiAxO1xuXG4gICYuYW5jaG9yLXRvcCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogbWluKDF2aCwgMC41dncpO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG4gIH1cblxuICAmLmFuY2hvci1ib3R0b20ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3R0b206IG1pbigxdmgsIDAuNXZ3KTtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICB9XG59XG5cbi5kZWVwbGliLW92ZXJmbG93LWJveCB7XG4gIGJvcmRlcjogdmFyKC0tZGVlcGxpYi1ib3JkZXItY29sb3IpIHNvbGlkIHZhcigtLWRlZXBsaWItYm9yZGVyLXdpZHRoKTtcbn1cblxuLmRlZXBsaWItcHJldi1uZXh0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBnYXA6IG1pbigyZHZoLCAxZHZ3KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVlcGxpYi1lbGVtZW50LWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLWRlZXBsaWItdGV4dC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IG1pbigxLjBkdmgsIDAuNWR2dyk7XG4gIGJvcmRlcjogbWluKDAuMnZoLCAwLjF2dykgc29saWQgdmFyKC0tZGVlcGxpYi1ib3JkZXItY29sb3IpO1xuXG4gIC5kZWVwbGliLXByZXYtbmV4dC1idXR0b24ge1xuICAgICY6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVlcGxpYi1lbGVtZW50LWhvdmVyLWNvbG9yKTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IHZhcigtLWRlZXBsaWItYm9yZGVyLXJhZGl1cyk7XG4gICAgfVxuXG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGFzcGVjdC1yYXRpbzogMTtcbiAgfVxuXG4gIC5kZWVwbGliLXByZXYtbmV4dC1sYWJlbCB7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxufVxuXG4jZGVlcGxpYi1uYXYtbWVudSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGdhcDogbWluKDJkdmgsIDFkdncpO1xuICB6LWluZGV4OiAxO1xuXG4gICY+LmRlZXBsaWItYnV0dG9uIHtcbiAgICBmbGV4OiAxIDEgYXV0bztcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYXNwZWN0LXJhdGlvOiAxO1xuICB9XG59XG5cbiNkZWVwbGliLXN0b3JhZ2UtbWV0ZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMHB4O1xuICBsZWZ0OiAwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZXBsaWItZWxlbWVudC1jb2xvcik7XG4gIGJvcmRlcjogdmFyKC0tZGVlcGxpYi1ib3JkZXItd2lkdGgpIHNvbGlkIHZhcigtLWRlZXBsaWItYm9yZGVyLWNvbG9yKTtcbiAgYm9yZGVyLXJhZGl1czogdmFyKC0tZGVlcGxpYi1ib3JkZXItcmFkaXVzKTtcbiAgei1pbmRleDogLTE7XG5cbiAgI2RlZXBsaWItc3RvcmFnZS1iYXIge1xuICAgIGhlaWdodDogMTAwJTtcbiAgICB3aWR0aDogMCU7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tZGVlcGxpYi1hY2NlbnQtY29sb3IpO1xuICB9XG59IiwiLmRlZXBsaWItY2hlY2tib3gtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjNlbTtcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuXG4gIHNwYW4ge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICB9XG5cbiAgLmRlZXBsaWItaW5wdXQge1xuICAgIHdpZHRoOiBtaW4oNXZoLCAyLjV2dyk7XG4gICAgaGVpZ2h0OiBtaW4oNXZoLCAyLjV2dyk7XG4gICAgd2lkdGg6IG1pbig1ZHZoLCAyLjVkdncpO1xuICAgIGhlaWdodDogbWluKDVkdmgsIDIuNWR2dyk7XG4gICAgYm9yZGVyLXJhZGl1czogbWluKDEuMHZoLCAwLjV2dyk7XG4gICAgYm9yZGVyLXJhZGl1czogbWluKDEuMGR2aCwgMC41ZHZ3KTtcblxuICAgICZbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQ6OmJlZm9yZSB7XG4gICAgICB3aWR0aDogODAlO1xuICAgICAgaGVpZ2h0OiA4MCU7XG4gICAgfVxuICB9XG59XG5cbi5kZWVwbGliLWlucHV0LWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC4zZW07XG4gIHdpZHRoOiBmaXQtY29udGVudDtcblxuICBzcGFuIHtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgfVxuXG4gICY6aGFzKC5kZWVwbGliLXRleHQpIHtcbiAgICBtYXJnaW4tdG9wOiBtaW4oMXZoLCAwLjV2dyk7XG4gICAgbWFyZ2luLXRvcDogbWluKDFkdmgsIDAuNWR2dyk7XG4gIH1cblxuICAuZGVlcGxpYi1pbnB1dCB7XG4gICAgZm9udC1zaXplOiAwLjllbTtcbiAgICBwYWRkaW5nOiBtaW4oMXZoLCAwLjV2dyk7XG4gICAgcGFkZGluZzogbWluKDFkdmgsIDAuNWR2dyk7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBtaW4taGVpZ2h0OiBtaW4oNXZoLCAyLjV2dyk7XG4gICAgbWluLWhlaWdodDogbWluKDVkdmgsIDIuNWR2dyk7XG4gICAgYm9yZGVyLXJhZGl1czogbWluKDEuMHZoLCAwLjV2dyk7XG4gICAgYm9yZGVyLXJhZGl1czogbWluKDEuMGR2aCwgMC41ZHZ3KTtcblxuICAgICZbdHlwZT1cImNvbG9yXCJdIHtcbiAgICAgIHBhZGRpbmc6IDBweDtcbiAgICAgIHdpZHRoOiBtaW4oNXZoLCAyLjV2dyk7XG4gICAgICBoZWlnaHQ6IG1pbig1dmgsIDIuNXZ3KTtcbiAgICAgIHdpZHRoOiBtaW4oNWR2aCwgMi41ZHZ3KTtcbiAgICAgIGhlaWdodDogbWluKDVkdmgsIDIuNWR2dyk7XG4gICAgICBib3JkZXItcmFkaXVzOiAwcHg7XG5cbiAgICAgICY6ZGlzYWJsZWQge1xuICAgICAgICBib3JkZXI6IHZhcigtLWRlZXBsaWItYmxvY2tlZC1jb2xvcikgc29saWQgdmFyKC0tZGVlcGxpYi1ib3JkZXItd2lkdGgpO1xuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbi5kZWVwbGliLWRyb3Bkb3duLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogbWluKDJ2aCwgMXZ3KTtcbiAgZ2FwOiBtaW4oMmR2aCwgMWR2dyk7XG4gIGNvbG9yOiB2YXIoLS1kZWVwbGliLXRleHQtY29sb3IpO1xuICB3aWR0aDogZml0LWNvbnRlbnQ7XG5cbiAgc2VsZWN0IHtcbiAgICBwYWRkaW5nOiAwIG1pbigxdmgsIDAuNXZ3KTtcbiAgICBwYWRkaW5nOiAwIG1pbigxZHZoLCAwLjVkdncpO1xuICAgIGJvcmRlci1yYWRpdXM6IG1pbigxdmgsIDAuNXZ3KTtcbiAgICBib3JkZXItcmFkaXVzOiBtaW4oMWR2aCwgMC41ZHZ3KTtcbiAgfVxuXG4gIHNwYW4ge1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICB9XG59XG5cbi5kZWVwbGliLWNoZWNrYm94LWNvbnRhaW5lcixcbi5kZWVwbGliLWlucHV0LWNvbnRhaW5lcixcbi5kZWVwbGliLWRyb3Bkb3duLWNvbnRhaW5lciB7XG4gICYucm93IHtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICB9XG5cbiAgJi5jb2x1bW4ge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIH1cblxuICAmLnJvd1JldmVyc2Uge1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcbiAgfVxuXG4gICYuY29sdW1uUmV2ZXJzZSB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xuICB9XG59IiwiLmRlZXBsaWItaGlnaGxpZ2h0LXRleHQge1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgY29sb3I6IHJnYigyMDMsIDE4NSwgMjMpO1xufVxuXG4jVGV4dEFyZWFDaGF0TG9nW2RhdGEtY29sb3J0aGVtZT0nZGFyayddIGRpdi5DaGF0TWVzc2FnZS5kZWVwbGliLW1lc3NhZ2UsXG4jVGV4dEFyZWFDaGF0TG9nW2RhdGEtY29sb3J0aGVtZT0nZGFyazInXSBkaXYuQ2hhdE1lc3NhZ2UuZGVlcGxpYi1tZXNzYWdlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGVlcGxpYi1lbGVtZW50LWNvbG9yKTtcbiAgYm9yZGVyOiBtaW4oMC4yZHZoLCAwLjFkdncpIHNvbGlkIHZhcigtLWRlZXBsaWItYm9yZGVyLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLWRlZXBsaWItdGV4dC1jb2xvcik7XG59XG5cbiNUZXh0QXJlYUNoYXRMb2cgZGl2LkNoYXRNZXNzYWdlLmRlZXBsaWItbWVzc2FnZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XG4gIGJvcmRlcjogbWluKDAuMmR2aCwgMC4xZHZ3KSBzb2xpZCAjNDQwMTcxO1xuICBjb2xvcjogIzExMTtcbiAgcGFkZGluZy1sZWZ0OiBtaW4oMC42ZHZoLCAwLjNkdncpO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbn1cblxuI1RleHRBcmVhQ2hhdExvZ1tkYXRhLWNvbG9ydGhlbWU9J2RhcmsnXSBkaXYuQ2hhdE1lc3NhZ2UuZGVlcGxpYi1tZXNzYWdlIGEsXG4jVGV4dEFyZWFDaGF0TG9nW2RhdGEtY29sb3J0aGVtZT0nZGFyazInXSBkaXYuQ2hhdE1lc3NhZ2UuZGVlcGxpYi1tZXNzYWdlIGEge1xuICBjb2xvcjogdmFyKC0tZGVlcGxpYi10ZXh0LWNvbG9yKTtcbn1cblxuI1RleHRBcmVhQ2hhdExvZyBkaXYuQ2hhdE1lc3NhZ2UuZGVlcGxpYi1tZXNzYWdlIGEge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xuICBjb2xvcjogIzExMTtcbn1cbiIsIi5kZWVwbGliLW1vZGFsIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgei1pbmRleDogMTAwMTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41ZW07XG4gIG1pbi13aWR0aDogbWF4KDUwZHZ3LCAyNWR2aCk7XG4gIGZvbnQtc2l6ZTogMWVtO1xuICBwYWRkaW5nOiBtaW4oMmR2aCwgMWR2dyk7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRlZXBsaWItZWxlbWVudC1jb2xvcik7XG4gIGJvcmRlci1yYWRpdXM6IG1pbigxLjJkdmgsIDAuNmR2dyk7XG4gIGJvcmRlcjogbWluKDAuMmR2aCwgMC4xZHZ3KSBzb2xpZCB2YXIoLS1kZWVwbGliLWJvcmRlci1jb2xvcik7XG4gIGNvbG9yOiB2YXIoLS1kZWVwbGliLXRleHQtY29sb3IpO1xuICBtYXgtd2lkdGg6IG1heCg5MGR2dywgNDVkdmgpO1xuXG4gIC5kZWVwbGliLW1vZGFsLWlucHV0IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmb250LXNpemU6IDFlbTtcbiAgICBib3JkZXItcmFkaXVzOiBtaW4oMS4wZHZoLCAwLjVkdncpO1xuICAgIHBhZGRpbmc6IG1pbigxZHZoLCAwLjVkdncpO1xuICB9XG5cbiAgaW5wdXQuZGVlcGxpYi1tb2RhbC1pbnB1dCB7XG4gICAgbWF4LXdpZHRoOiBtYXgoNTBkdmgsIDI1ZHZ3KTtcbiAgfVxuXG4gIC5kZWVwbGliLW1vZGFsLWJ1dHRvbi1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgIGdhcDogMC41ZW07XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICAuZGVlcGxpYi1idXR0b24ge1xuICAgICAgZm9udC1zaXplOiAwLjhlbTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICB3aWR0aDogYXV0bztcbiAgICAgIHBhZGRpbmc6IG1pbigwLjR2aCwgMC4ydncpIG1pbigydmgsIDF2dyk7XG5cbiAgICAgIC5idXR0b24tbGFiZWwge1xuICAgICAgICBkaXNwbGF5OiBjb250ZW50cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuZGVlcGxpYi1tb2RhbC1wcm9tcHQtY29udGFpbmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxufVxuXG4uZGVlcGxpYi1tb2RhbC1ibG9ja2VyIHtcbiAgei1pbmRleDogMTAwMDtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDBkdnc7XG4gIGhlaWdodDogMTAwZHZoO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XG59XG5cbiNkZWVwbGliLW1vZGFsLWltcG9ydF9leHBvcnQge1xuICAuZGVlcGxpYi1tb2RhbC1jaGVja2JveC1jb250YWluZXIge1xuICAgIG1hcmdpbi10b3A6IDAuNWVtO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IHZhcigtLWhhbGYtZ2FwKTtcbiAgfVxufSJdfQ== */`;
  function se() {
    if (true) return;
    let t8 = `${"https://protokink.github.io/Responsive/dev/public"}/`;
    G.hookFunction("fetch", k.ModifyBehavior, (e, n) => {
      let [i] = e, o = typeof i == "string" ? i : i instanceof URL ? i.href : i.url;
      if (o.startsWith(t8)) {
        let s = o.slice(t8.length), a = define_BUNDLED_PUBLIC_ASSET_MAP_default[s];
        if (a !== void 0) return a.startsWith("data:") ? fetch(a) : Promise.resolve(new Response(a, { status: 200 }));
      }
      return n(e);
    });
  }
  __name(se, "se");
  r(se, "installBundledPublicAssetFetch");
  var D = class extends L {
    static {
      __name(this, "D");
    }
    static {
      r(this, "DebugModule");
    }
    debugSettings = { showRawTranslations: false, showFileNames: false, showIncomingServerTransactions: false, incomingMessageFilterMode: "exclude", incomingMessageTypes: "", showOutcomingServerTransactions: false, outcomingMessageFilterMode: "exclude", outcomingMessageTypes: "", showRawActivityNames: false, showRawAssetNames: false };
    load() {
      let e = p.getLocalStorage("debugOptions");
      e && (this.debugSettings = Object.assign(this.debugSettings, e)), Oe(), G.hookFunction("TextGet", k.ModifyBehavior, (n, i) => {
        if (!this.debugSettings.showRawTranslations) return i(n);
        let [o] = n, s = TextScreenCache?.fileName() ?? "[unknown]";
        return this.debugSettings.showFileNames ? `${s}::${o}` : o;
      }), G.hookFunction("TextGetInScope", k.ModifyBehavior, (n, i) => {
        if (!this.debugSettings.showRawTranslations) return i(n);
        let [o, s] = n, a = o.lastIndexOf("/");
        a === -1 ? a = 0 : a = a + 1;
        let c = o.substring(a);
        return this.debugSettings.showFileNames ? `${c}::${s}` : s;
      }), G.hookFunction("InterfaceTextGet", k.ModifyBehavior, (n, i) => {
        if (!this.debugSettings.showRawTranslations) return i(n);
        let [o] = n, s = InterfaceStringsPath.lastIndexOf("/");
        s === -1 ? s = 0 : s = s + 1;
        let a = InterfaceStringsPath.substring(s);
        return this.debugSettings.showFileNames ? `${a}::${o}` : o;
      }), G.hookFunction("ActivityDictionaryText", k.ModifyBehavior, (n, i) => {
        if (!this.debugSettings.showRawActivityNames) return i(n);
        let [o] = n;
        return o;
      }), G.hookFunction("ElementButton.CreateForAsset", k.ModifyBehavior, (n, i) => {
        if (!this.debugSettings.showRawAssetNames) return i(n);
        let [, o, , , s] = n;
        return o = ("Asset" in o ? o : { Asset: o }).Asset, s ??= {}, s.label = o.Name, n[4] = s, i(n);
      });
    }
    unload() {
      Se();
    }
    saveDebugSettings() {
      p.setLocalStorage("debugOptions", this.debugSettings);
    }
  };
  var V;
  function ae(...t8) {
    let e = Array.isArray(t8[0]) && typeof t8[0][0] == "string" ? t8[0][0] : "[unknown]", n = Array.isArray(t8[0]) ? t8[0].slice(1) : [], i = B("DebugModule");
    return i.debugSettings.showIncomingServerTransactions && ce(e, i.debugSettings.incomingMessageTypes, i.debugSettings.incomingMessageFilterMode) && m.debug("\u25BC Receive", e, ...n), V?.apply(this, t8);
  }
  __name(ae, "ae");
  r(ae, "processIncomingTransaction");
  var R;
  function le(...t8) {
    let e = typeof t8[0] == "string" ? t8[0] : "[unknown]", n = Array.isArray(t8[1]) ? t8[1] : [t8[1]], i = B("DebugModule");
    return i.debugSettings.showOutcomingServerTransactions && ce(e, i.debugSettings.outcomingMessageTypes, i.debugSettings.outcomingMessageFilterMode) && m.debug("\u25B2 Send", e, ...n), R?.apply(this, t8);
  }
  __name(le, "le");
  r(le, "processOutcomingTransaction");
  function ce(t8, e, n) {
    if (!e.trim()) return true;
    let o = e.split(",").map((s) => s.trim()).filter((s) => s.length > 0).some((s) => t8 === s);
    return n === "include" ? o : !o;
  }
  __name(ce, "ce");
  r(ce, "shouldLogMessage");
  function Oe() {
    V === void 0 && typeof ServerSocket?.__proto__?.emitEvent == "function" && (V = ServerSocket.__proto__.emitEvent, ServerSocket.__proto__.emitEvent = ae), R === void 0 && typeof ServerSocket?.__proto__?.emit == "function" && (R = ServerSocket.__proto__.emit, ServerSocket.__proto__.emit = le);
  }
  __name(Oe, "Oe");
  r(Oe, "loadServerTransactions");
  function Se() {
    V && ServerSocket.__proto__.emitEvent === ae && (ServerSocket.__proto__.emitEvent = V, V = void 0), R && ServerSocket.__proto__.emit === le && (ServerSocket.__proto__.emit = R, R = void 0);
  }
  __name(Se, "Se");
  r(Se, "unloadServerTransactions");
  var ue = oe($(), 1);
  var p;
  var G;
  var m;
  async function kt(t8) {
    G = new Y({ name: define_MOD_INFO_default.name, fullName: define_MOD_INFO_default.fullName, version: "1.0.0", repository: define_MOD_INFO_default.repository }), se(), p = new Q(define_MOD_INFO_default.name), m = ue.default.get(define_MOD_INFO_default.name), H.injectInline("deeplib-style-6.0.0", re), m.debug("Init wait"), (!CurrentScreen || CurrentScreen === "Login") && t8.beforeLogin?.(), await ServerIsLoggedInAsync(), await ke(t8);
  }
  __name(kt, "kt");
  r(kt, "initMod");
  async function ke(t8) {
    if (window[define_MOD_INFO_default.name + "Loaded"]) return;
    let e = X(() => {
      p.load();
    }, (s) => s);
    e.ok || m.error(e.error);
    let n = await pe(async () => {
      await F.init(t8.translationOptions);
    }, (s) => s);
    n.ok || m.error(n.error);
    let i = Object.entries(t8.modules ?? {}), o = [];
    if (i.some((s) => s[1] instanceof N) || o.push(["VersionModule", new N()]), false, o.push(...i), !Fe(o)) {
      Ze();
      return;
    }
    await t8.initFunction?.(), t8.mainMenuOptions && B("GUI") && A.setOptions({ ...t8.mainMenuOptions, repoLink: define_MOD_INFO_default.repository }), window[define_MOD_INFO_default.name + "Loaded"] = true, m.log(`Loaded! Version: ${"1.0.0 - 22a0cb39"}`);
  }
  __name(ke, "ke");
  r(ke, "init");
  function Fe(t8) {
    for (let [e, n] of t8) ge(e, n);
    for (let e of y()) {
      let n = X(() => e.init(), (i) => i);
      n.ok || m.error(n.error);
    }
    for (let e of y()) {
      let n = X(() => e.load(), (i) => i);
      n.ok || m.error(n.error);
    }
    for (let e of y()) {
      let n = X(() => e.run(), (i) => i);
      n.ok || m.error(n.error);
    }
    for (let e of y()) e.registerDefaultSettings(p.playerStorage);
    return m.debug("Modules Loaded."), true;
  }
  __name(Fe, "Fe");
  r(Fe, "initModules");
  function Ze() {
    return Ee(), G.unload(), F.unload(), delete window[define_MOD_INFO_default.name + "Loaded"], m.debug("Unloaded."), true;
  }
  __name(Ze, "Ze");
  r(Ze, "unloadMod");
  function Ee() {
    for (let t8 of y()) t8.unload();
  }
  __name(Ee, "Ee");
  r(Ee, "unloadModules");
  var _ = /* @__PURE__ */ new Map();
  function y() {
    return [..._.values()];
  }
  __name(y, "y");
  r(y, "modules");
  function ge(t8, e) {
    return _.set(t8, e), e;
  }
  __name(ge, "ge");
  r(ge, "registerModule");
  function B(t8) {
    return _.get(t8);
  }
  __name(B, "B");
  r(B, "getModule");
  var be = class {
    static {
      __name(this, "be");
    }
    static {
      r(this, "BaseMigrator");
    }
  };
  var M = class t2 extends L {
    static {
      __name(this, "t");
    }
    static {
      r(this, "GUI");
    }
    static instance = null;
    _subscreens = [];
    _mainMenu = null;
    _modButtonOptions;
    get subscreens() {
      return this._subscreens;
    }
    get mainMenu() {
      return this._mainMenu;
    }
    constructor(e = null) {
      if (super(), t2.instance) throw new Error("Duplicate initialization");
      for (let n of y()) n.settingsScreen;
      this._modButtonOptions = e, t2.instance = this;
    }
    load() {
      if (!this._modButtonOptions) return;
      let e = this._modButtonOptions;
      this._mainMenu = e?.mainMenu ? new e.mainMenu(this) : new A(this), this._subscreens = [this._mainMenu];
      for (let n of y()) n.settingsScreen && this._subscreens.push(new n.settingsScreen(n));
      this._mainMenu.subscreens = this._subscreens, PreferenceRegisterExtensionSetting({ Identifier: this._modButtonOptions.identifier, ButtonText: this._modButtonOptions.buttonText, Image: this._modButtonOptions.image, load: r(async () => {
        this._mainMenu && await E(this._mainMenu);
      }, "load"), run: r(() => {
      }, "run"), click: r(() => {
      }, "click"), exit: r(() => {
      }, "exit") });
    }
  };
  var N = class t3 extends L {
    static {
      __name(this, "t");
    }
    static {
      r(this, "VersionModule");
    }
    static isItNewVersion = false;
    static version;
    static newVersionMessage;
    static showNewVersionMessage;
    static migrators = [];
    static beforeEach;
    static afterEach;
    static beforeAll;
    static afterAll;
    constructor(e) {
      super(), e ??= {}, t3.newVersionMessage = e.newVersionMessage, t3.showNewVersionMessage = e.showNewVersionMessage, e.migrators && (t3.migrators = e.migrators, t3.migrators.sort((n, i) => n.migrationVersion.localeCompare(i.migrationVersion, void 0, { numeric: true }))), t3.beforeEach = e.beforeEach, t3.afterEach = e.afterEach, t3.beforeAll = e.beforeAll, t3.afterAll = e.afterAll;
    }
    load() {
      t3.version = "1.0.0", t3.checkVersionUpdate(), CommonUnwrapThunk(t3.showNewVersionMessage) && t3.isItNewVersion && t3.sendNewVersionMessage();
    }
    static checkVersionUpdate() {
      let e = t3.loadVersion(), n = t3.version;
      t3.isNewVersion(e, n) && (t3.isItNewVersion = true, t3.checkVersionMigration(), t3.saveVersion()), p.save();
    }
    static checkVersionMigration() {
      let e = t3.loadVersion(), n = t3.migrators.filter((i) => t3.isNewVersion(e, i.migrationVersion));
      if (n.length) {
        t3.beforeAll?.();
        for (let i of n) t3.beforeEach?.(), i.migrate(), m.info(`Migrating from ${e} to ${i.migrationVersion} with ${i.constructor.name}`), t3.afterEach?.();
        t3.afterAll?.();
      }
    }
    static async sendNewVersionMessage() {
      if (!t3.newVersionMessage) return;
      let e = CommonUnwrapThunk(t3.newVersionMessage), n = e instanceof Promise ? await e : e, o = FriendListBeepLog.push({ MemberNumber: Player.MemberNumber, MemberName: define_MOD_INFO_default.name, ChatRoomName: g("module.version.version_update"), ChatRoomSpace: "X", Private: false, Sent: false, Time: /* @__PURE__ */ new Date(), Message: n }) - 1, s = g("module.version.new_version_toast_title", { $modName$: define_MOD_INFO_default.name, $modVersion$: t3.version }), a = FriendListBeepLog[o];
      ServerShowBeep(n, 1e4, { memberNumber: a.MemberNumber, memberName: a.MemberName, chatRoomName: a.ChatRoomName, ...a.Message && { onClick: r(() => {
        FriendListShowBeep(o);
      }, "onClick") } }, s);
    }
    static isNewVersion(e, n) {
      return e !== void 0 && e !== "" ? n.localeCompare(e, void 0, { numeric: true }) > 0 : true;
    }
    static saveVersion() {
      p.playerStorage && (p.playerStorage.Version = t3.version);
    }
    static loadVersion() {
      return p.playerStorage?.Version;
    }
  };
  var j = class extends I {
    static {
      __name(this, "j");
    }
    static {
      r(this, "GuiDebug");
    }
    static subscreenOptions = { name: "debug" };
    get pageStructure() {
      return [[{ type: "checkbox", id: "debug-show-incoming-server-transactions", label: "Show Incoming Server Transactions", setElementValue: r(() => this.module.debugSettings.showIncomingServerTransactions, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showIncomingServerTransactions = e;
      }, "setSettingValue") }, { type: "dropdown", id: "debug-incoming-filter-mode", label: "Filter Mode", description: ["Configure which incoming message types to show or hide.", ElementCreate({ tag: "br" }), "Include: only show these message types.", ElementCreate({ tag: "br" }), "Exclude: hide these message types."], optionsList: [{ attributes: { value: "include", label: "Include", selected: this.module.debugSettings.incomingMessageFilterMode === "include" } }, { attributes: { value: "exclude", label: "Exclude", selected: this.module.debugSettings.incomingMessageFilterMode === "exclude" } }], setSettingValue: r((e) => {
        this.module.debugSettings.incomingMessageFilterMode = e;
      }, "setSettingValue") }, { type: "text", id: "debug-incoming-message-types", label: "Message Types", description: 'Comma-separated list of message types (e.g., "ChatRoomChat, ChatRoomSync")', setElementValue: r(() => this.module.debugSettings.incomingMessageTypes, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.incomingMessageTypes = e;
      }, "setSettingValue") }, { type: "checkbox", id: "debug-show-outcoming-server-transactions", label: "Show Outcoming Server Transactions", setElementValue: r(() => this.module.debugSettings.showOutcomingServerTransactions, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showOutcomingServerTransactions = e;
      }, "setSettingValue") }, { type: "dropdown", id: "debug-outcoming-filter-mode", label: "Filter Mode", description: ["Configure which outcoming message types to show or hide.", ElementCreate({ tag: "br" }), "Include: only show these message types.", ElementCreate({ tag: "br" }), "Exclude: hide these message types."], optionsList: [{ attributes: { value: "include", label: "Include", selected: this.module.debugSettings.outcomingMessageFilterMode === "include" } }, { attributes: { value: "exclude", label: "Exclude", selected: this.module.debugSettings.outcomingMessageFilterMode === "exclude" } }], setSettingValue: r((e) => {
        this.module.debugSettings.outcomingMessageFilterMode = e;
      }, "setSettingValue") }, { type: "text", id: "debug-outcoming-message-types", label: "Message Types", description: 'Comma-separated list of message types (e.g., "ChatRoomMessage, AccountUpdate")', setElementValue: r(() => this.module.debugSettings.outcomingMessageTypes, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.outcomingMessageTypes = e;
      }, "setSettingValue") }, { type: "checkbox", id: "debug-show-raw-translations", label: "Show Raw Translations", setElementValue: r(() => this.module.debugSettings.showRawTranslations, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showRawTranslations = e;
      }, "setSettingValue") }, { type: "checkbox", id: "debug-show-file-names", label: "Show File Names", description: "Show the file name of the translation in the translation string.", setElementValue: r(() => this.module.debugSettings.showFileNames, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showFileNames = e;
      }, "setSettingValue") }, { type: "checkbox", id: "debug-show-raw-asset-names", label: "Show Raw Asset Names", setElementValue: r(() => this.module.debugSettings.showRawAssetNames, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showRawAssetNames = e;
      }, "setSettingValue") }, { type: "checkbox", id: "debug-show-raw-activity-names", label: "Show Raw Activity Names", setElementValue: r(() => this.module.debugSettings.showRawActivityNames, "setElementValue"), setSettingValue: r((e) => {
        this.module.debugSettings.showRawActivityNames = e;
      }, "setSettingValue") }], [{ type: "button", id: "test-deeplib-big-button", options: { label: "Big Button", tooltip: "This is a big button", image: "Icons/Exit.png" }, size: [405, 80], onClick() {
        C.info("Big Button Clicked");
      } }, { type: "button", id: "test-deeplib-small-button", options: { tooltip: "This is a small button", image: "Icons/Exit.png" }, size: [90, 90], onClick() {
        C.info("Small Button Clicked");
      } }, { type: "checkbox", id: "test-deeplib-checkbox", label: "Checkbox", description: "This is a checkbox", setElementValue() {
        return true;
      }, setSettingValue(e) {
        C.info("Checkbox value:", e);
      } }, { type: "text", id: "test-deeplib-text-input", label: "Input", description: "This is a text input", setElementValue() {
        return "Input Value";
      }, setSettingValue(e) {
        C.info("Input value:", e);
      } }, { type: "number", id: "test-deeplib-number-input", label: "Input", description: "This is a number input", setElementValue() {
        return "123";
      }, setSettingValue(e) {
        C.info("Input value:", e);
      } }, { type: "label", id: "test-deeplib-label", label: "Label", description: "This is a label" }], [{ type: "button", id: "test-deeplib-big-button2", options: { label: "Big Button", tooltip: "This is a big button", image: "Icons/Exit.png" }, size: [405, 80], onClick() {
        C.info("Big Button Clicked");
      } }, { type: "button", id: "test-deeplib-small-button2", options: { tooltip: "This is a small button", image: "Icons/Next.png" }, size: [90, 90], onClick() {
        C.info("Small Button Clicked");
      } }, { type: "checkbox", id: "test-deeplib-checkbox2", label: "Checkbox", description: "This is a checkbox", setElementValue() {
        return true;
      }, setSettingValue(e) {
        C.info("Checkbox value:", e);
      } }, { type: "text", id: "test-deeplib-text-input2", label: "Input", description: "This is a text input", setElementValue() {
        return "Input Value";
      }, setSettingValue(e) {
        C.info("Input value:", e);
      } }, { type: "number", id: "test-deeplib-number-input2", label: "Input", description: "This is a number input", setElementValue() {
        return "123";
      }, setSettingValue(e) {
        C.info("Input value:", e);
      } }, { type: "label", id: "test-deeplib-label2", label: "Label", description: "This is a label" }, { type: "dropdown", id: "test-deeplib-dropdown", label: "Dropdown", description: "This is a dropdown", optionsList: ["Option 1", "Option 2", "Option 3"], setElementValue() {
        return "Option 2";
      }, setSettingValue(e) {
        C.info("Dropdown value:", e);
      } }]];
    }
    exit() {
      this.module.saveDebugSettings(), super.exit();
    }
  };
  function me(t8) {
    return t8 !== null && typeof t8 == "object" && Object.getPrototypeOf(t8) === Object.prototype && !Array.isArray(t8);
  }
  __name(me, "me");
  r(me, "isPlainObject");
  function f(t8, e, n = { concatArrays: true, matchingOnly: false }) {
    if (t8 === void 0) return e;
    if (e === void 0) return t8;
    if (Array.isArray(t8) && Array.isArray(e) && n.concatArrays) return [...t8, ...e];
    if (me(t8) && me(e)) {
      let i = { ...t8 }, o = Object.keys(t8).length === 0, s = n.matchingOnly && !o ? Object.keys(e).filter((a) => a in t8) : Object.keys(e);
      for (let a of s) a === "__proto__" || a === "constructor" || a === "prototype" || (i[a] = a in t8 ? f(t8[a], e[a], n) : e[a]);
      return i;
    }
    return e;
  }
  __name(f, "f");
  r(f, "deepMerge");
  function Kt(t8) {
    let e = JSON.parse(JSON.stringify(t8)), n = [];
    for (; e.length > 0; ) {
      let i = Math.floor(Math.random() * e.length);
      n.push(e[i]), e.splice(i, 1);
    }
    return n;
  }
  __name(Kt, "Kt");
  r(Kt, "shuffleArray");
  function O(t8, e) {
    let n = t8.split("."), i = globalThis;
    for (let o = 0; o < n.length - 1; o++) i[n[o]] || (i[n[o]] = {}), i = i[n[o]];
    i[n[n.length - 1]] = e;
  }
  __name(O, "O");
  r(O, "exportToGlobal");
  function q(t8, e) {
    for (; t8 && t8 !== Object.prototype; ) {
      if (Object.getOwnPropertyDescriptor(t8, e)?.get) return true;
      t8 = Object.getPrototypeOf(t8);
    }
    return false;
  }
  __name(q, "q");
  r(q, "hasGetter");
  function Jt(t8, e) {
    for (; t8 && t8 !== Object.prototype; ) {
      if (Object.getOwnPropertyDescriptor(t8, e)?.set) return true;
      t8 = Object.getPrototypeOf(t8);
    }
    return false;
  }
  __name(Jt, "Jt");
  r(Jt, "hasSetter");
  var he = r((t8) => Math.round(t8 / 100) / 10, "byteToKB");
  function X(t8, e) {
    try {
      return { ok: true, value: t8() };
    } catch (n) {
      return { ok: false, error: e ? e(n) : n };
    }
  }
  __name(X, "X");
  r(X, "tryCatch");
  async function pe(t8, e) {
    try {
      return { ok: true, value: await t8() };
    } catch (n) {
      return { ok: false, error: e ? e(n) : n };
    }
  }
  __name(pe, "pe");
  r(pe, "tryCatchAsync");
  var u = { createButton: Me, createCheckbox: Ve, createInput: Ae, createLabel: We, createCustom: Re, createDropdown: De, createTooltip: Xe, getTooltip: fe, setTooltip: ee, createBackNext: Ne };
  function Me(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(t8.id);
    if (e) return e;
    t8.type = "button";
    let n;
    t8.options?.image && (n = t8.options.image, t8.options.image = void 0);
    let i = typeof t8?.disabled == "function" ? t8?.disabled() : t8?.disabled, o = ElementButton.Create(t8.id, t8?.onClick ?? (() => {
    }), f({ labelPosition: "center" }, t8.options), f({ button: { classList: ["deeplib-button"], attributes: { disabled: i }, children: [n ? f({ tag: "img", attributes: { id: `${t8.id}-image`, alt: "", decoding: "async", loading: "lazy", src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" }, style: { "--image": `url("${n}")` } }, t8.htmlOptions?.img) : void 0] } }, t8.htmlOptions ?? {}));
    return I.currentElements.push([o, t8]), o;
  }
  __name(Me, "Me");
  r(Me, "elementCreateButton");
  function Ve(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(t8.id);
    if (e) return e;
    t8.type = "checkbox";
    let n = typeof t8?.disabled == "function" ? t8?.disabled() : t8?.disabled, i = ElementCreate(f({ tag: "label", classList: ["deeplib-checkbox-container", t8?.options?.direction ?? "rowReverse"], attributes: { id: `${t8.id}-container`, for: t8.id }, children: [t8.label ? f({ tag: "span", classList: ["deeplib-text"], attributes: { id: `${t8.id}-label` }, children: [t8.label] }, t8.htmlOptions?.label) : void 0, f({ tag: "input", classList: ["checkbox", "deeplib-input"], attributes: { type: "checkbox", id: t8.id, disabled: n, checked: t8?.setElementValue?.() || void 0 }, eventListeners: { change: r(function() {
      t8?.setSettingValue?.(this.checked);
    }, "change") } }, t8.htmlOptions?.checkbox)] }, t8.htmlOptions?.container));
    return t8.description && (i.addEventListener("mouseover", function(o) {
      z.call(this, o, t8.description || null);
    }), i.addEventListener("mouseout", function(o) {
      P.call(this, o);
    })), I.currentElements.push([i, t8]), i;
  }
  __name(Ve, "Ve");
  r(Ve, "elementCreateCheckbox");
  function Re(t8) {
    t8.id ??= ElementGenerateID(), t8.htmlOptions.attributes ??= {}, t8.htmlOptions.attributes.id ??= t8.id;
    let e = document.getElementById(t8.htmlOptions.attributes.id);
    if (e) return e;
    t8.type = "custom";
    let n = ElementCreate(t8.htmlOptions);
    return I.currentElements.push([n, t8]), n;
  }
  __name(Re, "Re");
  r(Re, "elementCreateCustom");
  function Ae(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(t8.id);
    if (e) return e;
    let n = typeof t8?.disabled == "function" ? t8?.disabled() : t8?.disabled, i = ElementCreate(f({ tag: "label", classList: ["deeplib-input-container", t8?.options?.direction ?? void 0], attributes: { id: `${t8.id}-container`, for: t8.id }, children: [t8.label ? f({ tag: "span", classList: ["deeplib-text"], attributes: { id: `${t8.id}-label` }, children: [t8.label] }, t8.htmlOptions?.label) : void 0, f({ tag: "input", classList: ["deeplib-input"], attributes: { type: t8.type, id: t8.id, placeholder: " ", disabled: n, value: t8?.setElementValue?.() || void 0 }, eventListeners: { input: r(function() {
      t8?.setSettingValue?.(this.value);
    }, "input") } }, t8.htmlOptions?.input)] }, t8.htmlOptions?.container));
    return t8.description && (i.addEventListener("mouseover", function(o) {
      z.call(this, o, t8.description || null);
    }), i.addEventListener("mouseout", function(o) {
      P.call(this, o);
    })), I.currentElements.push([i, t8]), i;
  }
  __name(Ae, "Ae");
  r(Ae, "elementCreateInput");
  function We(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(t8.id);
    if (e) return e;
    t8.type = "label";
    let n = ElementCreate(f({ tag: "label", classList: ["deeplib-label", "deeplib-text"], attributes: { id: t8.id }, children: [t8.label] }, t8.htmlOptions));
    return t8.description && (n.addEventListener("mouseover", function(i) {
      z.call(this, i, t8.description || null);
    }), n.addEventListener("mouseout", function(i) {
      P.call(this, i);
    })), I.currentElements.push([n, t8]), n;
  }
  __name(We, "We");
  r(We, "elementCreateLabel");
  function De(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(`${t8.id}-container`);
    if (e) return e;
    t8.type = "dropdown";
    let n = ElementDropdown.CreateLabelled(t8.id, t8.optionsList, t8.label ?? "", t8.onChange ?? function() {
      return t8.setSettingValue?.(this.value);
    }, t8.options, f({ container: { classList: ["deeplib-dropdown-container", t8?.options?.direction ?? void 0], attributes: { id: `${t8.id}-container`, for: t8.id }, eventListeners: { mouseover: r(function(i) {
      z.call(this, i, t8.description || null);
    }, "mouseover"), mouseout: r(function(i) {
      P.call(this, i);
    }, "mouseout") } }, label: { classList: ["deeplib-text"], attributes: { id: `${t8.id}-label` } } }, t8.htmlOptions));
    return I.currentElements.push([n, t8]), n;
  }
  __name(De, "De");
  r(De, "elementCreateDropdown");
  function Xe() {
    return ElementCreate({ tag: "div", classList: ["deeplib-tooltip", "anchor-bottom"], attributes: { id: "deeplib-tooltip" }, style: { display: "none" } });
  }
  __name(Xe, "Xe");
  r(Xe, "elementCreateTooltip");
  function fe() {
    return document.getElementById("deeplib-tooltip") ?? void 0;
  }
  __name(fe, "fe");
  r(fe, "elementGetTooltip");
  function z(t8, e) {
    let n = this.getBoundingClientRect();
    ee(e, "bottom");
    let i = fe();
    if (i) {
      i.offsetHeight;
      let o = i.getBoundingClientRect();
      (S.doRectsOverlap(n, o) ? "top" : "bottom") === "top" && ve("top");
    }
  }
  __name(z, "z");
  r(z, "tooltipMouseOver");
  function P(t8) {
    ee(null);
  }
  __name(P, "P");
  r(P, "tooltipMouseOut");
  function ee(t8, e = "bottom") {
    let n = document.getElementById("deeplib-tooltip");
    if (!n) return false;
    ve(e);
    let i = t8 == null ? null : CommonIsObject(t8) && "tag" in t8 ? [ElementCreate(t8)] : CommonIsArray(t8) ? t8.map((o) => CommonIsObject(o) && "tag" in o ? ElementCreate(o) : typeof o == "string" || CommonIsObject(t8) && "tag" in t8 || o instanceof HTMLElement ? o : null).filter((o) => o !== null) : typeof t8 == "string" ? [t8] : null;
    return i === null ? (n.childNodes.forEach((o) => o.remove()), n.style.display = "none", true) : (n.replaceChildren(...i), n.style.display = "", true);
  }
  __name(ee, "ee");
  r(ee, "elementSetTooltip");
  function ve(t8) {
    let e = document.getElementById("deeplib-tooltip");
    if (!e) return false;
    e.classList.toggle("anchor-bottom", t8 === "bottom"), e.classList.toggle("anchor-top", t8 === "top");
  }
  __name(ve, "ve");
  r(ve, "elementSetTooltipPosition");
  function Ne(t8) {
    t8.id ??= ElementGenerateID();
    let e = document.getElementById(t8.id);
    if (e) return e;
    let n = r((a) => {
      let c = document.getElementById(`${t8.id}-label`);
      if (!c) return false;
      c.textContent = a;
    }, "setLabel"), i = r((a) => {
      let c = document.getElementById(`deeplib-prev-next-${t8.id}-prev-button-tooltip`);
      if (!c) return false;
      c.textContent = a;
    }, "setPrevTooltip"), o = r((a) => {
      let c = document.getElementById(`deeplib-prev-next-${t8.id}-next-button-tooltip`);
      if (!c) return false;
      c.textContent = a;
    }, "setNextTooltip");
    return ElementCreate({ tag: "div", classList: ["deeplib-prev-next"], attributes: { id: t8.id }, children: [u.createButton({ id: `deeplib-prev-next-${t8.id}-prev-button`, onClick: r(() => {
      t8.back({ setLabel: n, setBackTooltip: i, setNextTooltip: o });
    }, "onClick"), htmlOptions: { button: { classList: ["deeplib-prev-next-button"] } }, options: { noStyling: true, image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/arrow_left.svg`, tooltip: t8.initialPrevTooltip } }), u.createLabel({ id: `${t8.id}-label`, label: t8.initialLabel, htmlOptions: { classList: ["deeplib-prev-next-label"] } }), u.createButton({ id: `deeplib-prev-next-${t8.id}-next-button`, onClick: r(() => {
      t8.next({ setLabel: n, setBackTooltip: i, setNextTooltip: o });
    }, "onClick"), htmlOptions: { button: { classList: ["deeplib-prev-next-button"] } }, options: { noStyling: true, image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/arrow_right.svg`, tooltip: t8.initialNextTooltip } })] });
  }
  __name(Ne, "Ne");
  r(Ne, "elementPrevNext");
  var A = class t4 extends I {
    static {
      __name(this, "t");
    }
    static {
      r(this, "MainMenu");
    }
    subscreens = [];
    static options = {};
    static subscreenOptions = { name: "mainmenu", doShowExitButton: false, settingsWidth: 600 };
    constructor(e) {
      super(e), this.subscreens = e.subscreens;
    }
    load() {
      if (!M.instance || CurrentModule !== "DeepLibMod") {
        this.setSubscreen(this);
        return;
      }
      super.load();
      let e = u.createButton({ id: "exit", size: [90, 90], onClick: r(() => {
        this.exit();
      }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/exit.svg`, tooltip: g("settings.button.back_button_hint") } }), n = document.getElementById("deeplib-nav-menu");
      n && n.append(e);
      for (let o of this.subscreens) {
        if (o.options.name === "mainmenu") continue;
        let s = u.createButton({ id: `${o.options.name}-button`, onClick: r(() => {
          this.setSubscreen(o);
        }, "onClick"), size: [null, 90], options: { image: o.options.icon, label: g(`mainmenu.button.${o.options.name}`) } });
        b.appendToSettingsDiv(s);
      }
      let i = b.getMiscDiv();
      if (b.appendToSubscreen(i), t4.options.wikiLink) {
        let o = u.createButton({ id: "deeplib-wiki-button", onClick: r(() => {
          window.open(t4.options.wikiLink, "_blank");
        }, "onClick"), size: [null, 80], options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/notebook.svg`, label: g("mainmenu.button.wiki") } });
        b.appendToMiscDiv(o);
      }
      if (t4.options.repoLink) {
        let o = u.createButton({ id: "deeplib-repo-button", onClick: r(() => {
          window.open(t4.options.repoLink, "_blank");
        }, "onClick"), size: [null, 80], options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/git.svg`, label: g("mainmenu.button.repo") } });
        b.appendToMiscDiv(o);
      }
      if (t4.options.resetSubscreen) {
        let o = u.createButton({ id: "deeplib-reset-button", onClick: r(() => {
          this.setSubscreen(t4.options.resetSubscreen);
        }, "onClick"), size: [null, 80], options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/trash_bin.svg`, label: g("mainmenu.button.reset") } });
        b.appendToMiscDiv(o);
      }
      if (t4.options.importExportSubscreen) {
        let o = u.createButton({ id: "deeplib-import-export-button", onClick: r(() => {
          this.setSubscreen(t4.options.importExportSubscreen);
        }, "onClick"), size: [null, 80], options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/transfer.svg`, label: g("mainmenu.button.import_export") } });
        b.appendToMiscDiv(o);
      }
      if (t4.options.storageFullnessIndicator) {
        let s = he(p.storageSize()), a = (s / 180 * 100).toFixed(1), c = u.createButton({ id: CommonGenerateUniqueID(), size: [null, 80], options: { tooltipPosition: "left", noStyling: true, tooltip: g("mainmenu.meter.storage_hint", { $percentage$: a }), label: g("mainmenu.meter.storage_label", { $currentCapacity$: s, $maxCapacity$: 180 }) }, htmlOptions: { button: { children: [{ tag: "div", attributes: { id: "deeplib-storage-meter" }, children: [{ tag: "div", attributes: { id: "deeplib-storage-bar" }, style: { width: `${a}%` } }] }] } } });
        b.appendToMiscDiv(c);
      }
      if (B("DebugModule")) {
        let o = u.createButton({ id: "deeplib-debug-button", onClick: r(() => {
          this.setSubscreen(new j(B("DebugModule")));
        }, "onClick"), size: [90, 90], options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/bug.svg` } });
        n && n.prepend(o);
      }
    }
    run() {
      super.run();
    }
    click() {
    }
    exit() {
      CharacterAppearanceForceUpCharacter = -1, CharacterLoadCanvas(Player);
      let e = typeof this.options.returnScreen == "function" ? this.options.returnScreen() : this.options.returnScreen;
      e ? e instanceof I ? E(e).then(() => {
      }) : Array.isArray(e) && CommonSetScreen(...e) : PreferenceOpenSubscreen("Extensions").then(() => {
        PreferenceSubscreenExtensionsClear();
      });
    }
    resize() {
      super.resize(), ElementSetPosition("deeplib-misc", 1905, 930, "bottom-right"), ElementSetSize("deeplib-misc", 405, null);
    }
    static setOptions(e) {
      t4.options = e;
    }
  };
  var F = class t5 {
    static {
      __name(this, "t");
    }
    static {
      r(this, "Localization");
    }
    static LibTranslation = {};
    static ModTranslation = {};
    static PathToModTranslation;
    static PathToLibTranslation = `${"https://protokink.github.io/Responsive/dev/public"}/dl_translations/`;
    static DefaultLanguage = "en";
    static FetchFolder = false;
    static initialized = false;
    static async init(e) {
      if (t5.initialized) return;
      t5.initialized = true, t5.PathToModTranslation = (() => {
        if (e?.pathToTranslationsFolder) return e.pathToTranslationsFolder.endsWith("/") ? e.pathToTranslationsFolder : `${e.pathToTranslationsFolder}/`;
      })(), t5.DefaultLanguage = e?.defaultLanguage || t5.DefaultLanguage, t5.FetchFolder = e?.fetchFolder || t5.FetchFolder;
      let n = e?.fixedLanguage ? t5.DefaultLanguage : TranslationLanguage.toLowerCase(), i = await t5.fetchTranslation(t5.PathToLibTranslation, n);
      if (n === t5.DefaultLanguage) t5.LibTranslation = i;
      else {
        let s = await t5.fetchTranslation(t5.PathToLibTranslation, t5.DefaultLanguage);
        t5.LibTranslation = { ...s, ...i };
      }
      if (!t5.PathToModTranslation) return;
      let o = await t5.fetchTranslation(t5.PathToModTranslation, n, t5.FetchFolder);
      if (n === t5.DefaultLanguage) t5.ModTranslation = o;
      else {
        let s = await t5.fetchTranslation(t5.PathToModTranslation, t5.DefaultLanguage, t5.FetchFolder);
        t5.ModTranslation = { ...s, ...o };
      }
    }
    static unload() {
      t5.initialized = false, t5.LibTranslation = {}, t5.ModTranslation = {}, t5.PathToModTranslation = void 0, t5.PathToLibTranslation = `${"https://protokink.github.io/Responsive/dev/public"}/dl_translations/`, t5.DefaultLanguage = "en", t5.FetchFolder = false;
    }
    static getTextMod(e) {
      return t5.ModTranslation?.[e] || void 0;
    }
    static getTextLib(e) {
      return t5.LibTranslation?.[e] || void 0;
    }
    static async fetchTranslation(e, n, i = false) {
      if (i) {
        let a = `${e}${n}/`, c = await this.fetchLanguageFolder(a);
        if (Object.keys(c).length > 0) return c;
      }
      let o = `${e}${n}.lang`, s = await t5.fetchLanguageFile(o);
      if (n !== t5.DefaultLanguage && !s) {
        let a = `${e}${t5.DefaultLanguage}.lang`;
        return await this.fetchLanguageFile(a) || {};
      }
      return s || {};
    }
    static async fetchLanguageFile(e) {
      let n = await fetch(e).catch((o) => (m.error("Failed to fetch translation file:", o), new Response(null, { status: 500 })));
      if (!n.ok) return false;
      let i = await n.text();
      return this.parseTranslation(i);
    }
    static async fetchLanguageFolder(e) {
      let n = {}, i = "manifest.txt", o = null, s = await fetch(`${e}${i}`).catch((a) => (m.error("Failed to fetch language folder manifest:", a), new Response(null, { status: 500 })));
      if (s.ok && (o = (await s.text()).trim().split(`
`).map((c) => c.trim()).filter((c) => c && !c.startsWith("#"))), o && o.length > 0) {
        let a = o.map(async (d) => {
          try {
            let l = await t5.fetchLanguageFile(`${e}${d}`);
            if (l) return l;
          } catch {
          }
          return {};
        }), c = await Promise.all(a);
        for (let d of c) Object.assign(n, d);
        if (Object.keys(n).length > 0) return n;
      }
      return n;
    }
    static parseTranslation(e) {
      let n = {}, i = e.split(`
`);
      for (let o of i) {
        let s = o.trim();
        if (!s || s.startsWith("#")) continue;
        let [a, ...c] = s.split("=");
        n[a.trim()] = c.join("=").trim();
      }
      return n;
    }
  };
  var g = r((t8, e) => {
    let n = F.getTextMod(t8) || F.getTextLib(t8) || t8;
    if (e) {
      let i = Object.fromEntries(Object.entries(e).map(([o, s]) => [o, s.toString()]));
      return CommonStringPartitionReplace(n, i).join("");
    }
    return n;
  }, "getText");
  var W = class t6 {
    static {
      __name(this, "t");
    }
    constructor(e) {
      this.opts = e;
      e ??= {}, e.closeOnBackdrop ??= true, e.modalClassList ??= [];
      let n = `modal-prompt-${Date.now()}`, i = (CommonIsArray(e.prompt) ? e.prompt : [e.prompt]).filter((o) => o !== null) ?? [""];
      this.dialog = ElementCreate({ tag: "dialog", classList: ["deeplib-modal", ...e.modalClassList], attributes: { id: this.opts.modalId ?? `modal-${Date.now()}`, role: "dialog", "aria-modal": "true", "aria-labelledby": n }, children: [{ tag: "div", classList: ["deeplib-modal-prompt-container"], children: [...i] }, { tag: "div", classList: ["deeplib-modal-prompt"], attributes: { id: n }, children: [e.input ? this.renderInput(e.input) : void 0] }, this.renderButtons()] }), ElementSetFontSize(this.dialog, "auto"), this.blocker = this.createBlocker(), this.renderButtons(), document.body.append(this.createBlocker(), this.dialog), this.setupFocusTrap(), e.timeoutMs && (this.timeoutId = window.setTimeout(() => this.close("timeout"), e.timeoutMs)), e.onShow && e.onShow.call(this.dialog), this.updateIntervalId = window.setInterval(() => {
        ElementSetFontSize(this.dialog, "auto");
      }, 1e3);
    }
    opts;
    static {
      r(this, "Modal");
    }
    dialog;
    blocker;
    inputEl;
    timeoutId;
    updateIntervalId;
    static queue = [];
    static processing = false;
    show() {
      return t6.enqueue(this);
    }
    static async alert(e, n = {}) {
      await new t6({ prompt: e, buttons: [...n.buttons ?? [], { action: "close", text: g("modal.button.ok") }], timeoutMs: n.timeoutMs, escapeAction: "close", modalId: n.modalId, modalClassList: n.modalClassList, onShow: n.onShow }).show();
    }
    static async confirm(e, n = {}) {
      let [i] = await new t6({ prompt: e, buttons: [...n.buttons ?? [], { text: g("modal.button.decline"), action: "decline" }, { text: g("modal.button.confirm"), action: "confirm" }], escapeAction: "decline", enterAction: "confirm", modalId: n.modalId, modalClassList: n.modalClassList, onShow: n.onShow }).show();
      return i === "confirm";
    }
    static async prompt(e, n = {}) {
      let [i, o] = await new t6({ prompt: e, timeoutMs: 0, input: { type: "input", defaultValue: n.defaultValue }, buttons: [...n.buttons ?? [], { text: g("modal.button.cancel"), action: "cancel" }, { text: g("modal.button.submit"), action: "submit" }], escapeAction: "cancel", enterAction: "submit", modalId: n.modalId, modalClassList: n.modalClassList, onShow: n.onShow }).show();
      return i === "submit" ? o : null;
    }
    renderInput(e) {
      let n = document.createElement(e.type);
      return n.classList.add("deeplib-modal-input"), e.placeholder && (n.placeholder = e.placeholder), e.readOnly && (n.readOnly = true), e.defaultValue && (n.value = e.defaultValue), e.type === "textarea" && (n.rows = 5), n.addEventListener("input", () => {
        let i = e.validate?.(n.value);
        n.setCustomValidity(i || "");
      }), this.inputEl = n, n;
    }
    renderButtons() {
      let e = document.createElement("div");
      return e.classList.add("deeplib-modal-button-container"), (this.opts.buttons ? [...this.opts.buttons] : []).forEach((i) => {
        let o = u.createButton({ id: `deeplib-modal-${i.action}`, onClick: r(() => typeof i.action == "function" ? i.action() : this.close(i.action), "onClick"), options: { disabled: i.disabled, label: i.text } });
        e.append(o);
      }), e;
    }
    createBlocker() {
      let e = document.createElement("div");
      return e.classList.add("deeplib-modal-blocker"), e.title = "Click to close", this.opts.closeOnBackdrop !== false && e.addEventListener("click", () => this.close("close")), e;
    }
    setupFocusTrap() {
      let n = Array.from(this.dialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')), i = n[0], o = n[n.length - 1];
      this.dialog.addEventListener("keydown", (s) => {
        if (s.key === "Tab") {
          if (n.length === 0) {
            s.preventDefault();
            return;
          }
          s.shiftKey ? document.activeElement === i && (o.focus(), s.preventDefault()) : document.activeElement === o && (i.focus(), s.preventDefault());
        } else if (s.key === "Escape") s.stopPropagation(), this.close(this.opts.escapeAction ?? "close");
        else if (s.key === "Enter") {
          if (n.some((a) => a === document.activeElement) && document.activeElement !== this.inputEl) return;
          s.preventDefault(), s.stopPropagation(), this.close(this.opts.enterAction ?? "submit");
        }
      }), window.requestAnimationFrame(() => {
        (this.inputEl || i)?.focus();
      });
    }
    close(e) {
      this.timeoutId && clearTimeout(this.timeoutId), clearInterval(this.updateIntervalId), this.dialog.close(), this.dialog.remove(), this.blocker.remove(), document.body.querySelector(".deeplib-modal-blocker")?.remove();
      let n = this.inputEl?.value ?? "";
      this.resolve([e, n]), t6.dequeue();
    }
    resolve = r(() => {
    }, "resolve");
    static enqueue(e) {
      return t6.queue.push(e), t6.processing || t6.dequeue(), new Promise((n) => e.resolve = n);
    }
    static dequeue() {
      let e = t6.queue.shift();
      e ? (t6.processing = true, e.dialog.show()) : t6.processing = false;
    }
  };
  var Ie = class extends I {
    static {
      __name(this, "Ie");
    }
    static {
      r(this, "GuiImportExport");
    }
    importExportOptions;
    static subscreenOptions = { name: "import-export" };
    constructor(e) {
      super(), this.importExportOptions = e;
    }
    load() {
      super.load();
      let e = u.createButton({ id: "deeplib-import-file-button", size: [600, 90], onClick: r(() => {
        this.dataImport("file");
      }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/file_import.svg`, label: g("import-export.button.import_file") } });
      b.appendToSettingsDiv(e);
      let n = u.createButton({ id: "deeplib-export-file-button", size: [600, 90], onClick: r(() => {
        this.dataExport("file");
      }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/file_export.svg`, label: g("import-export.button.export_file") } });
      b.appendToSettingsDiv(n);
      let i = u.createButton({ id: "deeplib-import-clipboard-button", size: [600, 90], onClick: r(() => {
        this.dataImport("clipboard");
      }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/clipboard_import.svg`, label: g("import-export.button.import_clipboard") } });
      b.appendToSettingsDiv(i);
      let o = u.createButton({ id: "deeplib-export-clipboard-button", size: [600, 90], onClick: r(() => {
        this.dataExport("clipboard");
      }, "onClick"), options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/clipboard_export.svg`, label: g("import-export.button.export_clipboard") } });
      b.appendToSettingsDiv(o);
    }
    resize() {
      super.resize();
    }
    async dataExport(e) {
      try {
        let n = await this.getSelectedModules(y(), "export");
        if (!n) return;
        if (n.length === 0) {
          ToastManager.error("No modules selected for export.");
          return;
        }
        let i = this.buildExportPayload(n);
        if (e === "clipboard") await this.exportToClipboard(i);
        else if (e === "file" && !await this.exportToFile(i, "settings")) return;
        this.importExportOptions.onExport?.(), ToastManager.success("Data exported successfully.");
      } catch (n) {
        ToastManager.error("Data export failed."), m.error("Data export failed.", n);
      }
    }
    async dataImport(e) {
      try {
        let n = e === "clipboard" ? await this.importFromClipboard() : await this.importFromFile();
        if (n === null) return;
        if (!n) throw new Error("No data");
        if (!await this.applyImportPayload(n)) return;
        this.importExportOptions.onImport?.(), ToastManager.success("Data imported successfully.");
      } catch (n) {
        ToastManager.error("Data import failed."), m.error("Data import failed.", n);
      }
    }
    async exportToFile(e, n) {
      let i = this.importExportOptions.customFileExtension.startsWith(".") ? this.importExportOptions.customFileExtension : "." + this.importExportOptions.customFileExtension;
      if ("showSaveFilePicker" in window) try {
        let s = await (await window.showSaveFilePicker({ suggestedName: n + i, types: [{ description: "Custom Data Files", accept: { "text/plain": [i] } }] })).createWritable();
        return await s.write(e), await s.close(), true;
      } catch (o) {
        let s = o instanceof Error ? o.message : String(o);
        throw new Error(`File save cancelled or failed: ${s}`, { cause: o });
      }
      else {
        let o = await W.prompt("Enter file name", { defaultValue: n });
        if (o === null) return false;
        if (o === "") throw new Error("File name cannot be empty.");
        let s = new Blob([e], { type: "text/plain" }), a = ElementCreate({ tag: "a", attributes: { href: URL.createObjectURL(s), download: o + i } });
        return a.click(), URL.revokeObjectURL(a.href), true;
      }
    }
    async importFromFile() {
      let e = this.importExportOptions.customFileExtension.startsWith(".") ? this.importExportOptions.customFileExtension : "." + this.importExportOptions.customFileExtension;
      async function n(i) {
        if (!i.name.endsWith(e)) throw new Error(`Invalid file type. Expected a ${e} file.`);
        return new Promise((o, s) => {
          let a = new FileReader();
          a.onload = () => o(a.result), a.onerror = () => s(new Error("Failed to read file.")), a.readAsText(i);
        });
      }
      __name(n, "n");
      if (r(n, "importFromFileInternal"), "showOpenFilePicker" in window) try {
        let [i] = await window.showOpenFilePicker({ types: [{ description: "Custom Data Files", accept: { "text/plain": [e] } }], multiple: false }), o = await i.getFile();
        return await n(o);
      } catch (i) {
        let o = i instanceof Error ? i.message : String(i);
        throw new Error(`File selection cancelled or failed: ${o}`, { cause: i });
      }
      else return new Promise((i, o) => {
        let s = document.createElement("input");
        s.type = "file", s.accept = e, s.onchange = async (a) => {
          let c = a.target.files?.[0];
          if (c) try {
            let d = await n(c);
            i(d);
          } catch (d) {
            o(d);
          }
          else o(new Error("No file selected."));
        }, s.click();
      });
    }
    async exportToClipboard(e) {
      return navigator.clipboard.writeText(e).catch((n) => {
        let i = n instanceof Error ? n.message : String(n);
        throw new Error(`Failed to copy data to clipboard: ${i}`, { cause: n });
      });
    }
    async importFromClipboard() {
      return W.prompt("Enter data to import").catch((e) => {
        let n = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to read data from clipboard: ${n}`, { cause: e });
      });
    }
    async getSelectedModules(e, n) {
      let i = e.filter((l) => q(l, "settings") && !!l.settings), o = Object.fromEntries(i.map((l) => [l.constructor.name, true]));
      if (i.length === 0) throw new Error("No modules to choose from.");
      let s = i.map((l) => u.createCheckbox({ id: l.constructor.name, label: g(l.constructor.name), setElementValue: r(() => o[l.constructor.name], "setElementValue"), setSettingValue: r((h) => o[l.constructor.name] = h, "setSettingValue") })), a = n === "import" ? "import_export.import.select_modules" : "import_export.export.select_modules";
      if (!await W.confirm([g(a), ElementCreate({ tag: "br" }), g("import_export.text.not_sure"), { tag: "div", classList: ["deeplib-modal-checkbox-container"], children: s }], { modalId: "deeplib-modal-import_export" })) return null;
      let d = Object.entries(o).filter(([l, h]) => h).map(([l]) => B(l)).filter((l) => !!l);
      if (d.length === 0) throw new Error("No modules selected.");
      return d;
    }
    buildExportPayload(e) {
      let n = {};
      for (let i of e) !q(i, "settings") || i.settings === null || (n[i.constructor.name] = i.settings);
      return LZString.compressToBase64(JSON.stringify(n));
    }
    async applyImportPayload(e) {
      let n = JSON.parse(LZString.decompressFromBase64(e) ?? "");
      if (!n) throw new Error("Invalid import format.");
      let i = Object.keys(n).map((s) => B(s)).filter((s) => !!s), o = await this.getSelectedModules(i, "import");
      if (!o) return false;
      if (o.length === 0) throw new Error("No modules selected.");
      for (let s of o) {
        let a = n[s.constructor.name];
        if (!a) continue;
        let c = f(s.defaultSettings, a);
        c && (s.settings = c);
      }
      return true;
    }
  };
  var Q = class t7 {
    static {
      __name(this, "t");
    }
    static {
      r(this, "ModStorage");
    }
    static _instance = null;
    modName;
    constructor(e) {
      return t7._instance || (t7._instance = this, this.modName = e), this.modName ??= e, t7._instance;
    }
    get playerStorage() {
      return Player[this.modName];
    }
    set playerStorage(e) {
      Player[this.modName] = e;
    }
    get extensionStorage() {
      return Player.ExtensionSettings[this.modName];
    }
    set extensionStorage(e) {
      Player.ExtensionSettings[this.modName] = e;
    }
    setLocalStorage(e, n) {
      localStorage.setItem(`${this.modName}_${e}`, t7.dataCompress(n));
    }
    getLocalStorage(e) {
      let n = localStorage.getItem(`${this.modName}_${e}`);
      return n ? t7.dataDecompress(n) : null;
    }
    load() {
      if (this.extensionStorage) {
        let e = t7.dataDecompress(this.extensionStorage || "");
        e === null || !Object.hasOwn(e, "Version") ? this.playerStorage = { Version: "1.0.0" } : this.playerStorage = e;
      } else this.playerStorage = {};
    }
    save() {
      this.extensionStorage || (this.extensionStorage = ""), this.extensionStorage = t7.dataCompress(this.playerStorage), ServerPlayerExtensionSettingsSync(this.modName);
    }
    storageSize() {
      return t7.measureSize(this.extensionStorage);
    }
    static dataDecompress(e) {
      let n = LZString.decompressFromBase64(e), i = null;
      try {
        i = JSON.parse(n);
      } catch (o) {
        m.error(o);
      }
      return i;
    }
    static dataCompress(e) {
      return LZString.compressToBase64(JSON.stringify(e));
    }
    static measureSize(e) {
      try {
        if (typeof e != "string" && (e = JSON.stringify(e) || ""), typeof e == "string") return new TextEncoder().encode(e).byteLength;
        throw new Error();
      } catch {
        return NaN;
      }
    }
  };
  var S = { autoSetPosition: Ue, autoSetSize: Qe, hide: Ye, unhide: He, hasOverflow: je, doRectsOverlap: ze };
  function Ue(t8, e) {
    let n, i, o;
    if (Array.isArray(e)) n = e[0], i = e[1], o = e[2];
    else if (typeof e == "function") {
      let s = e();
      n = s[0], i = s[1], o = s[2];
    }
    n !== void 0 && i !== void 0 && ElementSetPosition(t8, n, i, o);
  }
  __name(Ue, "Ue");
  r(Ue, "autoSetPosition");
  function Qe(t8, e) {
    let n, i;
    if (Array.isArray(e)) n = e[0], i = e[1];
    else if (typeof e == "function") {
      let o = e();
      n = o[0], i = o[1];
    }
    n !== void 0 && i !== void 0 && ElementSetSize(t8, n, i);
  }
  __name(Qe, "Qe");
  r(Qe, "autoSetSize");
  function Ye(t8) {
    let e = ElementWrap(t8);
    e && (e.style.display = "none");
  }
  __name(Ye, "Ye");
  r(Ye, "hide");
  function He(t8) {
    let e = ElementWrap(t8);
    e && (e.style.display = "");
  }
  __name(He, "He");
  r(He, "unhide");
  function je(t8) {
    let e = ElementWrap(t8);
    if (!e) return null;
    let n = e.scrollHeight > e.clientHeight, i = e.scrollWidth > e.clientWidth;
    return { any: n || i, vertical: n, horizontal: i };
  }
  __name(je, "je");
  r(je, "hasOverflow");
  function ze(t8, e) {
    return !(t8.right < e.left || t8.left > e.right || t8.bottom < e.top || t8.top > e.bottom);
  }
  __name(ze, "ze");
  r(ze, "doRectsOverlap");
  var b = { getSubscreen: te, appendToSubscreen: Ke, removeSubscreen: Pe, getSettingsDiv: ne, appendToSettingsDiv: Je, removeSettingsDiv: $e, getMiscDiv: ie, appendToMiscDiv: _e, removeMiscDiv: qe };
  function te() {
    let t8 = ElementWrap("deeplib-subscreen");
    if (t8) return t8;
    let e = ElementCreate({ tag: "div", classList: ["deeplib-subscreen", "HideOnPopup"], attributes: { id: "deeplib-subscreen" } });
    return document.body.appendChild(e);
  }
  __name(te, "te");
  r(te, "elementGetSubscreenDiv");
  function Pe() {
    return te()?.remove();
  }
  __name(Pe, "Pe");
  r(Pe, "elementRemoveSubscreenDiv");
  function Ke(...t8) {
    return te()?.append(...t8);
  }
  __name(Ke, "Ke");
  r(Ke, "elementAppendToSubscreenDiv");
  function ne() {
    let t8 = ElementWrap("deeplib-settings");
    return t8 || ElementCreate({ tag: "div", classList: ["deeplib-settings", "scroll-box"], attributes: { id: "deeplib-settings" } });
  }
  __name(ne, "ne");
  r(ne, "elementGetSettingsDiv");
  function Je(...t8) {
    return ne()?.append(...t8);
  }
  __name(Je, "Je");
  r(Je, "elementAppendToSettingsDiv");
  function $e() {
    return ne()?.remove();
  }
  __name($e, "$e");
  r($e, "elementRemoveSettingsDiv");
  function ie() {
    let t8 = ElementWrap("deeplib-misc");
    return t8 || ElementCreate({ tag: "div", classList: ["deeplib-misc"], attributes: { id: "deeplib-misc" } });
  }
  __name(ie, "ie");
  r(ie, "elementGetMiscDiv");
  function _e(...t8) {
    return ie()?.append(...t8);
  }
  __name(_e, "_e");
  r(_e, "elementAppendToMiscDiv");
  function qe() {
    return ie()?.remove();
  }
  __name(qe, "qe");
  r(qe, "elementRemoveMiscDiv");
  var K = oe($(), 1);
  function et(t8) {
    let e = t8.name;
    return { INFO: "color: #32CCCC", TRACE: "color: #CCCC32", WARN: "color: #eec355", ERROR: "color: #750b0b", DEBUG: "color: #9E4BCF", TIME: "color: #CCCC32" }[e];
  }
  __name(et, "et");
  r(et, "colorizeLog");
  var C = K.default.get("DeepLib");
  K.default.useDefaults({ defaultLevel: K.default.DEBUG, formatter: r(function(t8, e) {
    let n = e.name || "DeepLib", i = navigator.userAgent.toLowerCase();
    if (i.includes("chrome") || i.includes("firefox")) {
      let o = et(e.level);
      t8.unshift(`%c${n}:`, o);
    } else t8.unshift(`${n}:`);
  }, "formatter") });
  function Rn(t8, e, n) {
    let i = ElementCreate({ tag: "div", classList: ["ChatMessage", "deeplib-message", "ChatMessageNonDialogue"], attributes: { id: t8 ?? `DEEPLIB_LOCAL_MESSAGE_${Date.now()}`, "data-time": ChatRoomCurrentTime(), "data-sender": Player.MemberNumber?.toString() }, children: [{ tag: "span", classList: ["deeplib-text"], innerHTML: e.replaceAll(`
	`, "") }, { tag: "br" }, { tag: "a", classList: ["deeplib-text"], attributes: { href: "#" }, innerHTML: "<b>Close (Click)</b>", eventListeners: { click: r(() => {
      i.remove();
    }, "click") } }] });
    ChatRoomAppendChat(i), n && setTimeout(() => i.remove(), n * 1e3);
  }
  __name(Rn, "Rn");
  r(Rn, "sendLocalMessage");
  function An(t8, e = void 0, n = []) {
    t8 && ServerSend("ChatRoomChat", { Content: "DEEPLIB_CUSTOM_ACTION", Type: "Action", Target: e ?? void 0, Dictionary: [{ Tag: 'MISSING TEXT IN "Interface.csv": DEEPLIB_CUSTOM_ACTION', Text: t8 }, ...n] });
  }
  __name(An, "An");
  r(An, "sendActionMessage");
  var k = { Observe: 0, AddBehavior: 1, ModifyBehavior: 5, OverrideBehavior: 10, Top: 100 };
  var Y = class {
    static {
      __name(this, "Y");
    }
    static {
      r(this, "ModSdkManager");
    }
    SDK;
    patchedFunctions = /* @__PURE__ */ new Map();
    constructor(e, n) {
      this.SDK = bcModSdk.registerMod(e, n);
    }
    hookFunction(e, n, i, o = null) {
      let s = this.initPatchableFunction(e), a = s.hooks.find((d) => d.hook === i);
      if (a) return console.warn(`Hook already exists for function ${e}:`, i.toString()), a.removeCallback;
      let c = this.SDK.hookFunction(e, n, i);
      return s.hooks.push({ hook: i, priority: n, module: o, removeCallback: c }), c;
    }
    patchFunction(e, n) {
      this.SDK.patchFunction(e, n);
    }
    unpatchFunction(e) {
      this.SDK.removePatches(e);
    }
    removeHookByModule(e, n) {
      let i = this.patchedFunctions.get(e);
      if (!i) return false;
      let o = false;
      for (let s = i.hooks.length - 1; s >= 0; s--) i.hooks[s].module === n && (i.hooks[s].removeCallback(), i.hooks.splice(s, 1), o = true);
      return i.hooks.length === 0 && this.patchedFunctions.delete(e), o;
    }
    removeAllHooksByModule(e) {
      let n = false;
      for (let i of this.patchedFunctions.values()) {
        for (let o = i.hooks.length - 1; o >= 0; o--) i.hooks[o].module === e && (i.hooks[o].removeCallback(), i.hooks.splice(o, 1), n = true);
        i.hooks.length === 0 && this.patchedFunctions.delete(i.name);
      }
      return n;
    }
    unload() {
      this.SDK.unload(), this.patchedFunctions.clear();
    }
    initPatchableFunction(e) {
      let n = this.patchedFunctions.get(e);
      return n || (n = { name: e, hooks: [] }, this.patchedFunctions.set(e, n)), n;
    }
  };
  var H = { injectInline(t8, e) {
    if (document.getElementById(t8)) return;
    let i = document.createElement("style");
    i.id = t8, i.appendChild(document.createTextNode(e)), document.head.appendChild(i);
  }, injectEmbed(t8, e) {
    if (document.getElementById(t8)) return;
    let i = document.createElement("link");
    i.id = t8, i.rel = "stylesheet", i.href = e, document.head.appendChild(i);
  }, eject(t8) {
    let e = document.getElementById(t8);
    e && e.remove();
  }, reload(t8, e) {
    H.eject(t8), H.injectInline(t8, e);
  }, async fetch(t8) {
    return fetch(t8).then((e) => e.text()).catch((e) => (m.error("Failed to fetch stylesheet:", e), ""));
  } };
  var xe = class {
    static {
      __name(this, "xe");
    }
    constructor(e) {
      this.channelName = e;
      this.removeHook = G.hookFunction("ChatRoomMessageProcessHidden", 0, (n, i) => {
        if (!this.isChannelMessage(n[0])) return i(n);
        let [o, s] = n, { type: a, data: c } = o.Dictionary[0], d = this.listeners[a];
        return d && d.forEach((l) => l(c, s)), i(n);
      }, `EventChannel-${e}`);
    }
    channelName;
    static {
      r(this, "EventChannel");
    }
    listeners = {};
    removeHook;
    unload() {
      Object.keys(this.listeners).forEach((e) => delete this.listeners[e]), this.removeHook();
    }
    sendEvent(e, n, i = null) {
      let o = { Type: "Hidden", Content: this.channelName, Sender: Player.MemberNumber, ...i ? { Target: i } : {}, Dictionary: [{ type: e, data: n }] };
      ServerSend("ChatRoomChat", o);
    }
    registerListener(e, n) {
      let i = this.listeners[e] ?? [];
      return i.push(n), this.listeners[e] = i, () => this.unregisterListener(e, n);
    }
    unregisterListener(e, n) {
      let i = this.listeners[e];
      if (i) {
        let o = i.indexOf(n);
        o !== -1 && i.splice(o, 1);
      }
    }
    isChannelMessage(e) {
      return e && e.Type === "Hidden" && e.Content === this.channelName && e.Sender && e.Sender !== Player.MemberNumber && e.Dictionary && e.Dictionary[0]?.data !== void 0 && e.Dictionary[0]?.type !== void 0 || false;
    }
  };

  // src/utilities/data.ts
  var modStorage = new Q("Responsive");
  function dataErase(doResetSettings, doResetResponses, doResetProfiles) {
    const data = modStorage.playerStorage;
    if (doResetSettings) {
      data.GlobalModule = {};
    }
    if (doResetResponses) {
      data.BehaviorsModule = {};
      data.AnimatronikkaModule = {};
    }
    if (doResetProfiles) {
      data.ProfilesModule = {};
    }
    modStorage.save();
  }
  __name(dataErase, "dataErase");
  function dataResetForManual() {
    const data = modStorage.playerStorage;
    data.BehaviorsModule = {
      behaviors: {},
      triggers: {},
      reactions: {}
    };
    data.AnimatronikkaModule = {
      animations: {}
    };
    modStorage.save();
  }
  __name(dataResetForManual, "dataResetForManual");

  // src/utilities/other.ts
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  __name(getRandomInt, "getRandomInt");
  function assertNever(x) {
    throw new Error(`Unexpected case: ${x}`);
  }
  __name(assertNever, "assertNever");
  function easeOutBack(t8) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t8 - 1) ** 3 + c1 * (t8 - 1) ** 2;
  }
  __name(easeOutBack, "easeOutBack");
  function lerp(a, b2, t8) {
    return a + (b2 - a) * t8;
  }
  __name(lerp, "lerp");

  // src/utilities/chat_messages.ts
  function isSimpleChat(msg) {
    return msg.trim().length > 0 && ChatRoomTargetMemberNumber === -1 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*") && !msg.startsWith("!") && !msg.startsWith(".") && !msg.startsWith("@") && !msg.startsWith("http");
  }
  __name(isSimpleChat, "isSimpleChat");
  function chatRoomAutoInterceptMessage(msg) {
    if (msg === void 0) return;
    const cur_msg = ElementValue("InputChat");
    const data = modStorage.playerStorage.GlobalModule;
    if (data.doMessageInterruption && isSimpleChat(cur_msg)) {
      return chatRoomInterceptMessage(cur_msg, msg);
    }
    return chatRoomNormalMessage(msg);
  }
  __name(chatRoomAutoInterceptMessage, "chatRoomAutoInterceptMessage");
  function chatRoomInterceptMessage(cur_msg, msg) {
    if (msg === void 0) return;
    ElementValue("InputChat", cur_msg + "... " + msg);
    ChatRoomSendChat();
  }
  __name(chatRoomInterceptMessage, "chatRoomInterceptMessage");
  function chatRoomNormalMessage(msg) {
    if (!msg) return;
    ChatRoomSendChatMessage(msg);
  }
  __name(chatRoomNormalMessage, "chatRoomNormalMessage");
  var pronouns = {
    "She/Her": {
      pronoun: "she",
      possessive: "her",
      intensive: "her",
      intensiveSelf: "herself"
    },
    "He/Him": {
      pronoun: "he",
      possessive: "his",
      intensive: "him",
      intensiveSelf: "himself"
    },
    "They/Them": {
      pronoun: "they",
      possessive: "their",
      intensive: "them",
      intensiveSelf: "themselves"
    }
  };
  function replaceTemplate(msg, target, source) {
    if (msg === void 0) return "";
    const playerPronounKey = CharacterPronounDescription(Player);
    const playerEntry = pronouns[playerPronounKey];
    const playerName = CharacterNickname(Player);
    const targetPronounKey = target ? CharacterPronounDescription(target) : void 0;
    const targetEntry = targetPronounKey ? pronouns[targetPronounKey] : void 0;
    const targetName = target ? CharacterNickname(target) : void 0;
    const sourcePronounKey = source ? CharacterPronounDescription(source) : void 0;
    const sourceEntry = sourcePronounKey ? pronouns[sourcePronounKey] : void 0;
    const sourceName = source ? CharacterNickname(source) : void 0;
    const replacements = {
      "player-name": playerName,
      "player-pronoun": playerEntry.pronoun,
      "player-possessive": playerEntry.possessive,
      "player-intensive": playerEntry.intensive,
      "player-self": playerEntry.intensiveSelf,
      "target-name": targetName,
      "target-pronoun": targetEntry?.pronoun,
      "target-possessive": targetEntry?.possessive,
      "target-intensive": targetEntry?.intensive,
      "target-self": targetEntry?.intensiveSelf,
      "source-name": sourceName,
      "source-pronoun": sourceEntry?.pronoun,
      "source-possessive": sourceEntry?.possessive,
      "source-intensive": sourceEntry?.intensive,
      "source-self": sourceEntry?.intensiveSelf
    };
    return msg.replace(/{{([a-zA-Z-]+)}}/g, (_2, key) => {
      const normalized = key.trim().toLowerCase();
      return replacements[normalized] ?? `{{${key}}}`;
    });
  }
  __name(replaceTemplate, "replaceTemplate");
  function randomResponse(key) {
    const rnd = getRandomInt(key.length);
    return key[rnd];
  }
  __name(randomResponse, "randomResponse");

  // src/modules/char_talk.ts
  var letterExpressionMap = [
    { regex: /[.?!…~]/, expr: [null, 600] },
    { regex: /[,;]/, expr: [null, 250] },
    //Latin
    { regex: /[a]/i, expr: ["Open", 400] },
    { regex: /[oeu]/i, expr: ["HalfOpen", 300] },
    { regex: /[bp]/i, expr: [null, 200] },
    { regex: /[mn]/i, expr: [null, 500] },
    { regex: /[ij]/i, expr: ["Smirk", 400] },
    { regex: /[kqrw]/i, expr: ["HalfOpen", 300] },
    { regex: /[fv]/i, expr: ["LipBite", 300] },
    { regex: /[cdt]/i, expr: ["TonguePinch", 200] },
    { regex: /[slz]/i, expr: ["TonguePinch", 400] },
    { regex: /[ghx]/i, expr: ["Angry", 300] },
    //Cyrillic
    { regex: /[ая]/i, expr: ["Open", 400] },
    { regex: /[оеуєю]/i, expr: ["HalfOpen", 300] },
    { regex: /[бп]/i, expr: [null, 200] },
    { regex: /[мн]/i, expr: [null, 500] },
    { regex: /[иіжїы]/i, expr: ["Smirk", 400] },
    { regex: /[yкр]/i, expr: ["HalfOpen", 300] },
    { regex: /[фв]/i, expr: ["LipBite", 300] },
    { regex: /[цдт]/i, expr: ["TonguePinch", 200] },
    { regex: /[слз]/i, expr: ["TonguePinch", 400] },
    { regex: /[гх]/i, expr: ["Angry", 300] }
  ];
  var CharTalkModule = class _CharTalkModule extends L {
    static {
      __name(this, "CharTalkModule");
    }
    static characterData = {};
    load() {
      ChatRoomRegisterMessageHandler({
        Description: "Processes mouth moving on the client",
        Priority: 500,
        Callback: /* @__PURE__ */ __name((data, sender, msg) => {
          if (data.Type === "Chat") _CharTalkModule.charTalkHandle(sender, msg);
          return false;
        }, "Callback")
      });
      G.hookFunction(
        "CommonDrawAppearanceBuild",
        0 /* Observe */,
        (args, next) => {
          const c = args[0];
          if (!c?.MemberNumber) return next(args);
          const charData = _CharTalkModule.characterData[c.MemberNumber];
          if (!charData) return next(args);
          const mouth = InventoryGet(c, "Mouth");
          if (!mouth) return next(args);
          if (!mouth.Property) mouth.Property = {};
          charData.realExpression = mouth.Property.Expression ?? null;
          mouth.Property.Expression = charData.currentExpression ?? null;
          const returnValue = next(args);
          mouth.Property.Expression = charData.realExpression;
          return returnValue;
        },
        3 /* CharTalk */
      );
    }
    /**
      * Gets the sent message, checks it for validity,
      * then splits it in chunks and turns it into a list of expression changes
      * before pushing them into the animator.
      */
    static animateSpeech(c, msg) {
      const maxFrames = 30;
      const chunks = msg.match(/.{1,3}/g) || [];
      const animation = chunks.map((chunk) => {
        const match = letterExpressionMap.find(({ regex }) => regex.test(chunk)) ?? { expr: [null, 200] };
        return match.expr;
      }).slice(0, maxFrames);
      _CharTalkModule.runExpressionAnimation(c, animation);
    }
    /**
      * Runs animation by changing mouth expression every `step[1]`ms
      */
    static runExpressionAnimationStep(c) {
      if (!c?.MemberNumber) return;
      const charData = _CharTalkModule.characterData[c.MemberNumber];
      if (!charData) return;
      if (charData.animationFrame >= charData.animation.length) {
        return _CharTalkModule.cleanup(c);
      }
      const [expression, duration] = charData.animation[charData.animationFrame++];
      _CharTalkModule.setLocalMouthExpression(c, expression);
      setTimeout(() => _CharTalkModule.runExpressionAnimationStep(c), duration);
    }
    static runExpressionAnimation(c, list) {
      if (!c?.MemberNumber) return;
      if (_CharTalkModule.characterData[c.MemberNumber]) return;
      _CharTalkModule.characterData[c.MemberNumber] = {
        realExpression: null,
        currentExpression: null,
        animation: list,
        animationFrame: 0
      };
      _CharTalkModule.runExpressionAnimationStep(c);
    }
    static setLocalMouthExpression(c, expressionName) {
      if (!c?.MemberNumber) return;
      const mouth = InventoryGet(c, "Mouth");
      if (!mouth || expressionName && !mouth.Asset.Group.AllowExpression?.includes(expressionName)) return;
      _CharTalkModule.characterData[c.MemberNumber].currentExpression = expressionName;
      CharacterRefresh(c, false);
    }
    static charTalkHandle(c, msg) {
      if (!c?.MemberNumber) return;
      const storage = modStorage.playerStorage.GlobalModule;
      if (!storage.modEnabled || !storage.CharTalkEnabled || !c?.MemberNumber || _CharTalkModule.characterData[c.MemberNumber]) return;
      if (isSimpleChat(msg)) {
        _CharTalkModule.animateSpeech(c, msg);
      }
    }
    static cleanup(c) {
      if (!c?.MemberNumber) return;
      if (!_CharTalkModule.characterData[c.MemberNumber]) return;
      _CharTalkModule.setLocalMouthExpression(c, _CharTalkModule.characterData[c.MemberNumber].realExpression);
      delete _CharTalkModule.characterData[c.MemberNumber];
    }
  };

  // src/screens/global.ts
  var GuiGlobal = class extends I {
    static {
      __name(this, "GuiGlobal");
    }
    static subscreenOptions = {
      name: "settings",
      icon: `${"https://protokink.github.io/Responsive/dev/public"}/images/cog.svg`
    };
    get settings() {
      return super.settings;
    }
    get pageStructure() {
      return [[
        {
          id: "modEnabled",
          type: "checkbox",
          label: g("settings.setting.responsive_enabled.name"),
          description: g("settings.setting.responsive_enabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.modEnabled ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.modEnabled = val, "setSettingValue")
        },
        {
          id: "responsesEnabled",
          type: "checkbox",
          label: g("settings.setting.responsesEnabled.name"),
          description: g("settings.setting.responsesEnabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.responsesEnabled ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.responsesEnabled = val, "setSettingValue")
        },
        {
          id: "charTalkEnabled",
          type: "checkbox",
          label: g("settings.setting.chartalk_enabled.name"),
          description: g("settings.setting.chartalk_enabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.CharTalkEnabled ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.CharTalkEnabled = val, "setSettingValue")
        },
        {
          id: "doMessageInterruption",
          type: "checkbox",
          label: g("settings.setting.interruption_enabled.name"),
          description: g("settings.setting.interruption_enabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.doMessageInterruption ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.doMessageInterruption = val, "setSettingValue")
        },
        {
          id: "doLeaveMessage",
          type: "checkbox",
          label: g("settings.setting.leave_message_enabled.name"),
          description: g("settings.setting.leave_message_enabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.doLeaveMessage ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.doLeaveMessage = val, "setSettingValue")
        },
        {
          id: "doAddMoansOnHighArousal",
          type: "checkbox",
          label: g("settings.setting.doAddMoansOnHighArousal.name"),
          description: g("settings.setting.doAddMoansOnHighArousal.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.doAddMoansOnHighArousal ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.doAddMoansOnHighArousal = val, "setSettingValue")
        },
        {
          id: "doPreventMessageIfBcxBlock",
          type: "checkbox",
          label: g("settings.setting.doPreventMessageIfBcxBlock.name"),
          description: g("settings.setting.doPreventMessageIfBcxBlock.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.doPreventMessageIfBcxBlock ?? false, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.doPreventMessageIfBcxBlock = val, "setSettingValue")
        },
        {
          id: "doShowNewVersionMessage",
          type: "checkbox",
          label: g("settings.setting.new_version_message_enabled.name"),
          description: g("settings.setting.new_version_message_enabled.desc"),
          setElementValue: /* @__PURE__ */ __name(() => this.settings?.doShowNewVersionMessage ?? true, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.settings.doShowNewVersionMessage = val, "setSettingValue")
        }
      ]];
    }
    load() {
      super.load();
    }
  };

  // src/modules/global.ts
  var GlobalModule = class extends L {
    static {
      __name(this, "GlobalModule");
    }
    get settingsScreen() {
      return GuiGlobal;
    }
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    get defaultSettings() {
      return {
        modEnabled: true,
        responsesEnabled: true,
        CharTalkEnabled: true,
        doShowNewVersionMessage: true,
        doLeaveMessage: true,
        doAddMoansOnHighArousal: true,
        doPreventMessageIfBcxBlock: false,
        doMessageInterruption: true
      };
    }
    load() {
    }
    run() {
    }
  };

  // src/screens/profiles.ts
  var GuiProfiles = class extends I {
    static {
      __name(this, "GuiProfiles");
    }
    static subscreenOptions = {
      name: "profiles",
      icon: `${"https://protokink.github.io/Responsive/dev/public"}/images/users_group.svg`,
      drawCharacter: false
    };
    get settings() {
      return super.settings;
    }
    load() {
      super.load();
      const profilesContainer = ElementCreate({
        tag: "div",
        classList: ["rsp-profiles-container"],
        attributes: {
          id: "rsp-profiles-container"
        },
        parent: b.getSubscreen()
      });
      for (const profileId of ["1", "2", "3"]) {
        const isValidId = this.isValidProfileId(profileId);
        if (!isValidId) continue;
        const profile = this.settings[profileId];
        const profileName = profile?.name || g("profiles.text.profile") + ` ${profileId}`;
        const profileElement = ElementCreate({
          tag: "div",
          attributes: {
            id: `rsp-profile-${profileId}`
          },
          classList: ["rsp-profile"],
          children: [
            u.createLabel({
              id: `rsp-profile-label-${profileId}`,
              label: profileName
            }),
            {
              tag: "div",
              classList: ["rsp-profile-buttons"],
              children: [
                u.createButton({
                  id: `rsp-profiles-profile-save-${profileId}`,
                  onClick: /* @__PURE__ */ __name(() => this.handleProfilesSaving(profileId), "onClick"),
                  options: {
                    label: g("profiles.button.save")
                  }
                }),
                u.createButton({
                  id: `rsp-profiles-profile-load-${profileId}`,
                  onClick: /* @__PURE__ */ __name(() => this.handleProfilesLoading(profileId), "onClick"),
                  options: {
                    label: g("profiles.button.load"),
                    disabled: !this.profileExists(profileId)
                  }
                }),
                u.createButton({
                  id: `rsp-profiles-profile-delete-${profileId}`,
                  onClick: /* @__PURE__ */ __name(() => this.handleProfilesDeleting(profileId), "onClick"),
                  options: {
                    label: g("profiles.button.delete"),
                    disabled: !this.profileExists(profileId)
                  }
                })
              ]
            }
          ]
        });
        profilesContainer.appendChild(profileElement);
      }
      CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
    }
    resize(onLoad) {
      super.resize(onLoad);
    }
    async handleProfilesSaving(profileId) {
      if (!this.profileCanBeSaved(profileId)) return;
      const name = await W.prompt(g("profiles.prompt"));
      if (name === null) return;
      const storage = modStorage.playerStorage;
      const profile = this.settings[profileId];
      if (!profile || Object.keys(profile).length === 0) {
        this.settings[profileId] = {};
      }
      this.settings[profileId] = CommonCloneDeep({
        name,
        data: {
          GlobalModule: storage.GlobalModule,
          BehaviorsModule: storage.BehaviorsModule
        }
      });
      const display = name ? `"${name}"` : profileId;
      ToastManager.success(`${g("profiles.text.profile")} ${display} ${g("profiles.text.has_been_saved")}`);
      this.updateProfileLabel(profileId);
      this.updateProfileButtons(profileId);
    }
    handleProfilesLoading(profileId) {
      if (!this.profileExists(profileId)) {
        ToastManager.error(`${g("profiles.text.profile")} ${profileId} ${g("profiles.text.doesnt_exist")}`);
        return;
      }
      const data = this.settings[profileId].data;
      modStorage.playerStorage = CommonCloneDeep({
        ...modStorage.playerStorage,
        GlobalModule: data.GlobalModule,
        BehaviorsModule: data.BehaviorsModule
      });
      const name = this.settings[profileId].name;
      const display = name ? `"${name}"` : profileId;
      ToastManager.success(`${g("profiles.text.profile")} ${display} ${g("profiles.text.has_been_loaded")}`);
    }
    handleProfilesDeleting(profileId) {
      if (!this.profileExists(profileId)) {
        ToastManager.info(`${g("profiles.text.profile")} ${profileId} ${g("profiles.text.doesnt_exist")}`);
        return;
      }
      const name = this.settings[profileId].name;
      this.settings[profileId] = {
        name: "",
        data: {}
      };
      const display = name ? `"${name}"` : profileId;
      ToastManager.success(`${g("profiles.text.profile")} ${display} ${g("profiles.text.has_been_deleted")}`);
      this.updateProfileLabel(profileId);
      this.updateProfileButtons(profileId);
    }
    updateProfileButtons(profileId) {
      const profileSaveButton = ElementWrap(`rsp-profiles-profile-save-${profileId}`);
      const profileLoadButton = ElementWrap(`rsp-profiles-profile-load-${profileId}`);
      const profileDeleteButton = ElementWrap(`rsp-profiles-profile-delete-${profileId}`);
      if (!profileSaveButton || !profileLoadButton || !profileDeleteButton) return;
      profileSaveButton.disabled = !this.profileCanBeSaved(profileId);
      profileLoadButton.disabled = !this.profileExists(profileId);
      profileDeleteButton.disabled = !this.profileExists(profileId);
    }
    updateProfileLabel(profileId) {
      const name = this.settings[profileId].name;
      const display = name ? name : `${g("profiles.text.profile")} ${profileId}`;
      const profileLabel = ElementWrap(`rsp-profile-label-${profileId}`);
      if (!profileLabel) return;
      profileLabel.textContent = display;
    }
    isValidProfileId(id) {
      if (!["1", "2", "3"].includes(id)) {
        m.warn(`Invalid profile id ${id}`);
        return false;
      }
      return true;
    }
    profileCanBeSaved(profileId) {
      if (!this.isValidProfileId(profileId)) return false;
      return true;
    }
    profileExists(profileId) {
      if (!this.isValidProfileId(profileId)) return false;
      const data = this.settings[profileId]?.data || {};
      if (!data || Object.keys(data).length === 0) return false;
      return true;
    }
  };

  // src/modules/profiles.ts
  var ProfilesModule = class extends L {
    static {
      __name(this, "ProfilesModule");
    }
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    get settingsScreen() {
      return GuiProfiles;
    }
    get defaultSettings() {
      return {};
    }
    load() {
    }
    run() {
    }
  };

  // src/utilities/handlers.ts
  var doesBcxAllowsTalking = /* @__PURE__ */ __name(() => {
    if (!window.bcx) return true;
    const isRuleWorking = /* @__PURE__ */ __name((ruleName) => {
      const rule = window.bcx?.getModApi(define_MOD_INFO_default.name).getRuleState(ruleName);
      if (!rule) return false;
      switch (ruleName) {
        case "speech_forbid_open_talking":
          return rule.inEffect && rule.isEnforced;
        case "speech_limit_open_talking":
          return rule.inEffect && rule.isEnforced;
        case "speech_specific_sound":
          return rule.inEffect && rule.isEnforced && rule.customData.soundWhitelist;
        case "speech_mandatory_words":
          return rule.inEffect && rule.isEnforced && rule.customData.mandatoryWords;
        default:
          break;
      }
    }, "isRuleWorking");
    if (modStorage.playerStorage.GlobalModule.doPreventMessageIfBcxBlock && (isRuleWorking("speech_forbid_open_talking") || isRuleWorking("speech_limit_open_talking") || isRuleWorking("speech_specific_sound") || isRuleWorking("speech_mandatory_words"))) {
      return false;
    }
    return true;
  }, "doesBcxAllowsTalking");
  var areBehaviorsEnabled = /* @__PURE__ */ __name(() => {
    const modData = modStorage.playerStorage;
    if (!modData.GlobalModule.modEnabled) return false;
    if (!modData.GlobalModule.responsesEnabled) return false;
    return true;
  }, "areBehaviorsEnabled");

  // node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/stringify.js
  var byteToHex = [];
  for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 256).toString(16).slice(1));
  }
  function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  }
  __name(unsafeStringify, "unsafeStringify");

  // node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/rng.js
  var rnds8 = new Uint8Array(16);
  function rng() {
    return crypto.getRandomValues(rnds8);
  }
  __name(rng, "rng");

  // node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist/v4.js
  function v4(options, buf, offset) {
    if (!buf && !options && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return _v4(options, buf, offset);
  }
  __name(v4, "v4");
  function _v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
      throw new Error("Random bytes length must be >= 16");
    }
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      if (offset < 0 || offset + 16 > buf.length) {
        throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
      }
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }
      return buf;
    }
    return unsafeStringify(rnds);
  }
  __name(_v4, "_v4");
  var v4_default = v4;

  // src/models/behaviors.ts
  var orgasmTypes = ["any", "normal", "resisted", "ruinedResisted", "ruinedTimeout", "ruinedSurrendered"];
  var constraintModes = ["any", "all"];
  var constraintDetailsPlayer = ["restrained", "gagged", "blinded", "deafened", "arousalMin", "arousalMax"];
  var constraintDetailsSource = ["memberNumber", ...constraintDetailsPlayer];
  var speechTypes = ["any", "normal", "whisper"];
  var reactionModes = ["all", "random"];
  var matchModes = ["startsWith", "contains", "endsWith", "exact", "regex"];
  var roomPresenceEvents = ["leave", "join", "leashed"];
  var reactionTypes = ["speech", "emote", "action", "activity", "animation"];
  var triggerTypes = ["speech", "emote", "action", "activity", "orgasm", "arousal", "roomPresence", "button"];
  var includeExcludeModes = ["include", "exclude"];
  function applyReactionDefaults(input) {
    return {
      ...input,
      id: input.id ?? v4_default(),
      name: input.name ?? "New Reaction"
    };
  }
  __name(applyReactionDefaults, "applyReactionDefaults");
  function applyTriggerDefaults(input) {
    const id = input.id ?? v4_default();
    const name = input.name ?? "New Trigger";
    switch (input.type) {
      case "speech":
      case "emote":
      case "action":
        return {
          ...input,
          id,
          name,
          content: input.content.map((entry) => ({
            ...entry,
            matchMode: entry.matchMode ?? "contains"
          }))
        };
      case "activity":
      case "orgasm":
      case "arousal":
      case "roomPresence":
      case "button":
        return { ...input, id, name };
    }
  }
  __name(applyTriggerDefaults, "applyTriggerDefaults");
  function applyBehaviorDefaults(input) {
    return {
      id: input.id ?? v4_default(),
      name: input.name ?? "New Behavior",
      enabled: input.enabled ?? true,
      triggers: input.triggers ?? [],
      reactionMode: input.reactionMode ?? "random",
      reactions: input.reactions ?? [],
      cooldownSec: input.cooldownSec
    };
  }
  __name(applyBehaviorDefaults, "applyBehaviorDefaults");

  // src/models/animations.ts
  var keyframeTypes = ["expression", "pose", "restraint", "appearance"];
  function applyAnimationDefaults(input) {
    return {
      id: input.id ?? v4_default(),
      name: input.name ?? "New Animation",
      keyframes: (input.keyframes ?? []).map((keyframe) => ({
        ...keyframe,
        id: keyframe.id ?? v4_default(),
        durationMs: keyframe.durationMs ?? 500
      })),
      tags: input.tags ?? [],
      loopCount: input.loopCount ?? 1
    };
  }
  __name(applyAnimationDefaults, "applyAnimationDefaults");

  // src/utilities/fields.ts
  var selector = Object.freeze({
    inputField: /* @__PURE__ */ __name((id) => `rsp-input-field-${id}`, "inputField"),
    numberInputField: /* @__PURE__ */ __name((id) => `rsp-number-input-field-${id}`, "numberInputField"),
    dropdownField: /* @__PURE__ */ __name((id) => `rsp-dropdown-field-${id}`, "dropdownField"),
    contentListSection: /* @__PURE__ */ __name((id) => `rsp-content-list-section-${id}`, "contentListSection"),
    collapsibleSectionId: /* @__PURE__ */ __name((id) => `rsp-collapsible-section-${id}`, "collapsibleSectionId"),
    collapsibleHeader: "rsp-collapsible-header",
    collapsibleContent: "rsp-collapsible-content",
    collapsibleSection: "rsp-collapsible"
  });
  function createInputField({ id, labelKey, value = "", onChange }) {
    const elementId = selector.inputField(id);
    const thisElement = ElementWrap(elementId);
    if (thisElement) {
      thisElement.replaceChildren();
    }
    const element = u.createInput({
      id: thisElement ? CommonGenerateUniqueID() : elementId,
      type: "text",
      label: g(labelKey),
      setElementValue: /* @__PURE__ */ __name(() => value, "setElementValue"),
      setSettingValue: onChange,
      htmlOptions: {
        container: {
          classList: ["rsp-field", "rsp-text-field"]
        }
      }
    });
    if (thisElement) {
      thisElement.replaceWith(element);
      element.id = elementId;
    }
    return element;
  }
  __name(createInputField, "createInputField");
  function createNumberInputField({ id, labelKey, value = "", onChange, step = "1", min = "0", max = "100" }) {
    step = Number(step).toString();
    min = Number(min).toString();
    max = Number(max).toString();
    const elementId = selector.inputField(id);
    const thisElement = ElementWrap(elementId);
    if (thisElement) {
      thisElement.replaceChildren();
    }
    const element = u.createInput({
      id: thisElement ? CommonGenerateUniqueID() : elementId,
      type: "number",
      label: g(labelKey),
      setElementValue: /* @__PURE__ */ __name(() => value, "setElementValue"),
      setSettingValue: onChange,
      htmlOptions: {
        container: {
          classList: ["rsp-field", "rsp-number-field"]
        },
        input: {
          attributes: {
            step,
            min,
            max
          }
        }
      }
    });
    if (thisElement) {
      thisElement.replaceWith(element);
      element.id = elementId;
    }
    return element;
  }
  __name(createNumberInputField, "createNumberInputField");
  function createDropdownField({ id, labelKey, value = "", options, onChange, replace = true }) {
    value = value || options[0];
    const elementId = selector.dropdownField(id);
    const thisElement = ElementWrap(elementId);
    if (thisElement && replace) {
      thisElement.replaceChildren();
    }
    const element = u.createDropdown({
      id: thisElement ? CommonGenerateUniqueID() : elementId,
      label: g(labelKey),
      optionsList: options.map((opt) => {
        const label = g("behaviors.option." + opt);
        return {
          tag: "option",
          attributes: {
            value: opt,
            label,
            selected: opt === value
          }
        };
      }),
      htmlOptions: {
        container: {
          classList: ["rsp-field", "rsp-dropdown-field"]
        }
      },
      setElementValue: /* @__PURE__ */ __name(() => value, "setElementValue"),
      setSettingValue: onChange
    });
    if (thisElement && replace) {
      thisElement.replaceWith(element);
      element.id = elementId;
    }
    return element;
  }
  __name(createDropdownField, "createDropdownField");
  function buildContentListSection({ id, labelKey, onAdd, addLabel, content, replace = true }) {
    const sectionId = selector.contentListSection(id);
    const thisElement = ElementWrap(sectionId);
    if (thisElement && replace) {
      thisElement.replaceChildren();
    }
    const addButton = u.createButton({
      id: `rsp-content-add-${CommonGenerateUniqueID()}`,
      onClick: onAdd,
      options: {
        image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
        label: g(addLabel)
      },
      htmlOptions: {
        button: {
          classList: ["rsp-content-add"]
        }
      }
    });
    const header = ElementCreate({
      tag: "div",
      classList: ["rsp-content-list-header"],
      children: [
        u.createLabel({
          id: `rsp-label-${CommonGenerateUniqueID()}`,
          label: g(labelKey)
        }),
        addButton
      ]
    });
    const container = ElementCreate({
      tag: "div",
      attributes: {
        id: thisElement ? CommonGenerateUniqueID() : sectionId
      },
      classList: ["rsp-section"],
      children: [
        header,
        content
      ]
    });
    if (thisElement && replace) {
      thisElement.replaceWith(container);
      container.id = sectionId;
    }
    return container;
  }
  __name(buildContentListSection, "buildContentListSection");
  function buildCollapsibleSection({ id, headerKey, content, expanded = false }) {
    id ??= CommonGenerateUniqueID();
    const sectionId = selector.collapsibleSectionId(id);
    const thisElement = ElementWrap(sectionId);
    if (thisElement) {
      thisElement.replaceChildren();
    }
    const header = ElementCreate({
      tag: "div",
      classList: [selector.collapsibleHeader],
      attributes: {
        "data-expanded": expanded ? "true" : "false"
      },
      children: [g(headerKey)],
      eventListeners: {
        click: /* @__PURE__ */ __name(() => {
          const isExpanded = header.getAttribute("data-expanded") === "true";
          header.setAttribute("data-expanded", (!isExpanded).toString());
        }, "click")
      }
    });
    const contentDiv = ElementCreate({
      tag: "div",
      classList: [selector.collapsibleContent],
      children: CommonUnwrapThunk(content)
    });
    const section = ElementCreate({
      tag: "div",
      attributes: {
        id: thisElement ? CommonGenerateUniqueID() : sectionId
      },
      classList: [selector.collapsibleSection],
      children: [header, contentDiv]
    });
    if (thisElement) {
      thisElement.replaceWith(section);
      section.id = sectionId;
    }
    return section;
  }
  __name(buildCollapsibleSection, "buildCollapsibleSection");

  // src/screens/animatronikka.ts
  var PREVIEW_TRANSITION_MS = 480;
  var selector2 = Object.freeze({
    container: "rsp-animatronikka-container",
    listPanel: "rsp-animatronikka-list-panel",
    previewCanvas: "rsp-animatronikka-preview-canvas",
    backToListButton: "rsp-animatronikka-back-to-list",
    editorPanel: "rsp-animatronikka-editor-panel",
    listItem: /* @__PURE__ */ __name((id) => `rsp-animatronikka-list-item-${id}`, "listItem"),
    listItemsContainer: "rsp-animatronikka-list-items",
    addButton: "rsp-animatronikka-add",
    deleteModeToggle: "rsp-animatronikka-delete-mode",
    previewMode: "rsp-animatronikka-preview-mode",
    animatronikkaKeyframes: /* @__PURE__ */ __name((id) => `rsp-animatronikka-keyframes-${id}`, "animatronikkaKeyframes"),
    animatronikkaKeyframeRow: /* @__PURE__ */ __name((animationId, keyframeId) => `rsp-animatronikka-keyframe-row-${animationId}-${keyframeId}`, "animatronikkaKeyframeRow")
  });
  function getPreviewCamera(mode) {
    if (mode === "full") return { x: 0, y: 0, zoom: 1 };
    return { x: -250, y: 250 - 2 * Player.HeightModifier, zoom: 2 };
  }
  __name(getPreviewCamera, "getPreviewCamera");
  var GuiAnimatronikka = class _GuiAnimatronikka extends I {
    static {
      __name(this, "GuiAnimatronikka");
    }
    static instance;
    deleteMode = false;
    selectedAnimationId = null;
    searchQuery = "";
    previewMode = "full";
    previewCamera = getPreviewCamera("full");
    previewCameraFrom = getPreviewCamera("full");
    previewCameraTo = getPreviewCamera("full");
    previewTransitionStart = 0;
    previewTransitioning = false;
    draggingKeyframeId = null;
    static subscreenOptions = {
      name: "animatronikka",
      icon: `${"https://protokink.github.io/Responsive/dev/public"}/images/clock.svg`,
      forceUpCharacter: true,
      drawCharacter: false
    };
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    get pageStructure() {
      return [[
        {
          type: "custom",
          id: selector2.container,
          htmlOptions: {
            tag: "div",
            classList: ["rsp-animatronikka-container"],
            parent: b.getSubscreen()
          },
          position: [100, 180, "top-left"],
          size: /* @__PURE__ */ __name(() => [1800, 720], "size")
        }
      ]];
    }
    load() {
      _GuiAnimatronikka.instance = this;
      super.load();
      const deleteModeButton = u.createButton({
        id: selector2.deleteModeToggle,
        onClick: /* @__PURE__ */ __name(() => this.toggleDeleteMode(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`,
          tooltip: g("animatronikka.text.toggle_delete_mode")
        },
        size: [90, 90]
      });
      I.menu?.prepend(deleteModeButton);
      this.render();
    }
    run() {
      super.run();
      if (this.selectedAnimationId) {
        const canvas = ElementWrap(selector2.previewCanvas);
        const ctx = canvas?.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        if (this.previewTransitioning) {
          const t8 = Math.min(1, (CommonTime() - this.previewTransitionStart) / PREVIEW_TRANSITION_MS);
          const e = easeOutBack(t8);
          this.previewCamera = {
            x: lerp(this.previewCameraFrom.x, this.previewCameraTo.x, e),
            y: lerp(this.previewCameraFrom.y, this.previewCameraTo.y, e),
            zoom: lerp(this.previewCameraFrom.zoom, this.previewCameraTo.zoom, e)
          };
          if (t8 >= 1) this.previewTransitioning = false;
        } else {
          this.previewCamera = getPreviewCamera(this.previewMode);
        }
        const { x, y: y2, zoom } = this.previewCamera;
        DrawCharacter(Player, x, y2, zoom, false, ctx ?? void 0);
      }
    }
    exit() {
      if (this.selectedAnimationId) {
        this.goBackToAnimationList();
        return;
      }
      _GuiAnimatronikka.instance.deleteMode = false;
      _GuiAnimatronikka.instance.selectedAnimationId = null;
      _GuiAnimatronikka.instance.searchQuery = "";
      _GuiAnimatronikka.instance.previewTransitioning = false;
      _GuiAnimatronikka.instance.previewCamera = getPreviewCamera(_GuiAnimatronikka.instance.previewMode);
      super.exit();
    }
    render() {
      const container = ElementWrap(selector2.container);
      if (!container) return;
      container.replaceChildren();
      if (this.selectedAnimationId) {
        container.append(this.buildPreviewCanvas(), this.buildEditorPanel());
      } else {
        container.append(this.buildListPanel(), this.buildEditorPanel());
      }
    }
    buildPreviewCanvas() {
      return u.createCustom({
        id: selector2.previewCanvas,
        htmlOptions: {
          tag: "canvas",
          classList: [selector2.previewCanvas],
          parent: b.getSubscreen(),
          attributes: {
            width: "500",
            height: "1000"
          }
        }
      });
    }
    goBackToAnimationList() {
      this.selectedAnimationId = null;
      this.render();
    }
    buildListPanel() {
      return ElementCreate({
        tag: "div",
        classList: [selector2.listPanel],
        children: [
          ElementCreate({
            tag: "div",
            classList: ["rsp-animatronikka-list-header"],
            children: [
              this.buildSearchBar(),
              this.buildAddButton()
            ]
          }),
          this.buildListItems(),
          this.buildLibraryControls()
        ]
      });
    }
    buildSearchBar() {
      return u.createInput({
        id: "rsp-animatronikka-search",
        type: "text",
        setElementValue: /* @__PURE__ */ __name(() => this.searchQuery, "setElementValue"),
        setSettingValue: /* @__PURE__ */ __name((val) => {
          this.searchQuery = val;
          this.updateListItems();
        }, "setSettingValue"),
        htmlOptions: {
          container: {
            classList: ["rsp-animatronikka-search"]
          },
          input: {
            attributes: {
              placeholder: g("animatronikka.search.placeholder")
            }
          }
        }
      });
    }
    buildAddButton() {
      return u.createButton({
        id: selector2.addButton,
        onClick: /* @__PURE__ */ __name(() => this.handleAddAnimation(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
          tooltip: g("animatronikka.button.add_animation")
        },
        htmlOptions: {
          button: {
            classList: [selector2.addButton]
          }
        }
      });
    }
    buildListItems() {
      const children = [];
      const query = this.searchQuery.toLowerCase().trim();
      Object.values(this.settings.animations).filter((animation) => !query || animation.name.toLowerCase().includes(query)).reverse().forEach((animation) => children.push(this.buildListItem(animation)));
      const thisElement = ElementWrap(selector2.listItemsContainer);
      const scrollBox = ElementCreate({
        tag: "div",
        classList: ["scroll-box", selector2.listItemsContainer],
        attributes: { id: selector2.listItemsContainer },
        children
      });
      if (thisElement) {
        thisElement.replaceWith(scrollBox);
      }
      return scrollBox;
    }
    buildLibraryControls() {
      const importButton = u.createButton({
        id: "rsp-animatronikka-import",
        onClick: /* @__PURE__ */ __name(() => this.handleImportAnimations(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/paste.svg`,
          tooltip: g("animatronikka.button.import")
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-library-controls-button"]
          }
        }
      });
      return ElementCreate({
        tag: "div",
        classList: ["rsp-animatronikka-library-controls"],
        children: [importButton]
      });
    }
    updateListItems() {
      const listItemsContainer = document.querySelector(`.${selector2.listItemsContainer}`);
      if (!listItemsContainer) return;
      const scrollPosition = listItemsContainer.scrollTop;
      const children = [];
      const query = this.searchQuery.toLowerCase().trim();
      Object.values(this.settings.animations).filter((animation) => !query || animation.name.toLowerCase().includes(query)).reverse().forEach((animation) => children.push(this.buildListItem(animation)));
      listItemsContainer.replaceChildren();
      listItemsContainer.append(...children);
      listItemsContainer.scrollTop = scrollPosition;
    }
    buildListItem(animation) {
      const isSelected = this.selectedAnimationId === animation.id;
      const thisElement = ElementWrap(selector2.listItem(animation.id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const button = u.createButton({
        id: selector2.listItem(thisElement ? CommonGenerateUniqueID() : animation.id),
        onClick: /* @__PURE__ */ __name(() => {
          if (this.deleteMode) {
            this.handleDeleteAnimation(animation.id);
          } else {
            this.selectAnimation(animation.id);
          }
        }, "onClick"),
        options: {
          label: animation.name
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-list-item"],
            dataAttributes: {
              deletable: "true",
              deleteMode: this.deleteMode,
              selected: isSelected
            }
          },
          label: {
            classList: ["truncated-text"]
          }
        }
      });
      if (thisElement) {
        thisElement.replaceWith(button);
        button.id = selector2.listItem(animation.id);
      }
      return button;
    }
    buildEditorPanel() {
      const thisElement = ElementWrap(selector2.editorPanel);
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const panel = ElementCreate({
        tag: "div",
        attributes: { id: selector2.editorPanel },
        classList: [selector2.editorPanel, "scroll-box"],
        children: []
      });
      if (!this.selectedAnimationId) {
        panel.appendChild(u.createLabel({
          id: "rsp-animatronikka-editor-empty",
          label: g("animatronikka.text.select_animation_to_edit"),
          htmlOptions: {
            classList: ["rsp-animatronikka-editor-empty"]
          }
        }));
      } else {
        const animation = this.settings.animations[this.selectedAnimationId];
        if (animation) {
          panel.append(...this.buildAnimationEditor(animation));
        }
      }
      if (thisElement) {
        thisElement.replaceWith(panel);
      }
      return panel;
    }
    buildAnimationEditor(animation) {
      const elements = [];
      elements.push(this.buildPreviewControls(animation));
      const nameField = createInputField({
        id: `${animation.id}-name`,
        labelKey: "animatronikka.field.name",
        value: animation.name,
        onChange: /* @__PURE__ */ __name((val) => {
          animation.name = val;
          this.buildListItem(animation);
        }, "onChange")
      });
      elements.push(nameField);
      const tagsField = createInputField({
        id: `${animation.id}-tags`,
        labelKey: "animatronikka.field.tags",
        value: animation.tags.join(", "),
        onChange: /* @__PURE__ */ __name((val) => {
          animation.tags = val.split(",").map((v) => v.trim()).filter(Boolean);
        }, "onChange")
      });
      elements.push(tagsField);
      const loopCountField = createNumberInputField({
        id: `${animation.id}-loop-count`,
        labelKey: "animatronikka.field.loop_count",
        value: (animation.loopCount ?? 1).toString(),
        onChange: /* @__PURE__ */ __name((val) => {
          const parsed = Math.max(0, parseInt(val || "0", 10));
          animation.loopCount = Number.isNaN(parsed) ? 1 : parsed;
        }, "onChange"),
        min: "0",
        max: "999",
        step: "1"
      });
      elements.push(loopCountField);
      elements.push(this.buildKeyframesSection(animation));
      return elements;
    }
    buildPreviewControls(animation) {
      const backButton = u.createButton({
        id: selector2.backToListButton,
        onClick: /* @__PURE__ */ __name(() => this.goBackToAnimationList(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/dl_images/arrow_left.svg`,
          tooltip: g("animatronikka.button.back_to_list"),
          tooltipPosition: "right"
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-back-to-list-button"]
          }
        }
      });
      const space = ElementCreate({ tag: "div", classList: ["rsp-animatronikka-space"] });
      const playButton = u.createButton({
        id: `${animation.id}-play`,
        onClick: /* @__PURE__ */ __name(() => {
          AnimatronikkaModule.instance?.playAnimation(animation.id, { interrupt: true, priority: 1, target: Player });
        }, "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/play.svg`,
          tooltip: g("animatronikka.button.play"),
          tooltipPosition: "right"
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-playback-controls-button"]
          }
        }
      });
      const stopButton = u.createButton({
        id: `${animation.id}-stop`,
        onClick: /* @__PURE__ */ __name(() => {
          if (Player?.MemberNumber) {
            AnimatronikkaModule.instance?.stopAnimation(Player.MemberNumber);
          }
        }, "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/stop.svg`,
          tooltip: g("animatronikka.button.stop"),
          tooltipPosition: "right"
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-playback-controls-button"]
          }
        }
      });
      const exportButton = u.createButton({
        id: `${animation.id}-export`,
        onClick: /* @__PURE__ */ __name(() => this.handleExportAnimation(animation), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/copy.svg`,
          tooltip: g("animatronikka.button.export"),
          tooltipPosition: "right"
        },
        htmlOptions: {
          button: {
            classList: ["rsp-animatronikka-export-button"]
          }
        }
      });
      const previewLabel = u.createLabel({
        id: `${animation.id}-preview-label`,
        label: g("animatronikka.text.preview_mode"),
        htmlOptions: { classList: ["rsp-animatronikka-preview-label"] }
      });
      const previewModes = ["full", "face"];
      const modeButtons = previewModes.map(
        (mode) => u.createButton({
          id: `${selector2.previewMode}-${mode}`,
          onClick: /* @__PURE__ */ __name(() => this.setPreviewMode(mode), "onClick"),
          options: {
            label: g(`animatronikka.preview_mode.${mode}`)
          },
          htmlOptions: {
            button: {
              classList: ["rsp-animatronikka-preview-button"],
              dataAttributes: {
                selected: (this.previewMode === mode).toString()
              }
            }
          }
        })
      );
      return ElementCreate({
        tag: "div",
        classList: ["rsp-animatronikka-preview-controls"],
        children: [
          backButton,
          space,
          playButton,
          stopButton,
          exportButton,
          ElementCreate({ tag: "div", classList: ["rsp-animatronikka-preview-modes"], children: [previewLabel, ...modeButtons] })
        ]
      });
    }
    setPreviewMode(mode) {
      if (mode === this.previewMode && !this.previewTransitioning) return;
      this.previewCameraFrom = { ...this.previewCamera };
      this.previewCameraTo = getPreviewCamera(mode);
      this.previewTransitionStart = CommonTime();
      this.previewTransitioning = true;
      this.previewMode = mode;
      const buttons = document.querySelectorAll(".rsp-animatronikka-preview-button");
      buttons.forEach((button) => {
        const buttonMode = button.getAttribute("id")?.split("-").pop();
        if (!buttonMode) return;
        button.setAttribute("data-selected", (buttonMode === mode).toString());
      });
      CharacterRefresh(Player, false, false);
    }
    buildKeyframesSection(animation) {
      const content = ElementCreate({
        tag: "div",
        classList: ["rsp-animatronikka-keyframes"],
        children: animation.keyframes.map((keyframe, index) => this.buildKeyframeRow(animation, keyframe, index))
      });
      this.attachKeyframeContainerDragHandlers(content, animation);
      return buildContentListSection({
        id: selector2.animatronikkaKeyframes(animation.id),
        labelKey: "animatronikka.section.keyframes",
        onAdd: /* @__PURE__ */ __name(() => this.handleAddKeyframe(animation), "onAdd"),
        addLabel: "animatronikka.button.add_keyframe",
        content
      });
    }
    buildKeyframeRow(animation, keyframe, index) {
      const thisElement = ElementWrap(selector2.animatronikkaKeyframeRow(animation.id, keyframe.id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const label = this.getKeyframeLabel(keyframe);
      const typeIcon = this.getKeyframeTypeIcon(keyframe);
      const dragHandle = this.buildKeyframeDragHandle();
      const typeButton = u.createButton({
        id: `${animation.id}-keyframe-type-${keyframe.id}`,
        onClick: /* @__PURE__ */ __name(() => {
        }, "onClick"),
        options: {
          image: typeIcon.image,
          tooltip: typeIcon.tooltip,
          noStyling: true,
          tooltipPosition: "right"
        },
        htmlOptions: {
          button: { classList: ["rsp-animatronikka-keyframe-type"] }
        }
      });
      const editButton = u.createButton({
        id: `${animation.id}-keyframe-edit-${keyframe.id}`,
        onClick: /* @__PURE__ */ __name(() => this.handleEditKeyframe(animation, keyframe), "onClick"),
        options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/images/pencil.svg`, tooltip: g("animatronikka.button.edit") },
        htmlOptions: { button: { classList: ["rsp-animatronikka-keyframe-button", "rsp-animatronikka-keyframe-square-button"] } }
      });
      const durationButton = u.createButton({
        id: `${animation.id}-keyframe-duration-${keyframe.id}`,
        onClick: /* @__PURE__ */ __name(() => this.handleEditKeyframeDuration(animation, keyframe), "onClick"),
        options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/images/clock.svg`, tooltip: g("animatronikka.button.duration") },
        htmlOptions: { button: { classList: ["rsp-animatronikka-keyframe-button", "rsp-animatronikka-keyframe-square-button"] } }
      });
      const duplicateButton = u.createButton({
        id: `${animation.id}-keyframe-duplicate-${keyframe.id}`,
        onClick: /* @__PURE__ */ __name(() => this.handleDuplicateKeyframe(animation, keyframe, index), "onClick"),
        options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/images/duplicate.svg`, tooltip: g("animatronikka.button.duplicate") },
        htmlOptions: { button: { classList: ["rsp-animatronikka-keyframe-button", "rsp-animatronikka-keyframe-square-button"] } }
      });
      const deleteButton = u.createButton({
        id: `${animation.id}-keyframe-delete-${keyframe.id}`,
        onClick: /* @__PURE__ */ __name(() => {
          if (this.deleteMode) {
            animation.keyframes.splice(index, 1);
            this.buildKeyframesSection(animation);
          }
        }, "onClick"),
        options: { image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`, tooltip: g("animatronikka.button.delete") },
        htmlOptions: { button: { classList: ["rsp-animatronikka-keyframe-button", "rsp-animatronikka-keyframe-square-button"] } }
      });
      const row = ElementCreate({
        tag: "div",
        classList: ["rsp-animatronikka-keyframe-row"],
        attributes: {
          id: thisElement ? CommonGenerateUniqueID() : selector2.animatronikkaKeyframeRow(animation.id, keyframe.id),
          draggable: "true"
        },
        children: [
          dragHandle,
          typeButton,
          u.createLabel({
            id: null,
            label,
            htmlOptions: {
              classList: ["rsp-animatronikka-keyframe-label", "truncated-text"]
            }
          }),
          {
            tag: "div",
            classList: ["rsp-animatronikka-keyframe-actions"],
            children: [editButton, durationButton, duplicateButton, deleteButton]
          }
        ],
        eventListeners: {
          dragstart: /* @__PURE__ */ __name((event) => this.handleKeyframeDragStart(event, keyframe), "dragstart"),
          dragend: /* @__PURE__ */ __name(() => this.handleKeyframeDragEnd(), "dragend"),
          dragover: /* @__PURE__ */ __name((event) => this.handleKeyframeDragOver(event, row), "dragover"),
          dragleave: /* @__PURE__ */ __name(() => this.clearKeyframeDropIndicators(row), "dragleave"),
          drop: /* @__PURE__ */ __name((event) => this.handleKeyframeDrop(event, animation, index, row), "drop")
        }
      });
      if (thisElement) {
        thisElement.replaceWith(row);
        row.id = selector2.animatronikkaKeyframeRow(animation.id, keyframe.id);
      }
      return row;
    }
    buildKeyframeDragHandle() {
      return ElementCreate({
        tag: "div",
        classList: ["rsp-animatronikka-keyframe-drag-handle"],
        children: [
          {
            tag: "span",
            classList: ["rsp-animatronikka-keyframe-drag-icon"]
          }
        ]
      });
    }
    handleKeyframeDragStart(event, keyframe) {
      this.draggingKeyframeId = keyframe.id;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", keyframe.id);
      }
    }
    handleKeyframeDragEnd() {
      this.draggingKeyframeId = null;
      document.querySelectorAll(".rsp-animatronikka-keyframe-row--drag-over, .rsp-animatronikka-keyframe-row--drag-over-top, .rsp-animatronikka-keyframe-row--drag-over-bottom").forEach((row) => this.clearKeyframeDropIndicators(row));
    }
    handleKeyframeDragOver(event, row) {
      if (!this.draggingKeyframeId) return;
      event.preventDefault();
      const rect = row.getBoundingClientRect();
      const isAfter = event.clientY >= rect.top + rect.height / 2;
      row.setAttribute("data-drop-position", isAfter ? "after" : "before");
      row.classList.add("rsp-animatronikka-keyframe-row--drag-over");
      row.classList.toggle("rsp-animatronikka-keyframe-row--drag-over-top", !isAfter);
      row.classList.toggle("rsp-animatronikka-keyframe-row--drag-over-bottom", isAfter);
    }
    handleKeyframeDrop(event, animation, targetIndex, row) {
      const draggedId = this.draggingKeyframeId ?? event.dataTransfer?.getData("text/plain");
      if (!draggedId) return;
      event.preventDefault();
      const position = row?.getAttribute("data-drop-position");
      const insertIndex = position === "after" ? targetIndex + 1 : targetIndex;
      if (this.reorderKeyframe(animation, draggedId, insertIndex)) {
        this.buildKeyframesSection(animation);
      } else {
        this.draggingKeyframeId = null;
      }
    }
    attachKeyframeContainerDragHandlers(container, animation) {
      container.addEventListener("dragover", (event) => {
        if (!this.draggingKeyframeId) return;
        event.preventDefault();
      });
      container.addEventListener("drop", (event) => {
        if (!this.draggingKeyframeId) return;
        if (event.target !== container) return;
        const draggedId = this.draggingKeyframeId ?? event.dataTransfer?.getData("text/plain");
        if (!draggedId) return;
        event.preventDefault();
        this.clearAllKeyframeDropIndicators();
        if (this.reorderKeyframe(animation, draggedId, animation.keyframes.length)) {
          this.buildKeyframesSection(animation);
        } else {
          this.draggingKeyframeId = null;
        }
      });
    }
    reorderKeyframe(animation, draggedId, targetIndex) {
      const dragIndex = animation.keyframes.findIndex((keyframe) => keyframe.id === draggedId);
      if (dragIndex === -1) return false;
      let insertIndex = Math.max(0, Math.min(targetIndex, animation.keyframes.length));
      if (dragIndex < insertIndex) {
        insertIndex -= 1;
      }
      if (dragIndex === insertIndex) return false;
      const [item] = animation.keyframes.splice(dragIndex, 1);
      animation.keyframes.splice(insertIndex, 0, item);
      return true;
    }
    clearKeyframeDropIndicators(row) {
      row.classList.remove(
        "rsp-animatronikka-keyframe-row--drag-over",
        "rsp-animatronikka-keyframe-row--drag-over-top",
        "rsp-animatronikka-keyframe-row--drag-over-bottom"
      );
      row.removeAttribute("data-drop-position");
    }
    clearAllKeyframeDropIndicators() {
      document.querySelectorAll(".rsp-animatronikka-keyframe-row").forEach((row) => this.clearKeyframeDropIndicators(row));
    }
    getKeyframeLabel(keyframe) {
      switch (keyframe.type) {
        case "expression":
          return `${g(`animatronikka.expression.${keyframe.group}`)}: ${keyframe.expression ?? g("animatronikka.text.none")} (${keyframe.durationMs}ms)`;
        case "pose":
          return `${keyframe.poseName || g("animatronikka.text.none")} (${keyframe.durationMs}ms)`;
        case "restraint": {
          const asset = InventoryGet(Player, keyframe.group);
          let assetName = g("animatronikka.text.none");
          if (asset) {
            assetName = asset.Asset.Name;
          }
          return `${keyframe.group}: ${assetName} (${keyframe.durationMs}ms)`;
        }
        case "appearance": {
          const asset = AssetGet("Female3DCG", keyframe.group, keyframe.asset.name);
          let assetName = g("animatronikka.text.none");
          if (asset) {
            assetName = asset.Description ?? keyframe.asset.name;
          }
          return `${keyframe.group}: ${assetName} (${keyframe.durationMs}ms)`;
        }
        default:
          return assertNever(keyframe);
      }
    }
    getKeyframeTypeIcon(keyframe) {
      switch (keyframe.type) {
        case "expression":
          return {
            image: `${"https://protokink.github.io/Responsive/dev/public"}/images/expression.svg`,
            tooltip: g("animatronikka.keyframe.expression")
          };
        case "pose":
          return {
            image: `${"https://protokink.github.io/Responsive/dev/public"}/images/pose.svg`,
            tooltip: g("animatronikka.keyframe.pose")
          };
        case "restraint":
          return {
            image: `${"https://protokink.github.io/Responsive/dev/public"}/images/restraint.svg`,
            tooltip: g("animatronikka.keyframe.restraint")
          };
        case "appearance":
          return {
            image: `${"https://protokink.github.io/Responsive/dev/public"}/images/appearance.svg`,
            tooltip: g("animatronikka.keyframe.appearance")
          };
        default:
          return assertNever(keyframe);
      }
    }
    async handleAddAnimation() {
      const name = await W.prompt(g("animatronikka.prompt.animation_name"), { modalClassList: ["rsp-modal"] });
      if (name === null) return;
      const animation = AnimatronikkaModule.createAnimation({
        name: name || g("animatronikka.text.new_animation"),
        keyframes: [],
        tags: [],
        loopCount: 1
      });
      if (!animation) return;
      this.settings.animations[animation.id] = animation;
      this.selectedAnimationId = animation.id;
      this.render();
    }
    async handleExportAnimation(animation) {
      const payload = JSON.stringify(animation, null, 2);
      await this.showJsonModal(g("animatronikka.prompt.export_json"), payload, true);
    }
    async handleImportAnimations() {
      const input = await this.showJsonModal(g("animatronikka.prompt.import_json"), "", false);
      if (!input) return;
      try {
        const parsed = JSON.parse(input);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        let added = 0;
        items.forEach((item) => {
          const inputAnimation = {
            id: "",
            name: typeof item?.name === "string" ? item.name : g("animatronikka.text.new_animation"),
            keyframes: Array.isArray(item?.keyframes) ? item.keyframes : [],
            tags: Array.isArray(item?.tags) ? item.tags : [],
            loopCount: typeof item?.loopCount === "number" ? Math.max(0, Math.floor(item.loopCount)) : 1
          };
          delete inputAnimation.id;
          const animation = AnimatronikkaModule.createAnimation(inputAnimation);
          if (animation) {
            this.settings.animations[animation.id] = animation;
            added++;
          }
        });
        if (added > 0) {
          this.buildListItems();
        }
        ToastManager.success(g("animatronikka.text.import_success", { $count: added.toString() }));
      } catch (_error) {
        ToastManager.error(g("animatronikka.text.import_failed"));
      }
    }
    async handleDeleteAnimation(id) {
      const animation = this.settings.animations[id];
      if (!animation) return;
      const confirmed = await W.confirm([
        g("animatronikka.prompt.delete_confirm", { $name: animation.name })
      ], { modalClassList: ["rsp-modal"] });
      if (!confirmed) return;
      delete this.settings.animations[id];
      if (this.selectedAnimationId === id) this.selectedAnimationId = null;
      ElementWrap(selector2.listItem(id))?.remove();
      this.render();
    }
    selectAnimation(id) {
      this.selectedAnimationId = id;
      this.render();
    }
    async handleAddKeyframe(animation) {
      const type = await this.selectKeyframeType();
      if (!type) return;
      const keyframe = await this.promptKeyframe(type);
      if (!keyframe) return;
      animation.keyframes.push(keyframe);
      this.buildKeyframesSection(animation);
    }
    async handleEditKeyframe(animation, keyframe) {
      const updated = await this.promptKeyframe(keyframe.type, keyframe);
      if (!updated) return;
      const index = animation.keyframes.findIndex((k2) => k2.id === keyframe.id);
      if (index === -1) return;
      animation.keyframes[index] = { ...updated, id: keyframe.id };
      this.buildKeyframesSection(animation);
    }
    async handleEditKeyframeDuration(animation, keyframe) {
      const durationMs = await this.promptDurationMs(keyframe);
      if (durationMs === null) return;
      keyframe.durationMs = durationMs;
      this.buildKeyframesSection(animation);
    }
    handleDuplicateKeyframe(animation, keyframe, index) {
      const copy = this.cloneKeyframe(keyframe);
      animation.keyframes.splice(index + 1, 0, copy);
      this.buildKeyframesSection(animation);
    }
    async selectKeyframeType() {
      const selected = await itemSelectorModal({
        buttons: keyframeTypes.map((type) => ({
          label: g(`animatronikka.keyframe.${type}`),
          value: type
        })),
        limit: 1
      });
      if (!selected || selected.length === 0) return null;
      return selected[0];
    }
    async promptKeyframe(type, current) {
      switch (type) {
        case "expression": {
          const group = (await expressionGroupSelectorModal({
            selectedGroups: current && current.type === "expression" ? [current.group] : [],
            limit: 1
          }))?.[0];
          if (!group) return null;
          const realGroup = group === "Eyes1" ? "Eyes" : group;
          const assetGroup = AssetGroupGet("Female3DCG", realGroup);
          if (!assetGroup) return null;
          const expression = await expressionNameSelectorModal({
            group: assetGroup.Name,
            selectedExpressions: current && current.type === "expression" ? [current.expression] : [],
            limit: 1
          });
          if (!expression) return null;
          const colorInput = await W.prompt(g("animatronikka.prompt.color_optional"), {
            defaultValue: current && current.type === "expression" ? this.formatColor(current.color) : "",
            modalClassList: ["rsp-modal"]
          });
          if (colorInput === null) return null;
          const durationMs = await this.promptDurationMs(current);
          if (durationMs === null) return null;
          return {
            id: current?.id ?? CommonGenerateUniqueID(),
            type,
            durationMs,
            group,
            expression: expression?.[0] ?? null,
            color: CommonIsColor(colorInput) ? colorInput : void 0
          };
        }
        case "pose": {
          const allowedPoses = Object.keys(PoseRecord).map((pose2) => ({
            label: pose2,
            value: pose2,
            selected: current && current.type === "pose" ? current.poseName === pose2 : false
          }));
          const pose = await itemSelectorModal({
            buttons: allowedPoses,
            limit: 1,
            prompt: g("animatronikka.prompt.pose_name")
          });
          if (!pose || pose.length === 0) return null;
          const durationMs = await this.promptDurationMs(current);
          if (durationMs === null) return null;
          return { id: current?.id ?? CommonGenerateUniqueID(), type, durationMs, poseName: pose[0] };
        }
        case "restraint": {
          const group = (await bodyPartSelectorModal({
            selectedParts: current && current.type === "restraint" ? [current.group] : [],
            limit: 1
          }))?.[0];
          if (!group) return null;
          const asset = InventoryGet(Player, group);
          if (!asset) return null;
          const durationMs = await this.promptDurationMs(current);
          if (durationMs === null) return null;
          return {
            id: current?.id ?? CommonGenerateUniqueID(),
            type,
            durationMs,
            group,
            asset: {
              name: asset.Asset.Name,
              property: structuredClone(asset.Property),
              color: asset.Color
            }
          };
        }
        case "appearance": {
          const group = (await itemSelectorModal({
            buttons: AssetGroup.filter((g2) => g2.IsAppearance()).map((group2) => ({
              label: group2.Description,
              value: group2.Name,
              selected: current && current.type === "appearance" ? current.group === group2.Name : false
            })),
            limit: 1,
            showSearch: true
          }))?.[0];
          if (!group) return null;
          const asset = InventoryGet(Player, group);
          if (!asset) return null;
          const durationMs = await this.promptDurationMs(current);
          if (durationMs === null) return null;
          return {
            id: current?.id ?? CommonGenerateUniqueID(),
            type,
            durationMs,
            group,
            asset: {
              name: asset.Asset.Name,
              property: structuredClone(asset.Property),
              color: asset.Color
            }
          };
        }
        default:
          return assertNever(type);
      }
    }
    async promptDurationMs(current) {
      const duration = await W.prompt(g("animatronikka.prompt.duration_ms"), {
        defaultValue: current ? current.durationMs.toString() : "500",
        modalClassList: ["rsp-modal"]
      });
      if (duration === null) return null;
      return Math.max(0, parseInt(duration || "0", 10));
    }
    parseColor(input) {
      const trimmed = input.trim();
      if (!trimmed) return void 0;
      if (trimmed.includes(",")) {
        return trimmed.split(",").map((value) => value.trim()).filter(Boolean).filter((value) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value));
      } else if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return trimmed;
      }
      return void 0;
    }
    formatColor(color) {
      if (!color) return "";
      return Array.isArray(color) ? color.join(", ") : color;
    }
    toggleDeleteMode() {
      this.deleteMode = !this.deleteMode;
      ElementWrap(selector2.deleteModeToggle)?.toggleAttribute("data-delete-mode", this.deleteMode);
      const deletableItems = document.querySelectorAll("[data-deletable]");
      deletableItems.forEach((item) => {
        item.toggleAttribute("data-delete-mode", this.deleteMode);
      });
    }
    async showJsonModal(title, initialValue, readOnly) {
      let value = initialValue;
      const textareaId = `rsp-animatronikka-json-${CommonGenerateUniqueID()}`;
      const textarea = ElementCreate({
        tag: "textarea",
        attributes: {
          id: textareaId,
          rows: "10",
          readonly: readOnly ? "true" : void 0
        },
        classList: ["rsp-animatronikka-json-textarea"],
        eventListeners: {
          input: /* @__PURE__ */ __name(function() {
            value = this.value;
          }, "input")
        }
      });
      textarea.value = initialValue;
      return await W.confirm([
        u.createLabel({ id: null, label: title }),
        textarea
      ], { modalClassList: ["rsp-modal", "rsp-animatronikka-json-modal"] }).then((result) => {
        if (!result) {
          return null;
        }
        return value;
      });
    }
    cloneKeyframe(keyframe) {
      const clone = typeof structuredClone === "function" ? structuredClone(keyframe) : JSON.parse(JSON.stringify(keyframe));
      return { ...clone, id: v4_default() };
    }
  };
  O("GuiAnimatronikka", GuiAnimatronikka);

  // src/modules/animatronikka.ts
  var animationGroups = ["Eyes", "Eyes1", "Eyes2", "Eyebrows", "Mouth", "Fluids", "Emoticon", "Blush", "Pussy"];
  var AnimatronikkaModule = class _AnimatronikkaModule extends L {
    static {
      __name(this, "AnimatronikkaModule");
    }
    static instance;
    activeRuns = /* @__PURE__ */ new Map();
    queuedRuns = /* @__PURE__ */ new Map();
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    get settingsScreen() {
      return GuiAnimatronikka;
    }
    get defaultSettings() {
      return {
        animations: {}
      };
    }
    load() {
      super.load();
      _AnimatronikkaModule.instance = this;
    }
    static createAnimation(animation) {
      return applyAnimationDefaults(animation);
    }
    getAnimation(id) {
      return this.settings.animations[id];
    }
    deleteAnimation(id) {
      delete this.settings.animations[id];
    }
    playAnimation(animationId, options) {
      const animation = this.getAnimation(animationId);
      if (!animation) return false;
      const target = options?.target ?? Player;
      if (!target?.MemberNumber) return false;
      const run = {
        id: animationId,
        animation: applyAnimationDefaults(animation),
        target,
        loopsRemaining: this.getLoopsRemaining(animation, options?.loopCount),
        priority: options?.priority ?? 0,
        groupStates: /* @__PURE__ */ new Map(),
        activeGroupCount: 0
      };
      const existing = this.activeRuns.get(target.MemberNumber);
      if (existing) {
        const shouldInterrupt = options?.interrupt || run.priority > existing.priority;
        if (shouldInterrupt) {
          this.stopAnimation(target.MemberNumber);
        } else {
          const queue = this.queuedRuns.get(target.MemberNumber) ?? [];
          queue.push(run);
          this.queuedRuns.set(target.MemberNumber, queue);
          return true;
        }
      }
      this.startRun(run);
      return true;
    }
    stopAnimation(memberNumber) {
      const existing = this.activeRuns.get(memberNumber);
      if (!existing) return;
      existing.groupStates.forEach((group) => {
        if (group.cancelTimer) group.cancelTimer();
        group.cancelTimer = void 0;
      });
      this.activeRuns.delete(memberNumber);
    }
    stopAll() {
      this.activeRuns.forEach((run) => {
        run.groupStates.forEach((group) => {
          if (group.cancelTimer) group.cancelTimer();
          group.cancelTimer = void 0;
        });
      });
      this.activeRuns.clear();
      this.queuedRuns.clear();
    }
    startRun(run) {
      const memberNumber = run.target.MemberNumber;
      if (memberNumber === void 0) return;
      this.activeRuns.set(memberNumber, run);
      run.groupStates = this.buildGroupStates(run.animation.keyframes);
      run.activeGroupCount = run.groupStates.size;
      if (run.activeGroupCount === 0) {
        return this.finishRun(run);
      }
      run.groupStates.forEach((_group, groupKey) => {
        this.runNextGroupFrame(run, groupKey);
      });
    }
    runNextGroupFrame(run, groupKey) {
      const group = run.groupStates.get(groupKey);
      if (!group) return;
      if (group.index >= group.keyframes.length) {
        return this.finishGroup(run, groupKey);
      }
      const keyframe = group.keyframes[group.index++];
      this.applyKeyframe(run.target, keyframe);
      group.cancelTimer = TimerCreate(
        () => this.runNextGroupFrame(run, groupKey),
        Math.max(0, keyframe.durationMs),
        false,
        "universal"
      );
    }
    finishGroup(run, groupKey) {
      const group = run.groupStates.get(groupKey);
      if (!group) return;
      if (group.cancelTimer) group.cancelTimer();
      group.cancelTimer = void 0;
      run.activeGroupCount -= 1;
      if (run.activeGroupCount > 0) return;
      if (run.loopsRemaining > 0) {
        run.loopsRemaining -= 1;
        this.restartRun(run);
        return;
      }
      this.finishRun(run);
    }
    getLoopsRemaining(animation, loopCount) {
      if (typeof loopCount === "number") {
        return Math.max(0, Math.floor(loopCount));
      }
      return Math.max(0, Math.floor(animation.loopCount ?? 1));
    }
    restartRun(run) {
      run.groupStates.forEach((group) => {
        if (group.cancelTimer) group.cancelTimer();
        group.cancelTimer = void 0;
        group.index = 0;
      });
      run.activeGroupCount = run.groupStates.size;
      run.groupStates.forEach((_group, groupKey) => {
        this.runNextGroupFrame(run, groupKey);
      });
    }
    finishRun(run) {
      const memberNumber = run.target.MemberNumber;
      if (memberNumber === void 0) return;
      this.activeRuns.delete(memberNumber);
      const queued = this.queuedRuns.get(memberNumber);
      if (!queued || queued.length === 0) return;
      const next = queued.shift();
      if (next) {
        this.queuedRuns.set(memberNumber, queued);
        this.startRun(next);
      }
    }
    applyKeyframe(target, keyframe) {
      switch (keyframe.type) {
        case "expression":
          this.applyExpressionKeyframe(target, keyframe);
          break;
        case "pose":
          this.applyPoseKeyframe(target, keyframe);
          break;
        case "restraint":
          this.applyRestraintKeyframe(target, keyframe);
          break;
        case "appearance":
          this.applyAppearanceKeyframe(target, keyframe);
          break;
        default:
          return assertNever(keyframe);
      }
    }
    applyExpressionKeyframe(target, keyframe) {
      CharacterSetFacialExpression(target, keyframe.group, keyframe.expression, void 0, keyframe.color);
    }
    applyPoseKeyframe(target, keyframe) {
      PoseSetActive(target, keyframe.poseName);
    }
    applyRestraintKeyframe(target, keyframe) {
      const item = InventoryWear(target, keyframe.asset.name, keyframe.group, keyframe.asset.color, void 0, void 0, void 0, false);
      if (!item) return;
      if (keyframe.asset.property) {
        item.Property = keyframe.asset.property;
      }
      CharacterRefresh(target, true, true);
    }
    applyAppearanceKeyframe(target, keyframe) {
      const item = InventoryWear(target, keyframe.asset.name, keyframe.group, keyframe.asset.color, void 0, void 0, void 0, false);
      if (!item) return;
      if (keyframe.asset.property) {
        item.Property = keyframe.asset.property;
      }
      CharacterRefresh(target, true, true);
    }
    buildGroupStates(keyframes) {
      const groups = /* @__PURE__ */ new Map();
      keyframes.forEach((keyframe) => {
        const groupKey = this.getKeyframeGroupKey(keyframe);
        const group = groups.get(groupKey);
        if (group) {
          group.keyframes.push(keyframe);
        } else {
          groups.set(groupKey, { keyframes: [keyframe], index: 0 });
        }
      });
      return groups;
    }
    getKeyframeGroupKey(keyframe) {
      switch (keyframe.type) {
        case "expression":
          return `expression:${keyframe.group}`;
        case "pose":
          return "pose";
        case "restraint":
          return `restraint:${keyframe.group}`;
        case "appearance":
          return `appearance:${keyframe.group}`;
        default:
          return assertNever(keyframe);
      }
    }
  };
  O("AnimatronikkaModule", AnimatronikkaModule);

  // src/utilities/selectorModals.ts
  async function itemSelectorModal(options) {
    options ??= {};
    const buttons = options.buttons ?? [];
    const limit = options.limit ?? Infinity;
    const showSearch = options.showSearch ?? false;
    if (buttons.length === 0 || limit < 1) {
      return [];
    }
    const prompt = options.prompt ?? g("behaviors.prompt.select_item");
    const selectedIds = new Set(buttons.filter((button) => button.selected).map((button) => button.value));
    while (selectedIds.size > limit) {
      const oldest = selectedIds.values().next().value;
      if (oldest === void 0) {
        break;
      }
      selectedIds.delete(oldest);
    }
    const buttonByValue = /* @__PURE__ */ new Map();
    const buttonElements = buttons.map((button) => {
      const isSelected = selectedIds.has(button.value);
      const buttonElement = u.createButton({
        id: `rsp-selector-${button.value}`,
        onClick: /* @__PURE__ */ __name(function() {
          const state = this.toggleAttribute("data-selected");
          if (state) {
            if (!selectedIds.has(button.value)) {
              if (selectedIds.size >= limit) {
                const oldest = selectedIds.values().next().value;
                if (oldest !== void 0) {
                  selectedIds.delete(oldest);
                  buttonByValue.get(oldest)?.removeAttribute("data-selected");
                }
              }
              selectedIds.add(button.value);
            }
          } else {
            selectedIds.delete(button.value);
          }
        }, "onClick"),
        options: {
          label: button.label
        },
        htmlOptions: {
          button: {
            classList: ["rsp-selector-button"],
            dataAttributes: {
              selected: isSelected ? "" : void 0,
              label: button.label
            },
            attributes: {
              name: button.value
            }
          }
        }
      });
      buttonByValue.set(button.value, buttonElement);
      return buttonElement;
    });
    const searchInput = showSearch ? u.createInput({
      id: "rsp-selector-search",
      type: "text",
      setSettingValue(val) {
        const searchTerm = val.toLowerCase().trim();
        buttonElements.forEach((button) => {
          if (button instanceof HTMLElement) {
            const label = button.getAttribute("data-label") || button.textContent || "";
            const matches = label.toLowerCase().includes(searchTerm);
            button.style.display = matches ? "" : "none";
          }
        });
      },
      htmlOptions: {
        input: {
          classList: ["rsp-selector-search-input"],
          attributes: {
            placeholder: g("behaviors.prompt.search_items")
          }
        }
      }
    }) : null;
    return await W.confirm([
      u.createLabel({ id: null, label: prompt }),
      ElementCreate({ tag: "br" }),
      ...searchInput ? [searchInput] : [],
      {
        tag: "div",
        classList: ["rsp-selector-buttons-container", "scroll-box"],
        children: buttonElements
      }
    ], { modalClassList: ["rsp-modal"] }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedIds);
    });
  }
  __name(itemSelectorModal, "itemSelectorModal");
  async function animationSelectorModal(options) {
    options ??= {};
    const animations = options.animations ?? {};
    const buttons = Object.values(animations).map((animation) => ({
      label: animation.name,
      value: animation.id,
      selected: options?.selectedIds?.includes(animation.id) ?? false
    }));
    return await itemSelectorModal({ buttons, limit: options.limit });
  }
  __name(animationSelectorModal, "animationSelectorModal");
  async function bodyPartSelectorModal(options) {
    options ??= {};
    const limit = options.limit ?? Infinity;
    if (limit < 1) {
      return [];
    }
    options.selectedParts = options.selectedParts?.filter((part) => Boolean(part));
    const selectedParts = new Set(options.selectedParts ?? []);
    const groupsToConceal = [
      "ItemAddon",
      "ItemHandheld",
      "ItemDevices",
      "ItemMisc",
      "ItemNipplesPiercings",
      "ItemMouth2",
      "ItemMouth3",
      "ItemTorso2",
      "ItemNeckRestraints",
      "ItemNeckAccessories"
    ];
    const bodyPartGrid = DialogFocusGroup.Create("rsp-body-part-selector", function() {
      this.setAttribute("aria-checked", "false");
      const clickedPart = this.name;
      const wasSelected = this.getAttribute("data-selected") === "";
      if (wasSelected) {
        if (selectedParts.has(clickedPart)) {
          selectedParts.delete(clickedPart);
        }
      } else {
        if (!selectedParts.has(clickedPart)) {
          if (selectedParts.size >= limit) {
            const oldest = Array.from(selectedParts).shift();
            if (oldest) {
              selectedParts.delete(oldest);
              const firstMirrored = ActivityGetAllMirrorGroups("Female3DCG", oldest);
              firstMirrored.forEach((group) => {
                const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
                elements.forEach((element) => element.removeAttribute("data-selected"));
              });
            }
          }
          selectedParts.add(clickedPart);
        }
      }
      const mirrored = ActivityGetAllMirrorGroups("Female3DCG", clickedPart);
      mirrored.forEach((group) => {
        const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
        elements.forEach((element) => element.toggleAttribute("data-selected"));
      });
    }, {
      useDynamicGroupName: true
    });
    for (const part of selectedParts) {
      const partElement = bodyPartGrid.querySelectorAll(`[name='${part}']`);
      if (partElement) {
        partElement.forEach((element) => element.setAttribute("data-selected", ""));
      }
    }
    for (const bodyPart of groupsToConceal) {
      const bodyPartElement = bodyPartGrid.querySelectorAll(`[id^='rsp-body-part-selector-${bodyPart}'`);
      if (bodyPartElement) {
        bodyPartElement.forEach((element) => element.setAttribute("concealed", "true"));
      }
    }
    const selectAllButton = u.createButton({
      id: "rsp-body-part-select-all",
      onClick: /* @__PURE__ */ __name(function() {
        const visibleElements = Array.from(bodyPartGrid.querySelectorAll("[name]:not([concealed])"));
        for (const element of visibleElements) {
          const partName = element.getAttribute("name");
          if (!partName || selectedParts.has(partName)) {
            continue;
          }
          if (selectedParts.size >= limit) {
            break;
          }
          selectedParts.add(partName);
          element.setAttribute("data-selected", "");
          const mirrored = ActivityGetAllMirrorGroups("Female3DCG", partName);
          mirrored.forEach((group) => {
            const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
            elements.forEach((el) => el.setAttribute("data-selected", ""));
          });
        }
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.select_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-select-all-button"]
        }
      }
    });
    const deselectAllButton = u.createButton({
      id: "rsp-body-part-deselect-all",
      onClick: /* @__PURE__ */ __name(function() {
        const partsToDeselect = [...selectedParts];
        selectedParts.clear();
        partsToDeselect.forEach((part) => {
          const elements = bodyPartGrid.querySelectorAll(`[name='${part}']`);
          elements.forEach((element) => element.removeAttribute("data-selected"));
          const mirrored = ActivityGetAllMirrorGroups("Female3DCG", part);
          mirrored.forEach((group) => {
            const mirrorElements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
            mirrorElements.forEach((element) => element.removeAttribute("data-selected"));
          });
        });
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.deselect_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-deselect-all-button"]
        }
      }
    });
    const label = limit > 1 ? g("behaviors.prompt.select_multiple_items") : g("behaviors.prompt.select_item");
    return await W.confirm([
      u.createLabel({ id: null, label }),
      ElementCreate({ tag: "br" }),
      {
        tag: "div",
        classList: ["rsp-selector-buttons-container"],
        children: [
          bodyPartGrid
        ]
      }
    ], {
      modalClassList: ["rsp-modal", "rsp-body-part-selector-modal"],
      onShow() {
        const buttonContainer = this.querySelector(".deeplib-modal-button-container");
        if (buttonContainer) {
          const controlsContainer = ElementCreate({
            tag: "div",
            classList: ["rsp-selector-controls"],
            children: [
              selectAllButton,
              deselectAllButton
            ]
          });
          buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
        }
      }
    }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedParts).filter((part) => Boolean(part));
    });
  }
  __name(bodyPartSelectorModal, "bodyPartSelectorModal");
  async function activitySelectorModal(options) {
    options ??= {};
    const limit = options.limit ?? Infinity;
    if (limit < 1) {
      return [];
    }
    options.selectedActivities = options.selectedActivities?.filter((activity) => Boolean(activity));
    const selectedActivities = new Set(options.selectedActivities ?? []);
    const allActivities = AssetAllActivities("Female3DCG");
    const onClick = /* @__PURE__ */ __name(function() {
      const wasSelected = this.hasAttribute("data-selected");
      const activityGrid2 = ElementWrap("rsp-activity-selector-grid");
      if (wasSelected) {
        if (selectedActivities.has(this.name)) {
          selectedActivities.delete(this.name);
        }
        this.removeAttribute("data-selected");
      } else {
        if (!selectedActivities.has(this.name)) {
          if (selectedActivities.size >= limit) {
            const oldest = Array.from(selectedActivities).shift();
            if (oldest && activityGrid2) {
              const oldestElement = activityGrid2.querySelector(`[name='${oldest}']`);
              if (oldestElement) {
                oldestElement.removeAttribute("data-selected");
                selectedActivities.delete(oldest);
              }
            }
          }
          selectedActivities.add(this.name);
        }
        this.setAttribute("data-selected", "");
      }
    }, "onClick");
    const activityButtons = allActivities.map((activity) => {
      const isSelected = selectedActivities.has(activity.Name);
      return u.createButton({
        id: `rsp-activity-selector-${activity.Name}`,
        onClick,
        options: {
          label: ActivityDictionaryText(`Activity${activity.Name}`)
        },
        htmlOptions: {
          button: {
            classList: ["rsp-activity-selector-button"],
            attributes: {
              name: activity.Name
            },
            dataAttributes: {
              activityLabel: ActivityDictionaryText(`Activity${activity.Name}`),
              selected: isSelected
            }
          }
        }
      });
    });
    const activityGrid = ElementCreate({
      tag: "div",
      classList: ["rsp-activity-selector-grid", "scroll-box"],
      attributes: {
        id: "rsp-activity-selector-grid"
      },
      children: activityButtons
    });
    const getVisibleButtons = /* @__PURE__ */ __name(() => {
      return activityButtons.filter((button) => {
        if (!(button instanceof HTMLElement)) return false;
        return button.style.display !== "none";
      });
    }, "getVisibleButtons");
    const selectAllButton = u.createButton({
      id: "rsp-activity-select-all",
      onClick: /* @__PURE__ */ __name(function() {
        const visibleButtons = getVisibleButtons();
        for (const button of visibleButtons) {
          const activityName = button.name;
          if (!selectedActivities.has(activityName)) {
            if (selectedActivities.size >= limit) {
              break;
            }
            selectedActivities.add(activityName);
            button.setAttribute("data-selected", "");
          }
        }
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.select_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-select-all-button"]
        }
      }
    });
    const deselectAllButton = u.createButton({
      id: "rsp-activity-deselect-all",
      onClick: /* @__PURE__ */ __name(function() {
        const activityGrid2 = ElementWrap("rsp-activity-selector-grid");
        selectedActivities.clear();
        if (activityGrid2) {
          const allSelectedButtons = activityGrid2.querySelectorAll("[data-selected]");
          allSelectedButtons.forEach((button) => {
            button.removeAttribute("data-selected");
          });
        }
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.deselect_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-deselect-all-button"]
        }
      }
    });
    const searchInput = u.createInput({
      id: "rsp-activity-search",
      type: "text",
      setSettingValue(val) {
        const searchTerm = val.toLowerCase().trim();
        activityButtons.forEach((button) => {
          if (button instanceof HTMLElement) {
            const label2 = button.getAttribute("data-activity-label") || button.textContent || "";
            const matches = label2.toLowerCase().includes(searchTerm);
            button.style.display = matches ? "" : "none";
          }
        });
      },
      htmlOptions: {
        input: {
          attributes: {
            placeholder: g("behaviors.prompt.search_activities")
          }
        }
      }
    });
    const label = limit > 1 ? g("behaviors.prompt.select_multiple_items") : g("behaviors.prompt.select_item");
    return await W.confirm([
      u.createLabel({ id: null, label }),
      searchInput,
      activityGrid
    ], {
      modalClassList: ["rsp-modal", "rsp-activity-selector-modal"],
      onShow() {
        const buttonContainer = this.querySelector(".deeplib-modal-button-container");
        if (buttonContainer) {
          const controlsContainer = ElementCreate({
            tag: "div",
            classList: ["rsp-selector-controls"],
            children: [
              selectAllButton,
              deselectAllButton
            ]
          });
          buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
        }
      }
    }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedActivities).filter((part) => Boolean(part));
    });
  }
  __name(activitySelectorModal, "activitySelectorModal");
  async function memberNumberSelectorModal(options) {
    options ??= {};
    const limit = options.limit ?? Infinity;
    if (limit < 1) {
      return [];
    }
    const includeFriends = options.includeFriends ?? true;
    const includeSubs = options.includeSubs ?? true;
    const includeLovers = options.includeLovers ?? true;
    const includeOwner = options.includeOwner ?? true;
    const includeInRoom = options.includeInRoom ?? true;
    const includePlayer = options.includePlayer ?? true;
    const selectedMembers = new Set(options.selectedMembers ?? []);
    const memberEntries = /* @__PURE__ */ new Map();
    if (includePlayer && Player) {
      memberEntries.set(Player.MemberNumber, {
        memberNumber: Player.MemberNumber,
        name: CharacterNickname(Player),
        context: "player"
      });
    }
    owner: if (includeOwner && Player?.Ownership) {
      const owner = Player.Ownership;
      if (!owner?.MemberNumber || isNaN(owner.MemberNumber)) break owner;
      memberEntries.set(owner.MemberNumber, {
        memberNumber: owner.MemberNumber,
        name: owner.Name,
        context: "owner"
      });
    }
    if (includeLovers && Player.Lovership.length > 0) {
      for (const lover of Player.Lovership) {
        if (!lover?.MemberNumber || isNaN(lover.MemberNumber)) continue;
        if (memberEntries.has(lover.MemberNumber)) continue;
        memberEntries.set(lover.MemberNumber, {
          memberNumber: lover.MemberNumber,
          name: lover.Name,
          context: "lover"
        });
      }
    }
    if (includeSubs && Player.SubmissivesList.size > 0) {
      for (const sub of Player.SubmissivesList) {
        if (memberEntries.has(sub)) continue;
        memberEntries.set(sub, {
          memberNumber: sub,
          name: Player.FriendNames.get(sub) ?? g("behaviors.name.unknown"),
          context: "submissive"
        });
      }
    }
    if (includeFriends && Player.FriendNames.size > 0) {
      for (const [friendNumber, friendName] of Player.FriendNames) {
        if (!friendNumber || memberEntries.has(friendNumber)) continue;
        memberEntries.set(friendNumber, {
          memberNumber: friendNumber,
          name: friendName,
          context: "friend"
        });
      }
    }
    if (includeInRoom && ChatRoomCharacter) {
      for (const character of ChatRoomCharacter) {
        if (!character.IsOnline()) continue;
        if (!character.MemberNumber || isNaN(character.MemberNumber)) continue;
        if (memberEntries.has(character.MemberNumber)) continue;
        memberEntries.set(character.MemberNumber, {
          memberNumber: character.MemberNumber,
          name: CharacterNickname(character),
          context: "same_room"
        });
      }
    }
    if (selectedMembers.size > 0) {
      for (const memberNumber of selectedMembers) {
        if (memberEntries.has(memberNumber)) continue;
        memberEntries.set(memberNumber, {
          memberNumber,
          name: g("behaviors.name.unknown"),
          context: "custom"
        });
      }
    }
    const contextPriority = {
      "friend": 1,
      "submissive": 2,
      "lover": 3,
      "owner": 4,
      "same_room": 5,
      "custom": 6,
      "player": 7
    };
    const sortedEntries = Array.from(memberEntries.values()).sort((a, b2) => {
      const aPriority = contextPriority[a.context] ?? 999;
      const bPriority = contextPriority[b2.context] ?? 999;
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return a.name.localeCompare(b2.name);
    });
    if (sortedEntries.length === 0) {
      return [];
    }
    const createGridRow = /* @__PURE__ */ __name((entry) => {
      const rowId = `rsp-member-row-${entry.memberNumber}`;
      const isSelected = selectedMembers.has(entry.memberNumber);
      return ElementCreate({
        tag: "div",
        attributes: {
          id: rowId,
          "data-member-number": entry.memberNumber.toString()
        },
        classList: isSelected ? ["rsp-member-grid-row", "rsp-member-row-selected"] : ["rsp-member-grid-row"],
        children: [
          {
            tag: "div",
            classList: ["rsp-member-grid-cell", "rsp-member-grid-cell-checkbox"],
            children: [
              u.createCheckbox({
                id: `rsp-member-select-${entry.memberNumber}`,
                setElementValue: /* @__PURE__ */ __name(() => isSelected, "setElementValue"),
                htmlOptions: {
                  checkbox: {
                    eventListeners: {
                      click: /* @__PURE__ */ __name(function() {
                        const memberNumber = parseInt(this.closest(".rsp-member-grid-row")?.getAttribute("data-member-number") || "0", 10);
                        const row = ElementWrap(rowId);
                        if (this.checked) {
                          if (selectedMembers.size >= limit) {
                            const firstSelected = Array.from(selectedMembers)[0];
                            selectedMembers.delete(firstSelected);
                            const firstRow = document.querySelector(`[data-member-number="${firstSelected}"]`);
                            if (firstRow) {
                              const checkbox = firstRow.querySelector('input[type="checkbox"]');
                              if (checkbox) checkbox.checked = false;
                              firstRow.classList.remove("rsp-member-row-selected");
                            }
                          }
                          selectedMembers.add(memberNumber);
                          if (row) row.classList.add("rsp-member-row-selected");
                        } else {
                          selectedMembers.delete(memberNumber);
                          if (row) row.classList.remove("rsp-member-row-selected");
                        }
                      }, "click")
                    }
                  }
                }
              })
            ]
          },
          {
            tag: "div",
            classList: ["rsp-member-grid-cell", "rsp-member-grid-cell-name"],
            children: [
              entry.name
            ]
          },
          {
            tag: "div",
            classList: ["rsp-member-grid-cell", "rsp-member-grid-cell-number"],
            children: [
              entry.memberNumber.toString()
            ]
          },
          {
            tag: "div",
            classList: ["rsp-member-grid-cell", "rsp-member-grid-cell-context"],
            children: [
              g(`behaviors.member_role.${entry.context}`)
            ]
          }
        ]
      });
    }, "createGridRow");
    const gridContainer = ElementCreate({
      tag: "div",
      classList: ["rsp-member-selector-grid"],
      children: [
        {
          tag: "div",
          classList: ["rsp-member-grid-header"],
          children: [
            {
              tag: "div",
              classList: ["rsp-member-grid-cell", "rsp-member-grid-header-cell"]
            },
            {
              tag: "div",
              classList: ["rsp-member-grid-cell", "rsp-member-grid-header-cell"],
              children: [g("behaviors.member_selector.name")]
            },
            {
              tag: "div",
              classList: ["rsp-member-grid-cell", "rsp-member-grid-header-cell"],
              children: [g("behaviors.member_selector.number")]
            },
            {
              tag: "div",
              classList: ["rsp-member-grid-cell", "rsp-member-grid-header-cell"],
              children: [g("behaviors.member_selector.context")]
            }
          ]
        },
        {
          tag: "div",
          classList: ["rsp-member-grid-content", "scroll-box"],
          attributes: {
            id: "rsp-member-selector-content"
          },
          children: sortedEntries.map((entry) => createGridRow(entry))
        }
      ]
    });
    const selectAllButton = u.createButton({
      id: "rsp-member-select-all",
      onClick: /* @__PURE__ */ __name(function() {
        const checkboxes = gridContainer.querySelectorAll('.rsp-member-grid-content input[type="checkbox"]');
        for (const checkbox of Array.from(checkboxes).reverse()) {
          if (checkbox.checked) continue;
          checkbox.click();
        }
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.select_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-select-all-button"]
        }
      }
    });
    const deselectAllButton = u.createButton({
      id: "rsp-member-deselect-all",
      onClick: /* @__PURE__ */ __name(function() {
        const checkboxes = gridContainer.querySelectorAll('.rsp-member-grid-content input[type="checkbox"]');
        for (const checkbox of Array.from(checkboxes).reverse()) {
          if (!checkbox.checked) continue;
          checkbox.click();
        }
      }, "onClick"),
      options: {
        label: g("behaviors.prompt.deselect_all")
      },
      htmlOptions: {
        button: {
          classList: ["rsp-deselect-all-button"]
        }
      }
    });
    const searchInput = u.createInput({
      id: "rsp-member-search",
      type: "text",
      setSettingValue(val) {
        const searchTerm = val.toLowerCase().trim();
        const rows = gridContainer.querySelectorAll(".rsp-member-grid-row");
        rows.forEach((row) => {
          const nameCell = row.querySelector(".rsp-member-grid-cell-name");
          const numberCell = row.querySelector(".rsp-member-grid-cell-number");
          const contextCell = row.querySelector(".rsp-member-grid-cell-context");
          const name = nameCell?.textContent?.toLowerCase() || "";
          const number = numberCell?.textContent?.toLowerCase() || "";
          const context = contextCell?.textContent?.toLowerCase() || "";
          const matches = name.includes(searchTerm) || number.includes(searchTerm) || context.includes(searchTerm);
          row.style.display = matches ? "" : "none";
        });
      },
      htmlOptions: {
        input: {
          attributes: {
            placeholder: g("behaviors.member_selector.search_placeholder")
          }
        }
      }
    });
    const addCustomEntries = /* @__PURE__ */ __name((memberNumbers) => {
      const contentContainer = ElementWrap("rsp-member-selector-content");
      if (!contentContainer) return;
      let addedAny = false;
      const newEntries = [];
      for (const memberNumber of memberNumbers) {
        if (isNaN(memberNumber) || memberNumber <= 0) continue;
        if (memberEntries.has(memberNumber)) {
          selectedMembers.add(memberNumber);
          const existingRow = ElementWrap(`rsp-member-row-${memberNumber}`);
          if (!existingRow) continue;
          existingRow.classList.add("rsp-member-row-selected");
          const checkbox = existingRow.querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.checked = true;
          continue;
        }
        const newEntry = {
          memberNumber,
          name: g("behaviors.name.unknown"),
          context: "custom"
        };
        memberEntries.set(memberNumber, newEntry);
        selectedMembers.add(memberNumber);
        newEntries.push(newEntry);
        addedAny = true;
      }
      if (!addedAny) return;
      const allEntries = Array.from(memberEntries.values()).sort((a, b2) => {
        const aPriority = contextPriority[a.context] ?? 999;
        const bPriority = contextPriority[b2.context] ?? 999;
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        return a.name.localeCompare(b2.name);
      });
      contentContainer.replaceChildren();
      allEntries.forEach((entry) => {
        const row = createGridRow(entry);
        contentContainer.appendChild(row);
      });
    }, "addCustomEntries");
    const customInput = u.createInput({
      id: "rsp-member-custom-input",
      type: "text",
      htmlOptions: {
        input: {
          attributes: {
            placeholder: g("behaviors.member_selector.custom_input_placeholder"),
            pattern: "[0-9,\\s]+"
          }
        }
      }
    });
    const addCustomButton = u.createButton({
      id: "rsp-member-add-custom",
      onClick: /* @__PURE__ */ __name(function() {
        const input = ElementWrap("rsp-member-custom-input");
        if (!input) return;
        const value = input.value.trim();
        if (!value) return;
        const memberNumbers = value.split(",").map((num) => parseInt(num.trim(), 10)).filter((num) => !isNaN(num) && num > 0);
        if (memberNumbers.length === 0) return;
        addCustomEntries(memberNumbers);
        input.value = "";
      }, "onClick"),
      options: {
        image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`
      },
      htmlOptions: {
        button: {
          classList: ["rsp-member-add-custom-button"]
        }
      }
    });
    const customInputContainer = ElementCreate({
      tag: "div",
      classList: ["rsp-member-custom-container"],
      children: [
        customInput,
        addCustomButton
      ]
    });
    return await W.confirm([
      u.createLabel({ id: null, label: g("behaviors.prompt.select_item") }),
      searchInput,
      customInputContainer,
      gridContainer
    ], {
      modalClassList: ["rsp-modal", "rsp-member-selector-modal"],
      onShow() {
        const buttonContainer = this.querySelector(".deeplib-modal-button-container");
        if (buttonContainer) {
          const controlsContainer = ElementCreate({
            tag: "div",
            classList: ["rsp-selector-controls"],
            children: [
              selectAllButton,
              deselectAllButton
            ]
          });
          buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
        }
      }
    }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedMembers);
    });
  }
  __name(memberNumberSelectorModal, "memberNumberSelectorModal");
  async function textReactionSelectorModal(options) {
    options ??= {};
    const initialValue = options?.initialValue ?? "";
    const prompt = options?.prompt ?? g("behaviors.prompt.edit_text_reaction");
    let textValue = initialValue;
    const textareaId = "rsp-text-reaction-textarea";
    const textarea = ElementCreate({
      tag: "textarea",
      attributes: {
        id: textareaId,
        rows: "2"
      },
      classList: ["rsp-text-reaction-textarea"],
      eventListeners: {
        input: /* @__PURE__ */ __name(function() {
          textValue = this.value;
        }, "input")
      }
    });
    textarea.value = initialValue;
    const insertAtCursor = /* @__PURE__ */ __name((text) => {
      const textareaElement = ElementWrap(textareaId);
      if (!textareaElement) return;
      const start = textareaElement.selectionStart;
      const end = textareaElement.selectionEnd;
      const currentValue = textareaElement.value;
      const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
      textareaElement.value = newValue;
      textValue = newValue;
      const newPosition = start + text.length;
      textareaElement.setSelectionRange(newPosition, newPosition);
      textareaElement.focus();
    }, "insertAtCursor");
    const templateStrings = [
      { label: "Player Name", value: "{{player-name}}" },
      { label: "Player Pronoun", value: "{{player-pronoun}}" },
      { label: "Player Possessive", value: "{{player-possessive}}" },
      { label: "Player Intensive", value: "{{player-intensive}}" },
      { label: "Player Self", value: "{{player-self}}" },
      { label: "Target Name", value: "{{target-name}}" },
      { label: "Target Pronoun", value: "{{target-pronoun}}" },
      { label: "Target Possessive", value: "{{target-possessive}}" },
      { label: "Target Intensive", value: "{{target-intensive}}" },
      { label: "Target Self", value: "{{target-self}}" },
      { label: "Source Name", value: "{{source-name}}" },
      { label: "Source Pronoun", value: "{{source-pronoun}}" },
      { label: "Source Possessive", value: "{{source-possessive}}" },
      { label: "Source Intensive", value: "{{source-intensive}}" },
      { label: "Source Self", value: "{{source-self}}" }
    ];
    const templateButtons = templateStrings.map(
      (template) => u.createButton({
        id: `rsp-template-${template.label.toLowerCase().replace(/\s+/g, "-")}`,
        onClick: /* @__PURE__ */ __name(function() {
          insertAtCursor(template.value);
        }, "onClick"),
        options: {
          label: template.label
        },
        htmlOptions: {
          button: {
            classList: ["rsp-template-button"]
          }
        }
      })
    );
    const templateButtonsContainer = ElementCreate({
      tag: "div",
      classList: ["rsp-template-buttons-container"],
      children: templateButtons
    });
    const container = ElementCreate({
      tag: "div",
      classList: ["rsp-text-reaction-container"],
      children: [
        u.createLabel({
          id: null,
          label: g("behaviors.prompt.enter_text"),
          htmlOptions: {
            classList: ["rsp-text-reaction-label"]
          }
        }),
        textarea,
        {
          tag: "div",
          classList: ["rsp-template-section"],
          children: [
            u.createLabel({
              id: null,
              label: g("behaviors.prompt.insert_template"),
              htmlOptions: {
                classList: ["rsp-template-section-label"]
              }
            }),
            templateButtonsContainer
          ]
        }
      ]
    });
    return await W.confirm([
      u.createLabel({ id: null, label: prompt }),
      container
    ], {
      modalClassList: ["rsp-modal", "rsp-text-reaction-modal"],
      onShow() {
        const textareaElement = ElementWrap(textareaId);
        if (textareaElement) {
          textareaElement.focus();
          textareaElement.setSelectionRange(textareaElement.value.length, textareaElement.value.length);
        }
      }
    }).then((result) => {
      if (!result) {
        return null;
      }
      return textValue;
    });
  }
  __name(textReactionSelectorModal, "textReactionSelectorModal");
  async function expressionGroupSelectorModal(options) {
    const limit = options.limit ?? Infinity;
    if (limit < 1) {
      return [];
    }
    const selectedGroups = new Set(options.selectedGroups ?? []);
    while (selectedGroups.size > limit) {
      const oldest = selectedGroups.values().next().value;
      if (oldest === void 0) {
        break;
      }
      selectedGroups.delete(oldest);
    }
    const buttonByValue = /* @__PURE__ */ new Map();
    const buttons = animationGroups.map((group) => {
      const isSelected = selectedGroups.has(group);
      const realGroup = group === "Eyes1" || group === "Eyes2" ? "Eyes" : group;
      const buttonElement = u.createButton({
        id: null,
        onClick: /* @__PURE__ */ __name(function() {
          const state = this.toggleAttribute("data-selected");
          if (state) {
            if (!selectedGroups.has(group)) {
              if (selectedGroups.size >= limit) {
                const oldest = selectedGroups.values().next().value;
                if (oldest !== void 0) {
                  selectedGroups.delete(oldest);
                  buttonByValue.get(oldest)?.removeAttribute("data-selected");
                }
              }
              selectedGroups.add(group);
            }
          } else {
            selectedGroups.delete(group);
          }
        }, "onClick"),
        options: {
          image: `Icons/Expressions/${realGroup}/Default.png`
        },
        htmlOptions: {
          button: {
            classList: ["rsp-expression-selector-button"],
            dataAttributes: {
              selected: isSelected ? "" : void 0
            }
          }
        }
      });
      buttonByValue.set(group, buttonElement);
      return buttonElement;
    });
    return await W.confirm([
      u.createLabel({ id: null, label: g("animatronikka.prompt.expression_group") }),
      {
        tag: "div",
        classList: ["rsp-expression-selector-buttons-container"],
        children: buttons
      }
    ], { modalClassList: ["rsp-modal", "rsp-expression-selector-modal"] }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedGroups).filter((group) => Boolean(group));
    });
  }
  __name(expressionGroupSelectorModal, "expressionGroupSelectorModal");
  async function expressionNameSelectorModal(options) {
    const limit = options.limit ?? Infinity;
    if (limit < 1) {
      return [];
    }
    const selectedExpressions = new Set(options.selectedExpressions ?? []);
    while (selectedExpressions.size > limit) {
      const oldest = selectedExpressions.values().next().value;
      if (oldest === void 0) {
        break;
      }
      selectedExpressions.delete(oldest);
    }
    const realGroup = options.group;
    const group = realGroup === "Eyes1" ? "Eyes" : realGroup;
    const allowedExpressions = [];
    const assetGroup = AssetGroupGet("Female3DCG", group);
    if (assetGroup) {
      allowedExpressions.push(...assetGroup.AllowExpression ?? []);
      if (!allowedExpressions.includes(null)) {
        allowedExpressions.unshift(null);
      }
    }
    const buttonByValue = /* @__PURE__ */ new Map();
    const buttons = allowedExpressions.sort((a, b2) => {
      if (a === null) return -1;
      if (b2 === null) return 1;
      return 0;
    }).map((expression) => {
      const isSelected = selectedExpressions.has(expression);
      const buttonElement = u.createButton({
        id: null,
        onClick: /* @__PURE__ */ __name(function() {
          const state = this.toggleAttribute("data-selected");
          if (state) {
            if (!selectedExpressions.has(expression)) {
              if (selectedExpressions.size >= limit) {
                const oldest = selectedExpressions.values().next().value;
                if (oldest !== void 0) {
                  selectedExpressions.delete(oldest);
                  buttonByValue.get(oldest)?.removeAttribute("data-selected");
                }
              }
              selectedExpressions.add(expression);
            }
          } else {
            selectedExpressions.delete(expression);
          }
        }, "onClick"),
        options: {
          image: `Icons/Expressions/${group}/${expression ?? "Default"}.png`
        },
        htmlOptions: {
          button: {
            classList: ["rsp-expression-selector-button"],
            dataAttributes: {
              selected: isSelected ? "" : void 0
            }
          }
        }
      });
      buttonByValue.set(expression, buttonElement);
      return buttonElement;
    });
    return await W.confirm([
      u.createLabel({ id: null, label: g("animatronikka.prompt.expression_name") }),
      {
        tag: "div",
        classList: ["rsp-expression-selector-buttons-container"],
        children: buttons
      }
    ], { modalClassList: ["rsp-modal", "rsp-expression-selector-modal"] }).then((result) => {
      if (!result) {
        return null;
      }
      return Array.from(selectedExpressions).filter((expression) => Boolean(expression));
    });
  }
  __name(expressionNameSelectorModal, "expressionNameSelectorModal");
  O("activitySelectorModal", activitySelectorModal);
  O("animationSelectorModal", animationSelectorModal);
  O("bodyPartSelectorModal", bodyPartSelectorModal);
  O("memberNumberSelectorModal", memberNumberSelectorModal);
  O("textReactionSelectorModal", textReactionSelectorModal);

  // src/utilities/triggers.ts
  function matchText(text, pattern, matchMode) {
    switch (matchMode) {
      case "startsWith":
        return text.startsWith(pattern);
      case "endsWith":
        return text.endsWith(pattern);
      case "contains":
        return text.includes(pattern);
      case "exact":
        return pattern === text;
      case "regex":
        return new RegExp(pattern, "i").test(text);
      default:
        assertNever(matchMode);
    }
  }
  __name(matchText, "matchText");
  function registerPredicate(types, predicate) {
    types.forEach((type) => {
      if (!triggerPredicates.has(type)) {
        triggerPredicates.set(type, []);
      }
      triggerPredicates.get(type).push(predicate);
    });
  }
  __name(registerPredicate, "registerPredicate");
  function registerRank(types, rank) {
    types.forEach((type) => triggerRanks.set(type, rank));
  }
  __name(registerRank, "registerRank");
  function triggerRank(trigger) {
    return triggerRanks.get(trigger.type)?.(trigger) ?? 0;
  }
  __name(triggerRank, "triggerRank");
  function hasTriggerRank(type) {
    return triggerRanks.has(type);
  }
  __name(hasTriggerRank, "hasTriggerRank");
  var messageContentPredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "emote" && trigger.type !== "speech" && trigger.type !== "action") {
      return false;
    }
    if (!data.message) return false;
    return trigger.content.some((entry) => {
      const templatedMessage = replaceTemplate(entry.value, data.target, data.source);
      if (!data.message) return false;
      return matchText(data.message, templatedMessage, entry.matchMode);
    });
  }, "messageContentPredicate");
  var speechTypePredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "speech") return true;
    if (trigger.speechType === "any") return true;
    return trigger.speechType === data.speechType;
  }, "speechTypePredicate");
  var activityPredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "activity") return false;
    if (!data.activityName || !data.groupName) return false;
    return trigger.activityName.includes(data.activityName) && trigger.groupName.includes(data.groupName);
  }, "activityPredicate");
  var orgasmPredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "orgasm") return false;
    if (trigger.orgasmType === "any") return true;
    return trigger.orgasmType === data.orgasmType;
  }, "orgasmPredicate");
  var arousalPredicate = /* @__PURE__ */ __name((trigger) => {
    if (trigger.type !== "arousal") return false;
    return (Player.ArousalSettings?.Progress ?? 0) >= trigger.limit;
  }, "arousalPredicate");
  var roomPresencePredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "roomPresence") return false;
    return trigger.event === data.roomPrecenseEvent;
  }, "roomPresencePredicate");
  var buttonPredicate = /* @__PURE__ */ __name((trigger, data) => {
    if (trigger.type !== "button") return false;
    return trigger.id === data.buttonId;
  }, "buttonPredicate");
  var triggerPredicates = /* @__PURE__ */ new Map();
  var triggerRanks = /* @__PURE__ */ new Map();
  registerPredicate(["emote", "speech", "action"], messageContentPredicate);
  registerPredicate(["speech"], speechTypePredicate);
  registerPredicate(["activity"], activityPredicate);
  registerPredicate(["orgasm"], orgasmPredicate);
  registerPredicate(["roomPresence"], roomPresencePredicate);
  registerPredicate(["arousal"], arousalPredicate);
  registerPredicate(["button"], buttonPredicate);
  registerRank(["arousal"], (trigger) => trigger.type === "arousal" ? trigger.limit : 0);
  var constraintPrerequisites = /* @__PURE__ */ new Map();
  function registerConstraintPrerequisite(entity, predicate, keys) {
    let entry = constraintPrerequisites.get(entity);
    if (!entry) {
      entry = [];
      constraintPrerequisites.set(entity, entry);
    }
    entry.push({ keys, predicate });
  }
  __name(registerConstraintPrerequisite, "registerConstraintPrerequisite");
  function isConstraintCompatible(trigger, entity, key) {
    const entry = constraintPrerequisites.get(entity);
    if (!entry) return true;
    return entry.every((entry2) => {
      if (key === void 0) {
        if (entry2.keys !== void 0) return true;
        return entry2.predicate(trigger);
      }
      if (entry2.keys !== void 0 && !entry2.keys.includes(key)) return true;
      return entry2.predicate(trigger);
    });
  }
  __name(isConstraintCompatible, "isConstraintCompatible");
  var excludeOnArousal = /* @__PURE__ */ __name((trigger) => trigger.type !== "arousal", "excludeOnArousal");
  var excludeOnButton = /* @__PURE__ */ __name((trigger) => trigger.type !== "button", "excludeOnButton");
  registerConstraintPrerequisite("source", excludeOnButton);
  registerConstraintPrerequisite("target", excludeOnButton);
  registerConstraintPrerequisite("source", excludeOnArousal);
  registerConstraintPrerequisite("target", excludeOnArousal);
  registerConstraintPrerequisite("player", excludeOnArousal, ["arousalMin", "arousalMax"]);
  function constraintKeys(obj) {
    return CommonKeys(obj);
  }
  __name(constraintKeys, "constraintKeys");
  function applicableConstraints(trigger) {
    const constraints = trigger.constraints;
    if (!constraints) return void 0;
    const result = {};
    constraintKeys(constraints).forEach((entity) => {
      if (!isConstraintCompatible(trigger, entity)) return;
      const stored = constraints[entity];
      if (!stored) return;
      const filtered = {};
      for (const key of constraintKeys(stored)) {
        if (!isConstraintCompatible(trigger, entity, key)) continue;
        const value = stored[key];
        if (value === void 0) continue;
        filtered[key] = value;
      }
      if (CommonKeys(filtered).length > 0) {
        result[entity] = filtered;
      }
    });
    return CommonKeys(result).length > 0 ? result : void 0;
  }
  __name(applicableConstraints, "applicableConstraints");
  function checkTriggerPredicates(trigger, data) {
    const predicates = triggerPredicates.get(trigger.type);
    if (!predicates || predicates.length === 0) {
      m.warn(`No predicates registered for trigger type: ${trigger.type}`);
      return false;
    }
    return predicates.every((predicate) => predicate(trigger, data));
  }
  __name(checkTriggerPredicates, "checkTriggerPredicates");
  function checkMemberNumberRule(rule, memberNumber) {
    const memberId = memberNumber.toString();
    return rule.entries.some((entry) => {
      const matches = entry.value === memberId;
      return entry.mode === "include" ? matches : !matches;
    });
  }
  __name(checkMemberNumberRule, "checkMemberNumberRule");
  function evaluateCharacterConstraints(constraints, char) {
    const results = {};
    const hasChar = char !== void 0;
    if ("memberNumber" in constraints && constraints.memberNumber !== void 0) {
      results.memberNumber = hasChar && char.MemberNumber !== void 0 ? checkMemberNumberRule(constraints.memberNumber, char.MemberNumber) : false;
    }
    if (constraints.restrained !== void 0) {
      results.restrained = hasChar ? char.IsRestrained() === constraints.restrained : false;
    }
    if (constraints.gagged !== void 0) {
      results.gagged = hasChar ? char.IsGagged() === constraints.gagged : false;
    }
    if (constraints.blinded !== void 0) {
      results.blinded = hasChar ? char.IsBlind() === constraints.blinded : false;
    }
    if (constraints.deafened !== void 0) {
      results.deafened = hasChar ? char.IsDeaf() === constraints.deafened : false;
    }
    if (constraints.arousalMin !== void 0) {
      const arousal = char?.ArousalSettings?.Progress ?? 0;
      results.arousalMin = arousal <= constraints.arousalMin;
    }
    if (constraints.arousalMax !== void 0) {
      const arousal = char?.ArousalSettings?.Progress ?? 0;
      results.arousalMax = arousal >= constraints.arousalMax;
    }
    return results;
  }
  __name(evaluateCharacterConstraints, "evaluateCharacterConstraints");
  function evaluateSourceConstraints(constraints, data) {
    return evaluateCharacterConstraints(constraints, data.source);
  }
  __name(evaluateSourceConstraints, "evaluateSourceConstraints");
  function evaluateTargetConstraints(constraints, data) {
    return evaluateCharacterConstraints(constraints, data.target);
  }
  __name(evaluateTargetConstraints, "evaluateTargetConstraints");
  function evaluatePlayerConstraints(constraints, _data) {
    return evaluateCharacterConstraints(constraints, Player);
  }
  __name(evaluatePlayerConstraints, "evaluatePlayerConstraints");
  function evaluateRoomConstraints(constraints, _data) {
    const results = {};
    if (constraints.inRoomNamed !== void 0) {
      const roomName = ChatRoomData?.Name ?? "";
      results.inRoomNamed = constraints.inRoomNamed.entries.some((entry) => {
        const matches = entry.value === roomName;
        return entry.mode === "include" ? matches : !matches;
      });
    }
    if (constraints.inRoomWithMembers !== void 0) {
      const members = ChatRoomData?.Character?.map((c) => c.MemberNumber) ?? [];
      results.inRoomWithMembers = constraints.inRoomWithMembers.entries.some((entry) => {
        const memberId = parseInt(entry.value, 10);
        const matches = members.includes(memberId);
        return entry.mode === "include" ? matches : !matches;
      });
    }
    return results;
  }
  __name(evaluateRoomConstraints, "evaluateRoomConstraints");
  function evaluateAllConstraints(constraints, data) {
    const results = {};
    if (constraints.source) {
      results.source = evaluateSourceConstraints(constraints.source, data);
    }
    if (constraints.target) {
      results.target = evaluateTargetConstraints(constraints.target, data);
    }
    if (constraints.player) {
      results.player = evaluatePlayerConstraints(constraints.player, data);
    }
    if (constraints.room) {
      results.room = evaluateRoomConstraints(constraints.room, data);
    }
    return results;
  }
  __name(evaluateAllConstraints, "evaluateAllConstraints");
  function isTriggerMet(trigger, messageData) {
    if (trigger.constraints && trigger.constraintMode) {
      const applicable = applicableConstraints(trigger);
      if (applicable && !processTriggerConstraint(applicable, trigger.constraintMode, messageData)) return false;
    }
    return checkTriggerPredicates(trigger, messageData);
  }
  __name(isTriggerMet, "isTriggerMet");
  function collectTriggers(type, messageData) {
    const enabledBehaviors = Object.values(BehaviorsModule.instance.settings.behaviors).filter((b2) => b2.enabled);
    const matches = [];
    for (const behavior of enabledBehaviors) {
      const last = BehaviorsModule.instance.behaviorExecutionMap.get(behavior.id);
      if (last && CommonTime() - last < (behavior.cooldownSec ?? 0) * 1e3) {
        continue;
      }
      const triggers = behavior.triggers.map((t8) => BehaviorsModule.instance.getTrigger(t8));
      const triggersOfType = triggers.filter((t8) => t8?.type === type).filter((t8) => t8 !== void 0);
      let best;
      for (const trigger of triggersOfType) {
        if (!isTriggerMet(trigger, messageData)) continue;
        if (!best || triggerRank(trigger) > triggerRank(best)) best = trigger;
      }
      if (best) matches.push({ behavior, trigger: best });
    }
    return matches;
  }
  __name(collectTriggers, "collectTriggers");
  function processTriggerConstraint(triggerConstraint, mode, messageData) {
    function collect(results2) {
      if (!results2) return [];
      return CommonEntries(results2).map(([, passed]) => passed);
    }
    __name(collect, "collect");
    const results = evaluateAllConstraints(triggerConstraint, messageData);
    const allResults = [
      ...collect(results.source),
      ...collect(results.target),
      ...collect(results.player),
      ...collect(results.room)
    ];
    if (allResults.length === 0) return true;
    switch (mode) {
      case "any":
        return allResults.some((result) => result);
      case "all":
        return allResults.every((result) => result);
      default:
        assertNever(mode);
    }
  }
  __name(processTriggerConstraint, "processTriggerConstraint");
  function triggerHasAnyConstraints(trigger) {
    return applicableConstraints(trigger) !== void 0;
  }
  __name(triggerHasAnyConstraints, "triggerHasAnyConstraints");
  function triggerHasConstraint(trigger, entity, constraintKey) {
    if (!trigger.constraints) return false;
    if (!isConstraintCompatible(trigger, entity, constraintKey)) return false;
    const entityConstraints = trigger.constraints[entity];
    if (!entityConstraints) return false;
    if (constraintKey === void 0) {
      return constraintKeys(entityConstraints).some((key) => isConstraintCompatible(trigger, entity, key));
    }
    const value = entityConstraints[constraintKey];
    if (value === null || value === void 0) return false;
    if (typeof value === "boolean" || typeof value === "number") {
      return true;
    }
    if (typeof value === "object" && "entries" in value) {
      return Array.isArray(value.entries) && value.entries.length > 0;
    }
    return false;
  }
  __name(triggerHasConstraint, "triggerHasConstraint");

  // src/utilities/debugStorage.ts
  var DEBUG_STORAGE_KEY = "DEBUG_HISTORY";
  var MAX_ENTRIES = 50;
  var DebugStorage = class _DebugStorage {
    static {
      __name(this, "DebugStorage");
    }
    static getHistory() {
      const history = modStorage.getLocalStorage(DEBUG_STORAGE_KEY);
      return history ?? [];
    }
    static addEntry(entry) {
      const history = _DebugStorage.getHistory();
      const newEntry = { ...entry, id: CommonGenerateUniqueID() };
      history.unshift(newEntry);
      if (history.length > MAX_ENTRIES) {
        history.length = MAX_ENTRIES;
      }
      modStorage.setLocalStorage(DEBUG_STORAGE_KEY, history);
    }
    static clearHistory() {
      modStorage.setLocalStorage(DEBUG_STORAGE_KEY, []);
    }
  };

  // src/screens/behaviors.ts
  var selector3 = Object.freeze({
    tabContainer: "rsp-behaviors-tab-container",
    tabButton: "rsp-behaviors-tab-button",
    tabContent: "rsp-behaviors-tab-content",
    listPanel: "rsp-behaviors-list-panel",
    editorPanel: "rsp-behaviors-editor-panel",
    listItemC: "rsp-behaviors-list-item",
    addButton: "rsp-behaviors-add-button",
    deleteModeToggle: "rsp-delete-mode-toggle",
    contentList: "rsp-behaviors-content-list",
    chip: "rsp-behaviors-chip",
    chipRemove: "rsp-behaviors-chip-remove",
    listItemsContainer: "rsp-behaviors-list-items",
    chipList: /* @__PURE__ */ __name((id) => `rsp-chip-list-${id}`, "chipList"),
    contentListSection: /* @__PURE__ */ __name((id) => `rsp-content-list-section-${id}`, "contentListSection"),
    listItem: /* @__PURE__ */ __name((id) => `rsp-list-item-${id}`, "listItem"),
    includeExcludeEntryList: /* @__PURE__ */ __name((id) => `rsp-constraint-entry-list-${id}`, "includeExcludeEntryList"),
    constraintsSection: /* @__PURE__ */ __name((id) => `rsp-constraints-section-${id}`, "constraintsSection")
  });
  var GuiBehaviors = class _GuiBehaviors extends I {
    static {
      __name(this, "GuiBehaviors");
    }
    static instance;
    deleteMode = false;
    doNotShowConfirmation = false;
    activeTab = "behaviors";
    selectedBehaviorId = null;
    selectedTriggerId = null;
    selectedReactionId = null;
    searchQuery = "";
    static subscreenOptions = {
      name: "behaviors",
      icon: `${"https://protokink.github.io/Responsive/dev/public"}/images/chat_round_line.svg`,
      forceUpCharacter: true,
      drawCharacter: false
    };
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    // #endregion !SECTION Class Definition
    // #region SECTION BaseSubscreen Lifecycle
    get pageStructure() {
      return [
        [
          {
            type: "custom",
            id: selector3.tabContainer,
            htmlOptions: {
              tag: "div",
              classList: ["rsp-behaviors-container"],
              parent: b.getSubscreen()
            },
            position: [100, 180],
            size: /* @__PURE__ */ __name(() => [1800, 720], "size")
          }
        ]
      ];
    }
    load() {
      _GuiBehaviors.instance = this;
      super.load();
      const deleteModeButton = u.createButton({
        id: selector3.deleteModeToggle,
        onClick: /* @__PURE__ */ __name(() => this.toggleDeleteMode(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`,
          tooltip: g("behaviors.text.toggle_delete_mode")
        },
        size: [90, 90]
      });
      I.menu?.prepend(deleteModeButton);
      this.render();
    }
    run() {
      super.run();
    }
    click() {
      super.click();
    }
    exit() {
      _GuiBehaviors.instance.deleteMode = false;
      _GuiBehaviors.instance.doNotShowConfirmation = false;
      _GuiBehaviors.instance.selectedBehaviorId = null;
      _GuiBehaviors.instance.selectedTriggerId = null;
      _GuiBehaviors.instance.selectedReactionId = null;
      _GuiBehaviors.instance.searchQuery = "";
      super.exit();
    }
    // #endregion !SECTION BaseSubscreen Lifecycle
    // #region SECTION Rendering
    render() {
      const container = ElementWrap(selector3.tabContainer);
      if (!container) return;
      container.replaceChildren();
      container.append(this.buildTabNavigation(), this.buildTabContent());
    }
    buildTabNavigation() {
      const nav = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-tabs"],
        children: [
          this.createTabButton("behaviors", g("behaviors.tab.behaviors")),
          this.createTabButton("triggers", g("behaviors.tab.triggers")),
          this.createTabButton("reactions", g("behaviors.tab.reactions")),
          this.createTabButton("debugger", g("behaviors.tab.debugger"))
        ]
      });
      return nav;
    }
    createTabButton(tab, label) {
      const button = u.createButton({
        id: `${selector3.tabButton}-${tab}`,
        onClick: /* @__PURE__ */ __name(() => this.switchTab(tab), "onClick"),
        options: {
          label
        },
        htmlOptions: {
          button: {
            classList: [
              selector3.tabButton
            ],
            dataAttributes: {
              tab,
              selected: this.activeTab === tab
            }
          }
        }
      });
      return button;
    }
    switchTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.selectedBehaviorId = null;
      this.selectedTriggerId = null;
      this.selectedReactionId = null;
      this.searchQuery = "";
      this.render();
    }
    buildTabContent() {
      if (this.activeTab === "debugger") {
        return ElementCreate({
          tag: "div",
          classList: ["rsp-behaviors-tab-content"],
          children: [this.buildDebuggerPanel()]
        });
      }
      const content = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-tab-content"],
        children: [
          this.buildListPanel(),
          this.buildEditorPanel()
        ]
      });
      return content;
    }
    // #endregion !SECTION Rendering
    // #region SECTION List Panel Building
    buildListPanel() {
      const panel = ElementCreate({
        tag: "div",
        classList: [selector3.listPanel],
        children: [
          {
            tag: "div",
            classList: ["rsp-behaviors-list-header"],
            children: [
              this.buildSearchBar(),
              this.buildAddButton()
            ]
          },
          this.buildListItems()
        ]
      });
      return panel;
    }
    buildSearchBar() {
      const searchInput = u.createInput({
        id: `rsp-search-${this.activeTab}`,
        type: "text",
        setElementValue: /* @__PURE__ */ __name(() => this.searchQuery, "setElementValue"),
        setSettingValue: /* @__PURE__ */ __name((val) => {
          this.searchQuery = val;
          this.updateListItems();
        }, "setSettingValue"),
        htmlOptions: {
          container: {
            classList: ["rsp-behaviors-search"]
          },
          input: {
            attributes: {
              placeholder: g("behaviors.search.placeholder")
            }
          }
        }
      });
      return searchInput;
    }
    buildAddButton() {
      if (this.activeTab === "debugger") return void 0;
      const tooltipMap = {
        behaviors: "behaviors.button.add_behavior",
        triggers: "behaviors.button.add_trigger",
        reactions: "behaviors.button.add_reaction"
      };
      const tooltip = g(tooltipMap[this.activeTab]);
      return u.createButton({
        id: `${selector3.addButton}-${this.activeTab}`,
        onClick: /* @__PURE__ */ __name(() => this.handleAdd(), "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
          tooltip
        },
        htmlOptions: {
          button: {
            classList: [selector3.addButton]
          }
        }
      });
    }
    buildListItems() {
      const children = [];
      const query = this.searchQuery.toLowerCase().trim();
      if (this.activeTab === "behaviors") {
        Object.values(this.settings.behaviors).filter((behavior) => !query || behavior.name.toLowerCase().includes(query)).reverse().forEach((behavior) => {
          children.push(this.buildBehaviorListItem(behavior));
        });
      } else if (this.activeTab === "triggers") {
        Object.values(this.settings.triggers).filter((trigger) => !query || trigger.name.toLowerCase().includes(query)).reverse().forEach((trigger) => {
          children.push(this.buildTriggerListItem(trigger));
        });
      } else if (this.activeTab === "reactions") {
        Object.values(this.settings.reactions).filter((reaction) => !query || reaction.name.toLowerCase().includes(query)).reverse().forEach((reaction) => {
          children.push(this.buildReactionListItem(reaction));
        });
      }
      const thisElement = ElementWrap(selector3.listItemsContainer);
      const scrollBox = ElementCreate({
        tag: "div",
        classList: ["scroll-box", selector3.listItemsContainer],
        attributes: {
          id: selector3.listItemsContainer
        },
        children
      });
      if (thisElement) {
        thisElement.replaceWith(scrollBox);
      }
      return scrollBox;
    }
    updateListItems() {
      const listItemsContainer = document.querySelector(`.${selector3.listItemsContainer}`);
      if (!listItemsContainer) return;
      const scrollPosition = listItemsContainer.scrollTop;
      const children = [];
      const query = this.searchQuery.toLowerCase().trim();
      if (this.activeTab === "behaviors") {
        Object.values(this.settings.behaviors).filter((behavior) => !query || behavior.name.toLowerCase().includes(query)).reverse().forEach((behavior) => {
          children.push(this.buildBehaviorListItem(behavior));
        });
      } else if (this.activeTab === "triggers") {
        Object.values(this.settings.triggers).filter((trigger) => !query || trigger.name.toLowerCase().includes(query)).reverse().forEach((trigger) => {
          children.push(this.buildTriggerListItem(trigger));
        });
      } else if (this.activeTab === "reactions") {
        Object.values(this.settings.reactions).filter((reaction) => !query || reaction.name.toLowerCase().includes(query)).reverse().forEach((reaction) => {
          children.push(this.buildReactionListItem(reaction));
        });
      }
      listItemsContainer.replaceChildren();
      listItemsContainer.append(...children);
      listItemsContainer.scrollTop = scrollPosition;
    }
    buildBehaviorListItem(behavior) {
      const isSelected = this.selectedBehaviorId === behavior.id;
      const hasTimeout = behavior.cooldownSec && behavior.cooldownSec > 0;
      const image = hasTimeout ? `${"https://protokink.github.io/Responsive/dev/public"}/images/clock.svg` : void 0;
      const thisElement = ElementWrap(selector3.listItem(behavior.id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const mainDiv = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-item-main"],
        children: [
          u.createCheckbox({
            id: `rsp-behavior-enabled-${CommonGenerateUniqueID()}`,
            label: behavior.name,
            setElementValue: /* @__PURE__ */ __name(() => behavior.enabled, "setElementValue"),
            options: {
              direction: "rowReverse"
            },
            htmlOptions: {
              label: {
                classList: ["rsp-behaviors-item-name", "truncated-text"]
              }
            }
          }),
          {
            tag: "span",
            classList: ["rsp-behaviors-item-info"],
            children: [
              `${behavior.triggers.length} ${g("behaviors.text.triggers")}, ${behavior.reactions.length} ${g("behaviors.text.reactions")}`
            ]
          }
        ]
      });
      const button = u.createButton({
        id: selector3.listItem(thisElement ? CommonGenerateUniqueID() : behavior.id),
        onClick: /* @__PURE__ */ __name(() => {
          if (this.deleteMode) {
            this.handleDelete("behaviors", behavior.id);
          } else {
            this.selectBehavior(behavior.id);
          }
        }, "onClick"),
        options: {
          image
        },
        htmlOptions: {
          button: {
            classList: [selector3.listItemC],
            dataAttributes: {
              deletable: "true",
              deleteMode: this.deleteMode,
              selected: isSelected
            },
            children: [
              mainDiv
            ]
          },
          img: {
            classList: ["rsp-behaviors-item-timeout-icon"]
          }
        }
      });
      if (thisElement) {
        thisElement.replaceWith(button);
        button.id = selector3.listItem(behavior.id);
      }
      return button;
    }
    buildTriggerListItem(trigger) {
      const thisElement = ElementWrap(selector3.listItem(trigger.id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const isSelected = this.selectedTriggerId === trigger.id;
      const hasConstraints = triggerHasAnyConstraints(trigger);
      const badges = [
        {
          tag: "span",
          classList: ["rsp-behaviors-item-badge", `type-${trigger.type}`],
          children: [
            g(`behaviors.trigger_type.${trigger.type}`)
          ]
        },
        ...hasConstraints ? [{
          tag: "span",
          classList: ["rsp-behaviors-item-badge", "has-constraints"],
          children: [
            g("behaviors.text.has_constraints")
          ]
        }] : []
      ];
      const mainDiv = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-item-main"],
        children: [
          {
            tag: "span",
            classList: ["rsp-behaviors-item-name", "truncated-text"],
            children: [
              trigger.name
            ]
          },
          {
            tag: "div",
            classList: ["rsp-behaviors-item-badges"],
            children: badges
          }
        ]
      });
      const button = u.createButton({
        id: selector3.listItem(thisElement ? CommonGenerateUniqueID() : trigger.id),
        onClick: /* @__PURE__ */ __name(() => {
          if (this.deleteMode) {
            this.handleDelete("triggers", trigger.id);
          } else {
            this.selectTrigger(trigger.id);
          }
        }, "onClick"),
        htmlOptions: {
          button: {
            classList: [selector3.listItemC],
            dataAttributes: {
              deletable: "true",
              deleteMode: this.deleteMode,
              selected: isSelected
            },
            children: [
              mainDiv
            ]
          }
        }
      });
      if (thisElement) {
        thisElement.replaceWith(button);
        button.id = selector3.listItem(trigger.id);
      }
      return button;
    }
    buildReactionListItem(reaction) {
      const isSelected = this.selectedReactionId === reaction.id;
      const thisElement = ElementWrap(selector3.listItem(reaction.id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const mainDiv = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-item-main"],
        children: [
          {
            tag: "span",
            classList: ["rsp-behaviors-item-name", "truncated-text"],
            children: [reaction.name]
          },
          {
            tag: "div",
            classList: ["rsp-behaviors-item-badges"],
            children: [
              {
                tag: "span",
                classList: ["rsp-behaviors-item-badge", `type-${reaction.type}`],
                children: [g(`behaviors.reaction_type.${reaction.type}`)]
              }
            ]
          }
        ]
      });
      const button = u.createButton({
        id: selector3.listItem(thisElement ? CommonGenerateUniqueID() : reaction.id),
        onClick: /* @__PURE__ */ __name(() => {
          if (this.deleteMode) {
            this.handleDelete("reactions", reaction.id);
          } else {
            this.selectReaction(reaction.id);
          }
        }, "onClick"),
        htmlOptions: {
          button: {
            classList: [selector3.listItemC],
            dataAttributes: {
              deletable: "true",
              deleteMode: this.deleteMode,
              selected: isSelected
            },
            children: [
              mainDiv
            ]
          }
        }
      });
      if (thisElement) {
        thisElement.replaceWith(button);
        button.id = selector3.listItem(reaction.id);
      }
      return button;
    }
    // #endregion !SECTION List Panel Building
    // #region SECTION Editor Panel Building
    buildEditorPanel() {
      const thisElement = ElementWrap(selector3.editorPanel);
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const panel = ElementCreate({
        tag: "div",
        attributes: {
          id: selector3.editorPanel
        },
        classList: [selector3.editorPanel, "scroll-box"],
        children: []
      });
      if (this.activeTab === "behaviors" && this.selectedBehaviorId) {
        const behavior = this.settings.behaviors[this.selectedBehaviorId];
        if (behavior) {
          panel.append(...this.buildBehaviorEditor(behavior));
        }
      } else if (this.activeTab === "triggers" && this.selectedTriggerId) {
        const trigger = this.settings.triggers[this.selectedTriggerId];
        if (trigger) {
          panel.append(...this.buildTriggerEditor(trigger));
        }
      } else if (this.activeTab === "reactions" && this.selectedReactionId) {
        const reaction = this.settings.reactions[this.selectedReactionId];
        if (reaction) {
          panel.append(...this.buildReactionEditor(reaction));
        }
      } else {
        panel.appendChild(u.createLabel({
          id: "rsp-behaviors-editor-empty",
          label: g("behaviors.text.select_item_to_edit"),
          htmlOptions: {
            classList: ["rsp-behaviors-editor-empty"]
          }
        }));
      }
      if (thisElement) {
        thisElement.replaceWith(panel);
      }
      return panel;
    }
    buildDebuggerPanel() {
      const history = DebugStorage.getHistory();
      const title = u.createLabel({
        id: "rsp-debugger-title",
        label: g("behaviors.debugger.title"),
        htmlOptions: {
          classList: ["rsp-debugger-title"]
        }
      });
      const countLabel = u.createLabel({
        id: "rsp-debugger-count",
        label: g("behaviors.debugger.entry_count", { $count: history.length.toString() }),
        htmlOptions: {
          classList: ["rsp-debugger-count"]
        }
      });
      const clearButton = u.createButton({
        id: "rsp-debugger-clear",
        onClick: /* @__PURE__ */ __name(() => {
          BehaviorsModule.clearDebugHistory();
          this.render();
        }, "onClick"),
        options: {
          label: g("behaviors.debugger.clear_history")
        },
        htmlOptions: {
          button: {
            classList: ["rsp-debugger-clear"]
          }
        }
      });
      const note = u.createLabel({
        id: "rsp-debugger-note",
        label: g("behaviors.debugger.local_storage_note"),
        htmlOptions: {
          classList: ["rsp-debugger-note"]
        }
      });
      const header = ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-header"],
        children: [title, note, countLabel, clearButton]
      });
      const list = ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-list", "scroll-box"],
        children: []
      });
      if (history.length === 0) {
        list.appendChild(u.createLabel({
          id: "rsp-debugger-empty",
          label: g("behaviors.debugger.no_executions"),
          htmlOptions: {
            classList: ["rsp-debugger-empty"]
          }
        }));
      } else {
        history.forEach((entry) => list.appendChild(this.buildDebuggerEntry(entry)));
      }
      return ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-panel"],
        children: [header, list]
      });
    }
    buildDebuggerEntry(entry) {
      const behavior = this.module.getBehavior(entry.behaviorId);
      const trigger = this.module.getTrigger(entry.triggerId);
      const behaviorLabel = behavior ? behavior.name : `${g("behaviors.debugger.unknown_behavior")} (${entry.behaviorId})`;
      const triggerLabel = trigger ? `${trigger.name} (${g(`behaviors.trigger_type.${trigger.type}`)})` : `${g("behaviors.debugger.unknown_trigger")} (${entry.triggerId})`;
      const reactionLabels = entry.reactionIds.length === 0 ? [g("behaviors.text.empty_content")] : entry.reactionIds.map((id) => {
        const reaction = this.module.getReaction(id);
        return reaction ? reaction.name : `${g("behaviors.debugger.unknown_reaction")} (${id})`;
      });
      const header = ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-entry-header"],
        children: [
          u.createLabel({
            id: null,
            label: behaviorLabel,
            htmlOptions: {
              classList: ["rsp-debugger-entry-title", !behavior ? "rsp-debugger-unknown" : void 0]
            }
          }),
          u.createLabel({
            id: null,
            label: new Date(entry.timestamp).toLocaleString(),
            htmlOptions: {
              classList: ["rsp-debugger-entry-time"]
            }
          }),
          {
            tag: "div",
            classList: ["rsp-debugger-badge"],
            children: [g(`behaviors.trigger_type.${entry.triggerType}`)]
          }
        ]
      });
      const body = ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-entry-body"],
        children: [
          this.buildDebuggerField("behaviors.debugger.trigger", triggerLabel, !trigger),
          this.buildDebuggerField("behaviors.debugger.reactions", reactionLabels.join(", "), reactionLabels.some((label) => label.startsWith(g("behaviors.debugger.unknown_reaction"))))
        ]
      });
      const messageFields = [];
      const data = entry.messageData;
      if (data.sourceMemberNumber !== void 0) {
        messageFields.push(this.buildDebuggerField("behaviors.debugger.source_member", data.sourceMemberNumber.toString()));
      }
      if (data.targetMemberNumber !== void 0) {
        messageFields.push(this.buildDebuggerField("behaviors.debugger.target_member", data.targetMemberNumber.toString()));
      }
      if (data.messageContent) {
        messageFields.push(this.buildDebuggerField("behaviors.debugger.message_content", data.messageContent));
      }
      if (data.activityName) {
        messageFields.push(this.buildDebuggerField("behaviors.debugger.activity_name", data.activityName));
      }
      if (data.groupName) {
        messageFields.push(this.buildDebuggerField("behaviors.debugger.group_name", data.groupName));
      }
      if (data.orgasmType) {
        messageFields.push(this.buildDebuggerField("behaviors.field.orgasm_type", data.orgasmType));
      }
      if (data.roomPrecenseEvent) {
        messageFields.push(this.buildDebuggerField("behaviors.field.room_presence_event", data.roomPrecenseEvent));
      }
      if (data.speechType) {
        messageFields.push(this.buildDebuggerField("behaviors.field.speech_type", data.speechType));
      }
      if (data.buttonId) {
        const buttonTrigger = this.module.getTrigger(data.buttonId);
        const buttonLabel = buttonTrigger?.type === "button" ? buttonTrigger.name : data.buttonId;
        messageFields.push(this.buildDebuggerField("behaviors.field.button_label", buttonLabel));
      }
      const messageSection = buildCollapsibleSection({
        headerKey: "behaviors.debugger.message_data",
        content: /* @__PURE__ */ __name(() => messageFields.length > 0 ? messageFields : [this.buildDebuggerField("behaviors.debugger.message_data", g("behaviors.text.empty_content"))], "content")
      });
      return ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-entry"],
        children: [header, body, messageSection]
      });
    }
    buildDebuggerField(labelKey, value, isUnknown = false) {
      return ElementCreate({
        tag: "div",
        classList: ["rsp-debugger-field"],
        children: [
          u.createLabel({
            id: null,
            label: g(labelKey),
            htmlOptions: {
              classList: ["rsp-debugger-field-label"]
            }
          }),
          u.createLabel({
            id: null,
            label: value,
            htmlOptions: {
              classList: ["rsp-debugger-field-value", isUnknown ? "rsp-debugger-unknown" : void 0]
            }
          })
        ]
      });
    }
    buildBehaviorEditor(behavior) {
      const elements = [];
      const nameField = createInputField({
        id: `${behavior.id}-name`,
        labelKey: "behaviors.field.name",
        value: behavior.name,
        onChange: /* @__PURE__ */ __name((val) => {
          behavior.name = val;
          this.buildBehaviorListItem(behavior);
        }, "onChange")
      });
      elements.push(nameField);
      const enabledField = u.createCheckbox({
        id: `${behavior.id}-enabled`,
        label: g("behaviors.field.enabled"),
        setElementValue: /* @__PURE__ */ __name(() => behavior.enabled, "setElementValue"),
        setSettingValue: /* @__PURE__ */ __name((val) => {
          behavior.enabled = val;
          this.buildBehaviorListItem(behavior);
        }, "setSettingValue"),
        htmlOptions: {
          container: {
            classList: ["rsp-behaviors-field"]
          }
        }
      });
      elements.push(enabledField);
      const reactionModeField = createDropdownField({
        id: `${behavior.id}-reaction-mode`,
        labelKey: "behaviors.field.reaction_mode",
        value: behavior.reactionMode,
        options: reactionModes,
        onChange: /* @__PURE__ */ __name((val) => behavior.reactionMode = val, "onChange")
      });
      elements.push(reactionModeField);
      const cooldownField = createNumberInputField({
        id: `${behavior.id}-cooldown`,
        labelKey: "behaviors.field.cooldown",
        value: behavior.cooldownSec?.toString() || "",
        onChange: /* @__PURE__ */ __name((val) => {
          behavior.cooldownSec = val ? parseFloat(val) : void 0;
          this.buildBehaviorListItem(behavior);
        }, "onChange"),
        step: "0.1"
      });
      elements.push(cooldownField);
      elements.push(this.buildTriggersSection(behavior));
      elements.push(this.buildReactionsSection(behavior));
      return elements;
    }
    buildTriggerEditor(trigger) {
      const elements = [];
      const nameField = createInputField({
        id: `${trigger.id}-name`,
        labelKey: "behaviors.field.name",
        value: trigger.name,
        onChange: /* @__PURE__ */ __name((val) => {
          trigger.name = val;
          this.buildTriggerListItem(trigger);
        }, "onChange")
      });
      elements.push(nameField);
      const typeOptions = triggerTypes;
      const typeField = createDropdownField({
        id: `${trigger.id}-type`,
        labelKey: "behaviors.field.type",
        value: trigger.type,
        options: typeOptions,
        onChange: /* @__PURE__ */ __name((val) => {
          const newTrigger = this.changeTriggerType(trigger, val);
          if (newTrigger) {
            this.settings.triggers[newTrigger.id] = newTrigger;
            this.selectedTriggerId = newTrigger.id;
            this.buildTriggerListItem(newTrigger);
            this.buildEditorPanel();
          }
        }, "onChange")
      });
      elements.push(typeField);
      elements.push(...this.buildTriggerTypeFields(trigger));
      elements.push(buildCollapsibleSection({
        id: selector3.constraintsSection(trigger.id),
        headerKey: "behaviors.section.constraints",
        content: this.buildTriggerContraintsOptions(trigger)
      }));
      return elements;
    }
    buildReactionEditor(reaction) {
      const elements = [];
      const nameField = createInputField({
        id: `${reaction.id}-name`,
        labelKey: "behaviors.field.name",
        value: reaction.name,
        onChange: /* @__PURE__ */ __name((val) => {
          reaction.name = val;
          this.buildReactionListItem(reaction);
        }, "onChange")
      });
      elements.push(nameField);
      const typeOptions = reactionTypes;
      const typeField = createDropdownField({
        id: `${reaction.id}-type`,
        labelKey: "behaviors.field.type",
        value: reaction.type,
        options: typeOptions,
        onChange: /* @__PURE__ */ __name((val) => {
          const newReaction = this.changeReactionType(reaction, val);
          if (newReaction) {
            this.settings.reactions[newReaction.id] = newReaction;
            this.selectedReactionId = newReaction.id;
            this.buildReactionListItem(newReaction);
            this.buildEditorPanel();
          }
        }, "onChange")
      });
      elements.push(typeField);
      if (reaction.type === "speech" || reaction.type === "emote" || reaction.type === "action") {
        const renderContent = /* @__PURE__ */ __name(() => this.buildContentArrayField(
          `${reaction.id}-content`,
          "behaviors.field.content",
          reaction.content,
          (val) => {
            reaction.content = val;
            renderContent();
          }
        ), "renderContent");
        const contentSection = renderContent();
        elements.push(contentSection);
      } else if (reaction.type === "activity") {
        const renderActivityNames = /* @__PURE__ */ __name(() => buildContentListSection({
          id: `${reaction.id}-activity-names`,
          labelKey: "behaviors.field.activity_names",
          onAdd: /* @__PURE__ */ __name(async () => {
            const result = await activitySelectorModal({ selectedActivities: [reaction.activityName], limit: 1 });
            if (!result) return;
            let updated = false;
            const selectedActivity = result[0];
            if (reaction.activityName !== selectedActivity) {
              reaction.activityName = selectedActivity;
              updated = true;
            }
            if (updated) {
              renderActivityNames();
            }
          }, "onAdd"),
          addLabel: "behaviors.button.select_activity",
          content: this.buildChipList(
            `${reaction.id}-activity-names`,
            reaction.activityName ? [{ id: reaction.activityName, name: ActivityDictionaryText(`Activity${reaction.activityName}`) }] : [],
            function() {
              reaction.activityName = "";
              this.remove();
            }
          )
        }), "renderActivityNames");
        const activityNamesSection = renderActivityNames();
        elements.push(activityNamesSection);
        const rerenderGroupNames = /* @__PURE__ */ __name(() => buildContentListSection({
          id: `${reaction.id}-group-names`,
          labelKey: "behaviors.field.group_names",
          onAdd: /* @__PURE__ */ __name(async () => {
            const result = await bodyPartSelectorModal({ selectedParts: [reaction.groupName], limit: 1 });
            if (!result) return;
            const selectedPart = result[0];
            let updated = false;
            if (reaction.groupName !== selectedPart) {
              reaction.groupName = selectedPart;
              updated = true;
            }
            if (updated) {
              rerenderGroupNames();
            }
          }, "onAdd"),
          addLabel: "behaviors.button.select_body_part",
          content: this.buildChipList(
            `${reaction.id}-group-names`,
            reaction.groupName ? [{ id: reaction.groupName, name: TextGetInScope("Screens/Character/Preference/Text_Preference.csv", `ArousalZone${reaction.groupName}`) }] : [],
            function() {
              reaction.groupName = "";
              this.remove();
            }
          )
        }), "rerenderGroupNames");
        const groupNamesSection = rerenderGroupNames();
        elements.push(groupNamesSection);
      } else if (reaction.type === "animation") {
        const renderAnimation = /* @__PURE__ */ __name(() => buildContentListSection({
          id: `${reaction.id}-animation`,
          labelKey: "behaviors.field.animation",
          onAdd: /* @__PURE__ */ __name(async () => {
            const animations = AnimatronikkaModule.instance?.settings.animations ?? {};
            const selected = reaction.animationId ? [reaction.animationId] : [];
            const result = await animationSelectorModal({ selectedIds: selected, limit: 1, animations });
            if (!result || result.length === 0) return;
            const [animationId] = result;
            if (reaction.animationId !== animationId) {
              reaction.animationId = animationId;
              renderAnimation();
            }
          }, "onAdd"),
          addLabel: "behaviors.button.select_animation",
          content: this.buildChipList(
            `${reaction.id}-animation`,
            reaction.animationId ? [{
              id: reaction.animationId,
              name: AnimatronikkaModule.instance?.settings.animations?.[reaction.animationId]?.name ?? reaction.animationId
            }] : [],
            function() {
              reaction.animationId = "";
              this.remove();
            }
          )
        }), "renderAnimation");
        elements.push(renderAnimation());
        const interruptField = u.createCheckbox({
          id: `${reaction.id}-animation-interrupt`,
          label: g("behaviors.field.animation_interrupt"),
          setElementValue: /* @__PURE__ */ __name(() => reaction.interrupt ?? false, "setElementValue"),
          setSettingValue: /* @__PURE__ */ __name((val) => reaction.interrupt = val, "setSettingValue"),
          htmlOptions: {
            container: {
              classList: ["rsp-behaviors-field"]
            }
          }
        });
        elements.push(interruptField);
        const priorityField = createNumberInputField({
          id: `${reaction.id}-animation-priority`,
          labelKey: "behaviors.field.animation_priority",
          value: reaction.priority?.toString() ?? "",
          onChange: /* @__PURE__ */ __name((val) => {
            reaction.priority = val ? parseFloat(val) : void 0;
          }, "onChange"),
          step: "1",
          min: "0",
          max: "100"
        });
        elements.push(priorityField);
      }
      return elements;
    }
    buildTriggerTypeFields(trigger) {
      const elements = [];
      switch (trigger.type) {
        case "speech": {
          const speechTypeField = createDropdownField({
            id: `${trigger.id}-speech-type`,
            labelKey: "behaviors.field.speech_type",
            value: trigger.speechType,
            options: speechTypes,
            onChange: /* @__PURE__ */ __name((val) => trigger.speechType = val, "onChange")
          });
          elements.push(speechTypeField);
          const renderContent = /* @__PURE__ */ __name(() => this.buildMatchContentField(
            `${trigger.id}-content`,
            "behaviors.field.content",
            () => {
              textReactionSelectorModal({ prompt: g("behaviors.prompt.add_content") }).then((response) => {
                if (response === null) return;
                trigger.content.push({ value: response, matchMode: "contains" });
                renderContent();
              });
            },
            trigger.content,
            (entries) => {
              trigger.content = entries;
              renderContent();
            },
            true
          ), "renderContent");
          const contentSection = renderContent();
          elements.push(contentSection);
          break;
        }
        case "emote":
        case "action": {
          const renderContent = /* @__PURE__ */ __name(() => this.buildMatchContentField(
            `${trigger.id}-content`,
            "behaviors.field.content",
            () => {
              textReactionSelectorModal({ prompt: g("behaviors.prompt.add_content") }).then((response) => {
                if (response === null) return;
                trigger.content.push({ value: response, matchMode: "contains" });
                renderContent();
              });
            },
            trigger.content,
            (entries) => {
              trigger.content = entries;
              renderContent();
            },
            true
          ), "renderContent");
          const contentSection = renderContent();
          elements.push(contentSection);
          break;
        }
        case "activity": {
          const renderActivityNames = /* @__PURE__ */ __name(() => buildContentListSection({
            id: `${trigger.id}-activity-names`,
            labelKey: "behaviors.field.activity_names",
            onAdd: /* @__PURE__ */ __name(async () => {
              const result = await activitySelectorModal({ selectedActivities: trigger.activityName });
              if (!result) return;
              trigger.activityName = result;
              renderActivityNames();
            }, "onAdd"),
            addLabel: "behaviors.button.select_activities",
            content: this.buildChipList(
              `${trigger.id}-activity-names`,
              trigger.activityName.map((activity) => ({ id: activity, name: ActivityDictionaryText(`Activity${activity}`) })),
              function(item) {
                trigger.activityName.splice(trigger.activityName.indexOf(item.id), 1);
                this.remove();
              }
            )
          }), "renderActivityNames");
          const activityNamesSection = renderActivityNames();
          elements.push(activityNamesSection);
          const rerenderGroupNames = /* @__PURE__ */ __name(() => buildContentListSection({
            id: `${trigger.id}-group-names`,
            labelKey: "behaviors.field.group_names",
            onAdd: /* @__PURE__ */ __name(async () => {
              const result = await bodyPartSelectorModal({ selectedParts: trigger.groupName });
              if (!result) return;
              trigger.groupName = result;
              rerenderGroupNames();
            }, "onAdd"),
            addLabel: "behaviors.button.select_body_parts",
            content: this.buildChipList(
              `${trigger.id}-group-names`,
              trigger.groupName.map((name) => ({ id: name, name: TextGetInScope("Screens/Character/Preference/Text_Preference.csv", `ArousalZone${name}`) })),
              function(item) {
                trigger.groupName.splice(trigger.groupName.indexOf(item.id), 1);
                this.remove();
              }
            )
          }), "rerenderGroupNames");
          const groupNamesSection = rerenderGroupNames();
          elements.push(groupNamesSection);
          break;
        }
        case "orgasm": {
          const orgasmTypeField = createDropdownField({
            id: `${trigger.id}-orgasm-type`,
            labelKey: "behaviors.field.orgasm_type",
            value: trigger.orgasmType,
            options: orgasmTypes,
            onChange: /* @__PURE__ */ __name((val) => trigger.orgasmType = val, "onChange")
          });
          elements.push(orgasmTypeField);
          break;
        }
        case "arousal": {
          const limitField = createNumberInputField({
            id: `${trigger.id}-arousal-limit`,
            labelKey: "behaviors.field.arousal_limit",
            value: trigger.limit.toString(),
            onChange: /* @__PURE__ */ __name((val) => {
              const parsed = parseFloat(val);
              trigger.limit = CommonIsNonNegativeInteger(parsed) ? parsed : 0;
            }, "onChange"),
            min: "0",
            max: "100"
          });
          elements.push(limitField);
          break;
        }
        case "roomPresence": {
          const roomPresenceField = createDropdownField({
            id: `${trigger.id}-room-presence-event`,
            labelKey: "behaviors.field.room_presence_event",
            value: trigger.event,
            options: roomPresenceEvents,
            onChange: /* @__PURE__ */ __name((val) => trigger.event = val, "onChange")
          });
          elements.push(roomPresenceField);
          break;
        }
        case "button": {
          elements.push(u.createLabel({
            id: null,
            label: g("behaviors.text.button_trigger_hint"),
            htmlOptions: {
              classList: ["rsp-behaviors-field-hint"]
            }
          }));
          break;
        }
      }
      return elements;
    }
    buildTriggerContraintsOptions(trigger) {
      const elements = [];
      const onChange = /* @__PURE__ */ __name(() => {
        buildCollapsibleSection({
          id: selector3.constraintsSection(trigger.id),
          headerKey: "behaviors.section.constraints",
          content: /* @__PURE__ */ __name(() => this.buildTriggerContraintsOptions(trigger), "content"),
          expanded: true
        });
      }, "onChange");
      const hasConstraints = triggerHasAnyConstraints(trigger);
      if (!hasConstraints) {
        const addConstraintButton2 = u.createButton({
          id: `rsp-add-constraint-${trigger.id}`,
          onClick: /* @__PURE__ */ __name(() => {
            this.showEntitySelector(trigger);
          }, "onClick"),
          options: {
            image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
            label: g("behaviors.button.add_constraint")
          },
          htmlOptions: {
            button: {
              classList: ["rsp-content-add"]
            }
          }
        });
        const addConstraintLabel = u.createLabel({
          id: `rsp-label-constraints-${CommonGenerateUniqueID()}`,
          label: g("behaviors.text.no_constraints")
        });
        const container = ElementCreate({
          tag: "div",
          classList: ["rsp-no-constraints-container"],
          children: [addConstraintLabel, addConstraintButton2]
        });
        elements.push(container);
        return elements;
      }
      const constraintModeField = createDropdownField({
        id: `${trigger.id}-constraint-mode`,
        labelKey: "behaviors.field.constraint_mode",
        value: trigger.constraintMode || "all",
        options: constraintModes,
        onChange: /* @__PURE__ */ __name((val) => trigger.constraintMode = val, "onChange"),
        replace: false
      });
      elements.push(constraintModeField);
      trigger.constraints ??= {};
      if (triggerHasConstraint(trigger, "source")) {
        elements.push(this.buildEntityConstraintSection(trigger, "source", onChange));
      }
      if (triggerHasConstraint(trigger, "target")) {
        elements.push(this.buildEntityConstraintSection(trigger, "target", onChange));
      }
      if (triggerHasConstraint(trigger, "player")) {
        elements.push(this.buildEntityConstraintSection(trigger, "player", onChange));
      }
      if (triggerHasConstraint(trigger, "room")) {
        elements.push(this.buildEntityConstraintSection(trigger, "room", onChange));
      }
      const addConstraintButton = u.createButton({
        id: `rsp-add-constraint-${trigger.id}`,
        onClick: /* @__PURE__ */ __name(() => {
          this.showEntitySelector(trigger);
        }, "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
          label: g("behaviors.button.add_constraint")
        },
        htmlOptions: {
          button: {
            classList: ["rsp-content-add"]
          }
        }
      });
      elements.push(addConstraintButton);
      return elements;
    }
    async showEntitySelector(trigger) {
      const entities = [
        { value: "source", label: g("behaviors.entity.source") },
        { value: "target", label: g("behaviors.entity.target") },
        { value: "player", label: g("behaviors.entity.player") },
        { value: "room", label: g("behaviors.entity.room") }
      ];
      const available = entities.filter((entity) => isConstraintCompatible(trigger, entity.value));
      if (available.length === 0) return;
      const selected = await itemSelectorModal({ buttons: available.map((e) => ({ label: e.label, value: e.value })) });
      if (selected === null || selected.length === 0) return;
      for (const entity of selected) {
        await this.showConstraintTypeSelector(trigger, entity);
      }
    }
    buildEntityConstraintSection(trigger, entity, onChange) {
      const entityConstraints = trigger.constraints?.[entity];
      if (!entityConstraints || !isConstraintCompatible(trigger, entity)) {
        return ElementCreate({ tag: "div" });
      }
      const entityLabels = {
        source: g("behaviors.entity.source"),
        target: g("behaviors.entity.target"),
        player: g("behaviors.entity.player"),
        room: g("behaviors.entity.room")
      };
      const constraintElements = [];
      if ("memberNumber" in entityConstraints && entityConstraints.memberNumber && isConstraintCompatible(trigger, entity, "memberNumber")) {
        const renderMemberNumber = /* @__PURE__ */ __name((replace) => this.buildIncludeExcludeField(
          `${trigger.id}-${entity}-memberNumber`,
          "behaviors.field.constraint_member_number",
          () => {
            const rule = entityConstraints.memberNumber;
            const entries = rule?.entries || [];
            memberNumberSelectorModal({ selectedMembers: entries.map((entry) => parseInt(entry.value)) }).then((response) => {
              if (response === null) return;
              const newEntries = entries.filter((entry) => response.includes(parseInt(entry.value)));
              response.forEach((memberNumber) => {
                if (newEntries.some((entry) => entry.value === memberNumber.toString())) return;
                newEntries.push({ value: memberNumber.toString(), mode: "include" });
              });
              trigger.constraints ??= {};
              trigger.constraints[entity].memberNumber = { entries: newEntries };
              renderMemberNumber(true);
              this.buildTriggerListItem(trigger);
            });
          },
          entityConstraints.memberNumber,
          (val) => {
            trigger.constraints ??= {};
            trigger.constraints[entity].memberNumber = val;
            renderMemberNumber(true);
            this.buildTriggerListItem(trigger);
          },
          () => {
            if (trigger.constraints && trigger.constraints[entity]) {
              delete trigger.constraints[entity].memberNumber;
              if (Object.keys(trigger.constraints[entity]).length === 0) {
                delete trigger.constraints[entity];
                if (Object.keys(trigger.constraints).length === 0) {
                  trigger.constraints = void 0;
                }
              }
            }
            onChange();
            this.buildTriggerListItem(trigger);
          },
          replace
        ), "renderMemberNumber");
        constraintElements.push(renderMemberNumber(false));
      }
      const booleanConstraints = ["restrained", "gagged", "blinded", "deafened"];
      for (const constraintKey of booleanConstraints) {
        if (!isConstraintCompatible(trigger, entity, constraintKey)) continue;
        if (constraintKey in entityConstraints && entityConstraints[constraintKey] !== void 0) {
          const value = entityConstraints[constraintKey];
          const field = createDropdownField({
            id: `${trigger.id}-${entity}-${constraintKey}`,
            labelKey: `behaviors.field.constraint_${constraintKey}`,
            value: value.toString(),
            options: ["true", "false"],
            onChange: /* @__PURE__ */ __name((val) => {
              trigger.constraints ??= {};
              trigger.constraints[entity][constraintKey] = val === "true";
              this.buildTriggerListItem(trigger);
            }, "onChange")
          });
          const removeButton = u.createButton({
            id: `rsp-remove-constraint-${trigger.id}-${entity}-${constraintKey}`,
            onClick: /* @__PURE__ */ __name(() => {
              if (trigger.constraints && trigger.constraints[entity]) {
                delete trigger.constraints[entity][constraintKey];
                if (Object.keys(trigger.constraints[entity]).length === 0) {
                  delete trigger.constraints[entity];
                  if (Object.keys(trigger.constraints).length === 0) {
                    trigger.constraints = void 0;
                  }
                }
              }
              onChange();
              this.buildTriggerListItem(trigger);
            }, "onClick"),
            options: {
              image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`,
              tooltip: g("behaviors.button.remove_constraint"),
              tooltipPosition: "left"
            },
            htmlOptions: {
              button: {
                classList: ["rsp-constraint-remove"]
              }
            }
          });
          field.appendChild(removeButton);
          constraintElements.push(field);
        }
      }
      const numericConstraints = ["arousalMin", "arousalMax"];
      for (const constraintKey of numericConstraints) {
        if (!isConstraintCompatible(trigger, entity, constraintKey)) continue;
        if (constraintKey in entityConstraints && entityConstraints[constraintKey] !== void 0) {
          const value = entityConstraints[constraintKey];
          const field = createNumberInputField({
            id: `${trigger.id}-${entity}-${constraintKey}`,
            labelKey: `behaviors.field.constraint_${constraintKey}`,
            value: value?.toString() ?? "",
            onChange: /* @__PURE__ */ __name((val) => {
              trigger.constraints ??= {};
              trigger.constraints[entity][constraintKey] = val ? parseFloat(val) : void 0;
              this.buildTriggerListItem(trigger);
            }, "onChange"),
            min: "0",
            max: "100"
          });
          const removeButton = u.createButton({
            id: `rsp-remove-constraint-${trigger.id}-${entity}-${constraintKey}`,
            onClick: /* @__PURE__ */ __name(() => {
              if (trigger.constraints && trigger.constraints[entity]) {
                delete trigger.constraints[entity][constraintKey];
                if (Object.keys(trigger.constraints[entity]).length === 0) {
                  delete trigger.constraints[entity];
                  if (Object.keys(trigger.constraints).length === 0) {
                    trigger.constraints = void 0;
                  }
                }
              }
              onChange();
              this.buildTriggerListItem(trigger);
            }, "onClick"),
            options: {
              image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`,
              tooltip: g("behaviors.button.remove_constraint"),
              tooltipPosition: "left"
            },
            htmlOptions: {
              button: {
                classList: ["rsp-constraint-remove"]
              }
            }
          });
          field.appendChild(removeButton);
          constraintElements.push(field);
        }
      }
      if (entity === "room") {
        if ("inRoomWithMembers" in entityConstraints && entityConstraints.inRoomWithMembers && isConstraintCompatible(trigger, entity, "inRoomWithMembers")) {
          const renderInRoomWithMembers = /* @__PURE__ */ __name((replace) => this.buildIncludeExcludeField(
            `${trigger.id}-room-inRoomWithMembers`,
            "behaviors.field.constraint_in_room_with_members",
            () => {
              const rule = entityConstraints.inRoomWithMembers;
              const entries = rule?.entries || [];
              memberNumberSelectorModal({ selectedMembers: entries.map((entry) => parseInt(entry.value)) }).then((response) => {
                if (response === null) return;
                const newEntries = entries.filter((entry) => response.includes(parseInt(entry.value)));
                response.forEach((memberNumber) => {
                  if (newEntries.some((entry) => entry.value === memberNumber.toString())) return;
                  newEntries.push({ value: memberNumber.toString(), mode: "include" });
                });
                trigger.constraints ??= {};
                trigger.constraints.room.inRoomWithMembers = { entries: newEntries };
                renderInRoomWithMembers(true);
                this.buildTriggerListItem(trigger);
              });
            },
            entityConstraints.inRoomWithMembers,
            (val) => {
              trigger.constraints ??= {};
              trigger.constraints.room.inRoomWithMembers = val;
              renderInRoomWithMembers(true);
              this.buildTriggerListItem(trigger);
            },
            () => {
              if (trigger.constraints && trigger.constraints.room) {
                delete trigger.constraints.room.inRoomWithMembers;
                if (Object.keys(trigger.constraints.room).length === 0) {
                  delete trigger.constraints.room;
                  if (Object.keys(trigger.constraints).length === 0) {
                    trigger.constraints = void 0;
                  }
                }
              }
              onChange();
              this.buildTriggerListItem(trigger);
            },
            replace
          ), "renderInRoomWithMembers");
          constraintElements.push(renderInRoomWithMembers(false));
        }
        if ("inRoomNamed" in entityConstraints && entityConstraints.inRoomNamed && isConstraintCompatible(trigger, entity, "inRoomNamed")) {
          const renderInRoomNamed = /* @__PURE__ */ __name((replace) => this.buildIncludeExcludeField(
            `${trigger.id}-room-inRoomNamed`,
            "behaviors.field.constraint_in_room_named",
            () => {
              const rule = entityConstraints.inRoomNamed;
              const entries = rule?.entries || [];
              W.prompt(g("behaviors.prompt.add_content"), { modalClassList: ["rsp-modal"] }).then((response) => {
                if (response === null) return;
                entries.push({ value: response, mode: "include" });
                trigger.constraints ??= {};
                trigger.constraints.room.inRoomNamed = { entries };
                renderInRoomNamed(true);
                this.buildTriggerListItem(trigger);
              });
            },
            entityConstraints.inRoomNamed,
            (val) => {
              trigger.constraints ??= {};
              trigger.constraints.room.inRoomNamed = val;
              renderInRoomNamed(true);
              this.buildTriggerListItem(trigger);
            },
            () => {
              if (trigger.constraints && trigger.constraints.room) {
                delete trigger.constraints.room.inRoomNamed;
                if (Object.keys(trigger.constraints.room).length === 0) {
                  delete trigger.constraints.room;
                  if (Object.keys(trigger.constraints).length === 0) {
                    trigger.constraints = void 0;
                  }
                }
              }
              onChange();
              this.buildTriggerListItem(trigger);
            },
            replace
          ), "renderInRoomNamed");
          constraintElements.push(renderInRoomNamed(false));
        }
      }
      const addConstraintButton = u.createButton({
        id: `rsp-add-constraint-${trigger.id}-${entity}`,
        onClick: /* @__PURE__ */ __name(() => {
          this.showConstraintTypeSelector(trigger, entity);
        }, "onClick"),
        options: {
          image: `${"https://protokink.github.io/Responsive/dev/public"}/images/plus.svg`,
          label: g("behaviors.button.add_constraint")
        },
        htmlOptions: {
          button: {
            classList: ["rsp-content-add"]
          }
        }
      });
      return buildCollapsibleSection({
        id: `${trigger.id}-entity-${entity}`,
        headerKey: entityLabels[entity],
        content: /* @__PURE__ */ __name(() => [...constraintElements, addConstraintButton], "content"),
        expanded: true
      });
    }
    async showConstraintTypeSelector(trigger, entity) {
      trigger.constraints ??= {};
      const entityConstraints = trigger.constraints[entity] ?? {};
      const availableConstraints = [];
      if (entity === "source" || entity === "target") {
        if (!("memberNumber" in entityConstraints && entityConstraints.memberNumber)) {
          availableConstraints.push({ key: "memberNumber", label: g("behaviors.field.constraint_member_number") });
        }
      }
      if (entity === "source" || entity === "target" || entity === "player") {
        if (!("restrained" in entityConstraints && entityConstraints.restrained !== void 0)) {
          availableConstraints.push({ key: "restrained", label: g("behaviors.field.constraint_restrained") });
        }
        if (!("gagged" in entityConstraints && entityConstraints.gagged !== void 0)) {
          availableConstraints.push({ key: "gagged", label: g("behaviors.field.constraint_gagged") });
        }
        if (!("blinded" in entityConstraints && entityConstraints.blinded !== void 0)) {
          availableConstraints.push({ key: "blinded", label: g("behaviors.field.constraint_blinded") });
        }
        if (!("deafened" in entityConstraints && entityConstraints.deafened !== void 0)) {
          availableConstraints.push({ key: "deafened", label: g("behaviors.field.constraint_deafened") });
        }
        if (!("arousalMin" in entityConstraints && entityConstraints.arousalMin !== void 0)) {
          availableConstraints.push({ key: "arousalMin", label: g("behaviors.field.constraint_arousalMin") });
        }
        if (!("arousalMax" in entityConstraints && entityConstraints.arousalMax !== void 0)) {
          availableConstraints.push({ key: "arousalMax", label: g("behaviors.field.constraint_arousalMax") });
        }
      }
      if (entity === "room") {
        if (!("inRoomWithMembers" in entityConstraints && entityConstraints.inRoomWithMembers)) {
          availableConstraints.push({ key: "inRoomWithMembers", label: g("behaviors.field.constraint_in_room_with_members") });
        }
        if (!("inRoomNamed" in entityConstraints && entityConstraints.inRoomNamed)) {
          availableConstraints.push({ key: "inRoomNamed", label: g("behaviors.field.constraint_in_room_named") });
        }
      }
      const compatibleConstraints = availableConstraints.filter((constraint) => isConstraintCompatible(trigger, entity, constraint.key));
      if (compatibleConstraints.length === 0) {
        return;
      }
      const selected = await itemSelectorModal({ buttons: compatibleConstraints.map((c) => ({ label: c.label, value: c.key })) });
      if (selected === null || selected.length === 0) return;
      if (!trigger.constraints) {
        trigger.constraints = {};
      }
      trigger.constraints[entity] ??= {};
      selected.forEach((constraintKey) => {
        const entityConstraints2 = trigger.constraints[entity];
        switch (constraintKey) {
          case "memberNumber":
            entityConstraints2.memberNumber = { entries: [] };
            break;
          case "inRoomWithMembers":
          case "inRoomNamed":
            entityConstraints2[constraintKey] = { entries: [] };
            break;
          case "arousalMin":
          case "arousalMax":
            entityConstraints2[constraintKey] = 0;
            break;
          case "restrained":
          case "gagged":
          case "blinded":
          case "deafened":
            entityConstraints2[constraintKey] = false;
            break;
          default:
            return assertNever(constraintKey);
        }
      });
      buildCollapsibleSection({
        id: selector3.constraintsSection(trigger.id),
        headerKey: "behaviors.section.constraints",
        content: /* @__PURE__ */ __name(() => this.buildTriggerContraintsOptions(trigger), "content"),
        expanded: true
      });
      this.buildTriggerListItem(trigger);
    }
    buildTriggersSection(behavior) {
      const sectionId = `${behavior.id}-triggers`;
      const thisElement = ElementWrap(selector3.contentListSection(sectionId));
      if (thisElement) thisElement.replaceChildren();
      const content = this.buildChipList(
        thisElement ? CommonGenerateUniqueID() : sectionId,
        behavior.triggers.map((id) => this.settings.triggers[id]).filter(Boolean).reverse(),
        async (trigger) => {
          const index = behavior.triggers.indexOf(trigger.id);
          if (index > -1) {
            behavior.triggers.splice(index, 1);
            this.buildTriggersSection(behavior);
            this.buildBehaviorListItem(behavior);
          }
        }
      );
      const section = buildContentListSection({
        id: thisElement ? CommonGenerateUniqueID() : sectionId,
        labelKey: "behaviors.section.triggers",
        onAdd: /* @__PURE__ */ __name(async () => {
          await this.showTriggerSelector(behavior);
          this.buildTriggersSection(behavior);
          this.buildBehaviorListItem(behavior);
        }, "onAdd"),
        addLabel: "behaviors.button.add_trigger",
        content
      });
      if (thisElement) {
        thisElement.replaceWith(section);
        section.id = selector3.contentListSection(sectionId);
      }
      return section;
    }
    buildReactionsSection(behavior) {
      const sectionId = `${behavior.id}-reactions`;
      const thisElement = ElementWrap(selector3.contentListSection(sectionId));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const content = this.buildChipList(
        thisElement ? CommonGenerateUniqueID() : sectionId,
        behavior.reactions.map((id) => this.settings.reactions[id]).filter(Boolean).reverse(),
        async (reaction) => {
          const index = behavior.reactions.indexOf(reaction.id);
          if (index > -1) {
            behavior.reactions.splice(index, 1);
            this.buildReactionsSection(behavior);
            this.buildBehaviorListItem(behavior);
          }
        }
      );
      const section = buildContentListSection({
        id: thisElement ? CommonGenerateUniqueID() : sectionId,
        labelKey: "behaviors.section.reactions",
        onAdd: /* @__PURE__ */ __name(async () => {
          await this.showReactionSelector(behavior);
          this.buildReactionsSection(behavior);
          this.buildBehaviorListItem(behavior);
        }, "onAdd"),
        addLabel: "behaviors.button.add_reaction",
        content
      });
      if (thisElement) {
        thisElement.replaceWith(section);
        section.id = selector3.contentListSection(sectionId);
      }
      return section;
    }
    // #endregion !SECTION Editor Panel Building
    // #region SECTION Field Builders
    buildChipList(id, items, onRemove) {
      const chipListId = selector3.chipList(id);
      const thisElement = ElementWrap(chipListId);
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const container = ElementCreate({
        tag: "div",
        classList: ["rsp-behaviors-chips"],
        attributes: {
          id: chipListId
        },
        children: items.slice().reverse().map((item) => {
          const chipClassList = item.type ? [selector3.chip, `type-${item.type}`] : [selector3.chip];
          const chip = ElementCreate({
            tag: "div",
            classList: chipClassList,
            children: [
              {
                tag: "span",
                children: [item.name]
              },
              u.createButton({
                id: `rsp-chip-remove-${item.id}`,
                onClick: /* @__PURE__ */ __name(function() {
                  onRemove.call(chip, item);
                }, "onClick"),
                options: {
                  image: `${"https://protokink.github.io/Responsive/dev/public"}/images/cross.svg`,
                  noStyling: true
                },
                htmlOptions: {
                  button: {
                    classList: [selector3.chipRemove]
                  }
                }
              })
            ]
          });
          return chip;
        })
      });
      if (thisElement) {
        thisElement.replaceWith(container);
      }
      return container;
    }
    buildContentArrayField(id, labelKey, values, onChange) {
      const content = this.buildContentList(values, onChange);
      const onAdd = /* @__PURE__ */ __name(() => {
        textReactionSelectorModal({ prompt: g("behaviors.prompt.add_content") }).then((response) => {
          if (response === null) return;
          values.push(response);
          onChange(values);
        });
      }, "onAdd");
      const thisElement = ElementWrap(selector3.contentListSection(id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const section = buildContentListSection({ id, labelKey, onAdd, addLabel: "behaviors.button.add_content", content });
      if (thisElement) {
        thisElement.replaceWith(section);
      }
      return section;
    }
    buildContentList(values, onChange) {
      const tooltip = this.deleteMode ? g("behaviors.text.delete_mode") : g("behaviors.text.edit_mode");
      const container = ElementCreate({
        tag: "div",
        classList: [selector3.contentList, "scroll-box"],
        children: [
          ...values.slice().reverse().map((value, index) => {
            const originalIndex = values.length - 1 - index;
            return u.createButton({
              id: `rsp-content-${index}-${CommonGenerateUniqueID()}`,
              options: {
                label: value === "" ? g("behaviors.text.empty_content") : value,
                tooltip,
                tooltipPosition: "top"
              },
              htmlOptions: {
                button: {
                  classList: ["rsp-content-item"],
                  dataAttributes: {
                    deletable: "true",
                    deleteMode: this.deleteMode,
                    emptyContent: (value === "").toString()
                  }
                },
                label: {
                  classList: ["truncated-text"]
                }
              },
              onClick: /* @__PURE__ */ __name(async function() {
                if (_GuiBehaviors.instance.deleteMode) {
                  const confirmed = await _GuiBehaviors.instance.confirmationModal(g("behaviors.prompt.delete_content"));
                  if (!confirmed) return;
                  values.splice(originalIndex, 1);
                  onChange(values);
                  const label = this.querySelector(".button-label");
                  if (label?.textContent) {
                    label.textContent = value === "" ? g("behaviors.text.empty_content") : value;
                  }
                } else {
                  textReactionSelectorModal({ initialValue: value, prompt: g("behaviors.prompt.edit_text_reaction") }).then((newValue) => {
                    if (newValue === value) return;
                    else if (newValue === null) return;
                    else {
                      values[originalIndex] = newValue;
                      onChange(values);
                      const label = this.querySelector(".button-label");
                      if (label?.textContent) {
                        label.textContent = newValue === "" ? g("behaviors.text.empty_content") : newValue;
                      }
                    }
                  });
                }
              }, "onClick")
            });
          })
        ]
      });
      return container;
    }
    buildIncludeExcludeField(id, labelKey, onAdd, rule, onChange, onRemove, replace) {
      const entries = rule?.entries || [];
      const list = this.buildIncludeExcludeEntryList(
        id,
        entries,
        (updatedEntries) => {
          if (!rule) {
            rule = { entries: updatedEntries };
          } else {
            rule.entries = updatedEntries;
          }
          onChange(rule);
        }
      );
      const thisElement = ElementWrap(selector3.contentListSection(id));
      if (thisElement && replace) {
        thisElement.replaceChildren();
      }
      const section = buildContentListSection({ id, labelKey, onAdd, addLabel: "behaviors.button.add_content", content: list });
      if (onRemove) {
        const header = section.querySelector(".rsp-content-list-header");
        if (header) {
          const removeButton = u.createButton({
            id: `rsp-remove-constraint-${id}`,
            onClick: onRemove,
            options: {
              image: `${"https://protokink.github.io/Responsive/dev/public"}/images/trash_bin.svg`,
              tooltip: g("behaviors.button.remove_constraint"),
              tooltipPosition: "top"
            },
            htmlOptions: {
              button: {
                classList: ["rsp-constraint-remove"]
              }
            }
          });
          header.appendChild(removeButton);
        }
      }
      if (thisElement && replace) {
        thisElement.replaceWith(section);
      }
      return section;
    }
    buildMatchContentEntryList(id, entries, onChange) {
      const tooltip = this.deleteMode ? g("behaviors.text.delete_mode") : g("behaviors.text.edit_mode");
      const thisElement = ElementWrap(selector3.includeExcludeEntryList(id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const container = ElementCreate({
        tag: "div",
        attributes: {
          id: selector3.includeExcludeEntryList(id)
        },
        classList: [selector3.contentList, "scroll-box"],
        children: [
          ...entries.slice().reverse().map((entry, index) => {
            const originalIndex = entries.length - 1 - index;
            const matchModeField = createDropdownField({
              id: `${id}-entry-${originalIndex}-match-mode`,
              labelKey: "",
              value: entry.matchMode ?? "contains",
              options: matchModes,
              onChange: /* @__PURE__ */ __name((val) => {
                entries[originalIndex].matchMode = val;
                onChange(entries);
              }, "onChange")
            });
            const entryContainer = ElementCreate({
              tag: "div",
              classList: ["rsp-include-exclude-entry"],
              children: [
                matchModeField,
                u.createButton({
                  id: null,
                  options: {
                    label: entry.value === "" ? g("behaviors.text.empty_content") : entry.value,
                    tooltip,
                    tooltipPosition: "top"
                  },
                  htmlOptions: {
                    button: {
                      classList: ["rsp-content-item"],
                      dataAttributes: {
                        deletable: "true",
                        deleteMode: this.deleteMode,
                        emptyContent: (entry.value === "").toString()
                      }
                    },
                    label: {
                      classList: ["truncated-text"]
                    }
                  },
                  onClick: /* @__PURE__ */ __name(async () => {
                    if (this.deleteMode) {
                      const confirmed = await this.confirmationModal(g("behaviors.prompt.delete_content"));
                      if (!confirmed) return;
                      entries.splice(originalIndex, 1);
                      onChange(entries);
                    } else {
                      W.prompt(g("behaviors.prompt.edit_content"), { defaultValue: entry.value, modalClassList: ["rsp-modal"] }).then((newValue) => {
                        if (newValue === entry.value) return;
                        else if (newValue === null) return;
                        else {
                          entries[originalIndex].value = newValue;
                          onChange(entries);
                        }
                      });
                    }
                  }, "onClick")
                })
              ]
            });
            return entryContainer;
          })
        ]
      });
      if (thisElement) {
        thisElement.replaceWith(container);
      }
      return container;
    }
    buildMatchContentField(id, labelKey, onAdd, entries, onChange, replace) {
      const list = this.buildMatchContentEntryList(
        id,
        entries,
        onChange
      );
      const thisElement = ElementWrap(selector3.contentListSection(id));
      if (thisElement && replace) {
        thisElement.replaceChildren();
      }
      const section = buildContentListSection({ id, labelKey, onAdd, addLabel: "behaviors.button.add_content", content: list });
      if (thisElement && replace) {
        thisElement.replaceWith(section);
      }
      return section;
    }
    buildIncludeExcludeEntryList(id, entries, onChange) {
      const tooltip = this.deleteMode ? g("behaviors.text.delete_mode") : g("behaviors.text.edit_mode");
      const thisElement = ElementWrap(selector3.includeExcludeEntryList(id));
      if (thisElement) {
        thisElement.replaceChildren();
      }
      const container = ElementCreate({
        tag: "div",
        attributes: {
          id: selector3.includeExcludeEntryList(id)
        },
        classList: [selector3.contentList, "scroll-box"],
        children: [
          ...entries.slice().reverse().map((entry, index) => {
            const originalIndex = entries.length - 1 - index;
            const modeField = createDropdownField({
              id: `${id}-entry-${originalIndex}-mode`,
              labelKey: "",
              value: entry.mode,
              options: includeExcludeModes,
              onChange: /* @__PURE__ */ __name((val) => {
                entries[originalIndex].mode = val;
                onChange(entries);
              }, "onChange")
            });
            const entryContainer = ElementCreate({
              tag: "div",
              classList: ["rsp-include-exclude-entry"],
              children: [
                modeField,
                u.createButton({
                  id: null,
                  options: {
                    label: entry.value === "" ? g("behaviors.text.empty_content") : entry.value,
                    tooltip,
                    tooltipPosition: "top"
                  },
                  htmlOptions: {
                    button: {
                      classList: ["rsp-content-item"],
                      dataAttributes: {
                        deletable: "true",
                        deleteMode: this.deleteMode,
                        emptyContent: (entry.value === "").toString()
                      }
                    },
                    label: {
                      classList: ["truncated-text"]
                    }
                  },
                  onClick: /* @__PURE__ */ __name(async () => {
                    if (this.deleteMode) {
                      const confirmed = await this.confirmationModal(g("behaviors.prompt.delete_content"));
                      if (!confirmed) return;
                      entries.splice(originalIndex, 1);
                      onChange(entries);
                    } else {
                      W.prompt(g("behaviors.prompt.edit_content"), { defaultValue: entry.value, modalClassList: ["rsp-modal"] }).then((newValue) => {
                        if (newValue === entry.value) return;
                        else if (newValue === null) return;
                        else {
                          entries[originalIndex].value = newValue;
                          onChange(entries);
                        }
                      });
                    }
                  }, "onClick")
                })
              ]
            });
            return entryContainer;
          })
        ]
      });
      if (thisElement) {
        thisElement.replaceWith(container);
      }
      return container;
    }
    // #region SECTION Selection Methods
    selectBehavior(id) {
      let oldBehavior;
      if (this.selectedBehaviorId) {
        oldBehavior = this.settings.behaviors[this.selectedBehaviorId];
      }
      this.selectedBehaviorId = id;
      if (oldBehavior) this.buildBehaviorListItem(oldBehavior);
      this.buildBehaviorListItem(this.settings.behaviors[id]);
      this.buildEditorPanel();
    }
    selectTrigger(id) {
      let oldTrigger;
      if (this.selectedTriggerId) {
        oldTrigger = this.settings.triggers[this.selectedTriggerId];
      }
      this.selectedTriggerId = id;
      if (oldTrigger) this.buildTriggerListItem(oldTrigger);
      this.buildTriggerListItem(this.settings.triggers[id]);
      this.buildEditorPanel();
    }
    selectReaction(id) {
      let oldReaction;
      if (this.selectedReactionId) {
        oldReaction = this.settings.reactions[this.selectedReactionId];
      }
      this.selectedReactionId = id;
      if (oldReaction) this.buildReactionListItem(oldReaction);
      this.buildReactionListItem(this.settings.reactions[id]);
      this.buildEditorPanel();
    }
    // #endregion !SECTION Selection Methods
    // #region SECTION Handlers
    handleAdd() {
      if (this.activeTab === "behaviors") {
        this.handleAddBehavior();
      } else if (this.activeTab === "triggers") {
        this.handleAddTrigger();
      } else if (this.activeTab === "reactions") {
        this.handleAddReaction();
      }
    }
    handleAddBehavior() {
      W.prompt(g("behaviors.prompt.behavior_name"), { modalClassList: ["rsp-modal"] }).then((name) => {
        if (name === null) return;
        const behavior = BehaviorsModule.createBehavior({
          name: name || g("behaviors.text.new_behavior"),
          enabled: true
        });
        if (behavior) {
          this.settings.behaviors[behavior.id] = behavior;
          this.selectedBehaviorId = behavior.id;
          this.buildListItems();
          this.buildEditorPanel();
        }
      });
    }
    handleAddTrigger() {
      W.prompt(g("behaviors.prompt.trigger_name"), { modalClassList: ["rsp-modal"] }).then((name) => {
        if (name === null) return;
        const trigger = BehaviorsModule.createTrigger({
          name: name || g("behaviors.text.new_trigger"),
          type: "speech",
          speechType: "any",
          content: []
        });
        if (trigger) {
          this.settings.triggers[trigger.id] = trigger;
          this.selectedTriggerId = trigger.id;
          this.buildListItems();
          this.buildEditorPanel();
        }
      });
    }
    handleAddReaction() {
      W.prompt(g("behaviors.prompt.reaction_name"), { modalClassList: ["rsp-modal"] }).then((name) => {
        if (name === null) return;
        const reaction = BehaviorsModule.createReaction({
          name: name || g("behaviors.text.new_reaction"),
          type: "speech",
          content: []
        });
        if (reaction) {
          this.settings.reactions[reaction.id] = reaction;
          this.selectedReactionId = reaction.id;
          this.buildListItems();
          this.buildEditorPanel();
        }
      });
    }
    async handleDelete(type, id) {
      const itemMap = {
        behaviors: this.settings.behaviors,
        triggers: this.settings.triggers,
        reactions: this.settings.reactions
      };
      const item = itemMap[type][id];
      if (!item) return;
      const confirmed = await this.confirmationModal(g("behaviors.prompt.delete_confirm").replace("{name}", item.name));
      if (!confirmed) return;
      if (type === "behaviors") {
        if (this.selectedBehaviorId === id) {
          this.selectedBehaviorId = null;
        }
        BehaviorsModule.deleteBehavior(id);
      } else if (type === "triggers") {
        if (this.selectedTriggerId === id) {
          this.selectedTriggerId = null;
        }
        BehaviorsModule.deleteTrigger(id);
      } else if (type === "reactions") {
        if (this.selectedReactionId === id) {
          this.selectedReactionId = null;
        }
        BehaviorsModule.deleteReaction(id);
      }
      ElementWrap(selector3.listItem(id))?.remove();
      this.buildEditorPanel();
    }
    // #endregion !SECTION Handlers
    // #region SECTION Selectors
    async showTriggerSelector(behavior) {
      const availableTriggers = Object.values(this.settings.triggers).filter((t8) => !behavior.triggers.includes(t8.id));
      if (availableTriggers.length === 0) {
        W.alert(g("behaviors.text.no_triggers_available"), { modalClassList: ["rsp-modal"] });
        return;
      }
      const options = availableTriggers.map((t8) => ({
        label: t8.name,
        value: t8.id
      }));
      const selectedIds = await itemSelectorModal({ buttons: options });
      if (selectedIds === null || selectedIds.length === 0) return;
      selectedIds.forEach((id) => {
        behavior.triggers.push(id);
      });
      this.buildBehaviorListItem(behavior);
      this.buildTriggersSection(behavior);
    }
    async showReactionSelector(behavior) {
      const availableReactions = Object.values(this.settings.reactions).filter((r2) => !behavior.reactions.includes(r2.id));
      if (availableReactions.length === 0) {
        W.alert(g("behaviors.text.no_reactions_available"), { modalClassList: ["rsp-modal"] });
        return;
      }
      const options = availableReactions.map((r2) => ({
        label: r2.name,
        value: r2.id
      }));
      const selectedIds = await itemSelectorModal({ buttons: options });
      if (selectedIds === null || selectedIds.length === 0) return;
      selectedIds.forEach((id) => behavior.reactions.push(id));
      this.buildBehaviorListItem(behavior);
      this.buildReactionsSection(behavior);
    }
    // #endregion !SECTION Selectors
    // #region SECTION Creators
    changeTriggerType(trigger, newType) {
      let newTrigger;
      switch (newType) {
        case "speech":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "speech",
            speechType: "any",
            content: [],
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "emote":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "emote",
            content: [],
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "action":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "action",
            content: [],
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "activity":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "activity",
            activityName: [],
            groupName: [],
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "orgasm":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "orgasm",
            orgasmType: "any",
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "arousal":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "arousal",
            limit: 0,
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "roomPresence":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "roomPresence",
            event: "join",
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        case "button":
          newTrigger = BehaviorsModule.createTrigger({
            name: trigger.name || g("behaviors.text.new_trigger"),
            type: "button",
            constraintMode: trigger.constraintMode,
            constraints: trigger.constraints
          });
          break;
        default:
          assertNever(newType);
      }
      if (!newTrigger) return void 0;
      return {
        ...newTrigger,
        id: trigger.id
      };
    }
    changeReactionType(reaction, newType) {
      let newReaction;
      switch (newType) {
        case "speech":
          newReaction = BehaviorsModule.createReaction({
            name: reaction.name || g("behaviors.text.new_reaction"),
            type: "speech",
            content: []
          });
          break;
        case "emote":
          newReaction = BehaviorsModule.createReaction({
            name: reaction.name || g("behaviors.text.new_reaction"),
            type: "emote",
            content: []
          });
          break;
        case "action":
          newReaction = BehaviorsModule.createReaction({
            name: reaction.name || g("behaviors.text.new_reaction"),
            type: "action",
            content: []
          });
          break;
        case "activity":
          newReaction = BehaviorsModule.createReaction({
            name: reaction.name || g("behaviors.text.new_reaction"),
            type: "activity",
            activityName: "",
            groupName: ""
          });
          break;
        case "animation":
          newReaction = BehaviorsModule.createReaction({
            name: reaction.name || g("behaviors.text.new_reaction"),
            type: "animation",
            animationId: "",
            interrupt: false,
            priority: 0
          });
          break;
        default:
          assertNever(newType);
      }
      if (!newReaction) return void 0;
      return {
        ...newReaction,
        id: reaction.id
      };
    }
    // #endregion !SECTION Creators
    // #region SECTION Utility Methods
    toggleDeleteMode() {
      this.deleteMode = !this.deleteMode;
      ElementWrap(selector3.deleteModeToggle)?.toggleAttribute("data-delete-mode", this.deleteMode);
      const deletableItems = document.querySelectorAll("[data-deletable]");
      deletableItems.forEach((item) => {
        item.toggleAttribute("data-delete-mode", this.deleteMode);
      });
    }
    async confirmationModal(message) {
      const result = this.doNotShowConfirmation || await W.confirm([
        message,
        u.createCheckbox({
          id: "rsp-do-not-show-confirmation",
          label: g("behaviors.text.do_not_show_this_again_until_leaving_this_screen"),
          setSettingValue: /* @__PURE__ */ __name((val) => this.doNotShowConfirmation = val, "setSettingValue")
        })
      ], { modalId: "rsp-modal" });
      if (result === false) this.doNotShowConfirmation = false;
      return result ?? false;
    }
    // #endregion !SECTION Utility Methods
  };
  O("GuiResponses", GuiBehaviors);

  // src/utilities/reactions.ts
  function processReactions(reactions, reactionMode, messageData) {
    if (reactions.length === 0) {
      return { success: false, executedReactionIds: [] };
    }
    switch (reactionMode) {
      case "random": {
        const reaction = reactions[getRandomInt(reactions.length)];
        const success = processReaction(reaction, messageData);
        return {
          success,
          executedReactionIds: success ? [reaction.id] : []
        };
      }
      case "all": {
        const executedReactionIds = [];
        const success = reactions.every((reaction) => {
          const processed = processReaction(reaction, messageData);
          if (processed) executedReactionIds.push(reaction.id);
          return processed;
        });
        return { success, executedReactionIds };
      }
      default:
        assertNever(reactionMode);
    }
  }
  __name(processReactions, "processReactions");
  function processReaction(reaction, messageData) {
    switch (reaction.type) {
      case "speech": {
        if (!doesBcxAllowsTalking()) return false;
        const response = randomResponse(reaction.content);
        const templatedResponse = replaceTemplate(response, messageData.source).trim();
        chatRoomAutoInterceptMessage(templatedResponse);
        return true;
      }
      case "emote": {
        const response = randomResponse(reaction.content);
        const templatedResponse = replaceTemplate(response, messageData.source).trim();
        ChatRoomSendEmote("**" + templatedResponse);
        return true;
      }
      case "action": {
        const response = randomResponse(reaction.content);
        const templatedResponse = replaceTemplate(response, messageData.source).trim();
        An(templatedResponse);
        return true;
      }
      case "activity": {
        const activity = AssetGetActivity("Female3DCG", reaction.activityName);
        const group = AssetGroupGet("Female3DCG", reaction.groupName);
        const character = messageData.source;
        if (!activity || !group || !character) return false;
        if (!ActivityCanBeDone(character, activity.Name, group.Name)) return false;
        ActivityRun(Player, character, group, { Activity: activity, Group: group.Name });
        return true;
      }
      case "animation": {
        const module = AnimatronikkaModule.instance;
        if (!module || !reaction.animationId) return false;
        const success = module.playAnimation(reaction.animationId, {
          interrupt: reaction.interrupt,
          priority: reaction.priority,
          target: Player
        });
        return success;
      }
      default:
        assertNever(reaction);
    }
  }
  __name(processReaction, "processReaction");

  // src/modules/behaviors.ts
  var orgasmTypesFromMessage = /* @__PURE__ */ __name((msg) => {
    switch (true) {
      case msg.includes("OrgasmFailResist"):
        return "ruinedResisted";
      case msg.includes("OrgasmFailTimeout"):
        return "ruinedTimeout";
      case msg.includes("OrgasmFailSurrender"):
        return "ruinedSurrendered";
      case msg.includes("OrgasmResist"):
        return "resisted";
      case msg.includes("Orgasm"):
        return "normal";
    }
    return void 0;
  }, "orgasmTypesFromMessage");
  var selec = Object.freeze({
    chatRoomButtonsId: "rsp-chatroom-buttons"
  });
  var CHAT_ROOM_BUTTON_POSITION_KEY = "CHAT_ROOM_BUTTON_POSITION";
  var CHAT_ROOM_BUTTON_SIZE = 64;
  var CHAT_ROOM_BUTTON_DRAG_THRESHOLD = 6;
  var BehaviorsModule = class _BehaviorsModule extends L {
    static {
      __name(this, "BehaviorsModule");
    }
    static instance;
    leashedLeave = false;
    behaviorExecutionMap = /* @__PURE__ */ new Map();
    static chatRoomButtonDrag = null;
    static suppressChatRoomButtonToggle = false;
    activeRankedKeys = {};
    get settings() {
      return super.settings;
    }
    set settings(val) {
      super.settings = val;
    }
    get settingsScreen() {
      return GuiBehaviors;
    }
    get defaultSettings() {
      return {
        behaviors: {},
        reactions: {},
        triggers: {}
      };
    }
    load() {
      super.load();
      _BehaviorsModule.instance = this;
      ChatRoomRegisterMessageHandler({
        Description: "Processes activity responses",
        Priority: 320,
        Callback: /* @__PURE__ */ __name((data, sender, msg, metadata) => {
          if (!areBehaviorsEnabled()) return false;
          if (!["Activity", "Emote", "Action", "Chat", "Whisper"].includes(data.Type)) return false;
          if (!metadata) return false;
          let type = data.Type.toLowerCase();
          let orgasmType = void 0;
          let speechType = void 0;
          if (data.Type === "Chat" || data.Type === "Whisper") {
            type = "speech";
            speechType = data.Type === "Chat" ? "normal" : "whisper";
          }
          if (data.Type === "Activity" && data.Content.startsWith("Orgasm")) {
            type = "orgasm";
            orgasmType = orgasmTypesFromMessage(data.Content);
          }
          const messageData = {
            source: sender,
            target: metadata.TargetCharacter,
            messageContent: data.Content,
            message: msg,
            activityName: metadata.ActivityName,
            groupName: metadata.GroupName,
            orgasmType,
            speechType
          };
          _BehaviorsModule.processBehavior(type, messageData);
          return false;
        }, "Callback")
      });
      G.hookFunction(
        "ServerAccountBeep",
        1 /* AddBehavior */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          const data = args[0];
          if (!data) return next(args);
          if (data.BeepType !== "Leash") return next(args);
          if (!data.ChatRoomName) return next(args);
          if (!ChatRoomData) return next(args);
          if (!Player.OnlineSharedSettings?.AllowPlayerLeashing) return next(args);
          this.leashedLeave = true;
          const messageData = {
            messageContent: data.Message,
            message: data.Message,
            roomPrecenseEvent: "leashed"
          };
          _BehaviorsModule.processBehavior("roomPresence", messageData);
          next(args);
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomSync",
        1 /* AddBehavior */,
        (args, next) => {
          this.leashedLeave = false;
          if (!areBehaviorsEnabled()) return next(args);
          const shouldProcess = !ServerPlayerIsInChatRoom() && RelogData?.ChatRoomName !== args[0].Name;
          const ret = next(args);
          if (shouldProcess)
            _BehaviorsModule.processBehavior("roomPresence", {
              source: Player,
              roomPrecenseEvent: "join"
            });
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ServerSend",
        1 /* AddBehavior */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          if (!ServerPlayerIsInChatRoom()) return next(args);
          if (args[0] !== "ChatRoomLeave") return next(args);
          if (this.leashedLeave) return next(args);
          _BehaviorsModule.processBehavior("roomPresence", {
            roomPrecenseEvent: "leave",
            source: Player
          });
          return next(args);
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomSyncMemberJoin",
        1 /* AddBehavior */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          if (!ServerPlayerIsInChatRoom()) return next(args);
          const ret = next(args);
          const character = ChatRoomGetCharacter(args[0].SourceMemberNumber);
          if (!character) return ret;
          _BehaviorsModule.processBehavior("roomPresence", {
            roomPrecenseEvent: "join",
            source: character
          });
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomSyncMemberLeave",
        1 /* AddBehavior */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          if (!ServerPlayerIsInChatRoom()) return next(args);
          const character = ChatRoomGetCharacter(args[0].SourceMemberNumber);
          if (!character) return next(args);
          _BehaviorsModule.processBehavior("roomPresence", {
            roomPrecenseEvent: "leave",
            source: character
          });
          return next(args);
        },
        0 /* Global */
      );
      G.hookFunction(
        "ActivityProgressCharacter",
        0 /* Observe */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          if (!ServerPlayerIsInChatRoom()) return next(args);
          const ret = next(args);
          _BehaviorsModule.handleArousalTick(args[0]);
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ActivityDecayCharacter",
        0 /* Observe */,
        (args, next) => {
          if (!areBehaviorsEnabled()) return next(args);
          if (!ServerPlayerIsInChatRoom()) return next(args);
          const ret = next(args);
          _BehaviorsModule.handleArousalTick(args[0]);
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomLoad",
        0 /* Observe */,
        async (args, next) => {
          const ret = await next(args);
          _BehaviorsModule.syncChatRoomButtons();
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomResize",
        0 /* Observe */,
        (args, next) => {
          const ret = next(args);
          _BehaviorsModule.positionChatRoomButtons();
          return ret;
        },
        0 /* Global */
      );
      G.hookFunction(
        "ChatRoomUnload",
        0 /* Observe */,
        (args, next) => {
          _BehaviorsModule.clearChatRoomButtons();
          return next(args);
        },
        0 /* Global */
      );
    }
    getBehavior(id) {
      return this.settings.behaviors[id];
    }
    getTrigger(id) {
      return this.settings.triggers[id];
    }
    getReaction(id) {
      return this.settings.reactions[id];
    }
    static createBehavior(behavior) {
      return applyBehaviorDefaults(behavior);
    }
    static createTrigger(trigger) {
      return applyTriggerDefaults(trigger);
    }
    static createReaction(reaction) {
      return applyReactionDefaults(reaction);
    }
    static clearDebugHistory() {
      DebugStorage.clearHistory();
    }
    static deleteBehavior(id) {
      delete _BehaviorsModule.instance.settings.behaviors[id];
    }
    static deleteTrigger(id) {
      delete _BehaviorsModule.instance.settings.triggers[id];
      Object.values(_BehaviorsModule.instance.settings.behaviors).forEach((behavior) => {
        const index = behavior.triggers.indexOf(id);
        if (index > -1) {
          behavior.triggers.splice(index, 1);
        }
      });
    }
    static deleteReaction(id) {
      delete _BehaviorsModule.instance.settings.reactions[id];
      Object.values(_BehaviorsModule.instance.settings.behaviors).forEach((behavior) => {
        const index = behavior.reactions.indexOf(id);
        if (index > -1) {
          behavior.reactions.splice(index, 1);
        }
      });
    }
    static handleArousalTick(character) {
      if (!areBehaviorsEnabled()) return;
      if (!character || character.MemberNumber !== Player.MemberNumber) return;
      _BehaviorsModule.processBehavior("arousal", { source: character });
    }
    static syncChatRoomButtons() {
      _BehaviorsModule.clearChatRoomButtons();
      if (!areBehaviorsEnabled()) return;
      const triggers = _BehaviorsModule.chatRoomButtonTriggers();
      if (triggers.length === 0) return;
      const buttons = triggers.map((trigger) => {
        return ElementButton.Create(
          `rsp-chatroom-button-${trigger.id}`,
          () => {
            _BehaviorsModule.processBehavior("button", {
              buttonId: trigger.id,
              source: Player
            });
          },
          {
            label: trigger.name,
            role: "menuitem",
            labelPosition: "left"
          },
          {
            button: {
              classList: ["rsp-chatroom-button"]
            }
          }
        );
      });
      const columns = CommonClamp(triggers.length, 1, 3);
      const buttonMenu = ElementMenu.Create(
        null,
        buttons,
        { role: "menu" },
        {
          menu: {
            classList: ["rsp-chatroom-button-grid"],
            style: { "--rsp-button-columns": String(columns) }
          }
        }
      );
      const mainButton = ElementButton.Create(
        null,
        function(ev) {
          if (_BehaviorsModule.suppressChatRoomButtonToggle) {
            _BehaviorsModule.suppressChatRoomButtonToggle = false;
            ev.preventDefault();
            ev.stopPropagation();
            return;
          }
          const open = this.getAttribute("aria-expanded") !== "true";
          this.setAttribute("aria-expanded", String(open));
          buttonMenu.toggleAttribute("data-open", open);
          _BehaviorsModule.layoutChatRoomButtonGrid();
        },
        {
          image: "Icons/Arousal.png",
          ariaHasPopup: "menu",
          ariaExpanded: "false"
        },
        {
          button: {
            classList: ["rsp-chatroom-button-main"]
          }
        }
      );
      ElementCreate({
        tag: "div",
        attributes: { id: selec.chatRoomButtonsId },
        classList: ["rsp-chatroom-buttons"],
        children: [mainButton, buttonMenu],
        parent: document.body
      });
      mainButton.addEventListener("pointerdown", _BehaviorsModule.onMenuPointerDown);
      document.addEventListener("pointermove", _BehaviorsModule.onMenuPointerMove);
      document.addEventListener("pointerup", _BehaviorsModule.onMenuPointerUp);
    }
    static positionChatRoomButtons() {
      const menu = ElementWrap(selec.chatRoomButtonsId);
      if (!menu) return;
      const canvasSize = CHAT_ROOM_BUTTON_SIZE;
      const maxX = Math.max(0, window.innerWidth - canvasSize);
      const maxY = Math.max(0, window.innerHeight - canvasSize);
      const anchor = _BehaviorsModule.readMenuAnchor() ?? {
        x: maxX === 0 ? 0 : Math.min(1, 16 / maxX),
        y: maxY === 0 ? 0 : Math.min(1, 80 / maxY)
      };
      _BehaviorsModule.placeMenu(menu, anchor.x * maxX, anchor.y * maxY);
    }
    static layoutChatRoomButtonGrid() {
      const menu = ElementWrap(selec.chatRoomButtonsId);
      const grid = menu?.querySelector(".rsp-chatroom-button-grid");
      if (!menu || !grid) return;
      const rect = menu.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.left;
      const spaceLeft = rect.right;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const alignStart = spaceRight >= spaceLeft;
      const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
      grid.classList.toggle("align-start", alignStart);
      grid.classList.toggle("open-up", openUp);
      grid.style.setProperty("--rsp-grid-max-width", `${Math.max(120, (alignStart ? spaceRight : spaceLeft) - 8)}px`);
      grid.style.setProperty("--rsp-grid-max-height", `${Math.max(80, (openUp ? spaceAbove : spaceBelow) - 12)}px`);
    }
    static closeChatRoomButtonMenu() {
      const menu = ElementWrap(selec.chatRoomButtonsId);
      const mainButton = menu?.querySelector(".rsp-chatroom-button-main");
      mainButton?.setAttribute("aria-expanded", "false");
      menu?.querySelector(".rsp-chatroom-button-grid")?.removeAttribute("data-open");
    }
    static clearChatRoomButtons() {
      document.removeEventListener("pointermove", _BehaviorsModule.onMenuPointerMove);
      document.removeEventListener("pointerup", _BehaviorsModule.onMenuPointerUp);
      _BehaviorsModule.chatRoomButtonDrag = null;
      ElementRemove(selec.chatRoomButtonsId);
    }
    static placeMenu(menu, left, top) {
      const canvasSize = CHAT_ROOM_BUTTON_SIZE;
      const maxX = Math.max(0, window.innerWidth - canvasSize);
      const maxY = Math.max(0, window.innerHeight - canvasSize);
      const x = CommonClamp(left, 0, maxX);
      const y2 = CommonClamp(top, 0, maxY);
      menu.style.left = `${x}px`;
      menu.style.top = `${y2}px`;
      menu.style.width = `${canvasSize}px`;
      menu.style.height = `${canvasSize}px`;
      _BehaviorsModule.layoutChatRoomButtonGrid();
    }
    static readMenuAnchor() {
      const stored = modStorage.getLocalStorage(CHAT_ROOM_BUTTON_POSITION_KEY);
      if (!stored || typeof stored.x !== "number" || typeof stored.y !== "number") return null;
      if (!Number.isFinite(stored.x) || !Number.isFinite(stored.y)) return null;
      return {
        x: CommonClamp(stored.x, 0, 1),
        y: CommonClamp(stored.y, 0, 1)
      };
    }
    static rememberMenuAnchor(left, top) {
      const canvasSize = CHAT_ROOM_BUTTON_SIZE;
      const maxX = Math.max(0, window.innerWidth - canvasSize);
      const maxY = Math.max(0, window.innerHeight - canvasSize);
      modStorage.setLocalStorage(CHAT_ROOM_BUTTON_POSITION_KEY, {
        x: maxX === 0 ? 0 : CommonClamp(left, 0, maxX) / maxX,
        y: maxY === 0 ? 0 : CommonClamp(top, 0, maxY) / maxY
      });
    }
    static onMenuPointerDown = /* @__PURE__ */ __name((ev) => {
      if (ev.button !== 0) return;
      const menu = ElementWrap(selec.chatRoomButtonsId);
      const mainButton = menu?.querySelector(".rsp-chatroom-button-main");
      if (!menu || !mainButton) return;
      const target = ev.target;
      if (!(target instanceof Node) || !mainButton.contains(target)) return;
      if (target instanceof Element && target.closest(".rsp-chatroom-button-grid")) return;
      const rect = menu.getBoundingClientRect();
      _BehaviorsModule.chatRoomButtonDrag = {
        pointerId: ev.pointerId,
        originX: ev.clientX,
        originY: ev.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        moved: false
      };
      mainButton.setPointerCapture(ev.pointerId);
    }, "onMenuPointerDown");
    static onMenuPointerMove = /* @__PURE__ */ __name((ev) => {
      const drag = _BehaviorsModule.chatRoomButtonDrag;
      if (!drag || ev.pointerId !== drag.pointerId) return;
      const menu = ElementWrap(selec.chatRoomButtonsId);
      if (!menu) return;
      const dx = ev.clientX - drag.originX;
      const dy = ev.clientY - drag.originY;
      if (!drag.moved && Math.hypot(dx, dy) < CHAT_ROOM_BUTTON_DRAG_THRESHOLD) return;
      drag.moved = true;
      _BehaviorsModule.suppressChatRoomButtonToggle = true;
      menu.setAttribute("data-dragging", "");
      _BehaviorsModule.placeMenu(menu, drag.startLeft + dx, drag.startTop + dy);
    }, "onMenuPointerMove");
    static onMenuPointerUp = /* @__PURE__ */ __name((ev) => {
      const drag = _BehaviorsModule.chatRoomButtonDrag;
      if (!drag || ev.pointerId !== drag.pointerId) return;
      _BehaviorsModule.chatRoomButtonDrag = null;
      const menu = ElementWrap(selec.chatRoomButtonsId);
      menu?.removeAttribute("data-dragging");
      if (!drag.moved || !menu) return;
      _BehaviorsModule.suppressChatRoomButtonToggle = true;
      const rect = menu.getBoundingClientRect();
      _BehaviorsModule.rememberMenuAnchor(rect.left, rect.top);
      setTimeout(() => {
        _BehaviorsModule.suppressChatRoomButtonToggle = false;
      }, 0);
    }, "onMenuPointerUp");
    static chatRoomButtonTriggers() {
      const behaviors = Object.values(_BehaviorsModule.instance.settings.behaviors ?? {});
      const ids = new Set(behaviors.filter((behavior) => behavior.enabled).flatMap((behavior) => behavior.triggers));
      return [...ids].flatMap((id) => {
        const trigger = _BehaviorsModule.instance.getTrigger(id);
        return trigger?.type === "button" ? [trigger] : [];
      });
    }
    static processBehavior(type, messageData) {
      const matches = collectTriggers(type, messageData);
      if (hasTriggerRank(type)) return _BehaviorsModule.runTopRanked(type, matches, messageData);
      const match = matches[0];
      if (!match) return void 0;
      return _BehaviorsModule.runBehavior(match.behavior, match.trigger, messageData);
    }
    static runTopRanked(type, matches, messageData) {
      const active = _BehaviorsModule.instance.activeRankedKeys ??= {};
      let maxRank = -1;
      const top = [];
      for (const match of matches) {
        const rank = triggerRank(match.trigger);
        if (rank > maxRank) {
          maxRank = rank;
          top.length = 0;
          top.push(match);
        } else if (rank === maxRank) {
          top.push(match);
        }
      }
      const key = top.length ? top.map((match) => match.trigger.id).sort().join("\0") : void 0;
      if (active[type] === key) return void 0;
      active[type] = key;
      if (!key) return void 0;
      let last;
      for (const match of top) {
        last = _BehaviorsModule.runBehavior(match.behavior, match.trigger, messageData);
      }
      return last;
    }
    static runBehavior(behavior, trigger, messageData) {
      const reactions = behavior.reactions.map((r2) => _BehaviorsModule.instance.getReaction(r2)).filter((r2) => r2 !== void 0).map((r2) => hasTriggerRank(trigger.type) && r2.type === "animation" ? { ...r2, interrupt: true } : r2);
      const reactionResult = processReactions(reactions, behavior.reactionMode, messageData);
      DebugStorage.addEntry({
        timestamp: Date.now(),
        behaviorId: behavior.id,
        triggerId: trigger.id,
        reactionIds: reactionResult.executedReactionIds,
        triggerType: trigger.type,
        messageData: {
          sourceMemberNumber: messageData.source?.MemberNumber,
          targetMemberNumber: messageData.target?.MemberNumber,
          messageContent: messageData.messageContent,
          activityName: messageData.activityName,
          groupName: messageData.groupName,
          orgasmType: messageData.orgasmType,
          roomPrecenseEvent: messageData.roomPrecenseEvent,
          speechType: messageData.speechType,
          buttonId: messageData.buttonId
        }
      });
      if (reactionResult.success && behavior.cooldownSec && !hasTriggerRank(trigger.type)) {
        _BehaviorsModule.instance.behaviorExecutionMap.set(behavior.id, CommonTime());
      }
      return behavior;
    }
  };
  O("BehaviorsModule", BehaviorsModule);
  O("getModule", B);

  // src/screens/reset.ts
  var GuiReset = class extends I {
    static {
      __name(this, "GuiReset");
    }
    get name() {
      return "reset";
    }
    static subscreenOptions = {
      name: "reset",
      drawCharacter: false,
      doShowExitButton: false,
      doShowTitle: false
    };
    doResetForManualSettings = false;
    doResetSettings = true;
    doResetResponses = true;
    doResetProfiles = false;
    load() {
      super.load();
      let timeToConfirm = 5;
      ElementCreate({
        tag: "div",
        classList: ["rsp-reset-container"],
        attributes: {
          id: "rsp-reset-container"
        },
        children: [
          u.createLabel({
            id: "themed-reset-label-perma_reset_of_mod_data",
            label: g("reset.label.perma_reset_of_mod_data")
          }),
          {
            tag: "br"
          },
          u.createLabel({
            id: "themed-reset-label-warning",
            label: g("reset.label.warning")
          }),
          u.createLabel({
            id: "themed-reset-label-if_u_confirm_perma_reset",
            label: g("reset.label.if_u_confirm_perma_reset")
          }),
          {
            tag: "br"
          },
          u.createLabel({
            id: "themed-reset-label-youll_able_to_use_mod",
            label: g("reset.label.youll_able_to_use_mod")
          }),
          {
            tag: "br"
          },
          u.createLabel({
            id: "themed-reset-label-action_cannot_be_undone",
            label: g("reset.label.action_cannot_be_undone")
          }),
          {
            tag: "br"
          },
          {
            tag: "div",
            attributes: {
              id: "rsp-reset-buttons-container"
            },
            children: [
              u.createButton({
                id: "rsp-reset-button",
                onClick: /* @__PURE__ */ __name(() => {
                  this.confirm();
                  timer?.();
                }, "onClick"),
                options: {
                  label: `${g("reset.button.confirm")} (${timeToConfirm})`
                },
                disabled: true
              }),
              u.createButton({
                id: "rsp-cancel-button",
                onClick: /* @__PURE__ */ __name(() => {
                  this.exit();
                  timer?.();
                }, "onClick"),
                options: {
                  label: g("reset.button.cancel")
                }
              })
            ]
          }
        ],
        parent: b.getSubscreen()
      });
      const timer = TimerCreate(() => {
        timeToConfirm--;
        const button = ElementWrap("rsp-reset-button");
        const buttonLabel = button?.querySelector(".button-label");
        if (buttonLabel) {
          buttonLabel.textContent = `${g("reset.button.confirm")} (${timeToConfirm})`;
        }
        if (timeToConfirm <= 0) {
          if (button && buttonLabel) {
            button.disabled = false;
            buttonLabel.textContent = g("reset.button.confirm");
          }
          timer();
        }
      }, 1e3, true, "universal");
    }
    resize(onLoad) {
      super.resize(onLoad);
      ElementSetPosition("rsp-reset-container", 500, 175, "top-left");
      ElementSetSize("rsp-reset-container", 1e3, null);
    }
    confirm() {
      if (this.doResetForManualSettings) {
        dataResetForManual();
      } else {
        dataErase(this.doResetSettings, this.doResetResponses, this.doResetProfiles);
        for (const module of y()) {
          module.registerDefaultSettings(modStorage.playerStorage);
        }
      }
      PreferenceOpenSubscreen("Extensions").then(() => {
        PreferenceSubscreenExtensionsClear();
      });
    }
  };

  // src/utilities/definition.ts
  var MSG_TIMER = {
    CHANGELOG: 30,
    INFO: 15,
    COMMANDS: 20
  };
  var CMD_BCR = "bcr";
  var CMD_TOGGLE = "toggle";
  var CMD_CHANGELOG = "changelog";
  var CMD_VERSION = "version";
  var CMD_DEBUG_DATA = "debug-data";

  // src/utilities/messages.ts
  var BCR_CMDS = (
    /*html*/
    `
  <div class="ResponsiveMessageContent">
    <b style='color:#440171; text-shadow: 0.05em 0.05em #690092;'>BC Responsive</b>: Available commands (Clickable)
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR} ${CMD_TOGGLE}")'>Toggle Responsive</a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR} ${CMD_CHANGELOG}")'>Show Changelog</a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR} ${CMD_VERSION}")'>Show Version</a><br>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR} ${CMD_DEBUG_DATA}")'>Debug Data</a><br>
    <br><a href='https://github.com/ProtoKink/Responsive/wiki' target='_blank'><b>Open Wiki</b></a>
  </div>
  `
  );
  var BCR_NEW_VERSION = (
    /*html*/
    `
  <div class='ResponsiveMessageContent'>
    <b style='color:#690092; text-shadow: 0.05em 0.05em #440171;'>BC Responsive</b><b>: New Version!</b> [${"1.0.0 - 22a0cb39"}]<br>
    <br><b style='color:#CC3232; text-shadow: 0.05em 0.05em #920009;'>Please, reload your page~</b><br>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR} ${CMD_CHANGELOG}")'><b>Changelog (Click)</b></a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR}")'><b>Show Help (Click)</b></a>
  </div>
 `
  );
  var BCR_VERSION_MSG = (
    /*html*/
    `
  <p class='ResponsiveMessageContent'>Current version of <b style='color:#690092; text-shadow: 0.05em 0.05em #440171;'>BC Responsive: v${"1.0.0 - 22a0cb39"}</b></p>
  `
  );
  var BCR_TOGGLE_ENABLED = (
    /*html*/
    `
    <p class='ResponsiveMessageContent'><b>BC Responsive</b> has been enabled</p>
    `
  );
  var BCR_TOGGLE_DISABLED = (
    /*html*/
    `
    <p class='ResponsiveMessageContent'><b>BC Responsive</b> has been disabled</p>
    `
  );
  var BCR_CHANGELOG = `
    0.6.6
    \u2022 Fixed CharTalk making expression stuck.
    \u2022 Fixed custom actions to be displayed correctly throughout all translations. 
    \u2022 Fixed CharTalk to match letters in case-insensitive way.
    \u2022 Limit amount of animation frames in CharTalk to 30. Long sentences or RP essays won't be animated for 10 straight minutes~

    0.6.5
    \u2022 Move mod button to Extensions Settings. Preferences > Extensions > Responsive Settings.
    \u2022 Fixed crash in some cases by automating data repairing.

    0.6.4
    \u2022 Fixed Character Talk wasn't working.<br>
`;

  // src/modules/commands.ts
  var CommandsModule = class extends L {
    static {
      __name(this, "CommandsModule");
    }
    load() {
      CommandCombine({
        Tag: CMD_BCR,
        Description: ": To open the Responsive commands overview.",
        Action: /* @__PURE__ */ __name(() => {
          Rn("bcr_cmds", BCR_CMDS, MSG_TIMER.COMMANDS);
        }, "Action"),
        Subcommands: [
          {
            Tag: CMD_TOGGLE,
            Description: ": To toggle the Responsive mod.",
            Action: /* @__PURE__ */ __name(() => {
              const data = modStorage.playerStorage.GlobalModule;
              data.modEnabled = !data.modEnabled;
              if (data.modEnabled) {
                Rn("bcr_toggle_enb", BCR_TOGGLE_ENABLED, MSG_TIMER.INFO);
              }
              if (!data.modEnabled) {
                Rn("bcr_toggle_dis", BCR_TOGGLE_DISABLED, MSG_TIMER.INFO);
              }
            }, "Action")
          },
          {
            Tag: CMD_CHANGELOG,
            Description: ": To open the Responsive changelog.",
            Action: /* @__PURE__ */ __name(() => {
              Rn("bcr_clog", BCR_CHANGELOG);
            }, "Action")
          },
          {
            Tag: CMD_VERSION,
            Description: ": To open the Responsive version.",
            Action: /* @__PURE__ */ __name(() => {
              Rn("bcr_ver", BCR_VERSION_MSG, MSG_TIMER.INFO);
            }, "Action")
          },
          {
            Tag: CMD_DEBUG_DATA,
            Description: ": To copy the Responsive debug data.",
            Action: /* @__PURE__ */ __name(() => {
              navigator.clipboard.writeText(modStorage.extensionStorage);
            }, "Action")
          }
        ]
      });
    }
  };

  // src/migrators/deeplib.ts
  var DeepLibMigrator = class extends be {
    static {
      __name(this, "DeepLibMigrator");
    }
    get migrationVersion() {
      return "1.0.0";
    }
    migrate() {
      replaceTemplates();
    }
  };
  function replaceTemplates() {
    const data = modStorage.playerStorage.ResponsesModule;
    const replacements = Object.freeze({
      tname: "{{target-name}}",
      tpronoun: "{{target-pronoun}}",
      tpossessive: "{{target-possessive}}",
      tintensive: "{{target-intensive}}",
      tself: "{{target-self}}",
      sname: "{{source-name}}",
      spronoun: "{{source-pronoun}}",
      spossessive: "{{source-possessive}}",
      sintensive: "{{source-intensive}}",
      sself: "{{source-self}}",
      player: "{{player-name}}"
    });
    data.mainResponses.forEach((entry) => {
      entry.responses = entry.responses.map((r2) => r2.replaceAll(/%SOURCE_PRONOUN%|SourcePronoun/g, replacements.spronoun).replaceAll(/%SOURCE_POSSESIVE%|SourcePossessive/g, replacements.spossessive).replaceAll(/%SOURCE_INTENSIVE%|SourceIntensive/g, replacements.sintensive).replaceAll(/%SOURCE%|Source/g, replacements.sname).replaceAll(/%TARGET_PRONOUN%|Pronoun/g, replacements.tpronoun).replaceAll(/%TARGET_POSSESIVE%|Possessive/g, replacements.tpossessive).replaceAll(/%TARGET_INTENSIVE%|Intensive/g, replacements.tintensive).replaceAll(/%TARGET%/g, replacements.tname).replaceAll(/Player/g, replacements.player));
    });
    modStorage.save();
  }
  __name(replaceTemplates, "replaceTemplates");

  // src/responsive.ts
  kt({
    async initFunction() {
      H.injectEmbed("bcr_style", `${"https://protokink.github.io/Responsive/dev/public"}/styles/main.css`);
      H.injectEmbed("bcr_behaviors_style", `${"https://protokink.github.io/Responsive/dev/public"}/styles/behaviors.css`);
      H.injectEmbed("bcr_modals_style", `${"https://protokink.github.io/Responsive/dev/public"}/styles/modals.css`);
      H.injectEmbed("bcr_field_style", `${"https://protokink.github.io/Responsive/dev/public"}/styles/fields.css`);
      H.injectEmbed("bcr_animatronikka_style", `${"https://protokink.github.io/Responsive/dev/public"}/styles/animatronikka.css`);
      ServerPlayerChatRoom.register({
        callback: /* @__PURE__ */ __name(() => CurrentModule === "DeepLibMod" && InformationSheetReturnScreen?.[1] === "ChatRoom", "callback")
      });
    },
    modules: {
      GUI: new M({
        buttonText: define_MOD_INFO_default.name,
        identifier: define_MOD_INFO_default.name,
        image: "Icons/Arousal.png"
      }),
      GlobalModule: new GlobalModule(),
      BehaviorsModule: new BehaviorsModule(),
      AnimatronikkaModule: new AnimatronikkaModule(),
      ProfilesModule: new ProfilesModule(),
      CharTalkModule: new CharTalkModule(),
      CommandsModule: new CommandsModule(),
      VersionModule: new N({
        newVersionMessage: BCR_CHANGELOG,
        migrators: [
          new DeepLibMigrator()
        ],
        showNewVersionMessage: /* @__PURE__ */ __name(() => p.playerStorage.GlobalModule.doShowNewVersionMessage, "showNewVersionMessage")
      })
    },
    mainMenuOptions: {
      wikiLink: "https://github.com/ProtoKink/Responsive/wiki",
      importExportSubscreen: new Ie({
        customFileExtension: "bcrsp"
      }),
      resetSubscreen: new GuiReset(),
      storageFullnessIndicator: true
    },
    translationOptions: {
      pathToTranslationsFolder: `${"https://protokink.github.io/Responsive/dev/public"}/i18n`,
      fetchFolder: true
    }
  });
})();
/*! Bundled license information:

bc-deeplib/dist/deeplib.js:
  (*! Bundled license information:
  
  js-logger/src/logger.js:
    (*!
     * js-logger - http://github.com/jonnyreeves/js-logger
     * Jonny Reeves, http://jonnyreeves.co.uk/
     * js-logger may be freely distributed under the MIT license.
     *)
  *)
*/
//# sourceMappingURL=main.js.map
