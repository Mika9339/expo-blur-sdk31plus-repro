# expo-blur: `dimezisBlurViewSdk31Plus` still blurs below Android 12

This is a minimal reproduction for an expo-blur bug on SDK 58 (`expo` 58.0.17, `expo-blur` 58.0.5, `react-native` 0.88.0), New Architecture.

## What the app contains

`App.tsx` renders a list of colored rows inside a `BlurTargetView` and lays a `BlurView` header over it. The header uses `blurTarget` pointing at that view and `blurMethod="dimezisBlurViewSdk31Plus"`. According to the docs, that method uses the Dimezis blur on Android 12 (API 31) and newer, and falls back to `'none'` on older versions, which renders a semi-transparent view instead of a blur.

## How to reproduce it

Build the app and run it on an Android 11 or older device or emulator (I used an API 28 emulator):

```sh
npm install
npx expo run:android --variant release
```

Scroll the list up a little, so a colored row passes under the header.

On Android 12 and newer the header blurs the rows behind it, as intended (screen 1). On API 28 it should only show its tint, but it still blurs them (screen 2). With the fix described below, API 28 shows the tint as documented (screen 3).

![API 34 blurs (1), API 28 still blurs (2), API 28 with the fix shows the tint (3)](shots/compare.png)

In our app this software blur also crashed while scrolling on Android 9 with `Underflow in restore`, because it redraws the whole page every frame. The small example here does not crash, but it shows that the blur runs although it shouldn't.

## Why it happens, and a fix

`ExpoBlurView.setBlurTargetId` calls `configureBlurView()`, which calls `blurView.setupWith(target)`. That turns the Dimezis blur on. Afterwards nothing re-applies the blur method, so the check for API 31 in `setBlurMethod` never runs again, and the blur stays enabled below API 31. Radius and tint are not re-applied either.

[`fix/expo-blur.patch`](fix/expo-blur.patch) calls `applyCurrentBlurSettings()` right after `configureBlurView()` in `setBlurTargetId`, the same way `onAttachedToWindow` already does. That re-applies method, radius and tint once the target has been set.

To try it, note that Expo modules ship a prebuilt AAR since SDK 58, so a patched source file is ignored unless the module is built from source. This repo already sets that up in `package.json` (`expo.autolinking.android.buildFromSource: ["expo-blur"]`). Apply the patch and rebuild:

```sh
(cd node_modules/expo-blur && patch -p1 < ../../fix/expo-blur.patch)
npx expo run:android --variant release
```
