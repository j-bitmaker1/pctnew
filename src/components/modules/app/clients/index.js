import { mapState } from 'vuex';
import f from "@/application/functions.js";
import client from './client/index.vue'
import _ from 'underscore';

export default {
	name: 'app_clients',
	props: {
		select : Object
	},

	components : {client},

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
					text : 'labels.deleteclient',
					icon : 'fas fa-trash',
					action : 'clients'
				},

			]

		}

	},

	created : function() {
		if (this.select && this.select.selected){
			this.selected = _.clone(this.select.selected)
		}
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
	

		selectOptions : function(){
			return {
				class : 'leftselection',
				selected : this.selected,
				disableActions : false,
				disable : (this.select && !this.select.multiple) ? true : false
			}
		},

		payload : function(){

			var orderBy = {}

			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', {search : this.searchvalue, type : "CLIENT"})
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

		selectionSuccess : function(clients){
			if (this.select){
				this.$emit('selected', clients)
			}
			else{
				this.selected = clients
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

		deleteclients : function(cc){
			_.each(cc, (profile) => {

				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")

			})

		},

		deleteclient : function(c){
			return this.deleteclients([c])
		},

		edit : function(profile){

			if(this.$refs['list']) this.$refs['list'].datachanged(profile, "ID")
		},

		open : function(profile){

			if(this.select){
				this.$emit('selected', [profile])
				this.$emit('close')
			}
			else{
				this.$router.push('client/' + profile.ID)
			}
			
		},

		portfoliosChanged : function(client, p){
			
		}

	},
}