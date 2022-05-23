import _ from 'underscore';
import { mapState } from 'vuex';

export default {
	name: 'filesystem',
	props: {
		initialroot : Number,
		

		select : Object,
		

		fclass : {
			type : String,
			default : 'mini'
		}
	},

	data : function(){

		return {
			loading : false,
			current : {},
			currentroot : undefined,
			history : [],

			selected : null,
			moving : null,

			menu : [
				{
					text : 'labels.moveitems',
					icon : 'fas fa-arrows-alt',
					action : 'moveItemsMode'
				},
	
				{
					text : 'labels.deleteitems',
					icon : 'fas fa-trash',
					action : 'deleteitems'
				}

			]
		}

	},

	created : function() {
		this.history.push(this.root)

		this.load()

		console.log('this.select', this.select)

		if (this.select && this.select.selected){
			this.selected = _.clone(this.select.selected)
		}
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

		selectOptions : function(){
			return {
				class : 'onobject',
				selected : this.selected,
				disableActions : false,
				disable : (this.select && !this.select.multiple) ? true : false,
				filter : (item) => {

					console.log("FILTER SELECT", item)

					if (this.select){
						if(this.select.type != 'folder' && item.type == 'folder') return false
					}

					return true
				}
			}
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

				if (this.select){
					if(this.select.type == 'folder' && c.type != this.select.type) e = false
				}

				console.log("E", e, c)

				return e
			})
			
		},

		sorted : function(){

			console.log('this.filtered', this.filtered)

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

			if(c.type == 'portfolio'){

				if(this.moving) return
				if(this.select) {
					this.$emit('selected', [c])
					return
				}

				this.$router.push('portfolio/' + c.id)

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

		selectionChange : function(items){
            this.$emit('selectionChange', items)
        },

		selectionSuccess : function(items){
			if (this.select){
				this.$emit('selected', items)
			}
			else{
				this.selected = items
			}

			console.log('this.selected', this.selected)
			
		},

		
		selectionCancel : function(){
			this.selected = null

			this.$emit('selectionCancel')
		},

		menuaction : function(action){
			if (this[action]){
				this[action]()
			}   
		},

		deleteitems : function(){

			this.$store.commit('globalpreloader', true)

			return Promise.all(_.map(this.selected, (item) => {

				console.log('item', item)

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

		moveItemsMode : function(){
			this.moving = this.selected
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

		selectCurrent : function(){
			
			this.$emit('selected', [this.current])

			this.close()
			
		},

		close : function(){
			this.$emit('close')
		}
	},
}