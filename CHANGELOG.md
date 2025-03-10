# Change Log

## 2.0.0

- **BREAKING CHANGES**

  - Handle crashes when not a finite number (i.e., `NaN`, `Infinity`, or `-Infinity`) numeric props were passed to the component by overriding them with default values
    - Display new warning component in production, it can be overridden with new `dataErrorComponent` prop
    - Display warnings in dev mode
    - Return errors with new `onDataError` prop that accepts a callback function

- Fixes component height when `arcDegree` prop is more than 180 degrees
- Update example project to latest React Native version 0.78

## 1.2.2

- Dependency updates
- Maintenance

## v1.2.1

- Use arc calculations to render range values https://github.com/shipt/segmented-arc-for-react-native/pull/86
- Arc drawing fix https://github.com/shipt/segmented-arc-for-react-native/pull/87
- Readme updates

## v1.1.1

- Add a support for scaling the display scale of arc segments https://github.com/shipt/segmented-arc-for-react-native/pull/70
- Dependency updates

## v1.0.1

- Minor dependency updates
- Add example project installation instructions

## v1.0.0

- The Segmented Arc for React Native is ready to use!
