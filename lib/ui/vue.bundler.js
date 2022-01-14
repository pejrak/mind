import * as Path from 'path'
import VueLoaderPlugin from 'vue-loader'
import { directory } from '../system/directory.js'

const ENVIRONMENT = (process.env.NODE_ENV || 'development')
const plugins = []
// const WriteFilesPlugin = require('write-file-webpack-plugin')

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
  new VueLoaderPlugin.VueLoaderPlugin(),
  // new WriteFilesPlugin()
)

console.info('Packing VUE UI...', { ENVIRONMENT })

export default {
  devServer: {
    allowedHosts: 'all',
    compress: true,
    devMiddleware: {
      writeToDisk: true,
    },
    port: 8094,
  },
  devtool: (
    ENVIRONMENT === 'development' ? 'inline-source-map' : 'source-map'
  ),
  entry: {
    main: Path.resolve(directory, './lib/ui/main/index.js')
  },
  mode: ENVIRONMENT,
  module: {
    rules,
  },
  output: {
    path: Path.resolve(directory, './public/internal'),
    publicPath: '/internal/',
    filename: '[name]-bundle.js'
  },
  plugins,
}
