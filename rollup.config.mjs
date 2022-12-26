import { createPlugins } from "rollup-plugin-atomic"

const plugins = createPlugins(["js", "babel"])

export default [
  {
    input: "src/underscore-plus.mjs",
    output: [
      {
        dir: "lib",
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: "src/underscore-plus.mjs",
    output: [
      {
        dir: "modules",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins
  },
];
