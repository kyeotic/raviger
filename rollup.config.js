const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/lib.js',
    format: 'umd',
    name: 'raviger',
    globals: {
      react: 'React'
    }
  },
  external: ['react'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '>3%, not ie 11, not dead'
          }
        ],
        '@babel/preset-react'
      ],
      sourceMaps: true,
      inputSourceMap: true
    })
  ]
}
