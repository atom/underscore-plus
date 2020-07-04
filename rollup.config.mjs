import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

let plugins = [
  babel(),

  // so Rollup can find externals
  resolve({ extensions: ["ts", ".js"], preferBuiltins: true }),

  // so Rollup can convert externals to an ES module
  commonjs(),
];

// minify only in production mode
if (process.env.NODE_ENV === "production") {
  plugins.push(
    // minify
    terser({
      ecma: 2018,
      warnings: true,
      compress: {
        drop_console: false,
      },
    })
  );
}

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
    plugins: plugins,
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
    plugins: plugins.slice(0,-1), // no minification
  },
];
