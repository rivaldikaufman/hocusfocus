# HocusFocus Metronome

A modern, focus-enhancing Metronome web application built with React, Tailwind CSS v4, and Vite.

## Features

- **Precise Timing**: Uses Web Audio API for accurate metronome ticks.
- **Visual Feedback**: Pulse animation synced with the beat.
- **Adjustable BPM**: Slider and manual input (40-200 BPM).
- **Preset Modes**: Quick access to Slow, Medium, and Fast Focus tempos.
- **Sound Options**: Choose from Classic Click, Wood Block, Digital Beep, or Soft Tick.
- **Volume Control**: Real-time volume adjustment.
- **Dark/Light Mode**: Toggle between themes.
- **Mobile Friendly**: Includes Wake Lock support to keep the screen active.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- Lucide React (Icons)

## Getting Started

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run dev`.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> e6026c1 (Initial commit: Metronome app with Tailwind v4, Responsive Design, and Volume Slider)
