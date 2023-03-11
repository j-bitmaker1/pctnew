<template>
<div class="page index">

	<topheader>
		<template v-slot:info>
			<span>Home</span>
		</template>
		<template v-slot:right>
			<!--<homeAdd />-->
			<div class="buttonpanel" @click="explore">
				<i class="fas fa-search"></i>
			</div>
		</template>

	</topheader>

	<maincontent>
		<template v-slot:content>
			<home />
		</template>
	</maincontent>


</div>
</template>

<style lang="sass" scoped>
.searchWrapper
	position: fixed
	left : 0
	bottom : 0
	top : 0
	right: 0
	z-index: 100
	background: srgb(--background-total-theme)
	

</style>

<script>
import home from "@/components/modules/app/home/index.vue";
import homeAdd from "@/components/modules/app/home/add/index.vue";

export default {
	name: 'home_page',
	components: {
		home, homeAdd
	},

	data : function(){
		return { 
			searchEnabled : false
		}
	},

	computed: {

	},

	methods: {
		explore : function(){
			this.core.vueapi.explore()
		}
		/*showsearch : function(){
			this.$store.commit('OPEN_MODAL', {
				id : 'modal_homesearch',
				module : "homesearch",
				caption : "Explore", /// TODO captions
				mclass : 'cover',
				data : {
					
				},
		
				events : {
				
				}
			})
		},*/

		/*closesearch : function(){
			this.searchEnabled = false
		}*/
	},

	mounted() {

	}
}
</script>
