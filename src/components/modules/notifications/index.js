import { mapState } from 'vuex';
import notification from "@/components/modules/notifications/notification/index.vue";
import { _ } from 'core-js';
export default {
	name: 'notifications',
	props: {
		actions: Array
	},

	data: function () {

		return {
			loading: false,
			mode : 'onlyunread', // all
			directions: {
				left: {
					distance: 100,
					direction: 'left'
				}
			},

			counts : {}

		}

	},

	created() {
		this.core.on('notification', this.name, (notification) => {
			if (this.$refs['list']) this.$refs['list'].dataunshift(notification, "id")
		})

		this.core.on('readNotification', this.name, (ids) => {

			if (this.$refs['list']) {
				
				_.each(ids, (id) => {
					this.$refs['list'].datadeleted({id}, "id")
				})

			}
		})

		
	},

	beforeDestroy() {
		this.core.off('notification', this.name)
		this.core.off('readNotification', this.name)
	},

	components: {
		notification
	},

	watch: {
		tscrolly: function () {

			if (this.$refs['list']) {

				if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight) {
					this.$refs['list'].next()
				}

			}

		}
	},
	computed: mapState({
		dheight: state => state.dheight,
		tscrolly: state => state.tscrolly,
		auth: state => state.auth,

		payload: function () {
			return this.mode == 'onlyunread' ? {
				includeOnlyUnreadFilter: true
			} : {}
		},

		menu: function () {
			return [

				{
					text: 'labels.makeasreadnotifications',
					icon: 'fas fa-trash',
					action: this.makeAsReadSelection
				}

			]
		}
	}),


	methods: {
		changeRead : function(){
			if(this.mode == 'onlyunread') {this.mode = 'all'; return}
			if(this.mode == 'all') {this.mode = 'onlyunread'; return}

		},
		makeAsReadSelection : function(notification){
			return this.makeAsRead(_.toArray(notification))
		},
		makeAsRead: function (notification) {

			console.log('notification', notification)

			if(!_.isArray(notification)) notification = [notification]

			this.core.api.notifications.makeRead(notification, {showStatusFailed : true})

			_.each(notification, (notification) => {
				if (this.$refs['list']) this.$refs['list'].datadeleted(notification, "id")
			})
			
		},

		clearAll : function(){
			this.core.api.notifications.makeReadAll({preloader : true, showStatusFailed : true}).then(r => {

				if (this.$refs['list'])
					this.$refs['list'].reload()

			})
		},

		setcount : function(v){
			this.$set(this.counts, this.mode, v)
		}
	},
}