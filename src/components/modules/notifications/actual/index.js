import { mapState } from 'vuex';
import notification from "../notification/index.vue";
import f from "@/application/functions.js"
export default {
    name: 'notifications_actual',
    props: {
    },

    components: { notification },

    data: function () {

        return {
            loading: false,
            processInterval: null,
            autohide: 3000,
            intervalTime : 200,
            directionsShowMore: {
                left: {
                    distance: 100,
                    direction: 'left'
                },
                top: {
                    distance: 100,
                    direction: 'top'
                },
                right: {
                    distance: 100,
                    direction: 'right'
                },
                bottom: {
                    distance: 100,
                    direction: 'bottom'
                }
            },
            directions: {
                left: {
                    distance: 100,
                    direction: 'left'
                },
                top: {
                    distance: 100,
                    direction: 'top'
                },
                right: {
                    distance: 100,
                    direction: 'right'
                },
                bottom: {
                    distance: 100,
                    direction: 'bottom'
                }
            },

            stopped : false,

            state: {}
        }

    },

    beforeDestroy() {
        if (this.processInterval) {
            clearInterval(this.processInterval)
            this.processInterval = null
        }
    },

    created() {
        this.processInterval = setInterval(() => {
            this.checkState()
        }, this.intervalTime)
    },

    watch: {
        //$route: 'getdata'
    },
    computed: mapState({
        auth: state => state.auth,
        notifications: state => state.notifications,

        maxCount: function () {
            return 1
        },

        filtered: function () {
            return _.filter(this.notifications, (n, i) => {
                return i < this.maxCount
            })
        },

        unfilteredCount: function () {
            return this.notifications.length - this.filtered.length
        }
    }),

    methods: {
        hide: function (notification, asRead) {

            var id = notification.id || notification.eventid

            this.$store.commit('removeNotification', notification)

            if (this.state[id]) {
                this.$delete(this.state, id)
            }

            if (asRead){
                this.core.api.notifications.makeRead(notification).catch(e => {
                    console.error(e)
                })
            }
        },
        swiped: function (notification, e) {

            if(e == 'bottom'){

                this.iteraction(notification)
                return
            }

            this.hide(notification, true)
        },

        showmore : function(){

            if (this.$route.name != 'index')
                this.$router.push('/')
                
        },

        swipedShowMore: function (e) {

            if(e == 'bottom'){

                this.showmore()
                
            }

            this.$store.commit('removeNotifications')
            this.state = {}
        },

        checkState() {

            if(this.stopped) return

            _.each(this.filtered, (notification) => {
                var id = notification.id || notification.eventid

                if (!this.state[id]) {
                    this.$set(this.state, id, {
                        showed: this.autohide,
                        iteraction: false
                    })
                }

                var s = this.state[id]

                console.log('s.showed', s.showed)

                if (s.showed <= 0) {
                   
                    this.hide(notification)

                    return
                }

                if (this.core.focus){
                    this.$set(this.state[id], 'showed', s.showed - this.intervalTime)
                }

                
            })
        },
        iteraction: function (notification) {

            var id = notification.id || notification.eventid

            if (this.state[id]) {
                this.$set(this.state[id], 'iteraction', true)
            }

        },

        starttouch : function(){
            this.stopped = true
        },

        endtouch : function(){
            this.stopped = false
        }, 
    },
}