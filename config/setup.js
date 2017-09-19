const { join } = require('path');
const webpack = require('webpack');
const ExtractText = require('extract-text-webpack-plugin');
const SWPrecache = require('sw-precache-webpack-plugin');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const HTML = require('html-webpack-plugin');
const uglify = require('./uglify');
const OfflinePlugin = require('offline-plugin');

const root = join(__dirname, '..');
// new SWPrecache({
//   cacheId: 'sw-preact-starter',
//   filename: 'service-worker.js',
//   dontCacheBustUrlsMatching: /./,
//   navigateFallback: 'index.html',
//   minify: true,
//   staticFileGlobsIgnorePatterns: [/\.map$/]
// })
module.exports = isProd => {
	// base plugins array
	const plugins = [
		new Clean(['dist'], { root }),
		new Copy([{ context: 'src/static/', from: '**/*.*' }]),
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
		new HTML({ template: 'src/index.html' }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
		})
	];

	if (isProd) {
		plugins.push(
			new webpack.LoaderOptionsPlugin({ minimize:true }),
			new webpack.optimize.UglifyJsPlugin(uglify),
			new ExtractText('styles.[hash].css'),
      new SWPrecache({
        cacheId: 'preact-service-worker',
        filename: 'service-worker.js',
        directoryIndex: '/',
        staticFileGlobs: [
          '/',
          './dist/manifest-*.json',
          // './build/public/bundle-*.{css,js}', // depends if we inlineJs, inlineCss or not
          './dist/img/*.{gif,png,svg}' // will not preache /icons
        ],
        navigateFallback: '/',
        dynamicUrlToDependencies: {
          '/': ['./dist/manifest.json', './package.json'] // bust cache when these change
        },
        skipWaiting: true,
        stripPrefix: './dist',
        runtimeCaching: [{
          urlPattern: /\/posts/, // handle remote api call
          handler: 'cacheFirst'
        }]
      })
		);
	} else {
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin()
		);
	}

	return plugins;
};
