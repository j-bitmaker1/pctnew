import { mapState } from 'vuex';
import f from "@/application/functions.js";
import lead from './lead/index.vue'
import _ from 'underscore';

export default {
	name: 'app_leads',
	props: {
		select : Object
	},

	components : {lead},

	data : function(){

		return {
			loading : false,
			searchvalue : '',
			count : 0,
		   
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
				}
			},


			selected : null,
			menu : [

				{
					text : 'labels.leadstocontacts',
					icon : 'fas fa-user-friends',
					action : 'leadstocontacts'
				},
			   
				{
					text : 'labels.deleteleads',
					icon : 'fas fa-trash',
					action : 'deleteleads'
				},

			]

		}

	},

	created : function() {
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
		tscrolly : state => state.tscrolly,
		dheight : state => state.dheight,
		selectMultiple : function(){
			return !this.select || this.select.multiple
		},
		payload : function(){

			var orderBy = {}

			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "LEAD"})
			}
		},

		elheight : function(){

			return f.mobileview() ? 195 : 120
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

	 

		selectionSuccess : function(leads){
			if (this.select){
				this.$emit('selected', leads)
			}
			else{
				this.selected = leads
			}
			
		},

		closeselected : function(){
			this.selected = null
		},

		menuaction : function(action){
			if (this[action]){
				this[action]()
			}   
		},


		deleteleads : function(cc){

			console.log("CCC", cc)

			_.each(cc, (profile) => {

				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")

			})

			this.closeselected()

		},

		deletelead : function(c){
			return this.deleteleads([c])
		},

		edit : function(profile){

			if(this.$refs['list']) this.$refs['list'].datachanged(profile, "ID")

		},

		open : function(client){

			if (this.select){
				this.$emit('selected', [client])
				this.$emit('close')
			}
			else{
				this.$store.commit('OPEN_MODAL', {
					id : 'modal_client_page',
					module : "lead_page",
					caption : "",
					mclass : 'withoutheader',
					data : {
						
						leadid : client.ID
					},
	
					events : {
						leadtocontact : (lead) => {
							console.log("leadtocontact", lead)
							this.deletelead(lead)
						}
					}
				})
			}

			

		},

		leadstocontacts : function(){

			this.$store.commit('globalpreloader', true)

			var leads = this.selected

			this.core.crm.leadtocontacts(_.map(leads, (s) => {return s.ID})).then(r => {


				this.deleteleads(leads)

				this.closeselected()

				//this.$router.push('/clients')

			}).catch(e => {


				this.$store.commit('icon', {
					icon: 'error',
					message: e.error
				})

			}).finally(() => {

				this.$store.commit('globalpreloader', false)

			})

		},

		leadtocontact : function(profile){
			this.deletelead(profile) /// from list
		}

	},
}