<template>
<div id="campaigns_steps_selectemails">

	<div class="listWrapper" v-if="emails.length" >
		<list :items="emails">
			<template v-slot:default="slotProps">
				<div class="setpW mobp" :class="{selected : slotProps.item.id == selected}" @click="e => select(slotProps.item)">
					<step :step="slotProps.item"/>
				</div>
			</template>
		</list>
	
		<div class="setpW mobp">
			<step :step="{type : function(){return 'finish'}}"/>
		</div>
	</div>

	<div class="empty" v-else>
		<span>There are no required emails in the campaign</span>
	</div>
</div>
</template>

<style scoped lang="sass">
.empty
	padding : 4 * $r
	margin-top: 4 * $r
	text-align: center
	border-radius: 12px
	background: srgb(--neutral-grad-0)

	span
		font-size: 0.8em
.listWrapper
	margin-top: 4 * $r

.setpW
	::v-deep
		.icon
			+transition(0.3s)
		.content
			+transition(0.3s)
			
	&.selected

		::v-deep
			.icon
				border-color : srgb(--color-good)
				color : srgb(--color-good)
			.content
				background: srgba(--color-good, 0.2)
</style>

<script>
import {
    mapState
} from 'vuex';

import step from '../step/index.vue'

export default {
    name: 'campaigns_steps_selectemails',
    props: {
        steps: Array,
		selected : String
    },
	components : {
		step,
	},

    computed: mapState({
        auth: state => state.auth,
        emails: function () {
            return _.filter(this.steps, (step) => {
                return step.type() == "email"
            })
        }
    }),

    methods: {
		select : function(item){
			this.$emit('select', item)
			this.$emit('close')
		}
    },
}
</script>
