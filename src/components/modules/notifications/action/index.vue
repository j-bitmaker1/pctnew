<template>
<div class="action" @click="click">
	<i :class="action.icon" /> <span>{{action.text}}</span>
</div>
</template>

<style scoped lang="sass">
.action
	white-space: nowrap
	background: srgb(--neutral-grad-0)
	border-radius: 24px
	display: flex
	flex-wrap: nowrap
	align-items: center
	padding : $r
	color : srgb(--neutral-grad-3)
	padding-left: 0
	font-size: 0.8em
	padding-left: $r
	padding-right: 3 * $r
	i
		width: 33px
		text-align: center
</style>

<script>
import {
	mapState
} from 'vuex';

import f from '@/application/functions.js'

export default {
	name: 'notifications_action',
	props: {
		action: Object,
		event : Object
	},
	data : function(){
		return {
			types : {
				lead : this.openlead,
				client : this.openclient,
				portfolio : this.openportfolio
			}
		}
	},
	computed: mapState({}),

	methods: {

		openlead : function(id){

			console.log("ID", id)

			this.core.vueapi.openlead({
				leadid : id,
				notification : this.event
			}, {

			})

		},
		openclient : function(id){

			this.core.vueapi.openclient({
				clientid : id,
				notification : this.event
			}, {

			})


		},
		openportfolio : function(id){},

		click : function(){
			if (this.action.link){

				if(this.action.link.type == 'externalLink'){
					f.openexternallink(this.action.link.address)
				}

				if(this.action.link.type == 'internalLink'){

					if (this.action.link.address){
						var parts = this.action.link.address.split('/')

						console.log("parts", parts, this.action.link.address)

						if (parts.length > 2){

							var t = parts[1]
							var id = parts[2]

							if (this.types[t]){

								console.log(Number(id))

								this.types[t](Number(id))

								this.$emit('close')
								
								return
							}
						}
						
					}

					console.log("???")

					this.$router.push(this.action.link.address)
				}

				
			}
		}
	},
}
</script>
