<template>
<div class="activity_client">
	<div class="profilerow">
		<div class="userpicWrapper" @click="open">
			<userpic :userinfo="profile" />
		</div>

		<div class="data" v-if="profile" @click="open">
			<div class="name"><span>{{profile.FName}} {{profile.LName}}</span></div>
			<div class="email"><span>{{profile.Email}}</span></div>
		</div>

		<div class="actions" v-if="actions">
			<div class="action" v-for="action in actions" :key="action.route">
				<router-link :to="action.route">
					<i :class="action.icon" />
				</router-link>
			</div>
		</div>

		<!---->
	</div>
</div>
</template>

<style scoped lang="sass">
.profilerow
	align-items: center
	display: flex

	.actions
		margin-left: auto

	.email
		span
			font-size: 0.8em
			color : srgb(--neutral-grad-2)
	.name
		span
			font-weight: 700

	::v-deep
		.userpicWrapper
			max-width: 44px
			min-width: 44px
			width: 44px
			line-height: 44px
			font-size: 0.8em
			margin-right: 2 * $r
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'activity_client',
	props: {
		profile: Object
	},
	computed: mapState({
		auth: state => state.auth,

		actions : function(){

			if(this.profile.type == "LEAD") return

			return [


				{
					icon : 'fas fa-info-circle',
					route : 'client/' + this.profile.ID + '?p=info'
				},

				{
					icon : 'fas fa-suitcase',
					route : 'client/' + this.profile.ID + '?p=portfolios'
				},
				/*{
					icon : 'fas fa-dollar-sign',
					route : 'client/' + this.profile.ID + '?p=capacity'
				},*/

			]
		}
	}),

	methods: {
		open : function(){
			this.$emit('open')
		}
	},
}
</script>
