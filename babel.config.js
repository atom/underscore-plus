module.exports = {
  presets: [
    [
      "babel-preset-atomic",
      {
        flow: false,
        react: false,
      },
    ],
  ],
  exclude: "node_modules/**",
  sourceMap: "inline",
}
