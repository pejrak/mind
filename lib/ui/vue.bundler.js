const ENVIRONMENT = (process.env.NODE_ENV || 'development')
const Path = require('path')
const plugins = []
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const rules = [
  {
    test: /\.css$/,
    use: [
      'style-loader',
      'css-loader'
    ]
  },
  { test: /.(eot|woff|ttf)([?]?.*)$/, loader: 'file-loader' },
  {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader'
    }
  },
]


rules.push({
  test: /\.pug$/,
  loader: 'pug-plain-loader'
})

plugins.push(
  new VueLoaderPlugin()
)

console.info('Packing VUE UI...', { ENVIRONMENT })

module.exports = {
  devServer: {
    compress: true,
    disableHostCheck: true,
    port: 8094,
  },
  devtool: (
    ENVIRONMENT === 'development' ? 'inline-source-map' : 'source-map'
  ),
  entry: {
    main: Path.resolve(__dirname, './main/index.js')
  },
  mode: ENVIRONMENT,
  module: {
    rules,
  },
  output: {
    path: Path.resolve(__dirname, '../../public/internal'),
    publicPath: '/internal/',
    filename: '[name]-bundle.js'
  },
  plugins,
}