import _ from "underscore";

export default {
	name: 'list',
	props: {
		items: {
			type: [Array, Object],
			required: true,
		},

		elheight : {
			type : Number,
			default : 0
		},

		selectOptions : {
			type : Object,
			default : () => {
				return {
					class : 'leftselection',
					selected : null,
					disableActions : false,
					disable : true,
					filter : (item) => {return true}
				}
			}
		},


	},
	computed: {
		readyItems: function () {
			return this.items;
		},

		selectionLength : function(){
			return _.toArray(this.selection || {}).length
		},

		selectedItems : function(){
			return _.filter(this.items, (item, i) => {
				return this.selection && this.selection[item.id || item.ID || (i + 1)]
			})
		}
	},

	created : function(){

		console.log('this.selectOptions', this.selectOptions)

		if (this.selectOptions.selected){
			this.selection = _.clone(this.selectOptions.selected)
		}

	},

	data : function(){
		return {
			selection : null,
		}
	},

	methods: {

		beforeEnter: function (el) {
			el.style.opacity = 0
			el.style.height = 0
		},
		enter: function (el, done) {
			var delay = el.dataset.index * 50


			setTimeout( () => {
				Velocity(
					el,
					{ opacity: 1, height: this.elheight + 'px' },
					{ complete: done }
				)
			}, delay)

		},
		leave: function (el, done) {
			var delay = el.dataset.index * 50
			setTimeout(function () {
				Velocity(
					el,
					{ opacity: 0, height: 0 },
					{ complete: done }
				)
			}, delay)
		},
		click : function(item){
			this.$emit('click', item)
		},

		enterSelectionMode : function(i){
			if(!this.selectOptions.disable){
				this.selection = {}

				var item = _.find(this.items, (item, index) => {
					return item.id || item.ID || (index + 1) == i
				})

				if(!item || !this.selectOptions.filter || this.selectOptions.filter(item)){
					this.selection[i] = true
				}

				console.log('item', item, this.selectOptions.filter(item))
				

				this.$emit('selectionChange', this.selectedItems)
			}
				
		},

		leaveSelectionMode : function(){
			this.selection = null

			this.selectionCancel()
		},

		selectionSuccess : function(){

			var selected = this.selectedItems

			this.$emit('selectionSuccess', selected)

			this.selection = null

		},

		selectionCancel : function(){


			this.$emit('selectionCancel')

			this.selection = null
		},

		select : function(i){

			if(this.selection[i]) this.$delete(this.selection, i)

			else this.$set(this.selection, i, true)

			this.$emit('selectionChange', this.selectedItems)

			if(_.isEmpty(this.selection)) this.selectionCancel()
		},

		scroll : function(prop, value){
			if(this.$refs.simplelist) this.$refs.simplelist[prop] = value
		}
	}
}