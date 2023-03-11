var prependcssvars = `
@import "~@/styles/variables/common.sass"
@import "~@/styles/mixins/common.sass"
`
var emptypublicpath = process.argv.find(function (el) { return el == '--emptypublicpath'; })

var production = process.env.NODE_ENV === 'production' ? true : false

process.env.VUE_APP_VERSION = process.env.npm_package_version

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
		/*webpackBundleAnalyzer: {
			openAnalyzer: false,
			analyzerMode: "disabled",
		},*/
	},

	
	configureWebpack: {
		optimization: {
			splitChunks: {
				minSize: 30000,
				maxInitialRequests : 10
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
