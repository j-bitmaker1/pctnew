var prependcssvars = `
@import "~@/styles/variables/common.sass"; 
@import "~@/styles/mixins/common.sass";
`


module.exports = {

	publicPath: '',
	lintOnSave: false,

	css: {
		loaderOptions: {
			sass: {
				additionalData: prependcssvars,
			},
		}
	},

	pluginOptions: {
		cordovaPath: 'src-cordova'
	},

	runtimeCompiler: true,
	
};
