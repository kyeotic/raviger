const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const packageJson = require('./package.json')
const { terser } = require('rollup-plugin-terser')

const deps = Object.keys(packageJson.dependencies || []).concat(
  Object.keys(packageJson.peerDependencies)
)

module.exports = [
  {
    input: 'src/main.js',
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      name: 'raviger',
      globals: {
        react: 'React'
      },
      interop: false,
      sourcemap: true
    },
    external: deps,
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
              targets: { node: '6.10' }
            }
          ],
          '@babel/preset-react'
        ],
        sourceMaps: true,
        inputSourceMap: true
      }),
      terser()
    ]
  },
  {
    input: 'src/main.js',
    output: {
      file: 'dist/module.js',
      format: 'esm',
      name: 'raviger',
      sourcemap: true,
      globals: {
        react: 'React'
      }
    },
    external: deps,
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
      }),
      terser()
    ]
  }
]
