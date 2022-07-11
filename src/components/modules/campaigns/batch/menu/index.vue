<template>
<div class="batch_menu">
	<tooltip>
		<template v-slot:item>
			<div :class="buttonclass">
				<i class="fas fa-ellipsis-v"></i>
			</div>
		</template>

		<template v-slot:content="i">
			<listmenu :items="menu" @action="menuaction" :close="i.close"/>
		</template>

	</tooltip>
</div>
</template>

<style scoped lang="sass">

</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'batch_menu',
	props: {
		batch: Object,
		buttonclass : {
			type : String,
			default : 'buttonpanel'
		}
	},
	computed: mapState({
		auth: state => state.auth,

		menu : function(){

			var m = []

			if(this.batch.Status != 'DELETED'){
				m.unshift({
					text : 'campaigns.menu.deletebatch',
					icon : 'fas fa-trash',
					action : 'deletebatch',
					class : 'bad'
				})
			}

			if (this.batch.Status != 'CANCELLED' && this.batch.Status != 'COMPLETED' && this.batch.Status != 'DELETED'){
				m.unshift({
					text : 'campaigns.menu.cancelbatch',
					icon : 'fas fa-stop',
					action : 'cancelbatch',
				})
			}

			if(this.batch.Status == 'ACTIVE'){
				m.unshift({
					text : 'campaigns.menu.pausebatch',
					icon : 'fas fa-pause',
					action : 'pausebatch',
				})
			}

			if(this.batch.Status == 'PAUSED'){
				m.unshift({
					text : 'campaigns.menu.resumebatch',
					icon : 'fas fa-play',
					action : 'resumebatch',
				})
			}

			return m
		}

	}),

	methods: {
		menuaction : function(action, item){
			if (this[action]){
				this[action]()
			}   
		},

		deletebatch : function(){
			this.$dialog.confirm(
				this.$t('campaigns.dialog.deletebatch'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.batches.delete(this.batch.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('deletebatch')
				})
			})
			
		},
		cancelbatch : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.cancelbatch'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.batches.cancel(this.batch.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('cancelbatch')
				})
			})

			
		},
		pausebatch : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.pausebatch'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.batches.pause(this.batch.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('pausebatch')
				})
			})

		},
		resumebatch : function(){

			this.$dialog.confirm(
				this.$t('campaigns.dialog.resumebatch'), {
				okText: this.$t('yes'),
				cancelText : this.$t('no')
			})
	
			.then((dialog) => {
				this.core.api.campaigns.batches.resume(this.batch.Id, {
					preloader : true,
					showStatus : true
				}).then(r => {
					this.$emit('resumebatch')
				})
			})

			
		},
		
	},
}
</script>
