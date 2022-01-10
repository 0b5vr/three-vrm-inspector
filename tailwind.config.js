module.exports = {
  content: [
    './index.html',
    './src/**/*.tsx',
  ],
  theme: {
    fontFamily: {
      'sans': [ 'Roboto', 'sans-serif' ],
      'mono': [ 'Roboto Mono', 'monospace' ],
    },
    extend: {
      width: {
        '120': '30rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
};
