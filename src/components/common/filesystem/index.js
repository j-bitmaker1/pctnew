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
		this.history.push(this.root)


		this.load()

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
		load : function(id){
			this.loading = true
			this.selected = null

			if(id) this.currentroot = id

			return this.core.api.filesystem.get(this.root).then(r => {

				this.current = r

				return Promise.resolve(r)
			}).catch(e => {
				console.error(e)
			}).finally(() => {
				this.loading = false
			})

		},

		down : function(r){
			this.currentroot = r
			this.history.push(r)

			this.load().then(r => {
				this.movescroll()
			})
		},

		up : function(){
			if (this.history.length > 1){
				this.currentroot = this.history[this.history.length - 2]
				this.history.pop();
			}
			else{
				this.currentroot = 0
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


				//this.$router.push('portfolio/' + c.id)

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

			return Promise.all(_.map(this.moving, (item) => {

				var nameexist = _.find(this.current.content, (c) => {
					return item.type == c.type && item.name == c.name
				})

				if (nameexist){

					this.core.notifier.simplemessage({
						icon : "fas fa-exclamation-triangle",
						title : "Name exist",
						message : item.name + " exist in this folder"
					})

					haserrors++
					
					return Promise.resolve()
				}

				return this.core.api.filesystem.move[item.type]({
					id : item.id,
					to : this.root,
					from : this.current.id
				})

			})).then(r => {

				this.moving = null

				if(haserrors == l){
					return Promise.reject({
						error : "Operation failed"
					})
				}

				if(!haserrors){
					this.$store.commit('icon', {
						icon: 'success'
					})
				}
				else{
					this.$store.commit('icon', {
						icon: 'warning',
						message : 'The operation was partially successful'
					})
				}
				
				return this.load()

			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})

			//this.moving

			
		},
		//// another
		selectCurrent : function(){
			
			this.$emit('selected', [this.current])

			this.close()
			
		},

		close : function(){
			this.$emit('close')
		}
	},
}