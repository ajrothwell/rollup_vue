import globals from 'rollup-plugin-node-globals';
import vue from 'rollup-plugin-vue';

import fs from 'fs';
import path from 'path';
const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
const external = Object.keys(pkg.dependencies || {});

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "esm",
    globals: {
      vue: 'Vue',
    },
  },
  external,
  plugins: [
    globals(),
    // babel({
    //   exclude: "node_modules/**",
    //   presets: [
    //     ["@babel/preset-env", { modules: false }],
    //   ]
    // }),
    vue({
      css: true,
    })
  ],
};
