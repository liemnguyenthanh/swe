(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * Splide.js
 * Version  : 3.6.12
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const PROJECT_CODE = "splide";
const DATA_ATTRIBUTE = `data-${PROJECT_CODE}`;

const CREATED = 1;
const MOUNTED = 2;
const IDLE = 3;
const MOVING = 4;
const DESTROYED = 5;
const STATES = {
  CREATED,
  MOUNTED,
  IDLE,
  MOVING,
  DESTROYED
};

const DEFAULT_EVENT_PRIORITY = 10;
const DEFAULT_USER_EVENT_PRIORITY = 20;

function empty(array) {
  array.length = 0;
}

function isObject(subject) {
  return !isNull(subject) && typeof subject === "object";
}
function isArray(subject) {
  return Array.isArray(subject);
}
function isFunction(subject) {
  return typeof subject === "function";
}
function isString(subject) {
  return typeof subject === "string";
}
function isUndefined(subject) {
  return typeof subject === "undefined";
}
function isNull(subject) {
  return subject === null;
}
function isHTMLElement(subject) {
  return subject instanceof HTMLElement;
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function includes(array, value) {
  return array.indexOf(value) > -1;
}

function push(array, items) {
  array.push(...toArray(items));
  return array;
}

const arrayProto = Array.prototype;

function slice(arrayLike, start, end) {
  return arrayProto.slice.call(arrayLike, start, end);
}

function find(arrayLike, predicate) {
  return slice(arrayLike).filter(predicate)[0];
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, (name) => {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

function addClass(elm, classes) {
  toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
}

function append(parent, children) {
  forEach(children, parent.appendChild.bind(parent));
}

function before(nodes, ref) {
  forEach(nodes, (node) => {
    const parent = ref.parentNode;
    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}

function matches(elm, selector) {
  return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}

function children(parent, selector) {
  return parent ? slice(parent.children).filter((child) => matches(child, selector)) : [];
}

function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}

function forOwn(object, iteratee, right) {
  if (object) {
    let keys = Object.keys(object);
    keys = right ? keys.reverse() : keys;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }
  return object;
}

function assign(object) {
  slice(arguments, 1).forEach((source) => {
    forOwn(source, (value, key) => {
      object[key] = source[key];
    });
  });
  return object;
}

function merge(object, source) {
  forOwn(source, (value, key) => {
    if (isArray(value)) {
      object[key] = value.slice();
    } else if (isObject(value)) {
      object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
    } else {
      object[key] = value;
    }
  });
  return object;
}

function removeAttribute(elm, attrs) {
  if (elm) {
    forEach(attrs, (attr) => {
      elm.removeAttribute(attr);
    });
  }
}

function setAttribute(elm, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, (value2, name) => {
      setAttribute(elm, name, value2);
    });
  } else {
    isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
  }
}

function create(tag, attrs, parent) {
  const elm = document.createElement(tag);
  if (attrs) {
    isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
  }
  parent && append(parent, elm);
  return elm;
}

function style(elm, prop, value) {
  if (isUndefined(value)) {
    return getComputedStyle(elm)[prop];
  }
  if (!isNull(value)) {
    const { style: style2 } = elm;
    value = `${value}`;
    if (style2[prop] !== value) {
      style2[prop] = value;
    }
  }
}

function display(elm, display2) {
  style(elm, "display", display2);
}

function focus(elm) {
  elm["setActive"] && elm["setActive"]() || elm.focus({ preventScroll: true });
}

function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}

function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}

function rect(target) {
  return target.getBoundingClientRect();
}

function remove(nodes) {
  forEach(nodes, (node) => {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

function measure(parent, value) {
  if (isString(value)) {
    const div = create("div", { style: `width: ${value}; position: absolute;` }, parent);
    value = rect(div).width;
    remove(div);
  }
  return value;
}

function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}

function prevent(e, stopPropagation) {
  e.preventDefault();
  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}

function query(parent, selector) {
  return parent && parent.querySelector(selector);
}

function queryAll(parent, selector) {
  return slice(parent.querySelectorAll(selector));
}

function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}

function unit(value) {
  return isString(value) ? value : value ? `${value}px` : "";
}

function assert(condition, message = "") {
  if (!condition) {
    throw new Error(`[${PROJECT_CODE}] ${message}`);
  }
}

function nextTick(callback) {
  setTimeout(callback);
}

const noop = () => {
};

function raf(func) {
  return requestAnimationFrame(func);
}

const { min, max, floor, ceil, abs } = Math;

function approximatelyEqual(x, y, epsilon) {
  return abs(x - y) < epsilon;
}

function between(number, minOrMax, maxOrMin, exclusive) {
  const minimum = min(minOrMax, maxOrMin);
  const maximum = max(minOrMax, maxOrMin);
  return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
}

function clamp(number, x, y) {
  const minimum = min(x, y);
  const maximum = max(x, y);
  return min(max(minimum, number), maximum);
}

function sign(x) {
  return +(x > 0) - +(x < 0);
}

function camelToKebab(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function format(string, replacements) {
  forEach(replacements, (replacement) => {
    string = string.replace("%s", `${replacement}`);
  });
  return string;
}

function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

const ids = {};
function uniqueId(prefix) {
  return `${prefix}${pad(ids[prefix] = (ids[prefix] || 0) + 1)}`;
}

function EventBus() {
  let handlers = {};
  function on(events, callback, key, priority = DEFAULT_EVENT_PRIORITY) {
    forEachEvent(events, (event, namespace) => {
      handlers[event] = handlers[event] || [];
      push(handlers[event], {
        _event: event,
        _callback: callback,
        _namespace: namespace,
        _priority: priority,
        _key: key
      }).sort((handler1, handler2) => handler1._priority - handler2._priority);
    });
  }
  function off(events, key) {
    forEachEvent(events, (event, namespace) => {
      const eventHandlers = handlers[event];
      handlers[event] = eventHandlers && eventHandlers.filter((handler) => {
        return handler._key ? handler._key !== key : key || handler._namespace !== namespace;
      });
    });
  }
  function offBy(key) {
    forOwn(handlers, (eventHandlers, event) => {
      off(event, key);
    });
  }
  function emit(event) {
    (handlers[event] || []).forEach((handler) => {
      handler._callback.apply(handler, slice(arguments, 1));
    });
  }
  function destroy() {
    handlers = {};
  }
  function forEachEvent(events, iteratee) {
    toArray(events).join(" ").split(" ").forEach((eventNS) => {
      const fragments = eventNS.split(".");
      iteratee(fragments[0], fragments[1]);
    });
  }
  return {
    on,
    off,
    offBy,
    emit,
    destroy
  };
}

const EVENT_MOUNTED = "mounted";
const EVENT_READY = "ready";
const EVENT_MOVE = "move";
const EVENT_MOVED = "moved";
const EVENT_SHIFTED = "shifted";
const EVENT_CLICK = "click";
const EVENT_ACTIVE = "active";
const EVENT_INACTIVE = "inactive";
const EVENT_VISIBLE = "visible";
const EVENT_HIDDEN = "hidden";
const EVENT_SLIDE_KEYDOWN = "slide:keydown";
const EVENT_REFRESH = "refresh";
const EVENT_UPDATED = "updated";
const EVENT_RESIZE = "resize";
const EVENT_RESIZED = "resized";
const EVENT_REPOSITIONED = "repositioned";
const EVENT_DRAG = "drag";
const EVENT_DRAGGING = "dragging";
const EVENT_DRAGGED = "dragged";
const EVENT_SCROLL = "scroll";
const EVENT_SCROLLED = "scrolled";
const EVENT_DESTROY = "destroy";
const EVENT_ARROWS_MOUNTED = "arrows:mounted";
const EVENT_ARROWS_UPDATED = "arrows:updated";
const EVENT_PAGINATION_MOUNTED = "pagination:mounted";
const EVENT_PAGINATION_UPDATED = "pagination:updated";
const EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
const EVENT_AUTOPLAY_PLAY = "autoplay:play";
const EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
const EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
const EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

function EventInterface(Splide2) {
  const { event } = Splide2;
  const key = {};
  let listeners = [];
  function on(events, callback, priority) {
    event.on(events, callback, key, priority);
  }
  function off(events) {
    event.off(events, key);
  }
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, (target, event2) => {
      listeners.push([target, event2, callback, options]);
      target.addEventListener(event2, callback, options);
    });
  }
  function unbind(targets, events, callback) {
    forEachEvent(targets, events, (target, event2) => {
      listeners = listeners.filter((listener) => {
        if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
          target.removeEventListener(event2, listener[2], listener[3]);
          return false;
        }
        return true;
      });
    });
  }
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, (target) => {
      if (target) {
        events.split(" ").forEach(iteratee.bind(null, target));
      }
    });
  }
  function destroy() {
    listeners = listeners.filter((data) => unbind(data[0], data[1]));
    event.offBy(key);
  }
  event.on(EVENT_DESTROY, destroy, key);
  return {
    on,
    off,
    emit: event.emit,
    bind,
    unbind,
    destroy
  };
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  const { now } = Date;
  let startTime;
  let rate = 0;
  let id;
  let paused = true;
  let count = 0;
  function update() {
    if (!paused) {
      const elapsed = now() - startTime;
      if (elapsed >= interval) {
        rate = 1;
        startTime = now();
      } else {
        rate = elapsed / interval;
      }
      if (onUpdate) {
        onUpdate(rate);
      }
      if (rate === 1) {
        onInterval();
        if (limit && ++count >= limit) {
          return pause();
        }
      }
      raf(update);
    }
  }
  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }
  function pause() {
    paused = true;
  }
  function rewind() {
    startTime = now();
    rate = 0;
    if (onUpdate) {
      onUpdate(rate);
    }
  }
  function cancel() {
    cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }
  function set(time) {
    interval = time;
  }
  function isPaused() {
    return paused;
  }
  return {
    start,
    rewind,
    pause,
    cancel,
    set,
    isPaused
  };
}

function State(initialState) {
  let state = initialState;
  function set(value) {
    state = value;
  }
  function is(states) {
    return includes(toArray(states), state);
  }
  return { set, is };
}

function Throttle(func, duration) {
  let interval;
  function throttled() {
    if (!interval) {
      interval = RequestInterval(duration || 0, () => {
        func.apply(this, arguments);
        interval = null;
      }, null, 1);
      interval.start();
    }
  }
  return throttled;
}

function Options(Splide2, Components2, options) {
  const throttledObserve = Throttle(observe);
  let initialOptions;
  let points;
  let currPoint;
  function setup() {
    try {
      merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, e.message);
    }
    initialOptions = merge({}, options);
    const { breakpoints } = options;
    if (breakpoints) {
      const isMin = options.mediaQuery === "min";
      points = Object.keys(breakpoints).sort((n, m) => isMin ? +m - +n : +n - +m).map((point) => [
        point,
        matchMedia(`(${isMin ? "min" : "max"}-width:${point}px)`)
      ]);
      observe();
    }
  }
  function mount() {
    if (points) {
      addEventListener("resize", throttledObserve);
    }
  }
  function destroy(completely) {
    if (completely) {
      removeEventListener("resize", throttledObserve);
    }
  }
  function observe() {
    const item = find(points, (item2) => item2[1].matches) || [];
    if (item[0] !== currPoint) {
      onMatch(currPoint = item[0]);
    }
  }
  function onMatch(point) {
    const newOptions = options.breakpoints[point] || initialOptions;
    if (newOptions.destroy) {
      Splide2.options = initialOptions;
      Splide2.destroy(newOptions.destroy === "completely");
    } else {
      if (Splide2.state.is(DESTROYED)) {
        destroy(true);
        Splide2.mount();
      }
      Splide2.options = newOptions;
    }
  }
  return {
    setup,
    mount,
    destroy
  };
}

const RTL = "rtl";
const TTB = "ttb";

const ORIENTATION_MAP = {
  marginRight: ["marginBottom", "marginLeft"],
  autoWidth: ["autoHeight"],
  fixedWidth: ["fixedHeight"],
  paddingLeft: ["paddingTop", "paddingRight"],
  paddingRight: ["paddingBottom", "paddingLeft"],
  width: ["height"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  Y: ["X"],
  ArrowLeft: ["ArrowUp", "ArrowRight"],
  ArrowRight: ["ArrowDown", "ArrowLeft"]
};
function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly) {
    const { direction } = options;
    const index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop][index] || prop;
  }
  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }
  return {
    resolve,
    orient
  };
}

const CLASS_ROOT = PROJECT_CODE;
const CLASS_SLIDER = `${PROJECT_CODE}__slider`;
const CLASS_TRACK = `${PROJECT_CODE}__track`;
const CLASS_LIST = `${PROJECT_CODE}__list`;
const CLASS_SLIDE = `${PROJECT_CODE}__slide`;
const CLASS_CLONE = `${CLASS_SLIDE}--clone`;
const CLASS_CONTAINER = `${CLASS_SLIDE}__container`;
const CLASS_ARROWS = `${PROJECT_CODE}__arrows`;
const CLASS_ARROW = `${PROJECT_CODE}__arrow`;
const CLASS_ARROW_PREV = `${CLASS_ARROW}--prev`;
const CLASS_ARROW_NEXT = `${CLASS_ARROW}--next`;
const CLASS_PAGINATION = `${PROJECT_CODE}__pagination`;
const CLASS_PAGINATION_PAGE = `${CLASS_PAGINATION}__page`;
const CLASS_PROGRESS = `${PROJECT_CODE}__progress`;
const CLASS_PROGRESS_BAR = `${CLASS_PROGRESS}__bar`;
const CLASS_AUTOPLAY = `${PROJECT_CODE}__autoplay`;
const CLASS_PLAY = `${PROJECT_CODE}__play`;
const CLASS_PAUSE = `${PROJECT_CODE}__pause`;
const CLASS_SPINNER = `${PROJECT_CODE}__spinner`;
const CLASS_INITIALIZED = "is-initialized";
const CLASS_ACTIVE = "is-active";
const CLASS_PREV = "is-prev";
const CLASS_NEXT = "is-next";
const CLASS_VISIBLE = "is-visible";
const CLASS_LOADING = "is-loading";
const STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
const CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};

function Elements(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { root } = Splide2;
  const elements = {};
  const slides = [];
  let classes;
  let slider;
  let track;
  let list;
  function setup() {
    collect();
    identify();
    addClass(root, classes = getClasses());
  }
  function mount() {
    on(EVENT_REFRESH, refresh, DEFAULT_EVENT_PRIORITY - 2);
    on(EVENT_UPDATED, update);
  }
  function destroy() {
    [root, track, list].forEach((elm) => {
      removeAttribute(elm, "style");
    });
    empty(slides);
    removeClass(root, classes);
  }
  function refresh() {
    destroy();
    setup();
  }
  function update() {
    removeClass(root, classes);
    addClass(root, classes = getClasses());
  }
  function collect() {
    slider = child(root, `.${CLASS_SLIDER}`);
    track = query(root, `.${CLASS_TRACK}`);
    list = child(track, `.${CLASS_LIST}`);
    assert(track && list, "A track/list element is missing.");
    push(slides, children(list, `.${CLASS_SLIDE}:not(.${CLASS_CLONE})`));
    const autoplay = find(`.${CLASS_AUTOPLAY}`);
    const arrows = find(`.${CLASS_ARROWS}`);
    assign(elements, {
      root,
      slider,
      track,
      list,
      slides,
      arrows,
      autoplay,
      prev: query(arrows, `.${CLASS_ARROW_PREV}`),
      next: query(arrows, `.${CLASS_ARROW_NEXT}`),
      bar: query(find(`.${CLASS_PROGRESS}`), `.${CLASS_PROGRESS_BAR}`),
      play: query(autoplay, `.${CLASS_PLAY}`),
      pause: query(autoplay, `.${CLASS_PAUSE}`)
    });
  }
  function identify() {
    const id = root.id || uniqueId(PROJECT_CODE);
    root.id = id;
    track.id = track.id || `${id}-track`;
    list.id = list.id || `${id}-list`;
  }
  function find(selector) {
    return child(root, selector) || child(slider, selector);
  }
  function getClasses() {
    return [
      `${CLASS_ROOT}--${options.type}`,
      `${CLASS_ROOT}--${options.direction}`,
      options.drag && `${CLASS_ROOT}--draggable`,
      options.isNavigation && `${CLASS_ROOT}--nav`,
      CLASS_ACTIVE
    ];
  }
  return assign(elements, {
    setup,
    mount,
    destroy
  });
}

const ROLE = "role";
const ARIA_CONTROLS = "aria-controls";
const ARIA_CURRENT = "aria-current";
const ARIA_LABEL = "aria-label";
const ARIA_HIDDEN = "aria-hidden";
const TAB_INDEX = "tabindex";
const DISABLED = "disabled";
const ARIA_ORIENTATION = "aria-orientation";
const ALL_ATTRIBUTES = [
  ROLE,
  ARIA_CONTROLS,
  ARIA_CURRENT,
  ARIA_LABEL,
  ARIA_HIDDEN,
  ARIA_ORIENTATION,
  TAB_INDEX,
  DISABLED
];

const SLIDE = "slide";
const LOOP = "loop";
const FADE = "fade";

