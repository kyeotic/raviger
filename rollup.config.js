import replace from 'rollup-plugin-replace'
import packageJson from './package.json'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

const deps = Object.keys(packageJson.dependencies || []).concat(
  Object.keys(packageJson.peerDependencies)
)

const terserConfig = terser({
  ecma: '2019',
  mangle: {
    keep_fnames: true,
    keep_classnames: true,
  },
  compress: {
    keep_fnames: true,
    keep_classnames: true,
  },
  output: {
    comments: false,
  },
})

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
      terserConfig,
    ],
  },
]
