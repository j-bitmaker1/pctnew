import _ from 'underscore';
import { mapState } from 'vuex';
export default {
	name: 'filesystem',
	props: {
		initialroot : Number,
		
		/*context : {
			type : String,
			default : "filesystem"
		},*/

		select : {
			type : Object,
			default : () => {
				return {
					context : 'filesystem'
				}
			}
		},

		fclass : {
			type : String,
			default : 'mini'
		},

		purpose : String
	},

	components : {},

	data : function(){

		return {
			loading : false,
			current : {},
			currentroot : undefined,
			history : [],

			moving : null,
		}

	},

	created : function() {
		this.history.push(this.root);

		this.core.on('updateintegrations', 'filesystem', () => {
			this.load('', {
				reload: true,
			});
		});

		this.load();

	},

	destroyed() {
		this.core.off('updateintegrations', 'filesystem');
	},

	watch: {
		//$route: 'getdata'
	},
	computed: mapState({
		auth : state => state.auth,
		root : function(){

			if(typeof this.currentroot != 'undefined') return this.currentroot

			return this.initialroot || '0'

		},

		menu : function(){
			return [
				{
					text : 'labels.moveitems',
					icon : 'fas fa-arrows-alt',
					action : this.moveItemsMode
				},
	
				{
					text : 'labels.deleteitems',
					icon : 'fas fa-trash',
					action : this.deleteitems
				}

			]
		},

		contents : function(){
			return this.current.content
		},

		showback : function(){

			if (this.history.length > 1) return true

			return this.root != '0' ? true : false
		},

		filtered : function(){
			return _.filter(this.contents, (c) => {

				var e = true

				if (this.moving){
					e = e && !_.find(this.moving, function(m){
						return m.id == c.id
					})
				}

				if(this.filter){
					e = this.filter(c)
				}

				/*if (this.select){
					if(this.select.type == 'folder' && c.type != this.select.type) e = false
				}*/


				return e
			})
			
		},

		sorted : function(){

			return _.sortBy(this.filtered, function(c){

				if(c.type == 'folder') return 0
				if(c.type == 'portfolio') return 1

			})
		}
	}),

	methods : {
		load : function(id, p = {}){
			this.loading = true
			this.selected = null

			if (id) {
				this.setcurrentroot(id)
			}

			return this.core.api.filesystem.get(this.root, p).then(r => {

				this.current = r

				return Promise.resolve(r)
			}).catch(e => {
				console.error(e)
			}).finally(() => {
				this.loading = false
			})

		},

		setcurrentroot : function(r){
			this.currentroot = r
			this.$emit('directoryChange', r)
		},

		down : function(r){
			this.setcurrentroot(r)
			this.history.push(r)

			this.load().then(r => {
				this.movescroll()
			})
		},

		up : function(){
			if (this.history.length > 1){

				this.setcurrentroot(this.history[this.history.length - 2])

				this.history.pop();
			}
			else{
				this.setcurrentroot(0)
			}

			this.load().then(r => {
				this.movescroll()
			})
			
		},

		movescroll : function(itemid){
			setTimeout(() => {
				if (itemid){
					if (this.$refs[itemid]){
						this.$refs['items'].scrollLeft = this.$refs[itemid].offsetLeft
					}	
				}
				else{
					this.$refs['items'].scrollLeft = 0
				}
				
			}, 50)

		},

		open : function(c){
			if (c.type == 'folder'){
				this.down(c.id)
			}

			if(this.purpose == 'selectFolder') return

			if(c.type == 'portfolio'){

				if(this.moving) return

				this.$emit('open', c)

			}
		},

		create : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_filesystem_edit',
				module : "filesystem_edit",
				caption : "Create Folder",

				data : {
					type : 'folder',
					rootid : this.current.id
				},

				events : {
					success : (data) => {
						this.load().then(r => {
							this.movescroll(r.id)
						})
					}
				}
			})
		},

		deleteitems : function(items){

			this.$store.commit('globalpreloader', true)

			return Promise.all(_.map(items, (item) => {

				if(item.attributes.nonremovable) return Promise.resolve()

				return this.core.api.filesystem.delete[item.type]({
					id : item.id,
					from : this.current.id
				})

			})).then(r => {

				this.moving = null

				this.$store.commit('icon', {
					icon: 'success'
				})
				
				return this.load()

			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})

		},

		moveItemsMode : function(items){
			this.moving = items
			this.movescroll()
		},

		cancelmoving : function(){
			this.moving = null
			this.movescroll()
		},

		placehere : function(){

			this.$store.commit('globalpreloader', true)

			var haserrors = 0
			var l = this.moving.length

			return this.core.filesystem.move(this.moving, this.current).then(r => {
				return this.load()
			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})



			
		},
		//// another
		selectCurrent : function(){
			
			this.$emit('selected', [this.current])

			this.close()
			
		},

		

		close : function(){
			this.$emit('close')
		},

		removefolder : function(){

			this.$store.commit('globalpreloader', true)

			return this.core.api.filesystem.delete['folder']({
				id : this.current.id,
				from : this.current.from
			}).then(() => {
				this.$store.commit('icon', {
					icon: 'success'
				})

				

				this.up()
			}).catch(e => {
				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})
			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})
		},

		moveportfoliostofolder : function(){
			this.core.vueapi.selectPortfolios((portfolios) => {

				return this.$dialog.confirm(
					'Do you really want to move '+portfolios.length+' portfolio(s) to '+this.current.name+'?', {
					okText: 'Yes',
					cancelText : 'No'
				})
		
				.then((dialog) => {

					this.$store.commit('globalpreloader', true)

					var fsportfolios = _.map(portfolios, (portfolio) => {
						return this.core.filesystem.portfolioToFsObject(portfolio)
					})
					
					return this.core.filesystem.move(fsportfolios, this.current).then(r => {

						this.load()
						
					}).catch(e => {

						this.$store.commit('icon', {
							icon: 'error',
							message: e.error
						})

					}).finally(() => {
						this.$store.commit('globalpreloader', false)
					})

				}).catch( e => {
					
				})
				
			}, {
				caption : "Select portfolios"
			})
		},

		openmenu : function(){
			var menu = []

			if(!this.current.attributes.readonly) { 

				menu.push({
					text : 'labels.moveportfoliostofolder',
					icon : 'fas fa-suitcase',
					action : this.moveportfoliostofolder
				})

			}

			if(!this.current.attributes.nonremovable) { 

				menu.push({
					text : 'labels.remove',
					icon : 'fas fa-times',
					action : this.removefolder
				})

			}

			if (this.current.attributes.isIntegration) {
				menu.push({
					text : 'labels.refreshintegration',
					icon : 'fas fa-redo-alt',
					action : () => {
						this.core.api.pctapi.integrations
                            .update(this.current.name)
                            .then(() => this.$store.commit('icon', {
								icon: 'success',
								message: 'Integration update started'
							}));
					},
				})
			}

			this.core.vueapi.listmenu(menu)
		}
	},
}