function Slide$1(Splide2, index, slideIndex, slide) {
  const { on, emit, bind, destroy: destroyEvents } = EventInterface(Splide2);
  const { Components, root, options } = Splide2;
  const { isNavigation, updateOnMove } = options;
  const { resolve } = Components.Direction;
  const styles = getAttribute(slide, "style");
  const isClone = slideIndex > -1;
  const container = child(slide, `.${CLASS_CONTAINER}`);
  const focusableNodes = options.focusableNodes && queryAll(slide, options.focusableNodes);
  let destroyed;
  function mount() {
    if (!isClone) {
      slide.id = `${root.id}-slide${pad(index + 1)}`;
    }
    bind(slide, "click keydown", (e) => {
      emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, self, e);
    });
    on([EVENT_REFRESH, EVENT_REPOSITIONED, EVENT_SHIFTED, EVENT_MOVED, EVENT_SCROLLED], update);
    on(EVENT_NAVIGATION_MOUNTED, initNavigation);
    if (updateOnMove) {
      on(EVENT_MOVE, onMove);
    }
  }
  function destroy() {
    destroyed = true;
    destroyEvents();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
    setAttribute(slide, "style", styles);
  }
  function initNavigation() {
    const idx = isClone ? slideIndex : index;
    const label = format(options.i18n.slideX, idx + 1);
    const controls = Splide2.splides.map((target) => target.splide.root.id).join(" ");
    setAttribute(slide, ARIA_LABEL, label);
    setAttribute(slide, ARIA_CONTROLS, controls);
    setAttribute(slide, ROLE, "menuitem");
    updateActivity(isActive());
  }
  function onMove() {
    if (!destroyed) {
      update();
    }
  }
  function update() {
    if (!destroyed) {
      const { index: currIndex } = Splide2;
      updateActivity(isActive());
      updateVisibility(isVisible());
      toggleClass(slide, CLASS_PREV, index === currIndex - 1);
      toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
    }
  }
  function updateActivity(active) {
    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      if (isNavigation) {
        setAttribute(slide, ARIA_CURRENT, active || null);
      }
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
    }
  }
  function updateVisibility(visible) {
    const hidden = !visible && (!isActive() || isClone);
    setAttribute(slide, ARIA_HIDDEN, hidden || null);
    setAttribute(slide, TAB_INDEX, !hidden && options.slideFocus ? 0 : null);
    if (focusableNodes) {
      focusableNodes.forEach((node) => {
        setAttribute(node, TAB_INDEX, hidden ? -1 : null);
      });
    }
    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
    }
  }
  function style$1(prop, value, useContainer) {
    style(useContainer && container || slide, prop, value);
  }
  function isActive() {
    const { index: curr } = Splide2;
    return curr === index || options.cloneStatus && curr === slideIndex;
  }
  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }
    const trackRect = rect(Components.Elements.track);
    const slideRect = rect(slide);
    const left = resolve("left");
    const right = resolve("right");
    return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
  }
  function isWithin(from, distance) {
    let diff = abs(from - index);
    if (!isClone && (options.rewind || Splide2.is(LOOP))) {
      diff = min(diff, Splide2.length - diff);
    }
    return diff <= distance;
  }
  const self = {
    index,
    slideIndex,
    slide,
    container,
    isClone,
    mount,
    destroy,
    update,
    style: style$1,
    isWithin
  };
  return self;
}

function Slides(Splide2, Components2, options) {
  const { on, emit, bind } = EventInterface(Splide2);
  const { slides, list } = Components2.Elements;
  const Slides2 = [];
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
    on([EVENT_MOUNTED, EVENT_REFRESH], () => {
      Slides2.sort((Slide1, Slide2) => Slide1.index - Slide2.index);
    });
  }
  function init() {
    slides.forEach((slide, index) => {
      register(slide, index, -1);
    });
  }
  function destroy() {
    forEach$1((Slide2) => {
      Slide2.destroy();
    });
    empty(Slides2);
  }
  function refresh() {
    destroy();
    init();
  }
  function update() {
    forEach$1((Slide2) => {
      Slide2.update();
    });
  }
  function register(slide, index, slideIndex) {
    const object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
  }
  function get(excludeClones) {
    return excludeClones ? filter((Slide2) => !Slide2.isClone) : Slides2;
  }
  function getIn(page) {
    const { Controller } = Components2;
    const index = Controller.toIndex(page);
    const max = Controller.hasFocus() ? 1 : options.perPage;
    return filter((Slide2) => between(Slide2.index, index, index + max - 1));
  }
  function getAt(index) {
    return filter(index)[0];
  }
  function add(items, index) {
    forEach(items, (slide) => {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }
      if (isHTMLElement(slide)) {
        const ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, emit.bind(null, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }
  function remove$1(matcher) {
    remove(filter(matcher).map((Slide2) => Slide2.slide));
    emit(EVENT_REFRESH);
  }
  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }
  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : (Slide2) => isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index));
  }
  function style(prop, value, useContainer) {
    forEach$1((Slide2) => {
      Slide2.style(prop, value, useContainer);
    });
  }
  function observeImages(elm, callback) {
    const images = queryAll(elm, "img");
    let { length } = images;
    if (length) {
      images.forEach((img) => {
        bind(img, "load error", () => {
          if (!--length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }
  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }
  function isEnough() {
    return Slides2.length > options.perPage;
  }
  return {
    mount,
    destroy,
    update,
    register,
    get,
    getIn,
    getAt,
    add,
    remove: remove$1,
    forEach: forEach$1,
    filter,
    style,
    getLength,
    isEnough
  };
}

function Layout(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { Slides } = Components2;
  const { resolve } = Components2.Direction;
  const { root, track, list } = Components2.Elements;
  const { getAt } = Slides;
  let vertical;
  let rootRect;
  function mount() {
    init();
    bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_RESIZE, resize);
  }
  function init() {
    rootRect = null;
    vertical = options.direction === TTB;
    style(root, "maxWidth", unit(options.width));
    style(track, resolve("paddingLeft"), cssPadding(false));
    style(track, resolve("paddingRight"), cssPadding(true));
    resize();
  }
  function resize() {
    const newRect = rect(root);
    if (!rootRect || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
      style(track, "height", cssTrackHeight());
      Slides.style(resolve("marginRight"), unit(options.gap));
      Slides.style("width", cssSlideWidth() || null);
      setSlidesHeight();
      rootRect = newRect;
      emit(EVENT_RESIZED);
    }
  }
  function setSlidesHeight() {
    Slides.style("height", cssSlideHeight() || null, true);
  }
  function cssPadding(right) {
    const { padding } = options;
    const prop = resolve(right ? "right" : "left");
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  function cssTrackHeight() {
    let height = "";
    if (vertical) {
      height = cssHeight();
      assert(height, "height or heightRatio is missing.");
      height = `calc(${height} - ${cssPadding(false)} - ${cssPadding(true)})`;
    }
    return height;
  }
  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }
  function cssSlideWidth() {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }
  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
  }
  function cssSlideSize() {
    const gap = unit(options.gap);
    return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
  }
  function listSize() {
    return rect(list)[resolve("width")];
  }
  function slideSize(index, withoutGap) {
    const Slide = getAt(index || 0);
    return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }
  function totalSize(index, withoutGap) {
    const Slide = getAt(index);
    if (Slide) {
      const right = rect(Slide.slide)[resolve("right")];
      const left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }
    return 0;
  }
  function sliderSize() {
    return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
  }
  function getGap() {
    const Slide = getAt(0);
    return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
  }
  function getPadding(right) {
    return parseFloat(style(track, resolve(`padding${right ? "Right" : "Left"}`))) || 0;
  }
  return {
    mount,
    listSize,
    slideSize,
    sliderSize,
    totalSize,
    getPadding
  };
}

function Clones(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Elements, Slides } = Components2;
  const { resolve } = Components2.Direction;
  const clones = [];
  let cloneCount;
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
  }
  function init() {
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
      emit(EVENT_RESIZE);
    }
  }
  function destroy() {
    remove(clones);
    empty(clones);
  }
  function refresh() {
    destroy();
    init();
  }
  function observe() {
    if (cloneCount < computeCloneCount()) {
      emit(EVENT_REFRESH);
    }
  }
  function generate(count) {
    const slides = Slides.get().slice();
    const { length } = slides;
    if (length) {
      while (slides.length < count) {
        push(slides, slides);
      }
      push(slides.slice(-count), slides.slice(0, count)).forEach((Slide, index) => {
        const isHead = index < count;
        const clone = cloneDeep(Slide.slide, index);
        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
        push(clones, clone);
        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
      });
    }
  }
  function cloneDeep(elm, index) {
    const clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = `${Splide2.root.id}-clone${pad(index + 1)}`;
    return clone;
  }
  function computeCloneCount() {
    let { clones: clones2 } = options;
    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (!clones2) {
      const fixedSize = measure(Elements.list, options[resolve("fixedWidth")]);
      const fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
      const baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
      clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
    }
    return clones2;
  }
  return {
    mount,
    destroy
  };
}

function Move(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { slideSize, getPadding, totalSize, listSize, sliderSize } = Components2.Layout;
  const { resolve, orient } = Components2.Direction;
  const { list, track } = Components2.Elements;
  let Transition;
  function mount() {
    Transition = Components2.Transition;
    on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }
  function destroy() {
    removeAttribute(list, "style");
  }
  function reposition() {
    if (!isBusy()) {
      Components2.Scroll.cancel();
      jump(Splide2.index);
      emit(EVENT_REPOSITIONED);
    }
  }
  function move(dest, index, prev, callback) {
    if (!isBusy()) {
      const { set } = Splide2.state;
      const position = getPosition();
      if (dest !== index) {
        Transition.cancel();
        translate(shift(position, dest > index), true);
      }
      set(MOVING);
      emit(EVENT_MOVE, index, prev, dest);
      Transition.start(index, () => {
        set(IDLE);
        emit(EVENT_MOVED, index, prev, dest);
        if (options.trimSpace === "move" && dest !== prev && position === getPosition()) {
          Components2.Controller.go(dest > prev ? ">" : "<", false, callback);
        } else {
          callback && callback();
        }
      });
    }
  }
  function jump(index) {
    translate(toPosition(index, true));
  }
  function translate(position, preventLoop) {
    if (!Splide2.is(FADE)) {
      const destination = preventLoop ? position : loop(position);
      list.style.transform = `translate${resolve("X")}(${destination}px)`;
      position !== destination && emit(EVENT_SHIFTED);
    }
  }
  function loop(position) {
    if (Splide2.is(LOOP)) {
      const diff = orient(position - getPosition());
      const exceededMin = exceededLimit(false, position) && diff < 0;
      const exceededMax = exceededLimit(true, position) && diff > 0;
      if (exceededMin || exceededMax) {
        position = shift(position, exceededMax);
      }
    }
    return position;
  }
  function shift(position, backwards) {
    const excess = position - getLimit(backwards);
    const size = sliderSize();
    position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
    return position;
  }
  function cancel() {
    translate(getPosition());
    Transition.cancel();
  }
  function toIndex(position) {
    const Slides = Components2.Slides.get();
    let index = 0;
    let minDistance = Infinity;
    for (let i = 0; i < Slides.length; i++) {
      const slideIndex = Slides[i].index;
      const distance = abs(toPosition(slideIndex, true) - position);
      if (distance <= minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }
    return index;
  }
  function toPosition(index, trimming) {
    const position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }
  function getPosition() {
    const left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }
  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize() - listSize()));
    }
    return position;
  }
  function offset(index) {
    const { focus } = options;
    return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
  }
  function getLimit(max) {
    return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
  }
  function isBusy() {
    return Splide2.state.is(MOVING) && options.waitForTransition;
  }
  function exceededLimit(max, position) {
    position = isUndefined(position) ? getPosition() : position;
    const exceededMin = max !== true && orient(position) < orient(getLimit(false));
    const exceededMax = max !== false && orient(position) > orient(getLimit(true));
    return exceededMin || exceededMax;
  }
  return {
    mount,
    destroy,
    move,
    jump,
    translate,
    shift,
    cancel,
    toIndex,
    toPosition,
    getPosition,
    getLimit,
    isBusy,
    exceededLimit
  };
}

function Controller(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { Move } = Components2;
  const { getPosition, getLimit } = Move;
  const { isEnough, getLength } = Components2.Slides;
  const isLoop = Splide2.is(LOOP);
  const isSlide = Splide2.is(SLIDE);
  let currIndex = options.start || 0;
  let prevIndex = currIndex;
  let slideCount;
  let perMove;
  let perPage;
  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init, DEFAULT_EVENT_PRIORITY - 1);
  }
  function init() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    currIndex = clamp(currIndex, 0, slideCount - 1);
  }
  function go(control, allowSameIndex, callback) {
    const dest = parse(control);
    if (options.useScroll) {
      scroll(dest, true, true, options.speed, callback);
    } else {
      const index = loop(dest);
      if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
        setIndex(index);
        Move.move(dest, index, prevIndex, callback);
      }
    }
  }
  function scroll(destination, useIndex, snap, duration, callback) {
    const dest = useIndex ? destination : toDest(destination);
    Components2.Scroll.scroll(useIndex || snap ? Move.toPosition(dest, true) : destination, duration, () => {
      setIndex(Move.toIndex(Move.getPosition()));
      callback && callback();
    });
  }
  function parse(control) {
    let index = currIndex;
    if (isString(control)) {
      const [, indicator, number] = control.match(/([+\-<>])(\d+)?/) || [];
      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +`${indicator}${+number || 1}`, currIndex, true);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      index = isLoop ? control : clamp(control, 0, getEnd());
    }
    return index;
  }
  function getNext(destination) {
    return getAdjacent(false, destination);
  }
  function getPrev(destination) {
    return getAdjacent(true, destination);
  }
  function getAdjacent(prev, destination) {
    const number = perMove || (hasFocus() ? 1 : perPage);
    const dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex);
    if (dest === -1 && isSlide) {
      if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
        return prev ? 0 : getEnd();
      }
    }
    return destination ? dest : loop(dest);
  }
  function computeDestIndex(dest, from, incremental) {
    if (isEnough()) {
      const end = getEnd();
      if (dest < 0 || dest > end) {
        if (between(0, dest, from, true) || between(end, from, dest, true)) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = perMove || hasFocus() ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
          } else if (options.rewind) {
            dest = dest < 0 ? end : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (!incremental && dest !== from) {
          dest = perMove ? dest : toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }
    return dest;
  }
  function getEnd() {
    let end = slideCount - perPage;
    if (hasFocus() || isLoop && perMove) {
      end = slideCount - 1;
    }
    return max(end, 0);
  }
  function loop(index) {
    if (isLoop) {
      return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
    }
    return index;
  }
  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
  }
  function toPage(index) {
    if (!hasFocus()) {
      index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
      index = floor(index / perPage);
    }
    return index;
  }
  function toDest(destination) {
    const closest = Move.toIndex(destination);
    return isSlide ? clamp(closest, 0, getEnd()) : closest;
  }
  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }
  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }
  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }
  return {
    mount,
    go,
    scroll,
    getNext,
    getPrev,
    getAdjacent,
    getEnd,
    setIndex,
    getIndex,
    toIndex,
    toPage,
    toDest,
    hasFocus
  };
}

const XML_NAME_SPACE = "http://www.w3.org/2000/svg";
const PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
const SIZE = 40;

