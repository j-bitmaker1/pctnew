<template>
<div class="page" :class="{inwnd : wnd, alone : !wnd}">

	<topheader :back="wnd ? '' : 'back'" :gray="true">
		<template v-slot:info>
			<div id="clientprofile">
				<div class="userpicWrapper">
					<userpic :userinfo="profile || {}" />
				</div>

				<div class="data" v-if="profile">
					<div class="name">{{profile.FName}} {{profile.LName}}</div>
					<div class="email"><avalue :value="profile.Email"/></div>
				</div>
			</div>
		</template>
		<template v-slot:right>

			<profilemenu @portfoliosChanged="portfoliosChanged" @delete="deleted" @edit="edit" :profile="profile" v-if="!loading" />
			
		</template>
	</topheader>


	<maincontent>
		<template v-slot:content>
			<div v-if="!loading">
				<div class="linenavigation ">
					<linenavigation :buttons="true" @change="changenav" :items="navigation" :navdefault="navdefault" :navkey="navkey" :mode="wnd ? 'emit' : 'history'"/>
				</div>
				<component ref="main" :is="module" :profile="profile" @close="close"/>
			</div>
		</template>
	</maincontent>

</div>
</template>

<style lang="sass" scoped>
.linenavigation
	background: srgb(--background-secondary-theme)
	margin-bottom: $r
	padding-bottom: $r

#clientprofile
	display: flex
	align-items: center

	.data
		.name
			font-size: 1.2em
			font-weight: 700
		.email
			font-size: 0.8em

::v-deep
	.userpicWrapper
		max-width: 44px
		min-width: 44px
		width: 44px
		line-height: 44px
		font-size: 0.8em
		margin-right: 2 * $r

@media only screen and (min-width: 1024px)
	.linenavigation
		background: srgb(--background-total-theme)


@media only screen and (max-width: 768px)

	

	.alone

		::v-deep
			.userpicWrapper
				max-width: 100px
				min-width: 100px
				width: 100px
				line-height: 100px
				
		::v-deep
			#topheader
				position: relative
				.headerLine
					align-items: flex-start
					height: auto
					.rightIcons
						margin-top: 2.5 * $r
					.leftIcon
						margin-top: 4 * $r
			.infoPart
				margin-left: 2 * $r
				margin-top: 8 * $r
				margin-bottom: 4 * $r
				.data
					margin-top: 2 * $r
				.userpicWrapper
					margin-right: 0
				#clientprofile
					flex-direction: column
					text-align: center


</style>

<script>
import linenavigation from "@/components/assets/linenavigation/index.vue";
import capacity from "@/components/modules/app/client/capacity/index.vue";
import portfolios from "@/components/modules/app/client/portfolios/index.vue";
import info from "@/components/modules/app/client/info/index.vue";
import profilemenu from "@/components/modules/app/client/menu/index.vue";

export default {
	name: 'page',

	props : {
		wnd : Boolean,
		clientid : Number
	},

	components: {
		linenavigation,
		capacity,
		portfolios,
		info,
		profilemenu
	},

	computed: {

		module: function () {
			return this.active
		},

		active: function () {
			return this.$route.query[this.navkey] || this.navdefault
		},

		id : function(){
			return this.clientid || this.$route.params.id
		},

	},

	data: function () {
		return {
			profile: {},
			loading : true,

			navkey: 'p',
			navdefault: 'portfolios',
			navigation : [
				{
					text: 'labels.info',
					id: 'info'
				},
				{
					text: 'labels.portfolios',
					id: 'portfolios'
				},
				{
					text: 'labels.capacity',
					id: 'capacity'
				},

			]
		}
	},

	methods: {
		load: function () {
			this.loading = true

			this.core.api.crm.contacts.get(this.id).then(r => {

				this.profile = r

				this.core.activity.template('client', this.profile)

				this.core.crm.contactAutoUpdate(this.profile)

				return Promise.resolve(r)
			}).finally(() => {
				this.loading = false
			})
		},

		changenav : function(v){
			this.navdefault = v
		},

		edit : function(profile){
			//this.profile = profile
		},

		deleted : function(){
			this.$router.push('/clients').catch(e => {})
			this.$emit('close')
		},

		portfoliosChanged : function(){
			if(this.$refs['main'] && this.$refs['main'].reload) this.$refs['main'].reload()
		},

		close : function(){
			this.$emit('close')
		}
		
	},

	created() {
		
	},

	mounted() {
		this.load()
	}
}
</script>
