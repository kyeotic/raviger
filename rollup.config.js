module.exports = {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    globals: {
      react: 'React'
    }
  },
  external: ['react', 'react-dom']
}