function Arrows(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { classes, i18n } = options;
  const { Elements, Controller } = Components2;
  let wrapper = Elements.arrows;
  let prev = Elements.prev;
  let next = Elements.next;
  let created;
  const arrows = {};
  function mount() {
    init();
    on(EVENT_UPDATED, init);
  }
  function init() {
    if (options.arrows) {
      if (!prev || !next) {
        createArrows();
      }
    }
    if (prev && next) {
      if (!arrows.prev) {
        const { id } = Elements.track;
        setAttribute(prev, ARIA_CONTROLS, id);
        setAttribute(next, ARIA_CONTROLS, id);
        arrows.prev = prev;
        arrows.next = next;
        listen();
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      } else {
        display(wrapper, options.arrows === false ? "none" : "");
      }
    }
  }
  function destroy() {
    if (created) {
      remove(wrapper);
    } else {
      removeAttribute(prev, ALL_ATTRIBUTES);
      removeAttribute(next, ALL_ATTRIBUTES);
    }
  }
  function listen() {
    const { go } = Controller;
    on([EVENT_MOUNTED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
    bind(next, "click", () => {
      go(">", true);
    });
    bind(prev, "click", () => {
      go("<", true);
    });
  }
  function createArrows() {
    wrapper = create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    before(wrapper, child(options.arrows === "slider" && Elements.slider || Splide2.root));
  }
  function createArrow(prev2) {
    const arrow = `<button class="${classes.arrow} ${prev2 ? classes.prev : classes.next}" type="button"><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${options.arrowPath || PATH}" />`;
    return parseHtml(arrow);
  }
  function update() {
    const index = Splide2.index;
    const prevIndex = Controller.getPrev();
    const nextIndex = Controller.getNext();
    const prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
    const nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
    prev.disabled = prevIndex < 0;
    next.disabled = nextIndex < 0;
    setAttribute(prev, ARIA_LABEL, prevLabel);
    setAttribute(next, ARIA_LABEL, nextLabel);
    emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
  }
  return {
    arrows,
    mount,
    destroy
  };
}

const INTERVAL_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-interval`;

function Autoplay(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
  const { isPaused } = interval;
  const { Elements } = Components2;
  let hovered;
  let focused;
  let paused;
  function mount() {
    const { autoplay } = options;
    if (autoplay) {
      initButton(true);
      initButton(false);
      listen();
      if (autoplay !== "pause") {
        play();
      }
    }
  }
  function initButton(forPause) {
    const prop = forPause ? "pause" : "play";
    const button = Elements[prop];
    if (button) {
      setAttribute(button, ARIA_CONTROLS, Elements.track.id);
      setAttribute(button, ARIA_LABEL, options.i18n[prop]);
      bind(button, "click", forPause ? pause : play);
    }
  }
  function listen() {
    const { root } = Elements;
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", (e) => {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }
    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", (e) => {
        focused = e.type === "focusin";
        autoToggle();
      });
    }
    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    on(EVENT_MOVE, updateInterval);
  }
  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = hovered = paused = false;
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }
  function pause(manual = true) {
    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
    paused = manual;
  }
  function autoToggle() {
    if (!paused) {
      if (!hovered && !focused) {
        play();
      } else {
        pause(false);
      }
    }
  }
  function update(rate) {
    const { bar } = Elements;
    bar && style(bar, "width", `${rate * 100}%`);
    emit(EVENT_AUTOPLAY_PLAYING, rate);
  }
  function updateInterval() {
    const Slide = Components2.Slides.getAt(Splide2.index);
    interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
  }
  return {
    mount,
    destroy: interval.cancel,
    play,
    pause,
    isPaused
  };
}

function Cover(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, (img, Slide) => {
        toggle(true, img, Slide);
      });
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
    }
  }
  function destroy() {
    apply(false);
  }
  function apply(cover) {
    Components2.Slides.forEach((Slide) => {
      const img = child(Slide.container || Slide.slide, "img");
      if (img && img.src) {
        toggle(cover, img, Slide);
      }
    });
  }
  function toggle(cover, img, Slide) {
    Slide.style("background", cover ? `center/cover no-repeat url("${img.src}")` : "", true);
    display(img, cover ? "none" : "");
  }
  return {
    mount,
    destroy
  };
}

const BOUNCE_DIFF_THRESHOLD = 10;
const BOUNCE_DURATION = 600;
const FRICTION_FACTOR = 0.6;
const BASE_VELOCITY = 1.5;
const MIN_DURATION = 800;

function Scroll(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Move } = Components2;
  const { getPosition, getLimit, exceededLimit } = Move;
  let interval;
  let scrollCallback;
  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }
  function scroll(destination, duration, callback, suppressConstraint) {
    const start = getPosition();
    let friction = 1;
    duration = duration || computeDuration(abs(destination - start));
    scrollCallback = callback;
    clear();
    interval = RequestInterval(duration, onScrolled, (rate) => {
      const position = getPosition();
      const target = start + (destination - start) * easing(rate);
      const diff = (target - getPosition()) * friction;
      Move.translate(position + diff);
      if (Splide2.is(SLIDE) && !suppressConstraint && exceededLimit()) {
        friction *= FRICTION_FACTOR;
        if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
          bounce(exceededLimit(false));
        }
      }
    }, 1);
    emit(EVENT_SCROLL);
    interval.start();
  }
  function bounce(backwards) {
    scroll(getLimit(!backwards), BOUNCE_DURATION, null, true);
  }
  function onScrolled() {
    const position = getPosition();
    const index = Move.toIndex(position);
    if (!between(index, 0, Splide2.length - 1)) {
      Move.translate(Move.shift(position, index > 0), true);
    }
    scrollCallback && scrollCallback();
    emit(EVENT_SCROLLED);
  }
  function computeDuration(distance) {
    return max(distance / BASE_VELOCITY, MIN_DURATION);
  }
  function clear() {
    if (interval) {
      interval.cancel();
    }
  }
  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onScrolled();
    }
  }
  function easing(t) {
    const { easingFunc } = options;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }
  return {
    mount,
    destroy: clear,
    scroll,
    cancel
  };
}

const SCROLL_LISTENER_OPTIONS = { passive: false, capture: true };

const FRICTION = 5;
const LOG_INTERVAL = 200;
const POINTER_DOWN_EVENTS = "touchstart mousedown";
const POINTER_MOVE_EVENTS = "touchmove mousemove";
const POINTER_UP_EVENTS = "touchend touchcancel mouseup";

function Drag(Splide2, Components2, options) {
  const { on, emit, bind, unbind } = EventInterface(Splide2);
  const { Move, Scroll, Controller } = Components2;
  const { track } = Components2.Elements;
  const { resolve, orient } = Components2.Direction;
  const { getPosition, exceededLimit } = Move;
  let basePosition;
  let baseEvent;
  let prevBaseEvent;
  let lastEvent;
  let isFree;
  let dragging;
  let hasExceeded = false;
  let clickPrevented;
  let disabled;
  let target;
  function mount() {
    bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
    bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
    bind(track, "click", onClick, { capture: true });
    bind(track, "dragstart", prevent);
    on([EVENT_MOUNTED, EVENT_UPDATED], init);
  }
  function init() {
    const { drag } = options;
    disable(!drag);
    isFree = drag === "free";
  }
  function onPointerDown(e) {
    if (!disabled) {
      const { noDrag } = options;
      const isTouch = isTouchEvent(e);
      const isDraggable = !noDrag || !matches(e.target, noDrag);
      clickPrevented = false;
      if (isDraggable && (isTouch || !e.button)) {
        if (!Move.isBusy()) {
          target = isTouch ? track : window;
          prevBaseEvent = null;
          lastEvent = null;
          bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
          bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
          Move.cancel();
          Scroll.cancel();
          save(e);
        } else {
          prevent(e, true);
        }
      }
    }
  }
  function onPointerMove(e) {
    if (!lastEvent) {
      emit(EVENT_DRAG);
    }
    lastEvent = e;
    if (e.cancelable) {
      const diff = coordOf(e) - coordOf(baseEvent);
      if (dragging) {
        Move.translate(basePosition + constrain(diff));
        const expired = timeOf(e) - timeOf(baseEvent) > LOG_INTERVAL;
        const exceeded = hasExceeded !== (hasExceeded = exceededLimit());
        if (expired || exceeded) {
          save(e);
        }
        emit(EVENT_DRAGGING);
        clickPrevented = true;
        prevent(e);
      } else {
        let { dragMinThreshold: thresholds } = options;
        thresholds = isObject(thresholds) ? thresholds : { mouse: 0, touch: +thresholds || 10 };
        dragging = abs(diff) > (isTouchEvent(e) ? thresholds.touch : thresholds.mouse);
        if (isSliderDirection()) {
          prevent(e);
        }
      }
    }
  }
  function onPointerUp(e) {
    unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
    unbind(target, POINTER_UP_EVENTS, onPointerUp);
    const { index } = Splide2;
    if (lastEvent) {
      if (dragging || e.cancelable && isSliderDirection()) {
        const velocity = computeVelocity(e);
        const destination = computeDestination(velocity);
        if (isFree) {
          Controller.scroll(destination);
        } else if (Splide2.is(FADE)) {
          Controller.go(index + orient(sign(velocity)));
        } else {
          Controller.go(Controller.toDest(destination), true);
        }
        prevent(e);
      }
      emit(EVENT_DRAGGED);
    } else {
      if (!isFree && getPosition() !== Move.toPosition(index)) {
        Controller.go(index, true);
      }
    }
    dragging = false;
  }
  function save(e) {
    prevBaseEvent = baseEvent;
    baseEvent = e;
    basePosition = getPosition();
  }
  function onClick(e) {
    if (!disabled && clickPrevented) {
      prevent(e, true);
    }
  }
  function isSliderDirection() {
    const diffX = abs(coordOf(lastEvent) - coordOf(baseEvent));
    const diffY = abs(coordOf(lastEvent, true) - coordOf(baseEvent, true));
    return diffX > diffY;
  }
  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !hasExceeded) {
      const base = baseEvent === lastEvent && prevBaseEvent || baseEvent;
      const diffCoord = coordOf(lastEvent) - coordOf(base);
      const diffTime = timeOf(e) - timeOf(base);
      const isFlick = timeOf(e) - timeOf(lastEvent) < LOG_INTERVAL;
      if (diffTime && isFlick) {
        return diffCoord / diffTime;
      }
    }
    return 0;
  }
  function computeDestination(velocity) {
    return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
  }
  function coordOf(e, orthogonal) {
    return (isTouchEvent(e) ? e.touches[0] : e)[`page${resolve(orthogonal ? "Y" : "X")}`];
  }
  function timeOf(e) {
    return e.timeStamp;
  }
  function constrain(diff) {
    return diff / (hasExceeded && Splide2.is(SLIDE) ? FRICTION : 1);
  }
  function isTouchEvent(e) {
    return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
  }
  function isDragging() {
    return dragging;
  }
  function disable(value) {
    disabled = value;
  }
  return {
    mount,
    disable,
    isDragging
  };
}

const IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];
const KEYBOARD_EVENT = "keydown";
function Keyboard(Splide2, Components2, options) {
  const { on, bind, unbind } = EventInterface(Splide2);
  const { root } = Splide2;
  const { resolve } = Components2.Direction;
  let target;
  let disabled;
  function mount() {
    init();
    on(EVENT_UPDATED, onUpdated);
    on(EVENT_MOVE, onMove);
  }
  function init() {
    const { keyboard } = options;
    if (keyboard) {
      if (keyboard === "focused") {
        target = root;
        setAttribute(root, TAB_INDEX, 0);
      } else {
        target = window;
      }
      bind(target, KEYBOARD_EVENT, onKeydown);
    }
  }
  function destroy() {
    unbind(target, KEYBOARD_EVENT);
    if (isHTMLElement(target)) {
      removeAttribute(target, TAB_INDEX);
    }
  }
  function disable(value) {
    disabled = value;
  }
  function onMove() {
    const _disabled = disabled;
    disabled = true;
    nextTick(() => {
      disabled = _disabled;
    });
  }
  function onUpdated() {
    destroy();
    init();
  }
  function onKeydown(e) {
    if (!disabled) {
      const { key } = e;
      const normalizedKey = includes(IE_ARROW_KEYS, key) ? `Arrow${key}` : key;
      if (normalizedKey === resolve("ArrowLeft")) {
        Splide2.go("<");
      } else if (normalizedKey === resolve("ArrowRight")) {
        Splide2.go(">");
      }
    }
  }
  return {
    mount,
    destroy,
    disable
  };
}

const SRC_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-lazy`;
const SRCSET_DATA_ATTRIBUTE = `${SRC_DATA_ATTRIBUTE}-srcset`;
const IMAGE_SELECTOR = `[${SRC_DATA_ATTRIBUTE}], [${SRCSET_DATA_ATTRIBUTE}]`;

function LazyLoad(Splide2, Components2, options) {
  const { on, off, bind, emit } = EventInterface(Splide2);
  const isSequential = options.lazyLoad === "sequential";
  let images = [];
  let index = 0;
  function mount() {
    if (options.lazyLoad) {
      init();
      on(EVENT_REFRESH, refresh);
      if (!isSequential) {
        on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED, EVENT_SCROLLED], observe);
      }
    }
  }
  function refresh() {
    destroy();
    init();
  }
  function init() {
    Components2.Slides.forEach((_Slide) => {
      queryAll(_Slide.slide, IMAGE_SELECTOR).forEach((_img) => {
        const src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
        const srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);
        if (src !== _img.src || srcset !== _img.srcset) {
          const className = options.classes.spinner;
          const parent = _img.parentElement;
          const _spinner = child(parent, `.${className}`) || create("span", className, parent);
          setAttribute(_spinner, ROLE, "presentation");
          images.push({ _img, _Slide, src, srcset, _spinner });
          !_img.src && display(_img, "none");
        }
      });
    });
    if (isSequential) {
      loadNext();
    }
  }
  function destroy() {
    index = 0;
    images = [];
  }
  function observe() {
    images = images.filter((data) => {
      const distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
      if (data._Slide.isWithin(Splide2.index, distance)) {
        return load(data);
      }
      return true;
    });
    if (!images.length) {
      off(EVENT_MOVED);
    }
  }
  function load(data) {
    const { _img } = data;
    addClass(data._Slide.slide, CLASS_LOADING);
    bind(_img, "load error", (e) => {
      onLoad(data, e.type === "error");
    });
    ["srcset", "src"].forEach((name) => {
      if (data[name]) {
        setAttribute(_img, name, data[name]);
        removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
      }
    });
  }
  function onLoad(data, error) {
    const { _Slide } = data;
    removeClass(_Slide.slide, CLASS_LOADING);
    if (!error) {
      remove(data._spinner);
      display(data._img, "");
      emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
      emit(EVENT_RESIZE);
    }
    if (isSequential) {
      loadNext();
    }
  }
  function loadNext() {
    if (index < images.length) {
      load(images[index++]);
    }
  }
  return {
    mount,
    destroy
  };
}

function Pagination(Splide2, Components2, options) {
  const { on, emit, bind, unbind } = EventInterface(Splide2);
  const { Slides, Elements, Controller } = Components2;
  const { hasFocus, getIndex } = Controller;
  const items = [];
  let list;
  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on([EVENT_MOVE, EVENT_SCROLLED], update);
  }
  function init() {
    destroy();
    if (options.pagination && Slides.isEnough()) {
      createPagination();
      emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
      update();
    }
  }
  function destroy() {
    if (list) {
      remove(list);
      items.forEach((item) => {
        unbind(item.button, "click");
      });
      empty(items);
      list = null;
    }
  }
  function createPagination() {
    const { length } = Splide2;
    const { classes, i18n, perPage } = options;
    const parent = options.pagination === "slider" && Elements.slider || Elements.root;
    const max = hasFocus() ? length : ceil(length / perPage);
    list = create("ul", classes.pagination, parent);
    for (let i = 0; i < max; i++) {
      const li = create("li", null, list);
      const button = create("button", { class: classes.page, type: "button" }, li);
      const controls = Slides.getIn(i).map((Slide) => Slide.slide.id);
      const text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", onClick.bind(null, i));
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      items.push({ li, button, page: i });
    }
  }
  function onClick(page) {
    Controller.go(`>${page}`, true, () => {
      const Slide = Slides.getAt(Controller.toIndex(page));
      Slide && focus(Slide.slide);
    });
  }
  function getAt(index) {
    return items[Controller.toPage(index)];
  }
  function update() {
    const prev = getAt(getIndex(true));
    const curr = getAt(getIndex());
    if (prev) {
      removeClass(prev.button, CLASS_ACTIVE);
      removeAttribute(prev.button, ARIA_CURRENT);
    }
    if (curr) {
      addClass(curr.button, CLASS_ACTIVE);
      setAttribute(curr.button, ARIA_CURRENT, true);
    }
    emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
  }
  return {
    items,
    mount,
    destroy,
    getAt,
    update
  };
}

const TRIGGER_KEYS = [" ", "Enter", "Spacebar"];
function Sync(Splide2, Components2, options) {
  const { list } = Components2.Elements;
  const events = [];
  function mount() {
    Splide2.splides.forEach((target) => {
      !target.isParent && sync(target.splide);
    });
    if (options.isNavigation) {
      navigate();
    }
  }
  function destroy() {
    removeAttribute(list, ALL_ATTRIBUTES);
    events.forEach((event) => {
      event.destroy();
    });
    empty(events);
  }
  function remount() {
    destroy();
    mount();
  }
  function sync(splide) {
    [Splide2, splide].forEach((instance) => {
      const event = EventInterface(instance);
      const target = instance === Splide2 ? splide : Splide2;
      event.on(EVENT_MOVE, (index, prev, dest) => {
        target.go(target.is(LOOP) ? dest : index);
      });
      events.push(event);
    });
  }
  function navigate() {
    const event = EventInterface(Splide2);
    const { on } = event;
    on(EVENT_CLICK, onClick);
    on(EVENT_SLIDE_KEYDOWN, onKeydown);
    on([EVENT_MOUNTED, EVENT_UPDATED], update);
    setAttribute(list, ROLE, "menu");
    events.push(event);
    event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }
  function update() {
    setAttribute(list, ARIA_ORIENTATION, options.direction !== TTB ? "horizontal" : null);
  }
  function onClick(Slide) {
    Splide2.go(Slide.index);
  }
  function onKeydown(Slide, e) {
    if (includes(TRIGGER_KEYS, e.key)) {
      onClick(Slide);
      prevent(e);
    }
  }
  return {
    mount,
    destroy,
    remount
  };
}

function Wheel(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
    }
  }
  function onWheel(e) {
    if (e.cancelable) {
      const { deltaY } = e;
      if (deltaY) {
        const backwards = deltaY < 0;
        Splide2.go(backwards ? "<" : ">");
        shouldPrevent(backwards) && prevent(e);
      }
    }
  }
  function shouldPrevent(backwards) {
    return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
  }
  return {
    mount
  };
}

