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
		}
	},
	computed: {
		readyItems: function () {
			return this.items;
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
		}
	}
}