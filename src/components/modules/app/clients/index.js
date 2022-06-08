import { mapState } from 'vuex';
import f from "@/application/functions.js";
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
		}
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
				}
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
		tscrolly : state => state.tscrolly,
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
			this.deleteclients(contacts)
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
				this.$router.push('client/' + profile.ID)
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