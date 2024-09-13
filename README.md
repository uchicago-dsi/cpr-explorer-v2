# Quickstart

1. Install docker
2. Obtain the propert env variables and create a .env file containing them
3. run `docker build .`
4. run `docker-compose up dev` to develop
5. run `docker-compose up build` to build (outputs to `dist` folder)

## env requirements
```
VITE_DATA_ENDPOINT = ... // Open Spatial Lab NECTR endpoint
VITE_MAPBOX_TOKEN = ... // mapbox API key

```

## Output
In `dist` after running the build, you'll find a folder, `assets`, containing the relevant code chunks and graphics. Deploy this on your website and add the minimal HTML from `index.html` to your desired page. 

# Boilerplate: React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
