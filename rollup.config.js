import replace from 'rollup-plugin-replace'
import packageJson from './package.json'
import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import { DEFAULT_EXTENSIONS } from '@babel/core'

const deps = Object.keys(packageJson.dependencies || []).concat(
  Object.keys(packageJson.peerDependencies)
)

const terserConfig = terser({
  keep_fnames: true,
  output: {
    comments: false,
  },
})

const babelConfig = {
  exclude: 'node_modules/**',
  sourceMaps: true,
  inputSourceMap: true,
  babelHelpers: 'bundled',
  extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
}

const entryFile = 'src/main.ts'

export default [
  {
    input: entryFile,
    output: {
      file: 'dist/main.js',
      format: 'cjs',
      name: 'raviger',
      globals: {
        react: 'React',
      },
      interop: false,
      sourcemap: true,
    },
    external: deps,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      typescript(),
      babel({
        ...babelConfig,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { node: '6.10' },
            },
          ],
          '@babel/preset-react',
        ],
      }),
      terserConfig,
    ],
  },
  {
    input: entryFile,
    output: {
      file: 'dist/module.js',
      format: 'esm',
      name: 'raviger',
      sourcemap: true,
      globals: {
        react: 'React',
      },
    },
    external: deps,
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      typescript(),
      babel({
        ...babelConfig,
        presets: [
          [
            '@babel/preset-env',
            {
              targets: '>3%, not ie 11, not dead',
            },
          ],
          '@babel/preset-react',
        ],
      }),
      terserConfig,
    ],
  },
]
