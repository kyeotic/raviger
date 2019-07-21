const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')

module.exports = {
  input: 'example/src/index.js',
  output: {
    file: 'example/dist/app.js',
    format: 'iife',
    sourcemap: true,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  external: ['react', 'react-dom'],
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