var ComponentConstructors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Options: Options,
  Direction: Direction,
  Elements: Elements,
  Slides: Slides,
  Layout: Layout,
  Clones: Clones,
  Move: Move,
  Controller: Controller,
  Arrows: Arrows,
  Autoplay: Autoplay,
  Cover: Cover,
  Scroll: Scroll,
  Drag: Drag,
  Keyboard: Keyboard,
  LazyLoad: LazyLoad,
  Pagination: Pagination,
  Sync: Sync,
  Wheel: Wheel
});

const I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay"
};

const DEFAULTS = {
  type: "slide",
  speed: 400,
  waitForTransition: true,
  perPage: 1,
  cloneStatus: true,
  arrows: true,
  pagination: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  keyboard: true,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
  drag: true,
  direction: "ltr",
  slideFocus: true,
  trimSpace: true,
  focusableNodes: "a, button, textarea, input, select, iframe",
  classes: CLASSES,
  i18n: I18N
};

function Fade(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  function mount() {
    on([EVENT_MOUNTED, EVENT_REFRESH], () => {
      nextTick(() => {
        Components2.Slides.style("transition", `opacity ${options.speed}ms ${options.easing}`);
      });
    });
  }
  function start(index, done) {
    const { track } = Components2.Elements;
    style(track, "height", unit(rect(track).height));
    nextTick(() => {
      done();
      style(track, "height", "");
    });
  }
  return {
    mount,
    start,
    cancel: noop
  };
}

function Slide(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  const { Move, Controller } = Components2;
  const { list } = Components2.Elements;
  let endCallback;
  function mount() {
    bind(list, "transitionend", (e) => {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }
  function start(index, done) {
    const destination = Move.toPosition(index, true);
    const position = Move.getPosition();
    const speed = getSpeed(index);
    if (abs(destination - position) >= 1 && speed >= 1) {
      apply(`transform ${speed}ms ${options.easing}`);
      Move.translate(destination, true);
      endCallback = done;
    } else {
      Move.jump(index);
      done();
    }
  }
  function cancel() {
    apply("");
  }
  function getSpeed(index) {
    const { rewindSpeed } = options;
    if (Splide2.is(SLIDE) && rewindSpeed) {
      const prev = Controller.getIndex(true);
      const end = Controller.getEnd();
      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }
    return options.speed;
  }
  function apply(transition) {
    style(list, "transition", transition);
  }
  return {
    mount,
    start,
    cancel
  };
}

const _Splide = class {
  constructor(target, options) {
    this.event = EventBus();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._options = {};
    this._Extensions = {};
    const root = isString(target) ? query(document, target) : target;
    assert(root, `${root} is invalid.`);
    this.root = root;
    merge(DEFAULTS, _Splide.defaults);
    merge(merge(this._options, DEFAULTS), options || {});
  }
  mount(Extensions, Transition) {
    const { state, Components: Components2 } = this;
    assert(state.is([CREATED, DESTROYED]), "Already mounted!");
    state.set(CREATED);
    this._Components = Components2;
    this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
    this._Extensions = Extensions || this._Extensions;
    const Constructors = assign({}, ComponentConstructors, this._Extensions, { Transition: this._Transition });
    forOwn(Constructors, (Component, key) => {
      const component = Component(this, Components2, this._options);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, (component) => {
      component.mount && component.mount();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  }
  sync(splide) {
    this.splides.push({ splide });
    splide.splides.push({ splide: this, isParent: true });
    if (this.state.is(IDLE)) {
      this._Components.Sync.remount();
      splide.Components.Sync.remount();
    }
    return this;
  }
  go(control) {
    this._Components.Controller.go(control);
    return this;
  }
  on(events, callback) {
    this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
    return this;
  }
  off(events) {
    this.event.off(events);
    return this;
  }
  emit(event) {
    this.event.emit(event, ...slice(arguments, 1));
    return this;
  }
  add(slides, index) {
    this._Components.Slides.add(slides, index);
    return this;
  }
  remove(matcher) {
    this._Components.Slides.remove(matcher);
    return this;
  }
  is(type) {
    return this._options.type === type;
  }
  refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  }
  destroy(completely = true) {
    const { event, state } = this;
    if (state.is(CREATED)) {
      event.on(EVENT_READY, this.destroy.bind(this, completely), this);
    } else {
      forOwn(this._Components, (component) => {
        component.destroy && component.destroy(completely);
      }, true);
      event.emit(EVENT_DESTROY);
      event.destroy();
      completely && empty(this.splides);
      state.set(DESTROYED);
    }
    return this;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    const { _options } = this;
    merge(_options, options);
    if (!this.state.is(CREATED)) {
      this.emit(EVENT_UPDATED, _options);
    }
  }
  get length() {
    return this._Components.Slides.getLength(true);
  }
  get index() {
    return this._Components.Controller.getIndex();
  }
};
let Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;

const CLASS_RENDERED = "is-rendered";

const RENDERER_DEFAULT_CONFIG = {
  listTag: "ul",
  slideTag: "li"
};

class Style {
  constructor(id, options) {
    this.styles = {};
    this.id = id;
    this.options = options;
  }
  rule(selector, prop, value, breakpoint) {
    breakpoint = breakpoint || "default";
    const selectors = this.styles[breakpoint] = this.styles[breakpoint] || {};
    const styles = selectors[selector] = selectors[selector] || {};
    styles[prop] = value;
  }
  build() {
    let css = "";
    if (this.styles.default) {
      css += this.buildSelectors(this.styles.default);
    }
    Object.keys(this.styles).sort((n, m) => this.options.mediaQuery === "min" ? +n - +m : +m - +n).forEach((breakpoint) => {
      if (breakpoint !== "default") {
        css += `@media screen and (max-width: ${breakpoint}px) {`;
        css += this.buildSelectors(this.styles[breakpoint]);
        css += `}`;
      }
    });
    return css;
  }
  buildSelectors(selectors) {
    let css = "";
    forOwn(selectors, (styles, selector) => {
      selector = `#${this.id} ${selector}`.trim();
      css += `${selector} {`;
      forOwn(styles, (value, prop) => {
        if (value || value === 0) {
          css += `${prop}: ${value};`;
        }
      });
      css += "}";
    });
    return css;
  }
}

class SplideRenderer {
  constructor(contents, options, config, defaults) {
    this.slides = [];
    this.options = {};
    this.breakpoints = [];
    merge(DEFAULTS, defaults || {});
    merge(merge(this.options, DEFAULTS), options || {});
    this.contents = contents;
    this.config = assign({}, RENDERER_DEFAULT_CONFIG, config || {});
    this.id = this.config.id || uniqueId("splide");
    this.Style = new Style(this.id, this.options);
    this.Direction = Direction(null, null, this.options);
    assert(this.contents.length, "Provide at least 1 content.");
    this.init();
  }
  static clean(splide) {
    const { on } = EventInterface(splide);
    const { root } = splide;
    const clones = queryAll(root, `.${CLASS_CLONE}`);
    on(EVENT_MOUNTED, () => {
      remove(child(root, "style"));
    });
    remove(clones);
  }
  init() {
    this.parseBreakpoints();
    this.initSlides();
    this.registerRootStyles();
    this.registerTrackStyles();
    this.registerSlideStyles();
    this.registerListStyles();
  }
  initSlides() {
    push(this.slides, this.contents.map((content, index) => {
      content = isString(content) ? { html: content } : content;
      content.styles = content.styles || {};
      content.attrs = content.attrs || {};
      this.cover(content);
      const classes = `${this.options.classes.slide} ${index === 0 ? CLASS_ACTIVE : ""}`;
      assign(content.attrs, {
        class: `${classes} ${content.attrs.class || ""}`.trim(),
        style: this.buildStyles(content.styles)
      });
      return content;
    }));
    if (this.isLoop()) {
      this.generateClones(this.slides);
    }
  }
  registerRootStyles() {
    this.breakpoints.forEach(([width, options]) => {
      this.Style.rule(" ", "max-width", unit(options.width), width);
    });
  }
  registerTrackStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_TRACK}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, this.resolve("paddingLeft"), this.cssPadding(options, false), width);
      Style2.rule(selector, this.resolve("paddingRight"), this.cssPadding(options, true), width);
      Style2.rule(selector, "height", this.cssTrackHeight(options), width);
    });
  }
  registerListStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_LIST}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, "transform", this.buildTranslate(options), width);
      if (!this.cssSlideHeight(options)) {
        Style2.rule(selector, "aspect-ratio", this.cssAspectRatio(options), width);
      }
    });
  }
  registerSlideStyles() {
    const { Style: Style2 } = this;
    const selector = `.${CLASS_SLIDE}`;
    this.breakpoints.forEach(([width, options]) => {
      Style2.rule(selector, "width", this.cssSlideWidth(options), width);
      Style2.rule(selector, "height", this.cssSlideHeight(options) || "100%", width);
      Style2.rule(selector, this.resolve("marginRight"), unit(options.gap) || "0px", width);
      Style2.rule(`${selector} > img`, "display", options.cover ? "none" : "inline", width);
    });
  }
  buildTranslate(options) {
    const { resolve, orient } = this.Direction;
    const values = [];
    values.push(this.cssOffsetClones(options));
    values.push(this.cssOffsetGaps(options));
    if (this.isCenter(options)) {
      values.push(this.buildCssValue(orient(-50), "%"));
      values.push(...this.cssOffsetCenter(options));
    }
    return values.filter(Boolean).map((value) => `translate${resolve("X")}(${value})`).join(" ");
  }
  cssOffsetClones(options) {
    const { resolve, orient } = this.Direction;
    const cloneCount = this.getCloneCount();
    if (this.isFixedWidth(options)) {
      const { value, unit: unit2 } = this.parseCssValue(options[resolve("fixedWidth")]);
      return this.buildCssValue(orient(value) * cloneCount, unit2);
    }
    const percent = 100 * cloneCount / options.perPage;
    return `${orient(percent)}%`;
  }
  cssOffsetCenter(options) {
    const { resolve, orient } = this.Direction;
    if (this.isFixedWidth(options)) {
      const { value, unit: unit2 } = this.parseCssValue(options[resolve("fixedWidth")]);
      return [this.buildCssValue(orient(value / 2), unit2)];
    }
    const values = [];
    const { perPage, gap } = options;
    values.push(`${orient(50 / perPage)}%`);
    if (gap) {
      const { value, unit: unit2 } = this.parseCssValue(gap);
      const gapOffset = (value / perPage - value) / 2;
      values.push(this.buildCssValue(orient(gapOffset), unit2));
    }
    return values;
  }
  cssOffsetGaps(options) {
    const cloneCount = this.getCloneCount();
    if (cloneCount && options.gap) {
      const { orient } = this.Direction;
      const { value, unit: unit2 } = this.parseCssValue(options.gap);
      if (this.isFixedWidth(options)) {
        return this.buildCssValue(orient(value * cloneCount), unit2);
      }
      const { perPage } = options;
      const gaps = cloneCount / perPage;
      return this.buildCssValue(orient(gaps * value), unit2);
    }
    return "";
  }
  resolve(prop) {
    return camelToKebab(this.Direction.resolve(prop));
  }
  cssPadding(options, right) {
    const { padding } = options;
    const prop = this.Direction.resolve(right ? "right" : "left", true);
    return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
  }
  cssTrackHeight(options) {
    let height = "";
    if (this.isVertical()) {
      height = this.cssHeight(options);
      assert(height, '"height" is missing.');
      height = `calc(${height} - ${this.cssPadding(options, false)} - ${this.cssPadding(options, true)})`;
    }
    return height;
  }
  cssHeight(options) {
    return unit(options.height);
  }
  cssSlideWidth(options) {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
  }
  cssSlideHeight(options) {
    return unit(options.fixedHeight) || (this.isVertical() ? options.autoHeight ? "" : this.cssSlideSize(options) : this.cssHeight(options));
  }
  cssSlideSize(options) {
    const gap = unit(options.gap);
    return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
  }
  cssAspectRatio(options) {
    const { heightRatio } = options;
    return heightRatio ? `${1 / heightRatio}` : "";
  }
  buildCssValue(value, unit2) {
    return `${value}${unit2}`;
  }
  parseCssValue(value) {
    if (isString(value)) {
      const number = parseFloat(value) || 0;
      const unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
      return { value: number, unit: unit2 };
    }
    return { value, unit: "px" };
  }
  parseBreakpoints() {
    const { breakpoints } = this.options;
    this.breakpoints.push(["default", this.options]);
    if (breakpoints) {
      forOwn(breakpoints, (options, width) => {
        this.breakpoints.push([width, merge(merge({}, this.options), options)]);
      });
    }
  }
  isFixedWidth(options) {
    return !!options[this.Direction.resolve("fixedWidth")];
  }
  isLoop() {
    return this.options.type === LOOP;
  }
  isCenter(options) {
    if (options.focus === "center") {
      if (this.isLoop()) {
        return true;
      }
      if (this.options.type === SLIDE) {
        return !this.options.trimSpace;
      }
    }
    return false;
  }
  isVertical() {
    return this.options.direction === TTB;
  }
  buildClasses() {
    const { options } = this;
    return [
      CLASS_ROOT,
      `${CLASS_ROOT}--${options.type}`,
      `${CLASS_ROOT}--${options.direction}`,
      options.drag && `${CLASS_ROOT}--draggable`,
      options.isNavigation && `${CLASS_ROOT}--nav`,
      CLASS_ACTIVE,
      !this.config.hidden && CLASS_RENDERED
    ].filter(Boolean).join(" ");
  }
  buildAttrs(attrs) {
    let attr = "";
    forOwn(attrs, (value, key) => {
      attr += value ? ` ${camelToKebab(key)}="${value}"` : "";
    });
    return attr.trim();
  }
  buildStyles(styles) {
    let style = "";
    forOwn(styles, (value, key) => {
      style += ` ${camelToKebab(key)}:${value};`;
    });
    return style.trim();
  }
  renderSlides() {
    const { slideTag: tag } = this.config;
    return this.slides.map((content) => {
      return `<${tag} ${this.buildAttrs(content.attrs)}>${content.html || ""}</${tag}>`;
    }).join("");
  }
  cover(content) {
    const { styles, html = "" } = content;
    if (this.options.cover && !this.options.lazyLoad) {
      const src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);
      if (src && src[2]) {
        styles.background = `center/cover no-repeat url('${src[2]}')`;
      }
    }
  }
  generateClones(contents) {
    const { classes } = this.options;
    const count = this.getCloneCount();
    const slides = contents.slice();
    while (slides.length < count) {
      push(slides, slides);
    }
    push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach((content, index) => {
      const attrs = assign({}, content.attrs, { class: `${content.attrs.class} ${classes.clone}` });
      const clone = assign({}, content, { attrs });
      index < count ? contents.unshift(clone) : contents.push(clone);
    });
  }
  getCloneCount() {
    if (this.isLoop()) {
      const { options } = this;
      if (options.clones) {
        return options.clones;
      }
      const perPage = max(...this.breakpoints.map(([, options2]) => options2.perPage));
      return perPage * ((options.flickMaxPages || 1) + 1);
    }
    return 0;
  }
  renderArrows() {
    let html = "";
    html += `<div class="${this.options.classes.arrows}">`;
    html += this.renderArrow(true);
    html += this.renderArrow(false);
    html += `</div>`;
    return html;
  }
  renderArrow(prev) {
    const { classes, i18n } = this.options;
    const attrs = {
      class: `${classes.arrow} ${prev ? classes.prev : classes.next}`,
      type: "button",
      ariaLabel: prev ? i18n.prev : i18n.next
    };
    return `<button ${this.buildAttrs(attrs)}><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${this.options.arrowPath || PATH}" /></svg></button>`;
  }
  html() {
    const { rootClass, listTag, arrows, beforeTrack, afterTrack, slider, beforeSlider, afterSlider } = this.config;
    let html = "";
    html += `<div id="${this.id}" class="${this.buildClasses()} ${rootClass || ""}">`;
    html += `<style>${this.Style.build()}</style>`;
    if (slider) {
      html += beforeSlider || "";
      html += `<div class="splide__slider">`;
    }
    html += beforeTrack || "";
    if (arrows) {
      html += this.renderArrows();
    }
    html += `<div class="splide__track">`;
    html += `<${listTag} class="splide__list">`;
    html += this.renderSlides();
    html += `</${listTag}>`;
    html += `</div>`;
    html += afterTrack || "";
    if (slider) {
      html += `</div>`;
      html += afterSlider || "";
    }
    html += `</div>`;
    return html;
  }
}

