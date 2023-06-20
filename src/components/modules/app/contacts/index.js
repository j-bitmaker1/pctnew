import { mapState } from 'vuex';
import contact from './contact/index.vue'
import _ from 'underscore';

export default {
	name: 'app_contacts',
	props: {
		actions : Array,
		select : Object,

		type : String,

		hasmenu : {
			type : Boolean,
			default : true
		},

		scroll : Number,

		includeAdd : Boolean
	},

	components : {contact},

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

			filterValues : {
				products : '1',
				myfirm : '0',
				PCT_Capacity : [0, 100],
				PCT_Tolerance : [0, 100],
				PCT_CrashRating : [0, 100]
			},

			dfilterValues : {}

		}

	},

	created : function(){
		this.core.on('created', this.name, (d) => {
			if (d.type == this.type){
				this.added ++
			}
		})

		this.dfilterValues = this.filterValues
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

			if(this.select) return null
			
			if(this.actions) return this.actions

			var a = [
				{
					text : 'labels.delete' + this.label + 's',
					icon : 'fas fa-trash',
					action : 'deletecontacts'
				}
			]

			if(this.type == 'lead'){
				a.unshift({
					text : 'labels.leadstocontacts',
					icon : 'fas fa-user-friends',
					action : this.leadstocontacts
				})
			}

			return a

		},

		payload : function(){

			var orderBy = {}

			orderBy[this.sorting[this.sort].field] = this.sorting[this.sort].sort

			var p = {search : this.searchvalue}

			if (this.type){
				p.type = this.type.toUpperCase()
			}

			if(this.type == "lead" || !this.type){
				p.products = ['']
			}

			var productFilter = this.filterValues['products']
			
			p.products = productFilter == '1' ? [''] : ['pct']

			p.onlyuser = this.filterValues['myfirm'] == '0' ? true : false

			console.log(p, this.filterValues)

			p.customfields = [{
				id : '$$PCT_Capacity',
				value : this.filterValues['PCT_Capacity'],
				type : 'int'
			},
			{
				id : '$$PCT_Tolerance',
				value : this.filterValues['PCT_Tolerance'],
				type : 'int'
			},

			{
				id : '$$PCT_CrashRating',
				value : this.filterValues['PCT_CrashRating'],
				type : 'int'
			}]

			return {
				orderBy,
				query : this.core.crm.query('simplesearch', p),
				
			}
		},

		label : function(){
			return this.type ? this.type : 'contact'
		},

		

		filters : function(){


			return {
				fields : [

					{
						id : 'products',
						input : 'radio',
						values : [
							{
								text : 'filters.leads.pct',
							},
							{
								text : 'filters.leads.crm',
							},
						]
						
					},

					{
						id : 'myfirm',
						input : 'radio',
						values : [
							{
								text : 'filters.leads.onlymy',
							},
							{
								text : 'filters.leads.firms',
							},
						]
						
					},

					{
                        id : 'PCT_Capacity',
                        text : 'filters.leads.capacity',
                        input : 'slider',
                        rules : [{
							rule : 'array'
						}, {
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }]
                    },

					{
                        id : 'PCT_Tolerance',
                        text : 'filters.leads.tolerance',
                        input : 'slider',
                        rules : [{
							rule : 'array'
						},{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }]
                    },

					{
                        id : 'PCT_CrashRating',
                        text : 'filters.leads.crashrating',
                        input : 'slider',
                        rules : [{
							rule : 'array'
						},{
                            rule : 'less_than:100',
                        }, {
                            rule : 'greater_than:0',
                        }]
                    }
	
				]
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
				"Do you really want to delete "+contacts.length+" "+this.label+"(s)?", {
				okText: vm.$t('yes'),
				cancelText : vm.$t('no')
			})
	
			.then((dialog) => {

				this.$store.commit('globalpreloader', true)
				
				return Promise.all(_.map(contacts, (c) => {
					return this.core.crm.deletecontact(c.ID)
				})).then(r => {

					this.deleteContactFromLists(contacts)
	
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

		////clbks

		deleteContactFromLists : function(cc){
			_.each(cc, (profile) => {
				if(this.$refs['list']) this.$refs['list'].datadeleted(profile, "ID")
			})
		},

		deleteContactFromList : function(c){
			return this.deleteContactFromLists([c])
		},

		portfoliosChanged : function(client, p){
			
		},

		////
		
		selected : function(profiles){
			this.$emit('selected', profiles)
			this.$emit('close')
		},

		cancel : function(){
			this.$emit('selected', [])
			this.$emit('close')
		},


		selectall : function(){
			this.$refs['list'].getall().then(profiles => {
				this.selected(profiles)
			})
		},

		

		open : function(profile){


			if (this.select){
				this.selected([profile])
			}
			else{

				if (this.type){
					this.$router.push(this.type + '/' + profile.ID).catch(e => {})
				}
				
			}
			
		},

		newclient : function(){

			this.core.vueapi.newClient((client) => {
				this.selected([client])
			})
			
		},

		filtering : function(v){

			var vs = {}

			_.each(this.filterValues, (a, i) => {

				vs[i] = a
				
				if(typeof v[i] != 'undefined') vs[i] = v[i]
			})


			this.filterValues = vs
		}


	},
}