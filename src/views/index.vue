<template>
<div class="page index">

	<topheader>
		<template v-slot:info>
			<span>Home</span>
		</template>
		<template v-slot:right>
			<div class="buttonpanel">
				
				<!--<i class="fas fa-bars"></i>-->
				<router-link to="explore">
					<i class="fas fa-search"></i>
				</router-link>
			</div>
		</template>

	</topheader>

	<maincontent>
		<template v-slot:content>
			<home />
		</template>
	</maincontent>

	<!--<transition name="fade">
		<div class="searchWrapper" v-if="searchEnabled">
			<topheader>
				<template v-slot:info>
					<span>Search</span>
				</template>
				<template v-slot:right>
					<div class="buttonpanel">
						<i class="fas fa-times" @click="closesearch"></i>
					</div>
				</template>

			</topheader>

			<maincontent>
				<template v-slot:content>
					<homesearch />
				</template>
			</maincontent>
		</div>
	</transition>-->

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


export default {
	name: 'home_page',
	components: {
		home
	},

	data : function(){
		return { 
			searchEnabled : false
		}
	},

	computed: {

	},

	methods: {
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
