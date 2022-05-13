import _ from "underscore";

export default {
	name: 'list',
	props: {
		items: {
			type: Array,
			required: true,
		},

		elheight : {
			type : Number,
			default : 0
		},

		selectMultiple : Boolean
	},
	computed: {
		readyItems: function () {
			return this.items;
		},

		selectionLength : function(){
			return _.toArray(this.selection || {}).length
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

			console.log('this.elheight', this.elheight)

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
			if (this.selectMultiple){
				this.selection = {}
				this.selection[i] = true
			}
				
		},

		leaveSelectionMode : function(){
			this.selection = null
		},

		selectionSuccess : function(){

			var selected = _.filter(this.items, (v, i) => {
				return this.selection[i]
			})

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

			if(_.isEmpty(this.selection)) this.selectionCancel()
		}
	}
}