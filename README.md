# Simple test slot machine for [Foxium](https://www.foxium.com/)
[![Build Status](https://github.com/CrazyFlasher/foxium-test-slot/actions/workflows/test.yml/badge.svg "Github Actions")](https://github.com/CrazyFlasher/foxium-test-slot/actions/workflows/test.yml)

Project is created with [TypeScript](https://www.typescriptlang.org/) using main libraries:

* [DomWires](https://github.com/CrazyFlasher/domwires-ts) - dependency injection framework created my CrazyFlasher (me).
* [PixiJS](https://pixijs.com) - rendering framework.
* [ESbuild](https://esbuild.github.io/) - bundler for browser environment.
* [Mocha](https://mochajs.org/) - test framework.
* [ESLint](https://eslint.org/) - code linting tool.

### Build and run locally
`npm install`

`npm run package`

`npm run run`

### Assets
Scene assets are managed using [Adobe Animate](https://www.adobe.com/ee/products/animate.html) and integrated to project using [PixiAnimate](https://github.com/pixijs/animate) library.
Assets from Animate are being exported in 3 qualities: high (max atlas size 4096), medium (2048) and low (1024).
Exported pngs and being compressed using [pngquant](https://github.com/papandreou/node-pngquant).
Needed quality for current device is being picked using [this logic](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/src/com/foxium/slot/common/AssetsQuality.ts) at run-time.
Also run-time quality can be forced by passing query param `?quality=high` (medium or low).

### App configuration
App is configured in [AppConfig.ts](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/src/AppConfig.ts) and [FactoriesConfig.ts](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/src/FactoriesConfig.ts).
Config values can be overridden in [config.json](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/assets/template/config.json) at run-time without rebuilding the code.

### Logic
Reels and configured in [AppConfig.ts](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/src/AppConfig.ts).
When reels are spinning, user sees correct symbols order.
After we have spin result (which currently is being picked from [results.json](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/assets/template/results.json)), we find correct position of the combination on pre-configured reels.
If current combination from [results.json]() is missing on reel - client will fall with error.

### Localization
Texts are loaded from [texts.csv](https://github.com/CrazyFlasher/foxium-test-slot/blob/main/assets/template/texts.csv).
Language can be forced by passing query param `?lang=en` (ru or est).