exports.CLASSES = CLASSES;
exports.CLASS_ACTIVE = CLASS_ACTIVE;
exports.CLASS_ARROW = CLASS_ARROW;
exports.CLASS_ARROWS = CLASS_ARROWS;
exports.CLASS_ARROW_NEXT = CLASS_ARROW_NEXT;
exports.CLASS_ARROW_PREV = CLASS_ARROW_PREV;
exports.CLASS_AUTOPLAY = CLASS_AUTOPLAY;
exports.CLASS_CLONE = CLASS_CLONE;
exports.CLASS_CONTAINER = CLASS_CONTAINER;
exports.CLASS_INITIALIZED = CLASS_INITIALIZED;
exports.CLASS_LIST = CLASS_LIST;
exports.CLASS_LOADING = CLASS_LOADING;
exports.CLASS_NEXT = CLASS_NEXT;
exports.CLASS_PAGINATION = CLASS_PAGINATION;
exports.CLASS_PAGINATION_PAGE = CLASS_PAGINATION_PAGE;
exports.CLASS_PAUSE = CLASS_PAUSE;
exports.CLASS_PLAY = CLASS_PLAY;
exports.CLASS_PREV = CLASS_PREV;
exports.CLASS_PROGRESS = CLASS_PROGRESS;
exports.CLASS_PROGRESS_BAR = CLASS_PROGRESS_BAR;
exports.CLASS_ROOT = CLASS_ROOT;
exports.CLASS_SLIDE = CLASS_SLIDE;
exports.CLASS_SLIDER = CLASS_SLIDER;
exports.CLASS_SPINNER = CLASS_SPINNER;
exports.CLASS_TRACK = CLASS_TRACK;
exports.CLASS_VISIBLE = CLASS_VISIBLE;
exports.EVENT_ACTIVE = EVENT_ACTIVE;
exports.EVENT_ARROWS_MOUNTED = EVENT_ARROWS_MOUNTED;
exports.EVENT_ARROWS_UPDATED = EVENT_ARROWS_UPDATED;
exports.EVENT_AUTOPLAY_PAUSE = EVENT_AUTOPLAY_PAUSE;
exports.EVENT_AUTOPLAY_PLAY = EVENT_AUTOPLAY_PLAY;
exports.EVENT_AUTOPLAY_PLAYING = EVENT_AUTOPLAY_PLAYING;
exports.EVENT_CLICK = EVENT_CLICK;
exports.EVENT_DESTROY = EVENT_DESTROY;
exports.EVENT_DRAG = EVENT_DRAG;
exports.EVENT_DRAGGED = EVENT_DRAGGED;
exports.EVENT_DRAGGING = EVENT_DRAGGING;
exports.EVENT_HIDDEN = EVENT_HIDDEN;
exports.EVENT_INACTIVE = EVENT_INACTIVE;
exports.EVENT_LAZYLOAD_LOADED = EVENT_LAZYLOAD_LOADED;
exports.EVENT_MOUNTED = EVENT_MOUNTED;
exports.EVENT_MOVE = EVENT_MOVE;
exports.EVENT_MOVED = EVENT_MOVED;
exports.EVENT_NAVIGATION_MOUNTED = EVENT_NAVIGATION_MOUNTED;
exports.EVENT_PAGINATION_MOUNTED = EVENT_PAGINATION_MOUNTED;
exports.EVENT_PAGINATION_UPDATED = EVENT_PAGINATION_UPDATED;
exports.EVENT_READY = EVENT_READY;
exports.EVENT_REFRESH = EVENT_REFRESH;
exports.EVENT_REPOSITIONED = EVENT_REPOSITIONED;
exports.EVENT_RESIZE = EVENT_RESIZE;
exports.EVENT_RESIZED = EVENT_RESIZED;
exports.EVENT_SCROLL = EVENT_SCROLL;
exports.EVENT_SCROLLED = EVENT_SCROLLED;
exports.EVENT_SHIFTED = EVENT_SHIFTED;
exports.EVENT_SLIDE_KEYDOWN = EVENT_SLIDE_KEYDOWN;
exports.EVENT_UPDATED = EVENT_UPDATED;
exports.EVENT_VISIBLE = EVENT_VISIBLE;
exports.EventBus = EventBus;
exports.EventInterface = EventInterface;
exports.RequestInterval = RequestInterval;
exports.STATUS_CLASSES = STATUS_CLASSES;
exports.Splide = Splide;
exports.SplideRenderer = SplideRenderer;
exports.State = State;
exports.Throttle = Throttle;
exports["default"] = Splide;

},{}],2:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var tryToString = require('../internals/try-to-string');

var TypeError = global.TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a function');
};

},{"../internals/global":49,"../internals/is-callable":60,"../internals/try-to-string":125}],3:[function(require,module,exports){
var global = require('../internals/global');
var isConstructor = require('../internals/is-constructor');
var tryToString = require('../internals/try-to-string');

var TypeError = global.TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw TypeError(tryToString(argument) + ' is not a constructor');
};

},{"../internals/global":49,"../internals/is-constructor":61,"../internals/try-to-string":125}],4:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');

var String = global.String;
var TypeError = global.TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw TypeError("Can't set " + String(argument) + ' as a prototype');
};

},{"../internals/global":49,"../internals/is-callable":60}],5:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var definePropertyModule = require('../internals/object-define-property');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/object-create":78,"../internals/object-define-property":80,"../internals/well-known-symbol":130}],6:[function(require,module,exports){
'use strict';
var charAt = require('../internals/string-multibyte').charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

},{"../internals/string-multibyte":111}],7:[function(require,module,exports){
var global = require('../internals/global');
var isPrototypeOf = require('../internals/object-is-prototype-of');

var TypeError = global.TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw TypeError('Incorrect invocation');
};

},{"../internals/global":49,"../internals/object-is-prototype-of":84}],8:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var String = global.String;
var TypeError = global.TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw TypeError(String(argument) + ' is not an object');
};

},{"../internals/global":49,"../internals/is-object":63}],9:[function(require,module,exports){
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

},{"../internals/array-iteration":11,"../internals/array-method-is-strict":12}],10:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var lengthOfArrayLike = require('../internals/length-of-array-like');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/length-of-array-like":70,"../internals/to-absolute-index":116,"../internals/to-indexed-object":117}],11:[function(require,module,exports){
var bind = require('../internals/function-bind-context');
var uncurryThis = require('../internals/function-uncurry-this');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

},{"../internals/array-species-create":15,"../internals/function-bind-context":39,"../internals/function-uncurry-this":43,"../internals/indexed-object":55,"../internals/length-of-array-like":70,"../internals/to-object":120}],12:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call -- required for testing
    method.call(null, argument || function () { return 1; }, 1);
  });
};

},{"../internals/fails":36}],13:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis([].slice);

},{"../internals/function-uncurry-this":43}],14:[function(require,module,exports){
var global = require('../internals/global');
var isArray = require('../internals/is-array');
var isConstructor = require('../internals/is-constructor');
var isObject = require('../internals/is-object');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');
var Array = global.Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"../internals/global":49,"../internals/is-array":59,"../internals/is-constructor":61,"../internals/is-object":63,"../internals/well-known-symbol":130}],15:[function(require,module,exports){
var arraySpeciesConstructor = require('../internals/array-species-constructor');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

},{"../internals/array-species-constructor":14}],16:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":130}],17:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};

},{"../internals/function-uncurry-this":43}],18:[function(require,module,exports){
var global = require('../internals/global');
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var isCallable = require('../internals/is-callable');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var Object = global.Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};

},{"../internals/classof-raw":17,"../internals/global":49,"../internals/is-callable":60,"../internals/to-string-tag-support":123,"../internals/well-known-symbol":130}],19:[function(require,module,exports){
var hasOwn = require('../internals/has-own-property');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};

},{"../internals/has-own-property":50,"../internals/object-define-property":80,"../internals/object-get-own-property-descriptor":81,"../internals/own-keys":91}],20:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

},{"../internals/well-known-symbol":130}],21:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":22,"../internals/descriptors":23,"../internals/object-define-property":80}],22:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],23:[function(require,module,exports){
var fails = require('../internals/fails');

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":36}],24:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":49,"../internals/is-object":63}],25:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],26:[function(require,module,exports){
// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
var documentCreateElement = require('../internals/document-create-element');

var classList = documentCreateElement('span').classList;
var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

module.exports = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

},{"../internals/document-create-element":24}],27:[function(require,module,exports){
module.exports = typeof window == 'object';

},{}],28:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');
var global = require('../internals/global');

module.exports = /ipad|iphone|ipod/i.test(userAgent) && global.Pebble !== undefined;

},{"../internals/engine-user-agent":32,"../internals/global":49}],29:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);

},{"../internals/engine-user-agent":32}],30:[function(require,module,exports){
var classof = require('../internals/classof-raw');
var global = require('../internals/global');

module.exports = classof(global.process) == 'process';

},{"../internals/classof-raw":17,"../internals/global":49}],31:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /web0s(?!.*chrome)/i.test(userAgent);

},{"../internals/engine-user-agent":32}],32:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';

},{"../internals/get-built-in":44}],33:[function(require,module,exports){
var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;

},{"../internals/engine-user-agent":32,"../internals/global":49}],34:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],35:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
  options.name        - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":19,"../internals/create-non-enumerable-property":21,"../internals/global":49,"../internals/is-forced":62,"../internals/object-get-own-property-descriptor":81,"../internals/redefine":96,"../internals/set-global":104}],36:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],37:[function(require,module,exports){
'use strict';
// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var uncurryThis = require('../internals/function-uncurry-this');
var redefine = require('../internals/redefine');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = uncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = uncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

},{"../internals/create-non-enumerable-property":21,"../internals/fails":36,"../internals/function-uncurry-this":43,"../internals/redefine":96,"../internals/regexp-exec":98,"../internals/well-known-symbol":130,"../modules/es.regexp.exec":139}],38:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});

},{"../internals/function-bind-native":40}],39:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var aCallable = require('../internals/a-callable');
var NATIVE_BIND = require('../internals/function-bind-native');

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"../internals/a-callable":2,"../internals/function-bind-native":40,"../internals/function-uncurry-this":43}],40:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});

},{"../internals/fails":36}],41:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};

},{"../internals/function-bind-native":40}],42:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var hasOwn = require('../internals/has-own-property');

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};

},{"../internals/descriptors":23,"../internals/has-own-property":50}],43:[function(require,module,exports){
var NATIVE_BIND = require('../internals/function-bind-native');

var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var uncurryThis = NATIVE_BIND && bind.bind(call, call);

module.exports = NATIVE_BIND ? function (fn) {
  return fn && uncurryThis(fn);
} : function (fn) {
  return fn && function () {
    return call.apply(fn, arguments);
  };
};

},{"../internals/function-bind-native":40}],44:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"../internals/global":49,"../internals/is-callable":60}],45:[function(require,module,exports){
var classof = require('../internals/classof');
var getMethod = require('../internals/get-method');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};

},{"../internals/classof":18,"../internals/get-method":47,"../internals/iterators":69,"../internals/well-known-symbol":130}],46:[function(require,module,exports){
var global = require('../internals/global');
var call = require('../internals/function-call');
var aCallable = require('../internals/a-callable');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var getIteratorMethod = require('../internals/get-iterator-method');

var TypeError = global.TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw TypeError(tryToString(argument) + ' is not iterable');
};

},{"../internals/a-callable":2,"../internals/an-object":8,"../internals/function-call":41,"../internals/get-iterator-method":45,"../internals/global":49,"../internals/try-to-string":125}],47:[function(require,module,exports){
var aCallable = require('../internals/a-callable');

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return func == null ? undefined : aCallable(func);
};

},{"../internals/a-callable":2}],48:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');

var floor = Math.floor;
var charAt = uncurryThis(''.charAt);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice(str, 0, position);
      case "'": return stringSlice(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt(ch, 1) : captures[f - 1] + charAt(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

},{"../internals/function-uncurry-this":43,"../internals/to-object":120}],49:[function(require,module,exports){
(function (global){(function (){
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],50:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var toObject = require('../internals/to-object');

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};

},{"../internals/function-uncurry-this":43,"../internals/to-object":120}],51:[function(require,module,exports){
module.exports = {};

},{}],52:[function(require,module,exports){
var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length == 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":49}],53:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":44}],54:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":23,"../internals/document-create-element":24,"../internals/fails":36}],55:[function(require,module,exports){
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var Object = global.Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":17,"../internals/fails":36,"../internals/function-uncurry-this":43,"../internals/global":49}],56:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var isCallable = require('../internals/is-callable');
var store = require('../internals/shared-store');

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/function-uncurry-this":43,"../internals/is-callable":60,"../internals/shared-store":108}],57:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var hasOwn = require('../internals/has-own-property');
var shared = require('../internals/shared-store');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = uncurryThis(store.get);
  var wmhas = uncurryThis(store.has);
  var wmset = uncurryThis(store.set);
  set = function (it, metadata) {
    if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget(store, it) || {};
  };
  has = function (it) {
    return wmhas(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/create-non-enumerable-property":21,"../internals/function-uncurry-this":43,"../internals/global":49,"../internals/has-own-property":50,"../internals/hidden-keys":51,"../internals/is-object":63,"../internals/native-weak-map":74,"../internals/shared-key":107,"../internals/shared-store":108}],58:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":69,"../internals/well-known-symbol":130}],59:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};

},{"../internals/classof-raw":17}],60:[function(require,module,exports){
// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = function (argument) {
  return typeof argument == 'function';
};

},{}],61:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof');
var getBuiltIn = require('../internals/get-built-in');
var inspectSource = require('../internals/inspect-source');

var noop = function () { /* empty */ };
var empty = [];
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, empty, argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;

},{"../internals/classof":18,"../internals/fails":36,"../internals/function-uncurry-this":43,"../internals/get-built-in":44,"../internals/inspect-source":56,"../internals/is-callable":60}],62:[function(require,module,exports){
var fails = require('../internals/fails');
var isCallable = require('../internals/is-callable');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":36,"../internals/is-callable":60}],63:[function(require,module,exports){
var isCallable = require('../internals/is-callable');

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};

},{"../internals/is-callable":60}],64:[function(require,module,exports){
module.exports = false;

},{}],65:[function(require,module,exports){
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":17,"../internals/is-object":63,"../internals/well-known-symbol":130}],66:[function(require,module,exports){
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var isCallable = require('../internals/is-callable');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var Object = global.Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};

},{"../internals/get-built-in":44,"../internals/global":49,"../internals/is-callable":60,"../internals/object-is-prototype-of":84,"../internals/use-symbol-as-uid":127}],67:[function(require,module,exports){
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var tryToString = require('../internals/try-to-string');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var lengthOfArrayLike = require('../internals/length-of-array-like');
var isPrototypeOf = require('../internals/object-is-prototype-of');
var getIterator = require('../internals/get-iterator');
var getIteratorMethod = require('../internals/get-iterator-method');
var iteratorClose = require('../internals/iterator-close');

var TypeError = global.TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};

},{"../internals/an-object":8,"../internals/function-bind-context":39,"../internals/function-call":41,"../internals/get-iterator":46,"../internals/get-iterator-method":45,"../internals/global":49,"../internals/is-array-iterator-method":58,"../internals/iterator-close":68,"../internals/length-of-array-like":70,"../internals/object-is-prototype-of":84,"../internals/try-to-string":125}],68:[function(require,module,exports){
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var getMethod = require('../internals/get-method');

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};

},{"../internals/an-object":8,"../internals/function-call":41,"../internals/get-method":47}],69:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],70:[function(require,module,exports){
var toLength = require('../internals/to-length');

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};

},{"../internals/to-length":119}],71:[function(require,module,exports){
var global = require('../internals/global');
var bind = require('../internals/function-bind-context');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var macrotask = require('../internals/task').set;
var IS_IOS = require('../internals/engine-is-ios');
var IS_IOS_PEBBLE = require('../internals/engine-is-ios-pebble');
var IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit');
var IS_NODE = require('../internals/engine-is-node');

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = bind(promise.then, promise);
    notify = function () {
      then(flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    // strange IE + webpack dev server bug - use .bind(global)
    macrotask = bind(macrotask, global);
    notify = function () {
      macrotask(flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/engine-is-ios":29,"../internals/engine-is-ios-pebble":28,"../internals/engine-is-node":30,"../internals/engine-is-webos-webkit":31,"../internals/function-bind-context":39,"../internals/global":49,"../internals/object-get-own-property-descriptor":81,"../internals/task":114}],72:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global.Promise;

},{"../internals/global":49}],73:[function(require,module,exports){
/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = require('../internals/engine-v8-version');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"../internals/engine-v8-version":33,"../internals/fails":36}],74:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":49,"../internals/inspect-source":56,"../internals/is-callable":60}],75:[function(require,module,exports){
'use strict';
var aCallable = require('../internals/a-callable');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-callable":2}],76:[function(require,module,exports){
var global = require('../internals/global');
var isRegExp = require('../internals/is-regexp');

var TypeError = global.TypeError;

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

},{"../internals/global":49,"../internals/is-regexp":65}],77:[function(require,module,exports){
var global = require('../internals/global');
var fails = require('../internals/fails');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var $parseInt = global.parseInt;
var Symbol = global.Symbol;
var ITERATOR = Symbol && Symbol.iterator;
var hex = /^[+-]?0x/i;
var exec = uncurryThis(hex.exec);
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
  // MS Edge 18- broken with boxed symbols
  || (ITERATOR && !fails(function () { $parseInt(Object(ITERATOR)); }));

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt(S, (radix >>> 0) || (exec(hex, S) ? 16 : 10));
} : $parseInt;

},{"../internals/fails":36,"../internals/function-uncurry-this":43,"../internals/global":49,"../internals/string-trim":113,"../internals/to-string":124,"../internals/whitespaces":131}],78:[function(require,module,exports){
/* global ActiveXObject -- old IE, WSH */
var anObject = require('../internals/an-object');
var definePropertiesModule = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};

},{"../internals/an-object":8,"../internals/document-create-element":24,"../internals/enum-bug-keys":34,"../internals/hidden-keys":51,"../internals/html":53,"../internals/object-define-properties":79,"../internals/shared-key":107}],79:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var toIndexedObject = require('../internals/to-indexed-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};

},{"../internals/an-object":8,"../internals/descriptors":23,"../internals/object-define-property":80,"../internals/object-keys":86,"../internals/to-indexed-object":117,"../internals/v8-prototype-define-bug":128}],80:[function(require,module,exports){
var global = require('../internals/global');
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var V8_PROTOTYPE_DEFINE_BUG = require('../internals/v8-prototype-define-bug');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');

var TypeError = global.TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":8,"../internals/descriptors":23,"../internals/global":49,"../internals/ie8-dom-define":54,"../internals/to-property-key":122,"../internals/v8-prototype-define-bug":128}],81:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var call = require('../internals/function-call');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var hasOwn = require('../internals/has-own-property');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};

},{"../internals/create-property-descriptor":22,"../internals/descriptors":23,"../internals/function-call":41,"../internals/has-own-property":50,"../internals/ie8-dom-define":54,"../internals/object-property-is-enumerable":87,"../internals/to-indexed-object":117,"../internals/to-property-key":122}],82:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":34,"../internals/object-keys-internal":85}],83:[function(require,module,exports){
// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

},{}],84:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

