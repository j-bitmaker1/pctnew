import { mapState } from 'vuex';
import f from "@/application/shared/functions.js";
import lead from './lead/index.vue'
import _ from 'underscore';

export default {
	name: 'app_leads',
	props: {
		actions : Array,
		select : Object,

		hasmenu : {
			type : Boolean,
			default : true
		},

		scroll : Number
	},

	components : {lead},

	data : function(){

		return {
			loading : false,
			searchvalue : '',
			count : 0,
			added : 0,
			sort : 'Created_desc',

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
					sort : 'desc',

					prepend : {
						"IsNewLead": 'desc'
					}
				}
			},

			filterValues : {}

		}

	},

	created : function(){
		this.core.on('created', this.name, (d) => {
			if (d.type == 'lead'){
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
		
		payload : function(){

			var orderBy = {}

			if(this.sorting[this.sort].prepend){
				orderBy = {
					... this.sorting[this.sort].prepend
				}
			}
			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', {
					search : this.searchvalue, 
					type : "LEAD", 
					products : ['pct','crm']
				})
			}
		},

		filters : function(){
			return [

				{
					id : 'products',
					input : 'multiseelct',
					values : [
						{
							text : 'filters.leads.pct',
							id : 'pct'
						},
						{
							text : 'filters.leads.crm',
							id : 'crm'
						},
					]
					
				},

			]
		},

		elheight : function(){

			return f.mobileview() ? 195 : 120
		},

		menu : function(){
			return this.actions ? this.actions : [

				{
					text : 'labels.leadstocontacts',
					icon : 'fas fa-user-friends',
					action : this.leadstocontacts
				},
			   
				{
					text : 'labels.deleteleads',
					icon : 'fas fa-trash',
					action : this.deletecontacts
				},

			]
		}
	}),

	methods : {

		search : function(v){

			this.searchvalue = v
		},

		setcount : function(v){
			this.count = v
		},

		sortchange : function(v){
			this.sort = v
		},

		edit : function(profile){
			if(this.$refs['list']) this.$refs['list'].datachanged(profile, "ID")
		},

		addedreload : function(){
			this.sort = 'Created_desc'
			this.reload()
		},

		reload : function(){

			this.added = 0

			if(this.$refs['list']) this.$refs['list'].reload()
		},

		open : function(client){

			if (this.select){
				this.$emit('selected', [client])
				this.$emit('close')
			}
			else{

				this.core.vueapi.openlead({
					leadid : client.ID
				},{
					leadtocontact : (lead) => {
						this.deletelead(lead)
					}
				})
			}

		},

		leadstocontacts : function(leads){

			this.$store.commit('globalpreloader', true)

			return this.core.crm.leadtocontacts(_.map(leads, (s) => {return s.ID})).then(r => {
				this.deleteleads(leads)
			}).catch(e => {

				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {
				this.$store.commit('globalpreloader', false)
			})

		},

		deletecontacts : function(contacts){

			this.$dialog.confirm(
				"Do you really want to delete "+contacts.length+" lead(s)?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.$store.commit('globalpreloader', true)
				
				return Promise.all(_.map(contacts, (c) => {
					return this.core.crm.deletecontact(c.ID)
				})).then(r => {

					this.deleteleads(contacts)
	
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

		deleteleads : function(cc){
			_.each(cc, (profile) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")
			})
		},

		deletelead : function(c){
			return this.deleteleads([c])
		},

		leadtocontactClbk : function(profile){
			this.deletelead(profile) /// from list
		},

		filtering : function(v){

		}

	},
}