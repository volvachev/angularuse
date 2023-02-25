# AngularUse

[![npm version](https://img.shields.io/npm/v/@volvachev/angularuse.svg)](https://npmjs.com/package/@volvachev/angularuse)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@volvachev/angularuse)](https://bundlephobia.com/result?p=@volvachev/angularuse)
[![.github/workflows/ci.yml](https://github.com/volvachev/angularuse/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/volvachev/angularuse/actions/workflows/ci.yml)
[![Coveralls github](https://img.shields.io/coveralls/github/volvachev/angularuse)](https://coveralls.io/github/volvachev/angularuse?branch=master)

Collection of essential Angular inject functions

## inject functions and directives

- [useDocumentVisibility](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-document-visibility/index.md) - reactively track `document.visibilityState`;
- [useWindowSize](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-window-size/index.md) - reactive window size;
- [useWindowFocus](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-window-focus/index.md) - reactively track window focus with `window.onfocus` and `window.onblur` events;
- [useResizeObserver](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-resize-observer/index.md) - reports changes to the dimensions of an Element's content or the border-box;
- [usePreferredLanguages](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-preferred-languages/index.md) - reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages). It provides web developers with information about the user's preferred languages.
- [useOnline](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-online/index.md) - reactive online state. A wrapper of `useNetwork`;
- [useNetwork](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-network/index.md) - reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). The Network Information API provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.);
- [useMemory](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-memory/index.md) - reactive Memory Info;
- [useMediaQuery](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-media-query/index.md) - reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries);
- [useBattery](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-battery/index.md) - reactive Battery Status API;
- [useTextSelection](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-text-selection/index.md) - reactively track user text selection based on `Window.getSelection`;
- [useWindowScroll](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-window-scroll/index.md) - reactive window scroll;
- [useElementBounding](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-element-bounding/index.md) - Reactive [bounding box](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of an HTML element;
- [useElementSize](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-element-size/index.md) - Reactive size of an HTML element. [ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver);
- [useElementVisibility](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-element-visibility/index.md) - Tracks the visibility of an element within the viewport;
- [useActiveElement](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-active-element/index.md) - Reactive `document.activeElement`;
- [useFocus](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-focus/index.md) - Reactive utility to track the focus state of a DOM element;
- [useFocusWithin](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-focus-within/index.md) - Reactive utility to track if an element or one of its decendants has focus. It is meant to match the behavior of the `:focus-within` CSS pseudo-class;
- [useFavicon](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-favicon/index.md) - Reactive favicon;
- [useTextareaAutosize](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-textarea-autosize/index.md) - Automatically update the height of a textarea depending on the content;
- [useMutationObserver](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-mutation-observer/index.md) - Watch for changes being made to the DOM tree. [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver);
- [useTextDirection](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-text-direction/index.md) - Reactive [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) of the element's text;
- [useIntersectionObserver](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-intersection-observer/index.md) - Detects that a target element's visibility;
- [useIdle](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-idle/index.md) - Tracks whether the user is being inactive;
- [useMouse](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-mouse/index.md) - Reactive mouse position;
- [useMouseInElement](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-mouse-in-element/index.md) - Reactive mouse position related to an element;
- [useMousePressed](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-mouse-pressed/index.md) - Reactive mouse position;

### inject rxjs functions
- [useInsideZone](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-inside-zone/index.md) and `insideZone` - RxJs operator, that run subscription function inside `NgZone`;
- [useOutsideZone](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-outside-zone/index.md) and `outsideZone` - RxJs operator, that run subscription function outside `NgZone`;
- [useUntilDestroy](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-until-destroy/index.md) - RxJs operator, which automatically unsubscribes from the `Observable` on hook `OnDestroy`;