module.exports = uncurryThis({}.isPrototypeOf);

},{"../internals/function-uncurry-this":43}],85:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var hasOwn = require('../internals/has-own-property');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};

},{"../internals/array-includes":10,"../internals/function-uncurry-this":43,"../internals/has-own-property":50,"../internals/hidden-keys":51,"../internals/to-indexed-object":117}],86:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":34,"../internals/object-keys-internal":85}],87:[function(require,module,exports){
'use strict';
var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

},{}],88:[function(require,module,exports){
/* eslint-disable no-proto -- safe */
var uncurryThis = require('../internals/function-uncurry-this');
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = uncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/a-possible-prototype":4,"../internals/an-object":8,"../internals/function-uncurry-this":43}],89:[function(require,module,exports){
'use strict';
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/classof":18,"../internals/to-string-tag-support":123}],90:[function(require,module,exports){
var global = require('../internals/global');
var call = require('../internals/function-call');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');

var TypeError = global.TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/function-call":41,"../internals/global":49,"../internals/is-callable":60,"../internals/is-object":63}],91:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var uncurryThis = require('../internals/function-uncurry-this');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":8,"../internals/function-uncurry-this":43,"../internals/get-built-in":44,"../internals/object-get-own-property-names":82,"../internals/object-get-own-property-symbols":83}],92:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],93:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":8,"../internals/is-object":63,"../internals/new-promise-capability":75}],94:[function(require,module,exports){
var Queue = function () {
  this.head = null;
  this.tail = null;
};

Queue.prototype = {
  add: function (item) {
    var entry = { item: item, next: null };
    if (this.head) this.tail.next = entry;
    else this.head = entry;
    this.tail = entry;
  },
  get: function () {
    var entry = this.head;
    if (entry) {
      this.head = entry.next;
      if (this.tail === entry) this.tail = null;
      return entry.item;
    }
  }
};

module.exports = Queue;

},{}],95:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":96}],96:[function(require,module,exports){
var global = require('../internals/global');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var setGlobal = require('../internals/set-global');
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');
var CONFIGURABLE_FUNCTION_NAME = require('../internals/function-name').CONFIGURABLE;

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var name = options && options.name !== undefined ? options.name : key;
  var state;
  if (isCallable(value)) {
    if (String(name).slice(0, 7) === 'Symbol(') {
      name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
    }
    if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
      createNonEnumerableProperty(value, 'name', name);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
});

},{"../internals/create-non-enumerable-property":21,"../internals/function-name":42,"../internals/global":49,"../internals/has-own-property":50,"../internals/inspect-source":56,"../internals/internal-state":57,"../internals/is-callable":60,"../internals/set-global":104}],97:[function(require,module,exports){
var global = require('../internals/global');
var call = require('../internals/function-call');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var classof = require('../internals/classof-raw');
var regexpExec = require('../internals/regexp-exec');

var TypeError = global.TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = call(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classof(R) === 'RegExp') return call(regexpExec, R, S);
  throw TypeError('RegExp#exec called on incompatible receiver');
};

},{"../internals/an-object":8,"../internals/classof-raw":17,"../internals/function-call":41,"../internals/global":49,"../internals/is-callable":60,"../internals/regexp-exec":98}],98:[function(require,module,exports){
'use strict';
/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var toString = require('../internals/to-string');
var regexpFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var shared = require('../internals/shared');
var create = require('../internals/object-create');
var getInternalState = require('../internals/internal-state').get;
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');

var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = uncurryThis(''.charAt);
var indexOf = uncurryThis(''.indexOf);
var replace = uncurryThis(''.replace);
var stringSlice = uncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  call(nativeExec, re1, 'a');
  call(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = call(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = call(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = call(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      call(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;

},{"../internals/function-call":41,"../internals/function-uncurry-this":43,"../internals/internal-state":57,"../internals/object-create":78,"../internals/regexp-flags":99,"../internals/regexp-sticky-helpers":100,"../internals/regexp-unsupported-dot-all":101,"../internals/regexp-unsupported-ncg":102,"../internals/shared":109,"../internals/to-string":124}],99:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":8}],100:[function(require,module,exports){
var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

module.exports = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};

},{"../internals/fails":36,"../internals/global":49}],101:[function(require,module,exports){
var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

},{"../internals/fails":36,"../internals/global":49}],102:[function(require,module,exports){
var fails = require('../internals/fails');
var global = require('../internals/global');

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp = global.RegExp;

module.exports = fails(function () {
  var re = $RegExp('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

},{"../internals/fails":36,"../internals/global":49}],103:[function(require,module,exports){
var global = require('../internals/global');

var TypeError = global.TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{"../internals/global":49}],104:[function(require,module,exports){
var global = require('../internals/global');

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":49}],105:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/descriptors":23,"../internals/get-built-in":44,"../internals/object-define-property":80,"../internals/well-known-symbol":130}],106:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var hasOwn = require('../internals/has-own-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/has-own-property":50,"../internals/object-define-property":80,"../internals/well-known-symbol":130}],107:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":109,"../internals/uid":126}],108:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":49,"../internals/set-global":104}],109:[function(require,module,exports){
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.21.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.21.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});

},{"../internals/is-pure":64,"../internals/shared-store":108}],110:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aConstructor = require('../internals/a-constructor');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aConstructor(S);
};

},{"../internals/a-constructor":3,"../internals/an-object":8,"../internals/well-known-symbol":130}],111:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/function-uncurry-this":43,"../internals/require-object-coercible":103,"../internals/to-integer-or-infinity":118,"../internals/to-string":124}],112:[function(require,module,exports){
'use strict';
var global = require('../internals/global');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

var RangeError = global.RangeError;

// `String.prototype.repeat` method implementation
// https://tc39.es/ecma262/#sec-string.prototype.repeat
module.exports = function repeat(count) {
  var str = toString(requireObjectCoercible(this));
  var result = '';
  var n = toIntegerOrInfinity(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

},{"../internals/global":49,"../internals/require-object-coercible":103,"../internals/to-integer-or-infinity":118,"../internals/to-string":124}],113:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var whitespaces = require('../internals/whitespaces');

var replace = uncurryThis(''.replace);
var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = replace(string, ltrim, '');
    if (TYPE & 2) string = replace(string, rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/function-uncurry-this":43,"../internals/require-object-coercible":103,"../internals/to-string":124,"../internals/whitespaces":131}],114:[function(require,module,exports){
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var bind = require('../internals/function-bind-context');
var isCallable = require('../internals/is-callable');
var hasOwn = require('../internals/has-own-property');
var fails = require('../internals/fails');
var html = require('../internals/html');
var arraySlice = require('../internals/array-slice');
var createElement = require('../internals/document-create-element');
var validateArgumentsLength = require('../internals/validate-arguments-length');
var IS_IOS = require('../internals/engine-is-ios');
var IS_NODE = require('../internals/engine-is-node');

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global.location;
} catch (error) { /* empty */ }

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/array-slice":13,"../internals/document-create-element":24,"../internals/engine-is-ios":29,"../internals/engine-is-node":30,"../internals/fails":36,"../internals/function-apply":38,"../internals/function-bind-context":39,"../internals/global":49,"../internals/has-own-property":50,"../internals/html":53,"../internals/is-callable":60,"../internals/validate-arguments-length":129}],115:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

// `thisNumberValue` abstract operation
// https://tc39.es/ecma262/#sec-thisnumbervalue
module.exports = uncurryThis(1.0.valueOf);

},{"../internals/function-uncurry-this":43}],116:[function(require,module,exports){
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer-or-infinity":118}],117:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":55,"../internals/require-object-coercible":103}],118:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- safe
  return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};

},{}],119:[function(require,module,exports){
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer-or-infinity":118}],120:[function(require,module,exports){
var global = require('../internals/global');
var requireObjectCoercible = require('../internals/require-object-coercible');

var Object = global.Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/global":49,"../internals/require-object-coercible":103}],121:[function(require,module,exports){
var global = require('../internals/global');
var call = require('../internals/function-call');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var getMethod = require('../internals/get-method');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

},{"../internals/function-call":41,"../internals/get-method":47,"../internals/global":49,"../internals/is-object":63,"../internals/is-symbol":66,"../internals/ordinary-to-primitive":90,"../internals/well-known-symbol":130}],122:[function(require,module,exports){
var toPrimitive = require('../internals/to-primitive');
var isSymbol = require('../internals/is-symbol');

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};

},{"../internals/is-symbol":66,"../internals/to-primitive":121}],123:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":130}],124:[function(require,module,exports){
var global = require('../internals/global');
var classof = require('../internals/classof');

var String = global.String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

},{"../internals/classof":18,"../internals/global":49}],125:[function(require,module,exports){
var global = require('../internals/global');

var String = global.String;

module.exports = function (argument) {
  try {
    return String(argument);
  } catch (error) {
    return 'Object';
  }
};

},{"../internals/global":49}],126:[function(require,module,exports){
var uncurryThis = require('../internals/function-uncurry-this');

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};

},{"../internals/function-uncurry-this":43}],127:[function(require,module,exports){
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":73}],128:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});

},{"../internals/descriptors":23,"../internals/fails":36}],129:[function(require,module,exports){
var global = require('../internals/global');

var TypeError = global.TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
  return passed;
};

},{"../internals/global":49}],130:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var hasOwn = require('../internals/has-own-property');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    var description = 'Symbol.' + name;
    if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":49,"../internals/has-own-property":50,"../internals/native-symbol":73,"../internals/shared":109,"../internals/uid":126,"../internals/use-symbol-as-uid":127}],131:[function(require,module,exports){
// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],132:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/array-for-each":9,"../internals/export":35}],133:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $includes = require('../internals/array-includes').includes;
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.includes` method
// https://tc39.es/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

},{"../internals/add-to-unscopables":5,"../internals/array-includes":10,"../internals/export":35}],134:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var uncurryThis = require('../internals/function-uncurry-this');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var thisNumberValue = require('../internals/this-number-value');
var $repeat = require('../internals/string-repeat');
var fails = require('../internals/fails');

var RangeError = global.RangeError;
var String = global.String;
var floor = Math.floor;
var repeat = uncurryThis($repeat);
var stringSlice = uncurryThis(''.slice);
var un$ToFixed = uncurryThis(1.0.toFixed);

var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var multiply = function (data, n, c) {
  var index = -1;
  var c2 = c;
  while (++index < 6) {
    c2 += n * data[index];
    data[index] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};

var divide = function (data, n) {
  var index = 6;
  var c = 0;
  while (--index >= 0) {
    c += data[index];
    data[index] = floor(c / n);
    c = (c % n) * 1e7;
  }
};

var dataToString = function (data) {
  var index = 6;
  var s = '';
  while (--index >= 0) {
    if (s !== '' || index === 0 || data[index] !== 0) {
      var t = String(data[index]);
      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
    }
  } return s;
};

var FORCED = fails(function () {
  return un$ToFixed(0.00008, 3) !== '0.000' ||
    un$ToFixed(0.9, 0) !== '1' ||
    un$ToFixed(1.255, 2) !== '1.25' ||
    un$ToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  un$ToFixed({});
});

// `Number.prototype.toFixed` method
// https://tc39.es/ecma262/#sec-number.prototype.tofixed
$({ target: 'Number', proto: true, forced: FORCED }, {
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toIntegerOrInfinity(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare -- NaN check
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(data, 0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(data, 1e7, 0);
          j -= 7;
        }
        multiply(data, pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(data, 1 << 23);
          j -= 23;
        }
        divide(data, 1 << j);
        multiply(data, 1, 1);
        divide(data, 2);
        result = dataToString(data);
      } else {
        multiply(data, 0, z);
        multiply(data, 1 << -e, 0);
        result = dataToString(data) + repeat('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + repeat('0', fractDigits - k) + result
        : stringSlice(result, 0, k - fractDigits) + '.' + stringSlice(result, k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

},{"../internals/export":35,"../internals/fails":36,"../internals/function-uncurry-this":43,"../internals/global":49,"../internals/string-repeat":112,"../internals/this-number-value":115,"../internals/to-integer-or-infinity":118}],135:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
// eslint-disable-next-line es/no-object-defineproperty -- safe
$({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty, sham: !DESCRIPTORS }, {
  defineProperty: defineProperty
});

},{"../internals/descriptors":23,"../internals/export":35,"../internals/object-define-property":80}],136:[function(require,module,exports){
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var redefine = require('../internals/redefine');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}

},{"../internals/object-to-string":89,"../internals/redefine":96,"../internals/to-string-tag-support":123}],137:[function(require,module,exports){
var $ = require('../internals/export');
var $parseInt = require('../internals/number-parse-int');

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != $parseInt }, {
  parseInt: $parseInt
});

},{"../internals/export":35,"../internals/number-parse-int":77}],138:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var call = require('../internals/function-call');
var NativePromise = require('../internals/native-promise-constructor');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var aCallable = require('../internals/a-callable');
var isCallable = require('../internals/is-callable');
var isObject = require('../internals/is-object');
var anInstance = require('../internals/an-instance');
var inspectSource = require('../internals/inspect-source');
var iterate = require('../internals/iterate');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var promiseResolve = require('../internals/promise-resolve');
var hostReportErrors = require('../internals/host-report-errors');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var Queue = require('../internals/queue');
var InternalStateModule = require('../internals/internal-state');
var isForced = require('../internals/is-forced');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_NODE = require('../internals/engine-is-node');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';

var getInternalState = InternalStateModule.getterFor(PROMISE);
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var NativePromisePrototype = NativePromise && NativePromise.prototype;
var PromiseConstructor = NativePromise;
var PromisePrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;

var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var NATIVE_REJECTION_EVENT = isCallable(global.PromiseRejectionEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var SUBCLASSING = false;

var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromisePrototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && isCallable(then = it.then) ? then : false;
};

var callReaction = function (reaction, state) {
  var value = state.value;
  var ok = state.state == FULFILLED;
  var handler = ok ? reaction.ok : reaction.fail;
  var resolve = reaction.resolve;
  var reject = reaction.reject;
  var domain = reaction.domain;
  var result, then, exited;
  try {
    if (handler) {
      if (!ok) {
        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
        state.rejection = HANDLED;
      }
      if (handler === true) result = value;
      else {
        if (domain) domain.enter();
        result = handler(value); // can throw
        if (domain) {
          domain.exit();
          exited = true;
        }
      }
      if (result === reaction.promise) {
        reject(TypeError('Promise-chain cycle'));
      } else if (then = isThenable(result)) {
        call(then, result, resolve, reject);
      } else resolve(result);
    } else reject(value);
  } catch (error) {
    if (domain && !exited) domain.exit();
    reject(error);
  }
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  microtask(function () {
    var reactions = state.reactions;
    var reaction;
    while (reaction = reactions.get()) {
      callReaction(reaction, state);
    }
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  call(task, global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          call(then, value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromisePrototype);
    aCallable(executor);
    call(Internal, this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromisePrototype = PromiseConstructor.prototype;
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: new Queue(),
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromisePrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    // eslint-disable-next-line unicorn/no-thenable -- safe
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      state.parent = true;
      reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
      reaction.fail = isCallable(onRejected) && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      if (state.state == PENDING) state.reactions.add(reaction);
      else microtask(function () {
        callReaction(reaction, state);
      });
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && isCallable(NativePromise) && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          call(nativeThen, that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
      redefine(NativePromisePrototype, 'catch', PromisePrototype['catch'], { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromisePrototype);
    }
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    call(capability.reject, undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        remaining++;
        call($promiseResolve, C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aCallable(C.resolve);
      iterate(iterable, function (promise) {
        call($promiseResolve, C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-callable":2,"../internals/an-instance":7,"../internals/check-correctness-of-iteration":16,"../internals/engine-is-browser":27,"../internals/engine-is-node":30,"../internals/engine-v8-version":33,"../internals/export":35,"../internals/function-call":41,"../internals/get-built-in":44,"../internals/global":49,"../internals/host-report-errors":52,"../internals/inspect-source":56,"../internals/internal-state":57,"../internals/is-callable":60,"../internals/is-forced":62,"../internals/is-object":63,"../internals/is-pure":64,"../internals/iterate":67,"../internals/microtask":71,"../internals/native-promise-constructor":72,"../internals/new-promise-capability":75,"../internals/object-set-prototype-of":88,"../internals/perform":92,"../internals/promise-resolve":93,"../internals/queue":94,"../internals/redefine":96,"../internals/redefine-all":95,"../internals/set-species":105,"../internals/set-to-string-tag":106,"../internals/species-constructor":110,"../internals/task":114,"../internals/well-known-symbol":130}],139:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var exec = require('../internals/regexp-exec');

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});

},{"../internals/export":35,"../internals/regexp-exec":98}],140:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var uncurryThis = require('../internals/function-uncurry-this');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');

var stringIndexOf = uncurryThis(''.indexOf);

// `String.prototype.includes` method
// https://tc39.es/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~stringIndexOf(
      toString(requireObjectCoercible(this)),
      toString(notARegExp(searchString)),
      arguments.length > 1 ? arguments[1] : undefined
    );
  }
});

},{"../internals/correct-is-regexp-logic":20,"../internals/export":35,"../internals/function-uncurry-this":43,"../internals/not-a-regexp":76,"../internals/require-object-coercible":103,"../internals/to-string":124}],141:[function(require,module,exports){
'use strict';
var apply = require('../internals/function-apply');
var call = require('../internals/function-call');
var uncurryThis = require('../internals/function-uncurry-this');
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var isCallable = require('../internals/is-callable');
var toIntegerOrInfinity = require('../internals/to-integer-or-infinity');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var getMethod = require('../internals/get-method');
var getSubstitution = require('../internals/get-substitution');
var regExpExec = require('../internals/regexp-exec-abstract');
var wellKnownSymbol = require('../internals/well-known-symbol');

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = uncurryThis([].concat);
var push = uncurryThis([].push);
var stringIndexOf = uncurryThis(''.indexOf);
var stringSlice = uncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? call(replacer, searchValue, O, replaceValue)
        : call(nativeReplace, toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString(apply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

},{"../internals/advance-string-index":6,"../internals/an-object":8,"../internals/fails":36,"../internals/fix-regexp-well-known-symbol-logic":37,"../internals/function-apply":38,"../internals/function-call":41,"../internals/function-uncurry-this":43,"../internals/get-method":47,"../internals/get-substitution":48,"../internals/is-callable":60,"../internals/regexp-exec-abstract":97,"../internals/require-object-coercible":103,"../internals/to-integer-or-infinity":118,"../internals/to-length":119,"../internals/to-string":124,"../internals/well-known-symbol":130}],142:[function(require,module,exports){
var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var DOMTokenListPrototype = require('../internals/dom-token-list-prototype');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var handlePrototype = function (CollectionPrototype) {
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
};

for (var COLLECTION_NAME in DOMIterables) {
  if (DOMIterables[COLLECTION_NAME]) {
    handlePrototype(global[COLLECTION_NAME] && global[COLLECTION_NAME].prototype);
  }
}

handlePrototype(DOMTokenListPrototype);

},{"../internals/array-for-each":9,"../internals/create-non-enumerable-property":21,"../internals/dom-iterables":25,"../internals/dom-token-list-prototype":26,"../internals/global":49}],143:[function(require,module,exports){
var $ = require('../internals/export');
var global = require('../internals/global');
var apply = require('../internals/function-apply');
var isCallable = require('../internals/is-callable');
var userAgent = require('../internals/engine-user-agent');
var arraySlice = require('../internals/array-slice');
var validateArgumentsLength = require('../internals/validate-arguments-length');

var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var Function = global.Function;

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > 2;
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = boundArgs ? arraySlice(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      apply(fn, this, args);
    } : fn, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});

},{"../internals/array-slice":13,"../internals/engine-user-agent":32,"../internals/export":35,"../internals/function-apply":38,"../internals/global":49,"../internals/is-callable":60,"../internals/validate-arguments-length":129}],144:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],145:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAccordions = void 0;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/web.timers.js");

var _selectors = _interopRequireDefault(require("../selectors"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var SELECTOR_ACCORDION_TOGGLE_BUTTON = _selectors["default"].SELECTOR_ACCORDION_TOGGLE_BUTTON,
    SELECTOR_ACCORDION = _selectors["default"].SELECTOR_ACCORDION,
    SELECTOR_ACCORDION_BODY = _selectors["default"].SELECTOR_ACCORDION_BODY,
    SELECTOR_ACCORDION_INNER = _selectors["default"].SELECTOR_ACCORDION_INNER;

var handleAccordions = function handleAccordions() {
  var accordionToggleButtons = document.querySelectorAll(SELECTOR_ACCORDION_TOGGLE_BUTTON);
  accordionToggleButtons.forEach(function (button) {
    button.onclick = function () {
      var accordion = button.closest(SELECTOR_ACCORDION);
      var accordionBody = accordion.querySelector(SELECTOR_ACCORDION_BODY);
      if (!accordion || !accordionBody) return;
      var isShow = accordion.classList.contains('is-show');
      var accordionInner = accordion.querySelector(SELECTOR_ACCORDION_INNER);
      var heightElement = accordionInner.clientHeight;

      var onToggle = function onToggle() {
        accordionBody.removeAttribute('style');
        accordionBody.removeEventListener('transitionend', onToggle);
      };

      accordion.classList.toggle('is-show', !isShow);
      accordionBody.style.height = "".concat(heightElement, "px");

      if (isShow) {
        setTimeout(function () {
          accordionBody.style.height = 0 + 'px';
        }, 10);
      }

      accordionBody.addEventListener('transitionend', onToggle);
    };
  });
};

exports.handleAccordions = handleAccordions;

},{"../selectors":156,"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142,"core-js/modules/web.timers.js":143}],146:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleScrollToElement = void 0;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

var handleScrollToElement = function handleScrollToElement() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var href = e.currentTarget.getAttribute('href');

      if (href === '#') {
        window.scroll({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
};

exports.handleScrollToElement = handleScrollToElement;

},{"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142}],147:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = Header;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

function Header() {
  var header = document.querySelector('.js-header');
  var headerMenuButton = document.querySelector('.js-header-menu-button');
  var headerMenuLinks = document.querySelector('.js-header-menu').querySelectorAll('a');
  header.classList.toggle('is-dark', window.scrollY > 0);

  function openMenu() {
    header.classList.add('is-menu-opening');
    document.body.classList.add('is-menu-opening');
  }

  function closeMenu() {
    header.classList.remove('is-menu-opening');
    document.body.classList.remove('is-menu-opening');
  }

  headerMenuButton.addEventListener('click', function () {
    if (!header) return;
    var isMenuOpen = header.classList.contains('is-menu-opening');

    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  headerMenuLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      return closeMenu();
    });
  });
}

},{"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142}],148:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleModal = void 0;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

var SELECTOR_MODAL = '.js-modal';
var SELECTOR_MODAL_CLOSE = '.js-modal-close';
var SELECTOR_MODAL_OPEN = '.js-modal-open';
var mapStrategies = {
  1: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5829.390960511309!2d141.3421456365918!3d43.068871806480715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0b2953dff59731%3A0x6bf74cb37f50c042!2z5aSn5Li45pyt5bmM5bqX!5e0!3m2!1sja!2sjp!4v1701664903627!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  2: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3132.6194763509366!2d140.86862717569608!3d38.26513057186586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f8a282542db10db%3A0xbe0847e4148d4af0!2z5LuZ5Y-w5LiJ6LaK!5e0!3m2!1sja!2sjp!4v1701154802351!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  3: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.7352516256205!2d139.61939997558054!3d35.90449927251601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018c142f9ea0eab%3A0xbf8565e83dbdf6e9!2z44Gd44GU44GG5aSn5a6u5bqX!5e0!3m2!1sja!2sjp!4v1701154824923!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  4: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3243.667912631945!2d140.11113217556664!3d35.6112574726099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x602284b05d796beb%3A0xbe3030ace939302b!2z44Gd44GU44GG5Y2D6JGJ5bqX!5e0!3m2!1sja!2sjp!4v1701154853228!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  5: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.6288754254056!2d139.9875403755701!3d35.68613917258564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60187fda5f7485e7%3A0xd77eefa69fe0c1c7!2z44KJ44KJ44G944O844GoVE9LWU8tQkFZ!5e0!3m2!1sja!2sjp!4v1701154878017!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  6: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.9823164111817!2d139.98248737557077!3d35.702052772580565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188078fc2a0d0b%3A0xfff1f043761aaa50!2z5p2x5q2m55m-6LKo5bqXIOiIueapi-W6lw!5e0!3m2!1sja!2sjp!4v1701154903241!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  7: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.42657063228!2d139.96806022557854!3d35.863061972529096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60189ce68dc29bd7%3A0xc089e6a0fbbf79cf!2z5p-P6auY5bO25bGL!5e0!3m2!1sja!2sjp!4v1701154925134!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  8: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.0008050393108!2d139.80193877557315!3d35.75078497256495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188e4f41a624a9%3A0xde2d62f43cf2ddb9!2z5YyX5Y2D5L2P44Oe44Or44Kk!5e0!3m2!1sja!2sjp!4v1701154957400!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  9: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.2674514031078!2d139.81112907557053!3d35.69503557258279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601888d809ff4821%3A0x9f1e6e4f209907dd!2z6Yym57O455S644Oe44Or44Kk!5e0!3m2!1sja!2sjp!4v1701155157378!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  10: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.8356299367942!2d139.7078411755721!3d35.73026077257157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d5d9bb197e7%3A0x37cf8b786a38ecd4!2z5p2x5q2m55m-6LKo5bqXIOaxoOiii-W6lw!5e0!3m2!1sja!2sjp!4v1701155201074!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  11: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.8886013950982!2d139.7092249755721!3d35.728958122571775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d67fef93b19%3A0xcd9ac1373273ee1e!2z6KW_5q2m5rGg6KKL5pys5bqX!5e0!3m2!1sja!2sjp!4v1701155229760!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  12: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.117350477895!2d139.76127537556957!3d35.67411237258955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188be5727dcea3%3A0xd60a27836288d3da!2z5pyJ5qW955S644Oe44Or44Kk!5e0!3m2!1sja!2sjp!4v1701155248487!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  13: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.139129269532!2d139.76013597556957!3d35.67357607258971!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188be562c880b5%3A0x79e943ae780264d4!2z6Ziq5oCl44Oh44Oz44K65p2x5Lqs!5e0!3m2!1sja!2sjp!4v1701155279565!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  14: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8151754730234!2d139.76636517556983!3d35.68155267258714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfeba8313b7%3A0xed9bfc268f8f7718!2z5aSn5Li4IOadseS6rOW6lw!5e0!3m2!1sja!2sjp!4v1701155796355!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  15: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8359752862625!2d139.77107427556984!3d35.68104057258728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bfd850bffff%3A0x5e9362d024973e62!2z5pel5pys5qmL6auY5bO25bGLUy5DLg!5e0!3m2!1sja!2sjp!4v1701155409699!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  16: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.44749833489!2d139.7007482755691!3d35.66598177259229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188ca5cffca823%3A0xf76c0aaada927aff!2z44CSMTUwLTAwMDEg5p2x5Lqs6YO95riL6LC35Yy656We5a6u5YmN77yW5LiB55uu77yS77yV4oiS77yR77yQIOelnuWuruWJjeOCv-OCseOCquOCreOCr-ODgeODk-ODqw!5e0!3m2!1sja!2sjp!4v1701155437965!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  17: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.568173641602!2d139.69966497557022!3d35.68763347258522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cc57486a4b7%3A0x86a5ef4c7a8ccb41!2z5paw5a6_6auY5bO25bGL!5e0!3m2!1sja!2sjp!4v1701155465155!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  18: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6481.09060407727!2d139.69376559358957!3d35.688196490339635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d43127338ff%3A0x384707ec5b211f72!2z5Lqs546L55m-6LKo5bqXIOaWsOWuv-W6lw!5e0!3m2!1sja!2sjp!4v1701155484982!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  19: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.393340979505!2d139.44252887556345!3d35.543986672631824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018feb36c23629b%3A0x5ae5d137153d8043!2z5bCP55Sw5oCl55m-6LKo5bqXIOeUuueUsOW6lw!5e0!3m2!1sja!2sjp!4v1701155505798!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  20: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.569391380287!2d139.6224773755597!3d35.46545357265768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185c149c9a6d67%3A0xd1822154178496c7!2z44Gd44GU44GG5qiq5rWc5bqX!5e0!3m2!1sja!2sjp!4v1701155528579!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  21: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.6052166254053!2d139.62212337555968!3d35.46456687265797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185c13590d1bad%3A0x73fc678dc8a23cc2!2z44Oe44Or44Kk44K344OG44Kj5qiq5rWc!5e0!3m2!1sja!2sjp!4v1701155550371!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  22: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.561969271543!2d139.61816917555967!3d35.46563727265764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185c12139cfec1%3A0xa65988184dbaa376!2z5qiq5rWc6auY5bO25bGL!5e0!3m2!1sja!2sjp!4v1701155566405!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  23: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.88083528984!2d139.6292090755592!3d35.45774447266022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185c42cdead9db%3A0xd1e112f8c4059ceb!2zTUFSSyBJUyDjgb_jgarjgajjgb_jgonjgYQ!5e0!3m2!1sja!2sjp!4v1701155591710!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  24: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3251.843417438998!2d139.59407687555705!3d35.409131572676266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60185b445446689d%3A0xe7e00170b529948b!2z5Lqs5oCl55m-6LKo5bqX!5e0!3m2!1sja!2sjp!4v1701155617389!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  25: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3249.9562321400545!2d139.3867406755592!3d35.45587797266079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60190266ed674bab%3A0xf4ad52edfaaada5b!2z44KJ44KJ44G944O844Go5rW36ICB5ZCN!5e0!3m2!1sja!2sjp!4v1701155669545!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  26: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4008524940486!2d136.88032402554586!3d35.171560422756116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60037727951432ff%3A0x83d7af7383bf32b0!2z44K444Kn44Kk44Ki5LiA44Or5ZCN5Y-k5bGL44K_44Kr44K344Oe44Ok!5e0!3m2!1sja!2sjp!4v1701155700497!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  27: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.652793686926!2d136.90535207554558!3d35.1652789727581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600370ce019f575b%3A0x9fcd6426ed276348!2z5p2-5Z2C5bGLIOWQjeWPpOWxi-W6lw!5e0!3m2!1sja!2sjp!4v1701155722106!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  28: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.653685188275!2d135.18745967552346!3d34.68868897292388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008efc67e26ccf%3A0x3b7b676190bd14cf!2z5aSn5Li4IOelnuaIuOW6lw!5e0!3m2!1sja!2sjp!4v1701155757879!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  29: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.480733827591!2d135.35620597552597!3d34.74348107290449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f23e3aae4f23%3A0x63587677d902e252!2z6KW_5a6u6Ziq5oCl!5e0!3m2!1sja!2sjp!4v1701155823235!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  30: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3275.097748795612!2d134.68705537553004!3d34.828634772874516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3554e012e0daab71%3A0xd34915f21cba8e36!2z5bGx6Zm955m-6LKo5bqX!5e0!3m2!1sja!2sjp!4v1701157209505!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  31: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.6077076596234!2d135.4986883755223!3d34.66460887293255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e76c9354dddd%3A0x7982a69c4e50074c!2z5aSn6Ziq6auY5bO25bGL!5e0!3m2!1sja!2sjp!4v1701157231650!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  32: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.090923048926!2d135.49274867552418!3d34.702886572918885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e68dc5aa6efd%3A0x6312408264b55d49!2z44Or44Kv44Ki5aSn6Ziq!5e0!3m2!1sja!2sjp!4v1701157251867!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  33: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.3410003636072!2d135.51089911107954!3d34.64609017282626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000dd19df9cd0f9%3A0xf2b4aff527aa64dc!2z44GC44G544Gu44OP44Or44Kr44K56L-R6YmE5pys5bqX!5e0!3m2!1sja!2sjp!4v1701162124053!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  34: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105034.94729948179!2d135.43089560692755!3d34.646062317387255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e69309285b39%3A0xbfe099cb9bdab03!2z6Ziq5oCl44Oh44Oz44K65aSn6Ziq!5e0!3m2!1sja!2sjp!4v1701162149761!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  35: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.1344367258935!2d135.49399601108206!3d34.70178897280629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e68d79809a79%3A0x2c0beb47b1f00e4!2z5aSn5Li45qKF55Sw5bqX!5e0!3m2!1sja!2sjp!4v1701162172291!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  36: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.128693112641!2d135.76629421109624!3d35.00348347270021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108957a893ac3%3A0x92a41928aa1855be!2z5Lqs6YO96auY5bO25bGLUy5DLg!5e0!3m2!1sja!2sjp!4v1701162196223!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  37: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.7168757038244!2d133.92638081108024!3d34.66185247282062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x355406340ef008dd%3A0xc497a34fc8c1a6d9!2z5aSp5rqA5bGLIOWyoeWxseacrOW6lw!5e0!3m2!1sja!2sjp!4v1701162218791!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  38: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6584.618877253783!2d132.45396776977543!3d34.39348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x355aa208aa76b7a1%3A0xcb582198029b3303!2z56aP5bGL5YWr5LiB5aCA5pys5bqX!5e0!3m2!1sja!2sjp!4v1701162242146!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  39: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3324.56584546928!2d130.4374221110299!3d33.56465477323331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x354191e79a67d911%3A0xe57737261ee4d100!2z44KJ44KJ44G944O844Go56aP5bKh!5e0!3m2!1sja!2sjp!4v1701162270520!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  40: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.1227316424415!2d130.6860886109953!3d32.789004873548706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3540f5f377084363%3A0xcdfeb700b0be2624!2z44Ki44Of44Ol44OX44Op44K244GP44G-44KC44Go!5e0!3m2!1sja!2sjp!4v1701162301463!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  41: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.480428471381!2d130.55438491094307!3d31.59329297407296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x353e5e010c53867b%3A0xe893f66b3319017d!2z5bGx5b2i5bGL!5e0!3m2!1sja!2sjp!4v1701162319013!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
};

var handleModal = function handleModal() {
  var openBtnItems = document.querySelectorAll(SELECTOR_MODAL_OPEN);
  var closeBtn = document.querySelector(SELECTOR_MODAL_CLOSE);
  var modal = document.querySelector(SELECTOR_MODAL);
  var body = document.querySelector('body');
  if (!modal) return;
  var mapModal = modal.querySelector('.js-map-append');

  var handleOpenModal = function handleOpenModal() {
    modal.classList.add('open');
    body.style.overflow = 'hidden';
  };

  openBtnItems.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.key;
      var html = mapStrategies[key];
      mapModal.innerHTML = html !== null && html !== void 0 ? html : '';
      handleOpenModal();
    });
  });
  closeBtn.addEventListener('click', function () {
    modal.classList.remove('open');
    body.style.overflow = '';
  });
};

exports.handleModal = handleModal;

},{"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142}],149:[function(require,module,exports){
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playPageIntro = playPageIntro;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

var _selectors = _interopRequireDefault(require("../selectors"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var SELECTOR_PAGE_INTRO = _selectors["default"].SELECTOR_PAGE_INTRO;
var ANIMATION_TIME = 4000; //ms

function playPageIntro() {
  return _playPageIntro.apply(this, arguments);
}

function _playPageIntro() {
  _playPageIntro = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var pageIntro;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pageIntro = document.querySelector(SELECTOR_PAGE_INTRO);

            if (pageIntro) {
              pageIntro.classList.add('is-animating');
              document.body.style.overflow = 'hidden';
              setTimeout(function () {
                document.body.style.removeProperty('overflow');
                pageIntro.classList.remove('is-animating');
                pageIntro.classList.add('is-animated');
                pageIntro.remove();
              }, ANIMATION_TIME);
            }

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _playPageIntro.apply(this, arguments);
}

},{"../selectors":156,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/es.promise.js":138,"core-js/modules/web.timers.js":143,"regenerator-runtime/runtime.js":144}],150:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onHandleResponsiveLink = onHandleResponsiveLink;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

var _selectors = _interopRequireDefault(require("../selectors"));

var _constants = require("../constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var SELECTOR_RESPONSIVE_LINK = _selectors["default"].SELECTOR_RESPONSIVE_LINK;

function onHandleResponsiveLink() {
  var responsiveLinks = document.querySelectorAll(SELECTOR_RESPONSIVE_LINK);
  var mobileMatchMedia = window.matchMedia(_constants.breakpointDown.md);
  var SUNTORY_URL = 'https://www.suntory-kenko.com';
  var SUNTORY_SP_URL = SUNTORY_URL + '/sp';

  function handleResponsiveLink() {
    responsiveLinks.forEach(function (link) {
      var isMobile = mobileMatchMedia.matches;
      var href = link.getAttribute('href');
      var hasSPInLink = href.includes(SUNTORY_SP_URL);

      if (isMobile) {
        if (hasSPInLink) return;
        link.href = href.replace(SUNTORY_URL, SUNTORY_SP_URL);
      } else if (hasSPInLink) {
        link.href = href.replace('/sp/', '/');
      }
    });
  }

  if (mobileMatchMedia.matches) handleResponsiveLink();
  mobileMatchMedia.addEventListener('change', handleResponsiveLink);
}

},{"../constants":152,"../selectors":156,"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.array.includes.js":133,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/es.regexp.exec.js":139,"core-js/modules/es.string.includes.js":140,"core-js/modules/es.string.replace.js":141,"core-js/modules/web.dom-collections.for-each.js":142}],151:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSlider = void 0;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

var _splide = _interopRequireDefault(require("@splidejs/splide"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var SLIDER_OPTIONS = {
  type: 'fade',
  arrows: false,
  pagination: false,
  drag: false
};

var initializeSlider = function initializeSlider(slider, thumbnails) {
  var handleToggle = function handleToggle(index) {
    thumbnails.forEach(function (item, idx) {
      return item.classList.toggle('active', idx === index);
    });
  };

  thumbnails.forEach(function (thumb, index) {
    thumb.addEventListener('click', function () {
      slider.go(index);
      handleToggle(index);
    });
  });
  handleToggle(0);
};

var handleSlider = function handleSlider() {
  var sliderItems = document.querySelectorAll('.js-slider-thumbnail');
  sliderItems.forEach(function (item) {
    var splide = item.querySelector('.splide');
    var thumbnailItems = item.querySelectorAll('.js-thumbnail > div');
    var slider = new _splide["default"](splide, SLIDER_OPTIONS).mount();
    initializeSlider(slider, thumbnailItems);
  });
};

exports.handleSlider = handleSlider;

},{"@splidejs/splide":1,"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142}],152:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.breakpointUp = exports.breakpointDown = exports.breakPoint = void 0;
var breakpointUp = {
  md: 'screen and (min-width: 768px)'
};
exports.breakpointUp = breakpointUp;
var breakpointDown = {
  md: 'screen and (max-width: 767px)'
};
exports.breakpointDown = breakpointDown;
var breakPoint = {
  md: 768
};
exports.breakPoint = breakPoint;

},{"core-js/modules/es.object.define-property.js":135}],153:[function(require,module,exports){
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FadeTop = FadeTop;
exports.sleep = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.parse-int.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var SELECTOR_FADE_UP = '.js-fade-up';
var SELECTOR_FADE_OUT = '.js-fade-out';

var sleep = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var delay,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            delay = _args.length > 0 && _args[0] !== undefined ? _args[0] : 800;
            _context.next = 3;
            return new Promise(function (r) {
              return setTimeout(r, delay);
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sleep() {
    return _ref.apply(this, arguments);
  };
}();

exports.sleep = sleep;

function FadeTop() {
  return _FadeTop.apply(this, arguments);
}

function _FadeTop() {
  _FadeTop = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var elements, observer;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            elements = document.querySelectorAll([SELECTOR_FADE_UP, SELECTOR_FADE_OUT]);
            observer = new IntersectionObserver(function (entries) {
              entries.forEach( /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(entry) {
                  var targetRect, isAboveViewport, delay, duration;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          targetRect = entry.target.getBoundingClientRect();
                          isAboveViewport = targetRect.bottom < 0; // unobserve items which above viewport

                          if (isAboveViewport) {
                            entry.target.classList.remove('js-fade-up', 'js-fade-out');
                            observer.unobserve(entry.target);
                          } // add Fade


                          if (!entry.isIntersecting) {
                            _context2.next = 14;
                            break;
                          }

                          delay = parseInt(entry.target.getAttribute('delay') || '0');
                          duration = parseInt(entry.target.getAttribute('duration') || '1300');

                          if (!(delay > 0)) {
                            _context2.next = 9;
                            break;
                          }

                          _context2.next = 9;
                          return sleep(delay);

                        case 9:
                          entry.target.style.transitionDuration = duration + 'ms';
                          entry.target.style.transitionProperty = 'opacity, transform';
                          entry.target.style.opacity = '1';
                          entry.target.style.transform = 'translate(0)';
                          observer.unobserve(entry.target);

                        case 14:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }, {
              threshold: 0.1
            }); // await reload the page is done with html, css

            _context3.next = 4;
            return sleep(100);

          case 4:
            elements.forEach(function (element) {
              observer.observe(element);
            });

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _FadeTop.apply(this, arguments);
}

},{"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/es.parse-int.js":137,"core-js/modules/es.promise.js":138,"core-js/modules/web.dom-collections.for-each.js":142,"core-js/modules/web.timers.js":143,"regenerator-runtime/runtime.js":144}],154:[function(require,module,exports){
"use strict";

var _responsiveLink = require("./components/responsive-link");

var _header = require("./components/header");

var _top = require("./pages/top");

var _accordion = require("./components/accordion");

var _modal = require("./components/modal");

var _slider = require("./components/slider");

var _anchorLink = require("./components/anchor-link");

var _fadeTop = require("./fade-top");

var init = function init() {
  (0, _responsiveLink.onHandleResponsiveLink)();
  (0, _accordion.handleAccordions)();
  (0, _modal.handleModal)();
  (0, _slider.handleSlider)();
  (0, _anchorLink.handleScrollToElement)();
  (0, _fadeTop.FadeTop)();
  (0, _header.Header)();
  (0, _top.TopPageEvent)();
}; // source: https://stackoverflow.com/a/58944651


try {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  } // This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.


  window.scrollTo(0, 0);
} catch (_unused) {//
}

window.addEventListener('load', function () {
  //waiting load file(image, video ...)
  var loading = document.querySelector('.js-loading');
  var body = document.querySelector('body');

  if (loading) {
    loading.style.opacity = '0';
    loading.style.visibility = 'hidden';
    body.classList.add('loaded');
    init();
  }
});

},{"./components/accordion":145,"./components/anchor-link":146,"./components/header":147,"./components/modal":148,"./components/responsive-link":150,"./components/slider":151,"./fade-top":153,"./pages/top":155}],155:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopPageEvent = TopPageEvent;

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.number.to-fixed.js");

require("core-js/modules/web.timers.js");

var _splide = _interopRequireDefault(require("@splidejs/splide"));

var _pageIntro = require("../components/page-intro");

var _constants = require("../constants");

var _utils = require("../utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function handleConceptProductSplide() {
  var conceptSplides = document.querySelectorAll('.js-concept-product-splide');
  conceptSplides.forEach(function (productSplide) {
    new _splide["default"](productSplide, {
      type: 'fade',
      rewind: true,
      arrows: false,
      pagination: false,
      autoplay: true,
      pauseOnHover: false,
      speed: 2000,
      interval: 2000
    }).mount();
  });
}

function showVideoFallback() {
  var videoFallbackSlider = document.querySelector('.js-video-fallback-slider');
  new _splide["default"](videoFallbackSlider, {
    type: 'fade',
    rewind: true,
    arrows: false,
    pagination: false,
    autoplay: true,
    pauseOnHover: false,
    speed: 4000,
    interval: 4000
  }).mount();
}

function setBodyClassName() {
  document.body.classList.toggle('is-body-scroll-active', window.scrollY > 0);
}

function MobileEvents() {
  var visualSection = document.querySelector('#visual-section');
  var videoWrapper = document.querySelector('#main-video-wrapper');
  var initVideoPositionTop = videoWrapper.offsetTop;
  var initVideoPositionBottom = videoWrapper.clientHeight + videoWrapper.offsetTop;

  function setVideoPosition() {
    if (!(0, _utils.isSP)()) {
      videoWrapper.style.removeProperty('top');
      videoWrapper.style.removeProperty('bottom');
      return;
    }

    if (window.scrollY > 0) {
      var positionTop = Math.max(0, initVideoPositionTop - window.scrollY);
      var positionBottom = Math.max(window.innerHeight - window.scrollY - initVideoPositionBottom, 0);
      videoWrapper.style.top = positionTop + 'px';
      videoWrapper.style.bottom = positionBottom + 'px';
    } else {
      videoWrapper.style.removeProperty('top');
      videoWrapper.style.removeProperty('bottom');
    }
  }

  function handleVisualSectionScrollTranslate() {
    if (!(0, _utils.isSP)()) {
      visualSection.style.removeProperty('opacity');
      return;
    }

    var height = visualSection.clientHeight;
    var rect = visualSection.getBoundingClientRect();
    var heightInScreen = height - Math.abs(rect.top);

    if (heightInScreen <= 0) {
      return;
    }

    if (heightInScreen === height) {
      visualSection.style.removeProperty('opacity');
      return;
    }

    var opacity = Math.max(heightInScreen / height - 0.3, 0);
    visualSection.style.opacity = opacity.toFixed(2);
  }

  setVideoPosition();
  handleVisualSectionScrollTranslate();
  window.addEventListener('scroll', function () {
    setVideoPosition();
    handleVisualSectionScrollTranslate();
  });
}

function TopPageEvent() {
  var mobileEventAdded = false;
  var video = document.querySelector('#main-video');
  var conceptImage1 = document.querySelector('.js-concept-translate-img-1');
  var conceptImage2 = document.querySelector('.js-concept-translate-img-2');
  var productSlider1 = document.querySelector('.js-product-slider-1');
  var productSlider2 = document.querySelector('.js-product-slider-2');

  function handleProductSlideTranslate() {
    var parent = productSlider1.parentElement;
    var elementPos = parent.getBoundingClientRect().top + parent.clientHeight / 2;
    var windowCenterPos = window.innerHeight * 0.5;
    var distanceY = (windowCenterPos - elementPos) * 0.2;
    productSlider1.style.transform = "translateY(-".concat(distanceY, "px)");
    productSlider2.style.transform = "translateY(".concat(distanceY, "px)");
  }

  function handleConceptBoxImageTranslate() {
    var parent = conceptImage1.parentElement;
    var elementPos = parent.getBoundingClientRect().top;
    var windowCenterPos = window.innerHeight * 0.8;
    var distanceX = Math.min((windowCenterPos - elementPos) * 0.07, 40);
    var distanceY = Math.min((windowCenterPos - elementPos) * 0.23, 132);
    conceptImage1.style.transform = "translateX(".concat(distanceX, "px)");
    conceptImage2.style.transform = "translateY(-".concat(distanceY, "px)");
  } // INIT PAGE EVENT


  (0, _pageIntro.playPageIntro)();
  setTimeout(function () {
    video.play().then(function () {
      video.setAttribute('autoplay', true);
    })["catch"](function () {
      showVideoFallback();
      video.remove();
    });
  }, 1000);
  setBodyClassName();
  handleConceptProductSplide();
  handleConceptBoxImageTranslate();
  handleProductSlideTranslate(); // PAGE SCROLL EVENT

  window.addEventListener('scroll', function () {
    setBodyClassName();
    handleProductSlideTranslate();
    handleConceptBoxImageTranslate();
  }); // WINDOW RESIZE EVENT

  window.addEventListener('resize', function () {
    handleConceptBoxImageTranslate();
    handleProductSlideTranslate();
  }); // MOBILE EVENTS

  var mobileMediaMatch = matchMedia(_constants.breakpointDown.md);

  function addMobileEvents() {
    if (mobileEventAdded === true) {
      return;
    }

    MobileEvents();
    mobileEventAdded = true;
  }

  if (mobileMediaMatch.matches) {
    addMobileEvents();
  }

  mobileMediaMatch.addEventListener('change', function (event) {
    if (event.matches) {
      addMobileEvents();
    }
  });
}

},{"../components/page-intro":149,"../constants":152,"../utils":157,"@splidejs/splide":1,"core-js/modules/es.array.for-each.js":132,"core-js/modules/es.number.to-fixed.js":134,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/web.dom-collections.for-each.js":142,"core-js/modules/web.timers.js":143}],156:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var selectors = {
  SELECTOR_ACCORDION_TOGGLE_BUTTON: '.js-accordion-button',
  SELECTOR_ACCORDION: '.js-accordion',
  SELECTOR_ACCORDION_BODY: '.js-accordion-body',
  SELECTOR_ACCORDION_INNER: '.js-accordion-inner',
  SELECTOR_ANCHOR_LINK: '.js-anchor-link',
  SELECTOR_RESPONSIVE_LINK: '.js-responsive-link',
  SELECTOR_PAGE_INTRO: '.js-page-intro',
  SELECTOR_TRANSLATE_SCROLL: '.js-translate-scroll'
};
var _default = selectors;
exports["default"] = _default;

},{"core-js/modules/es.object.define-property.js":135}],157:[function(require,module,exports){
"use strict";

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = exports.isSP = void 0;

require("regenerator-runtime/runtime.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/web.timers.js");

var _constants = require("./constants");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var sleep = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var delay,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            delay = _args.length > 0 && _args[0] !== undefined ? _args[0] : 800;
            _context.next = 3;
            return new Promise(function (r) {
              return setTimeout(r, delay);
            });

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sleep() {
    return _ref.apply(this, arguments);
  };
}();

exports.sleep = sleep;

var isSP = function isSP() {
  return window.innerWidth < _constants.breakPoint.md;
};

exports.isSP = isSP;

},{"./constants":152,"core-js/modules/es.object.define-property.js":135,"core-js/modules/es.object.to-string.js":136,"core-js/modules/es.promise.js":138,"core-js/modules/web.timers.js":143,"regenerator-runtime/runtime.js":144}]},{},[154])
//# sourceMappingURL=index.js.map
