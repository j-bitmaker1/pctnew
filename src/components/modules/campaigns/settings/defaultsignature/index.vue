<template>
<div class="campaigns_settings_defaultsignature" @click="select">
	<div class="label">
		<span>Default signature</span>
	</div>

	<div class="value">
		<linepreloader v-if="loading" />

		<span class="sig" v-if="!loading && signature">{{signature.Name}}</span>
		<span class="select" v-if="!loading && !signature"><i class="fas fa-caret-right"></i></span>
	</div>
</div>
</template>

<style scoped lang="sass">

.campaigns_settings_defaultsignature
	display: flex
	align-items: center

	::v-deep
		#linepreloader
			padding-top: 0
			padding-bottom: 0
			padding-right: 0

	.value
		margin-right: $r
		margin-left: auto

		.sig
			font-weight: 700

		.select
			color : srgb(--neutral-grad-2)

@media (pointer:fine)
	.campaigns_settings_defaultsignature
		cursor: pointer
		+transition(0.3s)

		&:hover
			opacity: 0.8

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'campaigns_settings_defaultsignature',
	props: {
		
	},
	data : function(){
		return {
			loading : false,
			signature : null
		}
	},
	computed: mapState({
		auth: state => state.auth,
	}),

	created(){
		this.load()
	},

	methods: {
		load : function(){
			this.loading = true
			 
			this.core.campaigns.getSettings().then(r => {
				if(!r.signature.value){
					return Promise.reject('none')
				}

				return this.core.campaigns.getSignature(r.signature.value)
			}).then(signature => {

				this.signature = signature
			}).catch((e) => {

			}).finally(() => {
				this.loading = false
			})
		},

		select : function(){
			this.core.campaigns.selectSignature().then(r => {
				this.signature = r

				this.save()
			})
		},

		save : function(){
			if (this.signature){
				this.core.campaigns.settings.set('signature', this.signature.Id)
			}
		}
	},
}
</script>
