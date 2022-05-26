var prependcssvars = `
@import "~@/styles/variables/common.sass"
@import "~@/styles/mixins/common.sass"
`
console.log('process.env.publicPath', process.env.publicPath)
console.log('process.argv', process.argv)

var emptypublicpath = process.argv.find(function(el) { return el == '--emptypublicpath'; })

console.log('emptypublicpath', emptypublicpath)

module.exports = {

	publicPath: emptypublicpath ? '' : process.env.publicPath || '/',
	lintOnSave: false,

	css: {
		loaderOptions: {
			sass: {
				additionalData: prependcssvars,
				sassOptions : {
					independedSyntax: true
				}
			},
		}
	},

	pluginOptions: {
		cordovaPath: 'src-cordova'
	},

	runtimeCompiler: true,
	
};
