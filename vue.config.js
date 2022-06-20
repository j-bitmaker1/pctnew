var prependcssvars = `
@import "~@/styles/variables/common.sass"
@import "~@/styles/mixins/common.sass"
`
var emptypublicpath = process.argv.find(function (el) { return el == '--emptypublicpath'; })


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
		cordovaPath: 'src-cordova'
	},

	runtimeCompiler: true,

	pwa: {
		name: 'Portfolio crash test',
		
		themeColor: '#FFFFFF',
		msTileColor: '#000000',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'white',

		// настройки манифеста
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

		// настройка workbox-плагина
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: './src/service-worker.js',
		},

		
	}

};
