# AngularUse

[![npm version](https://img.shields.io/npm/v/@volvachev/angularuse.svg)](https://npmjs.com/package/@volvachev/angularuse)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@volvachev/angularuse)](https://bundlephobia.com/result?p=@volvachev/angularuse)
[![.github/workflows/ci.yml](https://github.com/volvachev/angularuse/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/volvachev/angularuse/actions/workflows/ci.yml)
[![Coveralls github](https://img.shields.io/coveralls/github/volvachev/angularuse)](https://coveralls.io/github/volvachev/angularuse?branch=master)

Collection of essential Angular inject functions

## inject functions

- [useDocumentVisibility](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-document-visibility/index.md) - reactively track `document.visibilityState`;
- [useWindowSize](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-window-size/index.md) - reactive window size;
- [useWindowFocus](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-window-focus/index.md) - reactively track window focus with `window.onfocus` and `window.onblur` events;
- [useResizeObserver](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-resize-observer/index.md) - reports changes to the dimensions of an Element's content or the border-box;
- [usePreferredLanguages](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-preferred-languages/index.md) - reactive [Navigator Languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages). It provides web developers with information about the user's preferred languages.
- [useOutsideZone](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-outside-zone/index.md) and `outsideZone` - RxJs operator, that run subscription function outside `NgZone`
- [useOnline](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-online/index.md) - reactive online state. A wrapper of `useNetwork`;
- [useNetwork](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-network/index.md) - reactive [Network status](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API). The Network Information API provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.);
- [useMemory](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-memory/index.md) - reactive Memory Info;
- [useMediaQuery](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-media-query/index.md) - reactive [Media Query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Testing_media_queries);
- [useInsideZone](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-inside-zone/index.md) and `insideZone` - RxJs operator, that run subscription function inside `NgZone`;
- [useBattery](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-battery/index.md) - reactive Battery Status API;
- [useUntilDestroy](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-until-destroy/index.md) - RxJs operator, which automatically unsubscribes from the `Observable` on hook `OnDestroy`;
- [useTextSelection](https://github.com/volvachev/angularuse/blob/master/projects/angularuse/src/lib/core/use-text-selection/index.md) - reactively track user text selection based on `Window.getSelection`.
