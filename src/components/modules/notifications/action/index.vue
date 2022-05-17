<template>
<div class="action" @click="click">
	<i :class="action.icon" /> <span>{{action.text}}</span>
</div>
</template>

<style scoped lang="sass">
.action
	white-space: nowrap
	background: srgb(--neutral-grad-1)
	border-radius: 12px
	display: flex
	flex-wrap: nowrap
	align-items: center
	padding : $r
	color : srgb(--neutral-grad-3)
	padding-left: 0
	font-size: 0.8em
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
		action: Object
	},
	computed: mapState({}),

	methods: {
		click : function(){
			if (this.action.link){
				if(this.action.link.type == 'externalLink'){
					f.openexternallink(this.action.link.address)
				}

				if(this.action.link.type == 'internalLink'){
					this.$router.push(this.action.link.address)
				}

				
			}
		}
	},
}
</script>
