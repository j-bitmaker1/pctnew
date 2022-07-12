import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";
import client from './client/index.vue'
import _ from 'underscore';

export default {
	name: 'app_clients',
	props: {
		actions : Array,
		select : Object,

		hasmenu : {
			type : Boolean,
			default : true
		},

		scroll : Number
	},

	components : {client},

	data : function(){

		return {
			loading : false,
			searchvalue : '',
			count : 0,
			added : 0,
			sort : 'FName_asc',
			sorting : {
				FName_asc : {
					text : 'fname_asc',
					field : 'FName',
					sort : 'asc'
				},
				FName_desc : {
					text : 'fname_desc',
					field : 'FName',
					sort : 'desc'
				},
				Created_asc : {
					text : 'date_asc',
					field : 'Created',
					sort : 'asc'
				},
				Created_desc : {
					text : 'date_desc',
					field : 'Created',
					sort : 'desc'
				},

				$$PCT_PortfoliosTotalSum_asc : {
					text : 'total_assets_asc',
					field : '$$PCT_PortfoliosTotalSum',
					sort : 'asc'
				},
				$$PCT_PortfoliosTotalSum_desx : {
					text : 'total_assets_desc',
					field : '$$PCT_PortfoliosTotalSum',
					sort : 'desc'
				},

			},

		}

	},

	created : function(){
		this.core.on('created', this.name, (d) => {
			if (d.type == 'client'){
				this.added ++
			}
		})
	},

	beforeDestroy(){
		this.core.off('created', this.name)
	},
	

	watch: {
		tscrolly : function(){

			if (this.$refs['list']){

				if (this.$refs['list'].height() - 1000 < this.tscrolly + this.dheight){
					this.$refs['list'].next()
				}
				
			}
			
		}
	},
	computed: mapState({
		auth : state => state.auth,
		tscrolly : function(state){
			return this.scroll || state.tscrolly
		},
		dheight : state => state.dheight,

		menu : function(){

			return this.actions ? this.actions : [
				{
					text : 'labels.deleteclients',
					icon : 'fas fa-trash',
					action : 'deletecontacts'
				}
			]

		},

		payload : function(){

			var orderBy = {}

			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "CLIENT"})
			}
		},

	}),

	methods : {

		addedreload : function(){
			this.sort = 'Created_desc'
			this.reload()
		},

		reload : function(){
			this.added = 0
			if(this.$refs['list']) this.$refs['list'].reload()
		},

		search : function(v){
			this.searchvalue = v
		},

		setcount : function(v){
			this.count = v
		},

		sortchange : function(v){
			this.sort = v
		},

		

		deletecontacts : function(contacts){

			this.$dialog.confirm(
				"Do you really want to delete "+contacts.length+" client(s)?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.$store.commit('globalpreloader', true)
				
				return Promise.all(_.map(contacts, (c) => {
					return this.core.crm.deletecontact(c.ID)
				})).then(r => {

					
					this.deleteclients(contacts)
	
					this.$store.commit('icon', {
						icon: 'success'
					})
					
				}).catch(e => {

					this.$store.commit('icon', {
						icon: 'error',
						message: e.error
					})
				}).finally(() => {
					this.$store.commit('globalpreloader', false)
				})

			})

		},
		
		selected : function(profiles){
			this.$emit('selected', profiles)
			this.$emit('close')
		},

		open : function(profile){

			if (this.select){
				this.selected([profile])
			}
			else{
				this.$router.push('client/' + profile.ID).catch(e => {})
			}
			
		},

		portfoliosChanged : function(client, p){
			
		},

		////clbks

		deleteclients : function(cc){
			_.each(cc, (profile) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")
			})
		},

		deleteclient : function(c){
			return this.deleteclients([c])
		}

	},
}