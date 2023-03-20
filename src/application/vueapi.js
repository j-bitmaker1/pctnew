class Vueapi {
    constructor(core){

        this.core = core
        this.store = this.core.store
        this.router = this.core.vm.$router
        this.vm = core.vm

    }

    icon = function(icon, message){
        this.store.commit('icon', {
            icon,
            message
        })
    }

    selectClients = function(success, p = {}){

        p.type = 'client'

        this.selectContacts(success, p)
    }

    selectLeads = function(success, p = {}){

        p.type = 'lead'

        this.selectContacts(success, p)
    }

    selectContacts = function(success, p = {}){

        if (p.selected){
            this.store.commit('select', {
                context : p.type || 'contact',
                items : p.selected
            })
        }

        this.store.commit('OPEN_MODAL', {
            id : 'modal_contacts',
            module : "contacts",
            caption : "Select " + (p.type || 'contact'),
            data : {
                select : {
                    context : (p.type || 'contact'),
                    filter : p.filter,
                    disabled : p.one ? true : false,
                    selectall : p.selectall
                },
                type : p.type,
                hasmenu : false
            },

            events : {
                selected : (contacts) => {
                    if(success) success(contacts)
                }
            }
        })
    }

    selectContactToPortfolios = function(portfolios, success, type){

        this.selectContacts((clients) => {
            var client = clients[0]

            this.core.pct.setPortfoliosToClient(client.ID, portfolios, {
                preloader : true,
                showStatus : true
            }).then(r => {

                if (success)
                    success(client)

            })
        }, {type})

    }

    selectClientToPortfolios = function(portfolios, success){
        this.selectContactToPortfolios(portfolios, success, 'client')
    }

    selectLeadToPortfolios = function(portfolios, success){
        this.selectContactToPortfolios(portfolios, success, 'lead')
    }

    selectPortfolios = function(success, p = {}){

        if (p.selected){
            this.store.commit('select', {
                context : 'portfolio',
                items : p.selected
            })
        }

        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolios_main',
            module : "portfolios_main",
            caption : p.caption || "Select Portfolios", /// TODO captions
    
            data : {
                
                select : {
                    context : "portfolio",
                    filter : p.filter,
                    disabled : p.one ? true : false
                },

                hasmenu : false

            },
    
            events : {
                selected : (portfolios) => {
                    if(success) success(portfolios)

                    this.store.commit('unselect', {
                        context : 'portfolio'
                    })
                },

                close : () => {
                    this.store.commit('unselect', {
                        context : 'portfolio'
                    })
                }
            }
        })
    }

    selectPortfoliosToClient = function(profile, success){

        var set = (portfolios) => {
            this.core.pct.setPortfoliosToClient(profile.ID, portfolios, {
                preloader : true,
                showStatus : true
            }).then(r => {

                if(success) success(portfolios)

            }).catch(e => {

            })
        }

        this.selectPortfolios((portfolios) => {


            var portfoliosWithContact = _.filter(portfolios, portfolio => {
                return portfolio.crmContactId && portfolio.crmContactId != profile.ID
            })

            if(!portfoliosWithContact.length){
                set(portfolios)
            }
            else{

                return this.vm.$dialog.confirm(
                    this.vm.$t('labels.portfolioswithclientq'), {
                    okText: this.vm.$t('labels.portfolioswithclientyes'),
                    cancelText : 'No'
                })
        
                .then((dialog) => {

                    set(portfolios)

                }).catch( e => {
                    
                })
            }

            

        }, {
            filter : (portfolio) => {
                return portfolio.crmContactId && portfolio.crmContactId != profile.ID
            }
        })

       
    }

    editPortfolio = function (portfolio, success) {
        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_edit',
            module : "portfolio_edit",
            caption : "Edit Portfolio",
            data : {
                edit : {
                    name : portfolio.name,
                    assets : portfolio.positions,
                    id : portfolio.id
                }
            },
    
            events : {
                edit : (portfolio) => {
                    if(success) success(portfolio)
                }
            }
        })
    }

    selectFolder = function(success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filesystem',
            module : "filesystem",
            caption : "Select folder",
            data : {

                fclass : 'expanded',
                purpose : 'selectFolder'
                
            },
            events : {
                selected : (items) => {
                    var item = items[0]

                    if(success) success(item)

                }
            }
        })
    }

    editClient = function(profile, success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_client_edit',
            module : "client_edit",
            caption : "Edit client",
    
            data : {
                edit : profile
            },
    
            events : {
                success : (data) => {
                    var profile = _.extend(profile, data)
                    
                    success(profile)
                    //this.$emit('edit', profile)
                }
            }
        })
    }

    createCustomScenario = function(data, success, p = {}){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenario_custom',
            module : "scenario_custom",
            caption : p.caption || "New custom scenario",
    
            data : data,
    
            events : {
                success : (scenario) => {
                    success(scenario)
                }
            }
        })
    }

    customStressTest = function(data, success, p = {}){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenario_custom',
            module : "scenario_custom",
            caption : p.caption || "Custom stress test",
    
            data : {
                ...data,
                mode : 'stresstest'
            }
        })
    }

    editCustomScenario = function(data, success){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenario_custom',
            module : "scenario_custom",
            caption : p.caption || "Edit custom scenario",
    
            data : data,
    
            events : {
                success : (scenario) => {
                    success(scenario)
                }
            }
        })
    }

    selectfactors = function(data, events){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenario_allfactors',
            module : "scenario_allfactors",
            caption : "Factors",
    
            data : data,
    
            events : events
        })
    }

    savecustomscenario = function(data, success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenarios_savecustoms',
            module : "scenarios_savecustom",
            caption : "Factors",
    
            data : data,
    
            events : {
                success
            }
        })
    }

    optimizationSettings = function(data, changed){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_optimization_settings',
            module : "optimization_settings",
            caption : "Optimization settings",
    
            data : data,
    
            events : {
                changed
            }
        })
    }

    portfolioLtrdetails = function(data){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_ltrdetails',
            module : "portfolio_ltrdetails",
            caption : "Long Term Return Calculation Details",
            data : data,
            events : {
            }
        })
    }
    

    createContact = function(payload, success, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_client_edit',
            module : "client_edit",
            caption : p.caption || "New contact",
    
            data : {
                payload : payload || {}
            },
    
            events : {
                success : (data) => {
                    success(data)
                }
            }
        })
    }

    sharequestionnaire = function(){

        this.core.api.crm.questionnaire.getlink(null, {
            preloader : true
        }).then(url => {

            this.share({url}, {
                caption: "Share Questionnaire"
            })

        }).catch(e => {
            
            this.store.commit('icon', {
                icon: 'error',
                message: e.error
            })

        })

    }

    share = function(data, p = {}){

        this.store.commit('OPEN_MODAL', {
            id: 'modal_share',
            module: "share",
            caption: p.caption || "Share",
            mclass : 'small',
            data : data
        })

    }

    scenarioManager = function(success, p = {}){


        this.store.commit('OPEN_MODAL', {
            id : 'modal_scenarios_list',
            module : "scenarios_list",
            caption : "Scenario manager", /// TODO captions
    
            data : {

            },
    
            events : {
                changed : function(){
                    if(success)
                        success()
                }
            }
        })
    }

    annuitiesLookup = function(success, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_assets_annuities',
            module : "assets_annuities",
            caption : "Select structure",
    
            events : {
                selected : function(annuity){
                    
                    success(annuity)
                }
            }
        })
    }

    integrations = function(success, p = {}){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_settings_integrations',
            module : "settings_integrations",
            caption : "Integrations",
    
            events : {
                changed : function(){
                    success()
                }
            }
        })
    }

    integrationsAdd = function(success, p = {}){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_settings_integrations_add',
            module : "settings_integrations_add",
            caption : "Add connection",
            data : p,
            events : {
                changed : function(){
                    success()
                }
            }
        })
    }

    scoreConverter = function(success, p = {}){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_settings_scoreConverter',
            module : "settings_scoreConverter",
            caption : "User Defined Risk Score",
    
            events : {
                changed : function(){
                    success()
                }
            }
        })
    }

    newPortfolio = function (data) {
        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_edit',
            module : "portfolio_edit",
            caption : "New Portfolio",
            data : data || {},
    
            events : {
                edit : (portfolio) => {

                    if (this.core.mobileview()){
                        this.$router.push('/portfolio/' + portfolio.id).catch(e => {})
                    }
                    else{
                        this.$router.push('/summary?id=' + portfolio.id).catch(e => {})
                    }
                }
            }
        })
    }

    newClient = function (success) {
        this.createContact({type : "CLIENT"}, (data) => {

            if (success){
                success(data)
                return
            }

            if (data.ID)
                this.router.push('client/' + data.ID).catch(e => {})
        }, {
            caption : "New client"
        })

    }

    newLead = function () {
        this.createContact({type : "LEAD"}, (data) => {

            if (data.ID)
                this.router.push('lead/' + data.ID).catch(e => {})

        }, {
            caption : "New lead"
        })

    }

    fileManager = function(data, events, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filemanager',
            module : "filemanager",
            caption : "File manager",
            one : true,
            data : data || {},
            events : events
        })
    }

    fileManager_File = function(file, events, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_filemanager_file',
            module : "filemanager_file",
            caption : p.name || "File",
            mclass : 'withoutheader',
            one : true,
            data : {
                file
            },
            events : events
        })
    }

    pdfviewer = function(file, events = {}, p = {}){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_pdfviewer',
            module : "pdfviewer",
            caption : "Pdf viewer",
            one : true,
            mclass : 'withoutheader',
            data : {
                file
            },
            events : events
        })
    }

    pincode = function(mode = 'create', attemp, check, caption){

        var hascode = false

        return new Promise((resolve, reject) => {

            this.store.commit('OPEN_MODAL', {
                id : 'modal_pincode',
                module : "pincode",
                caption : mode == 'create' ? 'Create pincode' : "Enter pincode",
                mclass : 'cover withoutheader',
                data : {
                    confirm : mode == 'create',
                    mode,
                    attemp,
                    check,
                    caption
                },
                events : {
                    success : function(pin){

                        hascode = true

                        resolve(pin)
                    },
                    close : function(){

                        if(!hascode){
                            hascode = true
                            reject()
                        }

                    }
                }
            })

        })

        
    }

    camera = function(success, p = {}){
        this.store.commit('OPEN_CAMERA', {
            data : {
                multiple : true,
                mask : {
                    title : p.title || ""
                }
            },
            events : {
                selected : (images) => {
                    success(images)
                }
            }
        })
    }

    searchAssets = function(success, multiple, value, closed){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_assets_search',
            module : "assets_search",
            mclass : "topsearching",
            fromtop : true,
            one : true,
            caption : "",
    
            data : {
                value
            },
            events : {

                selected : function(a){
                    if(success) success(a)
                },
                
                multiple : function(as){
                    if(multiple) multiple(as)
                },

                close : function(){
                    if(closed) closed()
                }
            }
        })
    }

    portfoliopdf = function(data, success){
        this.store.commit('OPEN_MODAL', {
            
            id : 'modal_portfoliopdf',
            module : "portfoliopdf",
            caption : "Create PDF report",
    
            data : data,
            events : {
                success : function(a){
                    if(success) success(a)
                }
            }
        })
    }

    pdfSettings = function( success){
        this.store.commit('OPEN_MODAL', {
            
            id : 'modal_pdfSettings',
            module : "pdfSettings",
            caption : "PDF Settings",
    
            data : {},
            events : {
                success : function(a){
                    if(success) success(a)
                }
            }
        })
    }

    fx = function({place, name, parameters = {}}){

        return

        var dp = {}

        if (name == 'stars') 
            dp = {
                opacity : 0.8,
                scatter : 20,
                duration : 900,
                color : '#ffa000'
            }

            

        this.store.commit('FX', {place, name, parameters : {
            ...dp,
            ...parameters
        }})
    }

    editorjs = function(data, success,  p = {}){
        this.store.commit('OPEN_MODAL', {
            
            id : 'modal_editorjs',
            module : "editorjs",
            caption : p.caption || "",
    
            data : data,
            events : {
                save : function(data){
                    if(success) success(data)
                }
            }
        })
    } 

    ///

    customWindow = function(module, caption, data = {}, events = {}, p = {}){

        var e = false

        return new Promise((resolve, reject) => {

            events.close = () => {

                if(e) return

                e = true
                reject('closed')
            }

            events.success = (d) => {

                if(e) return

                e = true
                resolve(d)
            }

            this.store.commit('OPEN_MODAL', {
                id : 'modal_' + module,
                module : module,
                caption : caption || "",
                data : data,
                events : events,
                mclass : p.mclass,
            })
        })

    }

    portfolioSummary = function(data, events){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_portfolio_summary',
            module : "portfolio_summary",
            caption : "",
            mclass : 'allscreen',
            data : data,
            events : events,
            canpip : true,
            one : true,
            save : true
        })

    }

    openlead = function(data, events){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_lead_page',
            module : "lead_page",
            caption : "",
            mclass : 'withoutheader',
            data : data,
            events : events
        })

    }

    openclient = function(data, events){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_client_page',
            module : "client_page",
            caption : "",
            mclass : 'withoutheader',
            data : data,
            events : events
        })

    }

    explore = function(data, events){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_explore',
            module : "explore",
            caption : "",
            mclass : 'withoutheader',
            data : data,
            events : events
        })

    }

    fastmenu = function(){

        this.store.commit('OPEN_MODAL', {
            id : 'modal_fastmenu',
            module : "fastmenu",
            caption : "",
            mclass : 'withoutheader fastmenu absoluteContent',
        })

    }

    listmenu = function(items){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_listmenu',
            module : "listmenu",
            caption : "",
            mclass : 'small likemenu',

            data :  {
                items,
                close : () => {
                    this.store.commit('CLOSE_MODAL', 'modal_listmenu')
                }
            }
        })
    }

    listmenupromise = function(items){

        return new Promise((resolve, reject) => {
            this.store.commit('OPEN_MODAL', {
                id : 'modal_listmenu',
                module : "listmenu",
                caption : "",
                mclass : 'small likemenu',
                
                data :  {
                    items,
                    
                },
                events : {
                    close : () => {
                        reject('closed')
                    },
                }
            })
        })
    }

    addMenu = function(){
        var actions = {
            portfolio:  () => {
                this.store.commit('OPEN_MODAL', {
                    id: 'modal_portfolios_edit',
                    module: "portfolio_edit",
                    caption: "New Portfolio",
    
                    events: {
                        edit: (data) => {
                            this.router.push('portfolio/' + data.id).catch(e => {})
                        }
                    }
                })
            },
            client: () => {
                this.createContact({
                    Type: "CLIENT"
                }, (data) => {
    
                    this.router.push('client/' + data.ID).catch(e => {})
    
                }, {
                    caption: "New client"
                })
            },
            
            lead: () => {
                this.createContact({
                    Type: "LEAD"
                }, (data) => {
    
                    this.router.push('lead/' + data.ID).catch(e => {})
    
                }, {
                    caption: "New lead"
                })
            },

            campaign : () => {
                this.core.campaigns.start()
            }


        }

        var menu = [{
            text: 'labels.newPortfolio',
            icon: 'fas fa-suitcase',
            action: actions.portfolio,

            features : ['PCT']
        },
        {
            text: 'labels.newClient',
            icon: 'fas fa-users',
            action: actions.client,

            features : ['CRM']
        },
        {
            text: 'labels.newLead',
            icon: 'fas fa-user-plus',
            action: actions.lead,

            features : ['CRM']
        },{
            text: 'campaigns.labels.newCampaign',
            icon: 'fas fa-play',
            action: actions.campaign,

            features : ['CAMPAIGN']
        }]

        menu = this.core.user.extendByFeaturesMenu(menu)

        this.listmenu(menu)
    }

    questionnaireResult = function(questionnaire){
        this.core.api.crm.questionnaire.getresult(questionnaire, {preloader : true}).then(r => {
           
            this.store.commit('OPEN_MODAL', {
                id : 'modal_questionnaire_client',
                module : "questionnaire_client",
                caption : "Questionnaire",
                mclass : '',
    
                data :  {
                    result : r
                }
            })

            
        }).catch(e => {
            this.store.commit('icon', {
                icon: 'error',
                message: e.error
            })
        })
    }

    gallery = function(images = [], index = 0){

        this.store.commit('GALLERY', {
            images,index
        })

    }


    searchVariable = function(value, success){
        this.store.commit('OPEN_MODAL', {
            id : 'modal_campaigns_variables',
            module : "campaigns_variables",
            mclass : "topsearching",
            fromtop : true,
            one : true,
            caption : "Search variable",
    
            data : {
                value,
                onlysearch : true
            },
            events : {
                selected : function(a){
                    if(success) success(a)
                }
            }
        })
    }


}

export default Vueapi