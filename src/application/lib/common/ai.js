import f from '../../shared/functions.js'

var Master = function(settings = {}, /*app, */context){

	var self = this
	var defaulttemperature = 0.1

	self.context = context ? _.clone(context) : {}

	self.type = null
	self.displayerror = null

	self.types = {}

	self.hooks = {
		wantsay : {}
	}

	self.parameters = {}
	self.data = {}
	self.result = undefined
	self.recalled = false
	self.stopped = false
	self.temperature = defaulttemperature
	self.files = []

	self.stage = {
		resultshowed : false,
		refine : false,
		chatstopped : false,
		userask : true,
		userhasask : false,
		cansave : false,
		asktemperature : false,
		autoclient : false
	}

	self.session = f.makeid()
	self.id = null
	self.saving = false
	self.history = {
		type : null,
		data : []
	}

	self.consistentTypes = [
		['chat'],
		['email', 'speech'],
	]

	self.recall = function(data = {}){
		if(data.context) self.context = _.clone(data.context)
		if(data.result) self.result = _.clone(data.result)
		if(data.type) self.type = _.clone(data.type)
		if(data.stage) self.stage = _.clone(data.stage)
		if(data.parameters) self.parameters = _.clone(data.parameters)
		if(data.data) self.data = _.clone(data.data)
		if(data.history) {
			self.history = _.clone(data.history)
			self.history.data = _.clone(data.history.data)
		}
		if(data.session) self.session = _.clone(data.session)
		if(data.files) self.files = _.clone(data.files)

		if(typeof data.temperature != 'undefined') self.temperature = data.temperature
		
	}

	self.status = function(){

		var titlechunks = ['Empty chat']

		if (self.type){
			titlechunks = [self.type.name]
		}

		/*if (self.context.portfolio){
			titlechunks.push(self.context.portfolio.name)
		}

		if (self.context.client){
			titlechunks.push(self.context.client.name)
		}*/

		return {
			context : self.context,
			result : self.result,
			type : self.type ? {
				name : self.type.name,
				id : self.type.id
			} : null,
			stage : self.stage,
			parameters : self.parameters,
			data : self.data,
			history : self.history,
			session : self.session,
			title : titlechunks.join(', '),
			temperature : self.temperature
		}
	}

	var helpers = {
		getportfolio : function(clbk){
			if (self.context.portfolio){
				settings.helpers.getportfolio(self.context.portfolio, clbk)
			}

			else{
				clbk(null)
			}
		},

		getclient : function(clbk){
			if (self.context.client){
				settings.helpers.getclient(self.context.client, clbk)
			}

			else{
				clbk(null)
			}
		},

		hardrequest : function(promise, attempt, totaltime, wasmessage){

			if(!totaltime) totaltime = 0
			if(!attempt) attempt = 0
			if(!wasmessage) wasmessage = false


			var time = new Date().getTime()

			return promise().then(function(data){

				return Promise.resolve(data)

			}).catch(function(error){

				if(attempt >= 2){
					return Promise.reject(error)
				}

				attempt++

				var td = new Date().getTime() - time

				if (td > 30000 && !wasmessage){

					wasmessage = true

					_.each(self.hooks.wantsay, function(ws){

						ws([{
							type : 'message',
							event : {
								message : 'Generation takes longer than expected, please wait'
							}
						}])

					})
					//say
				}

				return helpers.hardrequest(promise, attempt, totaltime + td, wasmessage)


			})

		},

		askParameter : function(clbk){


			var index = null
			
			_.find(self.parameters, (p, i) => {
				if(p.question){
					index = i
					return true
				}
			})

			if (index){
				templates.parameterQuestion(index, clbk)
				return true
			}

			var needAskParameter = _.find(self.type.parameters, function(parameter){

				if(!parameter.Id) return false
				
				if(typeof self.parameters[parameter.Id] == 'undefined'){

					return true
				}
	
			})

			console.log('needAskParameter', needAskParameter)
	
			if (needAskParameter){
				templates.parameter(needAskParameter, clbk)

				return true
			}
				 
		}
	}
	
	var actions = {

		restart : function(){
			self.context = context ? _.clone(context) : {}

			self.type = null

			self.data = {}
			self.parameters = {}
			self.result = undefined
			self.displayerror = null

			self.stage = {
				resultshowed : false,
				cansave : self.stage.cansave,
				refine : false,
				chatstopped : false,
				userask : true,
				userhasask : false,
				asktemperature : false
			}

			//self.session = makeid()

			self.history.type = null
			self.history.data = []
			self.files = []

			self.temperature = defaulttemperature
		},

		

		complianceReview : {
			text : "Send for compliance Review",
			
			donotcontinue : true,
			clbk : function(){

			},
			action : function(clbk){


				settings.actions.sendToComplience(self.result, function(err){

					if(!err)
						clbk("Success! Your email was forwarded to complicance departement for review.")

					else{
						clbk('')
					}
				})

				/*setTimeout(function(){
				
					

				}, 1000)*/
				
			}
		},

		generateemail : {
			text : "Send email",
			/// TODO CHECK
			donotcontinue : true,
			clbk : function(){

			},
			action : function(clbk){

				helpers.getportfolio(function(portfolio){

					helpers.getclient(function(client){

						var result = {
							caption : (self.result.caption),
							text : f.convertNewLinesToBr(self.result.text),
							title : "Email created by artificial intelligence"
						}

						settings.actions.sendEmail(portfolio, client, result, function(result){
							clbk('')
						})
					})

				})
				
			}
		},

		copyresult : {
			text : "Copy text",
			donotcontinue : true,
			clbk : function(result){
				copyTextClear((result.caption || '') + '\n\n' + (result.text))
				sitemessage("Text was copied")
			}
		},

		share : {
			donotcontinue : true,
			text : "Share",
			clbk : function(){
				
			}
		},

		refine : {
			style : 'main',
			text : "Refine",
			clbk : function(){
				
				self.stage.refine = true
				self.data.text = undefined
			}
		},

		regenerate: {
			text : "Regenerate",
			clbk : function(){
				
				self.stage.resultshowed = false
				self.stage.asktemperature = true
				self.result = undefined

			}
		},

		stop : {
			text : "Stop",
			clbk : function(){
				self.stage.chatstopped = true
			}
		},

		continueWithPromt: {
			style : 'main',
			text : "Continue",
			clbk : function(){
				self.result = undefined
				self.stage.resultshowed = false
				self.context.test = false


				//// TODO PROMT EVERY TIME
			}
		},

		makePromt: {
			style : 'main',
			text : "Make promt",
			clbk : function(){
				self.result = undefined
				self.stage.resultshowed = false
				self.context.test = true
				

				//// TODO PROMT EVERY TIME
			}
		},
	}

	/*
	
	Send for compliance Review
10:52
Success! Your email was forwarded to complicance departement for review.
	*/

	var templates = {

		complianceReview : function(clbk){


			clbk([{
				type : 'message',
				event : {
				
					message : "Please wait, sending email to complicance departement for review...",
					icons : [{
						i : 'fas fa-spinner fa-spin',
						style : 'good'
					}],
					action : function(p = {}){
	
						if(p.before) p.before(false)

						setTimeout(function(){
							if(p.clbk) p.clbk(error, {hide : true})
						}, 1000)


					}
				}
			}])
		},

		intro : function(clbk){
			var events = [{
				type : 'message',
				event : {
					message : "How can I help you?"
				}
			}]

			var answers = {
				type : 'parameter',
				event : {
					type : 'answers',
					answers : _.sortBy(_.map(self.types, function(meta){
						return {
							dictionary : meta.dictionary,
							order : meta.order || 5,
							text : meta.name,
							clbk : function(){
								self.type = meta


								//TODO consistent types

								if (self.type.type == 'chat' || self.history.type == 'chat'){
									self.history.data = []
								}

								self.history.type = self.type.type
							}
						}
					}), function(v){
						return v.order
					})
				}
			}

			events.push(answers)

			return clbk(events)
		},

		clientname: function(clbk){

			helpers.getclient((client) => {

				var text = ''

				if(!client){
					text = 'Contact: Not selected'
				}
				else{
					text = (client.Type == 'CLIENT' ? 'Client:' : 'Lead:') + " " + client.FName + " " + client.LName
				}

				this.simpletext(text, clbk)

			})
			
		},

		client : function(clbk){
			var events = [{
				type : 'message',
				event : {
					message : "Please select the person for whom the result is generated?"
				}
			}]

			var selectclbk = (_clbk, id, name) => {

				if (!id || !name){

					self.context.client = null

					if (_clbk)
						_clbk('')
				}

				else{

					self.context.client = id

					if (_clbk)
						_clbk(name)
				}
			}

			settings.answers.client(selectclbk, function(_ans){
				var answers = {
					type : 'parameter',
						event : {
						type : 'answers',
						answers : (_ans || []).concat(

							self.type.clientRequired ? [] : [{
								text : "Proceed without client",
								dictionary : ['without', 'empty'],
								clbk : function(){
			
									selectclbk(null, null)
			
								}
							}]

						)
					}
				}

				events.push(answers)

				clbk(events)
			})
		},

		portfolio : function(clbk){
			var events = [{
				type : 'message',
				event : {
					message : "Please select portfolio"
				}
			}]

			var selectclbk = (_clbk, id, name, clientid) => {
				if (!id || !name){

					self.context.portfolio = null

					if (_clbk)
						_clbk('')
				}

				else{

					self.context.portfolio = id

					if(clientid){
						self.stage.autoclient = true
						self.context.client = clientid
					}

					if (_clbk)
						_clbk(name)
				}
			}

			settings.answers.portfolio(selectclbk, function(_ans){
				var answers = {
					type : 'parameter',
						event : {
						type : 'answers',
						answers : (_ans || []).concat(

							self.type.portfolioRequired ? [] : [{
								text : "Proceed without portfolio",
								dictionary : ['without', 'empty'],
								clbk : function(){
			
									selectclbk(null, null)
			
								}
							}]

						)
					}
				}

				events.push(answers)

				clbk(events)
			})
			
		},


		error : function(error, clbk){

			var errorToText = 'Undefined Error (1)'

			try{
				errorToText = JSON.stringify(error)
			}catch(e){

			}

			if(clbk) clbk([{
				type : 'message',
				event : {
					message : "An error has occurred"
				}
			},{
				type : 'message',
				event : {
					message : errorToText
				}
			}, {
				type : 'parameter',
				event : {
					type : 'answers',
					answers : [{
						dictionary : ['try'],
						text : 'Try again',
						clbk : function(){
							
						}
					},
					{
						dictionary : ['start'],
						text : 'Start over',
						clbk : function(){
							
							actions.restart()
						}
					}, {
						dictionary : ['close', 'thanks', 'exit'],
						text : 'Close',
						action : function(){
                            settings.actions.close ? settings.actions.close() : ''
							
						}
					}]
				}
			}])
		},

		end : function(clbk){
			

			if(clbk) clbk([{
				cantsave : true,
				type : 'message',
				event : {
					message : "I hope I helped you! Have a good day!"
				}
			}, {
				type : 'parameter',
				cantsave : true,
				event : {
					type : 'answers',
					answers : [{
						dictionary : ['close', 'thanks', 'exit'],
						text : 'Close',
						action : function(){
							settings.actions.close ? settings.actions.close() : ''
						}
					}, {
						dictionary : ['resume'],
						text : 'Resume chat',
						clbk : function(){

							self.stage.chatstopped = false
							
							if (self.type.type != 'chat'){
								
								actions.refine.clbk()

							}

						}
					},{
						dictionary : ['again', 'start'],
						text : 'Start over',
						clbk : function(){
							
							actions.restart()
							
						}
					}]
				}
			}])
		},

		text : function(text, fillclbk, clbk){

			clbk([{
				type : 'message',
				event : {
					message : text
				}
			}, {
				type : 'parameter',
				event : {
					type : 'answers',
					textanswer : true,
					clbk : function(text){
						fillclbk(text)
					},
					answers : [{
						dictionary : ['cancel'],
						text : 'Cancel',
						clbk : function(){
							fillclbk('')
						}
					}]
				}
			}])

		},

		simpletext : function(text, clbk){
			clbk([{
				type : 'message',
				event : {
					message : text,
					justsay : true
				}
			}])
		},

		style : function(clbk){

			var styles = [{
				text : "Aggressive",
				value : "agressive"
			}]

			clbk([{
				type : 'message',
				event : {
					message : "Choose a style for " + self.type.shortName,
				}
			}, {
				type : 'parameter',
				event : {
					type : 'answers',
					answers : _.map(styles, function(stl){
						return {
							dictionary : [],
							text : stl.text,
							clbk : function(){
								self.data.style = stl.value
							}
						}
					})
				
				}
			}])
		},

		generate : function(clbk){


			var event = {
				type : 'message',
				event : {
				
					message : self.context.test ? "Please wait, generating promt..." : "Please wait, generating...",
					icons : [{
						i : 'fas fa-spinner fa-spin',
						style : 'good'
					}],
					//shadow : self.type.type == 'chat' ? true : false,
					action : function(p = {}){
	
						//if(p.before) p.before(self.type.type == 'chat' && !self.type.pdf ? false : true)

						if(p.before) p.before(false)

						var files = _.map(self.files, (f) => {
							return f.replace('rxfile:', '')
						})

						_.each(self.type.parameters, (parameter, i) => {
							if(parameter.Type == 'file' && typeof self.parameters[parameter.Id] != 'undefined'){
								files.push(self.parameters[parameter.Id].replace('rxfile:', ''))
							}
						})

						files = _.uniq(files, (f) => {return f})

						console.log('self.type', self.type, self, files)

						if(self.type.pdf){
							var lastquestion = _.find([].concat(self.history.data).reverse(), function(v){
								return v.speaker != 'AI'
							})

							console.log('lastquestion', lastquestion)

							if(!lastquestion){
								if(p.clbk) p.clbk("I can't find your last question", {hide : true})
							}
							else{


								helpers.hardrequest(function(){
									return settings.ai.pdf(self.parameters, {
										query : lastquestion.text
									}, {
										session : self.session,
										files
									})
								})

								.then(function(r){

									if (self.type.type == 'chat' && r.text){
										self.history.data.push({
											speaker : "AI",
											text : r.text
										})
									}

									self.result = r

									if(p.clbk) p.clbk('', {hide : true})

								}).catch(function(error){

									if(p.clbk) p.clbk(error, {hide : true})

								})
							}



						}
						else{

							helpers.getportfolio(function(portfolio){

								helpers.getclient(function(client){
									helpers.hardrequest(function(){

										

										return settings.ai.generate(self.type.id, self.parameters, {
											test : self.context.test || false,
											portfolio : portfolio ? portfolio.id : null,
											client : client ? client.ID : null
										}, {
											//refinetext : self.data.text,
											history : self.history.data,
											temperature : self.temperature,
											files
										})

									})
									
									.then(function(r){
			
										self.temperature = defaulttemperature
										
										if (self.type.type == 'chat' && r.text){
											self.history.data.push({
												speaker : "AI",
												text : r.text
											})
										}
			
										self.result = r
			
										if(p.clbk) p.clbk('', {hide : true})
			
									}).catch(function(error){
			
										event.hidden = true
			
			
			
										if(p.clbk) p.clbk(error, {hide : true})
			
									})

								})
							})
						}
	
						

					}
				}
			}

			clbk([event])
		},

		result : function(clbk){

			if (self.result.text && self.type.type != 'chat'){
				self.history.data.push({
					speaker : 'AI',
					text : self.result.text
				})
			}

			var fixresult = self.result

			clbk(

				_.filter(
				
					[{
						type : 'message',
						event : {
							fast : self.context.test || false,
							message : self.result.html ? 'Here is the landing page:' : (
								self.result.caption ? (self.result.caption + '\n\n') : "") + (self.result.text ? self.result.text : ("Request: \n" + (self.result.fullrequest || "Empty") + "\n\nShort request:\n" + (self.result.shortrequest || "Empty") + "\n\nCompletion request:\n" + (self.result.completion || "Empty")
							)),

							requestId : (self.result.html ? null : self.result.requestId) || null
						}
					}, 
					
					self.result.html ?
	
					{
						type : 'html',
						event : {
							html : self.result.html,
							requestId : self.result.requestId || null
						}
					} : null,
				
				
				
					{
					type : 'parameter',
					event : {
						type : 'answers',
						nothide : true,
						
						action : self.type.type != 'chat' ? null : function(p = {}){

							if(p.clbk) p.clbk()
						},


						textanswer : self.type.type != 'chat',
						clbk : self.type.type != 'chat' ? function(text){

							self.result = undefined
							self.stage.resultshowed = false
							self.data.text = text

							self.history.data.push({
								speaker : "Additional Instruction",
								text : text,
								userask : true
							})
							
						} : null,
						
						answers : _.map(
							_.filter(self.type.type == 'chat' ? 
							
							[settings.user.aiadmin && !self.context.test && !self.type.pdf ? actions.makePromt : null, /*actions.copyresult,*/ actions.stop] : 
							
							[
								settings.user.aiadmin && !self.type.pdf ? actions.makePromt : null, 
								actions.refine,

								self.type.type == 'email' && !self.result.html && self.result.text && !self.context.test && !settings.user.limitedversion ? actions.generateemail : null, 

								/*self.result.text && !self.context.test && !self.result.html ? actions.complianceReview : null, */
								
								self.context.test ? null : actions.regenerate
							],
							
							function(v){

								return v

							}), function(stl){

							return {
								dictionary : [],
								text : stl.text,
								style : stl.style || '',
								action : stl.action || null,
								donotcontinue : stl.donotcontinue,
								clbk : function(){
									if (stl.clbk)
										stl.clbk(fixresult)
								}
							}
						}).concat(self.type.type == 'chat' || self.context.test ? [] : [
							{
								dictionary : ['next'],
								text : "Continue",
								clbk : function(){
									
								}
							}
						])}
					}]
				
				)
			
			
			)


			self.context.test = false
		},

		parameterQuestion : function(qpindex, clbk){

			var answerFormat = {
				type : 'parameter',
				event : {
					type : 'answers',
					textanswer : true,
					clbk : function(text){
						self.parameters[qpindex] = text
					},
					answers : [{
						dictionary : ['skip'],
						text : 'Skip',
						clbk : function(){
							self.parameters[qpindex] = self.parameters[qpindex].value
						}
					}]
				}
			}

			clbk([{
				type : 'message',
				event : {
					message : self.parameters[qpindex].question
				}
			}, answerFormat])
		},

		parameter : function(parameter, clbk){

			var answerFormat = {
				type : 'parameter',
				event : {}
			}


			if(parameter.Type == 'string' && !parameter.Values){

				answerFormat.event = {
					type : 'answers',
					textanswer : true,
					clbk : function(text){
						self.parameters[parameter.Id] = text
					},
					answers : [{
						dictionary : ['skip'],
						text : 'Skip',
						clbk : function(){
							self.parameters[parameter.Id] = ''
						}
					}]
				}

			}

			if(parameter.Type == 'file'){

				answerFormat.event = {
					type : 'answers',
					answers : [
						{
							dictionary : ['upload'],
							text : "Upload file",
							needfill : true,
							action : function(clbk){
								settings.helpers.uploadfile((value) => {

									self.parameters[parameter.Id] = value

									if(clbk) clbk(value)
								})
							}
						}
					]
				}

			}

			if(parameter.Type == 'string' && parameter.Values){

				answerFormat.event = {
					type : 'answers',
					answers : _.map(parameter.Values, function(value){

						if(_.isObject(value)){
							return {
								dictionary : [],
								text : value.value,
								clbk : function(){
									self.parameters[parameter.Id] = {
										value : value.value,
										question : value.question
									}
								}
							}
						}
						else{
							return {
								dictionary : [],
								text : value,
								clbk : function(){
									self.parameters[parameter.Id] = value
								}
							}
						}

						

					})
				}

			}

			if(parameter.Type == 'bool'){

				answerFormat.event = {
					type : 'answers',
					answers : [
						{
							dictionary : commandDictionary.yes,
							text : "Yes",
							clbk : function(){
								self.parameters[parameter.Id] = true
							}
						},
						{
							dictionary : commandDictionary.no,
							text : "No",
							clbk : function(){
								self.parameters[parameter.Id] = false
							}
						}
					]
				}

			}
			
			clbk([{
				type : 'message',
				event : {
					message : parameter.Name
				}
			}, answerFormat])

		},

		isittest : function(clbk){

			clbk([{
				type : 'message',
				event : {
					message : 'Do you want to generate a promt first?'
				}
			}, {

				type : 'parameter',
				event : {
					type : 'answers',
					answers : [
						{
							dictionary : commandDictionary.yes,
							text : "Yes",
							clbk : function(){
								self.context.test = true
							}
						},
						{
							dictionary : commandDictionary.no,
							text : "No",
							clbk : function(){
								self.context.test = false
							}
						}
					]
				}
				
			}])

			
		},

		simpleecho : function(clbk){
			var text = `Dear [Financial Advisor],

			I hope this email finds you well. As we discussed, I have gathered some information about the Beneo Inc 401(K) Profit Sharing Plan and Trust that you will be analyzing and marketing your services to.
			
			Firstly, I would like to provide some information about your role as a financial advisor. Your main objective is to analyze the retirement plan and identify any potential issues or red flags that may arise. It is important to thoroughly understand the plan and its components in order to effectively market your services to the plan.
			
			Now, onto the retirement plan itself. The plan name is Beneo Inc 401(K) Profit Sharing Plan and Trust. It is a Profit Share Without Advanced Design Plan with Participants Loans. 
			
			However, there are some red flags that you should be aware of. Red flags are potential issues with the plan that may need to be addressed. In this case, the red flags are related to the Profit Share Without Advanced Design Plan and Participants Loans.
			
			Additionally, there are fiduciary risk factors that have been derived from form 5500. The higher the risk score, the more important it is to address these factors. It is important to thoroughly analyze these risk factors and address any potential issues that may arise.
			
			Furthermore, it is important to access the retirement plan's website or portal to determine the ease or difficulty of enrolling, making or changing elections or investment options, requesting distributions, and similar actions. Doing so now, and on a regular basis going forward, may uncover issues that can be adjusted and corrected and may help prevent participant claims or irritation in the future. Plan sponsors and administrators may wish to check off this "top 10 list" before year-end to avoid 401(k) compliance issues.
			
			In addition, it is important to ensure that the plan complies with the applicable reporting and disclosure requirements. This includes making sure that the plan complies with the reporting and disclosure requirements outlined in the PDF document provided in the source below.
			
			In light of recent developments, it is also important to note that excessive fees can be a potential issue for retirement plans. The Seventh Circuit recently issued its opinion in Hughes v. Northwestern University, concluding that participants in two Northwestern 403b plans plausibly pled fiduciary-breach claims based on allegations of excessive recordkeeping and investment management fees. While the claim that too many investment options caused "decision paralysis" was dismissed, it is important to keep in mind that excessive fees can be a potential issue for retirement plans.
			
			In conclusion, it is important to focus on the potential problems with the plan and address them accordingly. By doing so, you will be able to effectively market your services to the plan and provide valuable insights to your clients.
			
			Best regards,
			
			[Your Name]
			
			Sources: abd, Northwestern University's Alternative Explanations Not Strong Enough to Defeat ERISA Excessive Fee Claims, United States Government PDF on reporting and disclosure requirements.`

			clbk([{
				type : 'message',
				event : {
					message : text
				}
			}])
		},

		userask : function(needmessage, clbk){

			clbk((needmessage ? [
				{
					type : 'message',
					event : {
						message : 'Please ask me anything'
					}
				}
			] : []).concat([
				{
					type : 'parameter',
					event : {
						type : 'answers',
						textanswer : true,
						clbk : function(text){

							self.history.data.push({
								speaker : settings.user.name || "User",
								text : text,
								userask : true
							})

						},
						answers : [].concat(needmessage ? [{
							dictionary : ['cancel'],
							text : 'Cancel',
							clbk : function(){
								self.stage.chatstopped = true
							}
						}] : [])
					}
				}
			]))
			
		},

		resume : function(clbk){
			clbk([{
				type : 'message',
				cantsave : true,
				event : {
					message : "Would you like to continue this chat?",
					
				}
			}, {
				type : 'parameter',
				cantsave : true,
				event : {
					type : 'answers',
					answers : [
						{
							dictionary : commandDictionary.yes,
							text : "Yes",
							clbk : function(){
								
							}
						}
					]
				}
			}])
		},

		asktemperature: function(clbk){
			clbk([{
				type : 'message',
				event : {
					message : "How different should the new version be?",
					
				}
			}, {
				type : 'parameter',
				event : {
					type : 'answers',
					answers : [
						{
							dictionary : ['slightly'],
							text : "Slightly different",
							clbk : function(){
								self.temperature = 0.1
							}
						},
						{
							dictionary : ['slightly'],
							text : "Considerably different",
							clbk : function(){
								self.temperature = 0.3
							}
						},
						{
							dictionary : ['slightly'],
							text : "Very different",
							clbk : function(){
								self.temperature = 0.4
							}
						}
					]
				}
			}])
		},
	}

	self.nextEventsPrepare = function(clbk){
		self.nextEvents(function(events){

			_.each(events, function(event){
				if(event.event && event.event.answers){
					_.each(event.event.answers, function(answer){
						answer.answerid = f.makeid()
					})
				}	
			})

			clbk(events)
		})
	}

	self.nextEvents = function(clbk){

		if (self.stopped){
			return clbk([])
		}

		if (self.recalled){

			self.recalled = false

			return templates.resume(clbk) 
		}

		if (self.displayerror){

			var e = self.displayerror

			self.displayerror = null

			return templates.error(e, clbk) 
		}

		if(!self.type){
			return templates.intro(clbk)
		}

		if (self.type.type == 'chat'){

			if (helpers.askParameter(clbk)){
				return
			}

			if (self.stage.chatstopped){
				return templates.end(clbk)
			}

			if (self.stage.userask){

				self.stage.userask = false

				return templates.userask(!self.stage.userhasask, clbk)
			}

			else {

				self.stage.userhasask = true
				self.stage.cansave = true

				if(typeof self.result == 'undefined'){
					return templates.generate(clbk)
				}
				else{

					self.stage.userask = true

					return templates.result(function(d){
						self.result = undefined
						clbk(d)
					})
				}
				
			}

			return
		}

		if (self.type.type == 'speech' || self.type.type == 'email'){

			if (typeof self.context.portfolio == 'undefined' && self.type.portfolioRequired){
				return templates.portfolio(clbk)
			}

			if (self.type.clientRequired && typeof self.context.client == 'undefined'){

				return templates.client(clbk)
			}

			if (self.stage.autoclient){

				self.stage.autoclient = false

				return templates.clientname(clbk)
			}
		}

		

		if (self.stage.refine){ 

			self.stage.refine = false

			return templates.text('Please add additional instructions', function(text){

				self.data.text = text
				

				if(!text){

					

				}	
				else{

					self.history.data.push({
						speaker : "Additional Instruction",
						text : text,
						userask : true
					})

					self.result = undefined
					self.stage.resultshowed = false
				}

			}, clbk)
		}

		self.stage.cansave = true

		//return templates.simpleecho(clbk)

		if (helpers.askParameter(clbk)){
			return
		}

		if (self.stage.asktemperature){

			self.stage.asktemperature = false

			return templates.asktemperature(clbk)
		}

		if(typeof self.result == 'undefined'){
			return templates.generate(clbk)
		}

		if(!self.stage.resultshowed){ 
			
			self.stage.resultshowed = true

			return templates.result(clbk)
		}

		
		////TODO

		/*if (typeof self.data.text == 'undefined'){
			return templates.text('Say something else', function(text){

				self.data.text = text

			}, clbk)
		}*/
		

		return templates.end(clbk)
		
	}

	self.prepare = function(clbk){

		settings.template.list().then(function(templates){

			_.each(templates, function(template){
				self.types[template.Id] = {
					id : template.Id,
					name : template.Name,
					dictionary : template.Parameters.Dictionary || [],
					shortName : template.Parameters.ShortName || [],
					type : template.Parameters.Type || 'email',
					parameters : template.Parameters.Parameters || [],

					portfolioRequired : template.Parameters.PortfolioRequired || false,
					clientRequired : template.Parameters.ClientRequired || false,
					skipClient : template.Parameters.skipClient || false,
					
					test : template.Parameters.Test || false,
					order : template.Parameters.Order || 5
				}
			})

			self.types['pdf_att'] = {
				id : 'pdf_att',
				name : "Ask about your document",
				dictionary : ['document'],
				shortName : "PDF",
				type : 'chat',
				parameters : [{
					"Name": "Please select a file",
					"Id": "attach",
					"Type": "file",
					"DefaultValue": ""
				}],
				order : 4,
				pdf : true
			}

			if(clbk) clbk()
		})
	}

	self.actions = {
		restart : function(){
			actions.restart()
		},

		changetype: function(){
			self.type = null

			self.data = {}
			self.parameters = {}
			self.result = undefined
			self.displayerror = null

			self.stage.chatstopped = false
			self.stage.refine = false

		},

		cancelportfolio : function(){
			delete self.context.portfolio 

			self.result = undefined
			self.stage.resultshowed = false
		},

		cancelclient : function(){
			delete self.context.client

			self.result = undefined
			self.stage.resultshowed = false
		},

		cancelparameter : function(id){
			delete self.parameters[id]
			self.result = undefined
			self.stage.resultshowed = false
		},
	}

	self.fillingstatus = function(){

		if(self.stopped) return 'stopped'

		if(self.saving) return 'saving'

		if (self.id){
			return 'cleansaved'
		}

		if(self.stage.cansave) return 'clean'

		return 'draft'
	}

	self.addfile = function(id){
		self.files.push(id)
	}

	self.removefile = function(id){
		self.files = _.filter(self.files, (i) => {
			return i != id
		})

		var rmp = []

		_.each(self.parameters, (p, i) => {
			if(self.parameters[i] == id) rmp.push(i)
		})

		console.log('rmp', rmp, id, self.parameters)

		_.each(rmp, (i) => {
			delete self.parameters[i]
		})
	}

	return self
} 

export default Master