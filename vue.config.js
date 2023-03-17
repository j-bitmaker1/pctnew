var prependcssvars = `
@import "~@/styles/variables/common.sass"
@import "~@/styles/mixins/common.sass"
`
var emptypublicpath = process.argv.find(function (el) { return el == '--emptypublicpath'; })

var production = process.env.NODE_ENV === 'production' ? true : false

process.env.VUE_APP_VERSION = process.env.npm_package_version


const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),

        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        new MomentLocalesPlugin({
            localesToKeep: ['es-us', 'ru'],
        }),
    ],
};

module.exports = {

	publicPath: emptypublicpath ? '' : process.env.publicPath || '/',
	lintOnSave: false,

	css: {
		loaderOptions: {
			sass: {
				additionalData: prependcssvars,
				sassOptions: {
					independedSyntax: true
				}
			},
		}
	},

	pluginOptions: {
		cordovaPath: 'src-cordova',
		webpackBundleAnalyzer: {
			openAnalyzer: false,
			analyzerMode: "disabled",
		},
	},

	
	configureWebpack: {
		plugins : [
			new MomentLocalesPlugin(),
			new MomentLocalesPlugin({
				localesToKeep: ['es-us'],
			}),
		],
		optimization: {
			splitChunks : {

				chunks: 'async',
				minChunks: 4,
				maxInitialRequests: 5,
				minSize: 250000,
				maxAsyncRequests: 8,
				cacheGroups: {
					default: false,
					common: {
						chunks: 'all',
						test: /[\\/]src[\\/](.*)[\\/]/,
						name: 'common',
						minChunks: 1,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 60,
						reuseExistingChunk: true
					},
					styles: {
						name: 'styles',
						test: /\.(sa|sc|c)ss$/,
						chunks: 'all',
						enforce: true,
						reuseExistingChunk: true
					},
					runtimeChunk: {
						name: 'manifest'
					}
				}

			
			},
			
			
			concatenateModules: production,
			flagIncludedChunks: production,

			
		},

		
	
	},

	runtimeCompiler: true,

	pwa: {
		name: 'Portfolio crash test',
		
		themeColor: '#FFFFFF',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'white',

		manifestOptions: {
			short_name : "PCT",
			start_url : '.',
			display: 'standalone',
			background_color: '#FFFFFF',
			icons: [{
				"src": "icon.png",
				"type": "image/png",
				"sizes": "192x192"
			}]
		},

		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: './src/service-worker.js',
		},

		
	}

};
