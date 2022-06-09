import f from './functions'
import {Contact, Portfolio} from './lib/kit.js'
var Axios = require('axios');

var sha1 = require('sha1');
var { parseerror } = require('./error')

import dbstorage from "./dbstorage";
import _ from 'underscore';

var FormDataRequest = function(core = {}, url, system){

	var self = this

	self.fetch = function(to, formData, p){
		const headers = {'content-type': 'multipart/form-data'}

		return core.user.extendA({ formData, system }).then(r => {

			return Axios({
				baseURL: url,
				url: to || '',
				data: formData,
				method: 'post',
				headers,
			}).then(r => {

				if(f.deep(r, 'data.errors')){
					return Promise.reject(parseerror({
						code : 500,
						errors : r.data.errors
					}))
				}


				return Promise.resolve(r.data)
			})
		})
		
	}

}

var Request = function (core = {}, url, system) {
	var self = this

	var loading = {}

	var timeout = function (ms, promise, controller) {

		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {

				if (controller.signal.dontabortable) {
					return
				}

				if (controller) {
					controller.abort()
				}
			}, ms)

			promise.then(value => {

				clearTimeout(timer)
				resolve(value)

			}).catch(reason => {

				clearTimeout(timer)
				reject(reason)

			})
		})
	}

	var direct = function (url, data, p) {

		if (!p) p = {}

		if (typeof AbortController != 'undefined') {
			var controller = p.controller || (new AbortController())

			var time = p.timeout || 30000

			if (window.cordova) {
				time = time * 2
			}

			return timeout(time, directclear(url, data, controller.signal, p), controller)
		}
		else {
			return directclear(url, data, null, p)
		}


	}

	var directclear = function (url, data, signal, p) {

		if (!p) p = {}

		if (!data)
			data = {}

		var headers = _.extend({
			'Accept': 'application/json',
			'Content-Type': 'application/json;charset=utf-8'
		}, p.headers || {})

		var er = false
		var status = 0
		var token  = ''


		return (core.user ? core.user.extendA({ headers, data, system }) : Promise.resolve()).then(r => {

			var parameters = {

				method: p.method || 'POST',
				mode: 'cors',
				headers: headers,
				signal: signal
			}

			if (parameters.method == 'POST') parameters.body = JSON.stringify(data)
			if (parameters.method == 'GET') url = url + (url.indexOf('?') > -1 ? '&' : '?') + new URLSearchParams(data)

			return fetch(url, parameters)

		}).then(response => {

			if (signal)
				signal.dontabortable = true

			if (!response.ok) {
				er = true
			}

			var json = {}

			status = response.status

			const contentType = response.headers.get("content-type");

			token = response.headers.get("Token");


			if (contentType && contentType.indexOf("application/json") !== -1) {

				return response.json()

			} else {
				return response.text().then(text => {

					return {
						Message: text,
					}

				});
			}

		}).then(result => {

			result.code = status

			if(result.result == 'failed'){
				result.code = 500
				result.Error = result.errors
				er = true
			}

			if (result.AuthSession && result.AuthSession.Error){ /// oldpct
				result.code = 500
				result.Error = result.AuthSession.Error
				er = true
			}

			if (er) {
				return Promise.reject(parseerror(result))
			}

			else {

				if(!result.token)
					result.token = token

				core.user.extendU(result, system)
			}

			var data = (result || {}).data || result || {}

			return Promise.resolve(data)

		}).catch(e => {


			if(e && e.toString() && e.toString().indexOf('Failed to fetch') > -1){
				e.code = 20
			}

			return Promise.reject(e)
		})
	}

	var doublePreventRequest = function(path, data, p){
		var datahash = sha1(path + JSON.stringify(data))

		if (loading[datahash]){
			return loading[datahash]
		}

		loading[datahash] = direct(path, data, p).then((r) => {
			delete loading[datahash]
			return Promise.resolve(r)
		}).catch(e => {
			delete loading[datahash]
			return Promise.reject(e)
		})

		return loading[datahash]
	}

	self.fetch = function (path, data, p) {

		if(!path) path = ''

		return doublePreventRequest(url ? (url + (path.indexOf('?') == 0 ? '' : '/') + path) : path, data, p)

		return direct(url ? (url + (path.indexOf('?') == 0 ? '' : '/') + path) : path, data, p)

	}

	return self
}

var ApiWrapper = function (core) {

	var self = this;

	var cache = {}
	var loading = {}
	var storages = {}

	self.appid = 'net.rixtrema.pct'

	var dbmeta = {
		stress : function(){
			return {
				storage : 'stress',
				time : 60 * 60 * 48,
				version : 2
			}
		},

		system : function(){
			return {
				storage : 'system',
				time : 60 * 60 * 148,
				version : 2
			}
		},

		files : function(){
			return {
				storage : 'files',
				time : 60 * 60 * 12 
			}
		},

		portfolios : function(){
			return {
				storage : 'portfolios',
				time : 60 * 60 * 12 
			}
		},

		contacts : function(){
			return {
				storage : 'contacts',
				time : 60 * 60 * 12 
			}
		},

		financial: function(){
			return {
				storage : 'financial',
				time : 60 * 60 * 248 
			}
		},
	}

	var requests = {
		pct: new Request(core, "https://rixtrema.net/RixtremaWS/AJAXPCT.aspx", 'pct'),
		pctapi: new Request(core, "https://rixtrema.net/api/pct", 'pctapi'),
		api: new Request(core, "https://rixtrema.net/api", 'api'),

		apiFD: new FormDataRequest(core, "https://rixtrema.net/api", 'api'),
		/* temp */
		'401k' : new Request(core, "https://rixtrema.net/RixtremaWS401k/AJAXFCT.aspx", '401k'),
		'401kFD' : new FormDataRequest(core, "https://rixtrema.net/RixtremaWS401k/AJAXFCT.aspx", '401k'),
		/* ---- */

		default: new Request(core)
	}

	var liststorage = {}

	var waitonline = function () {

		if (!core || !core.waitonline) {
			return Promise.resolve()
		}

		return core.waitonline()

	}

	var prepareliststorage = function(data, system, to, p){

		liststorage[system] || (liststorage[system] = {})
		liststorage[system][to] || (liststorage[system][to] = {})

		var datahash = ''

		_.each(data, function(v, k){
			if(k != p.from && k != p.to && v && k != p.includeCount) datahash += JSON.stringify(v)
		})

		datahash = sha1(datahash)

		liststorage[system][to][datahash] || (liststorage[system][to][datahash] = {
			count : undefined,
			data : {}
		})


		return datahash
	}

	var getloaded = function(datahash, data, system, to, p){

		var _fr = data[p.from] || 0
		var _count = data[p.count] || 100

		if(p.bypages) _fr = (_fr * _count)

		var storage = liststorage[system][to][datahash]

		var loaded = _.filter(storage.data, function(e, i){
			if(i >= _fr && (i < _count + _fr) ){
				return true
			}
		})

		var flength = _.filter(storage.data, function(e, i){
			return e
		}).length

		var r = {
			data : 	loaded,
			count : storage.count,
			last : 	_.isEmpty(storage.data) ? undefined : _.max(_.map(Object.keys(storage.data), v => Number(v))),
			first : _.isEmpty(storage.data) ? undefined : _.min(_.map(Object.keys(storage.data), v => Number(v)))
		}


		if(flength == storage.count) return r

		if(_count && _count == loaded.length) return r

		return null

	}

	var paginatedrequest = function(data, system, to, p){



		if(!p) p = {}
		if(!data) data = {}

		p.from || (p.from = "From")
		p.count || (p.count = "To")
		p.includeCount || (p.includeCount = "Count")

		var datahash = prepareliststorage(data, system, to, p)

		if (p.refresh) {

			liststorage[system][to][datahash].data = []
			liststorage[system][to][datahash].count = undefined

		}

		var loaded = getloaded(datahash, data, system, to, p)

		if (loaded) return Promise.resolve(loaded)

		if(!liststorage[system][to][datahash].count) data[p.includeCount] = true
		

		return request(data, system, to, p).then(r => {

			if(r.pagination) r.count = r.pagination.total

			prepareliststorage(data, system, to, p) /// async. maybe clear

			if(!data[p.from]) data[p.from] = 0

			_.each(r.records || [], (e, i) => {
				var c = 0
				
				if(p.bypages){c = data[p.from] * data[p.count] + i}else{c = data[p.from] + i}

				liststorage[system][to][datahash].data[c] = e
			})

			if (typeof r.count != 'undefined' && data[p.includeCount])
				liststorage[system][to][datahash].count = r.count

			var loaded = getloaded(datahash, data, system, to, p)

			if(!loaded) return Promise.reject('notloaded')

			return Promise.resolve(loaded)
		})

	}

	var getstorage = function (p) {


		if (!storages[p.storage]) {
			return dbstorage(p.storage, p.version || 1, p.time).then(storage => {
				storages[p.storage] = storage

				return Promise.resolve(storage)
			})
		}

		return Promise.resolve(storages[p.storage])
	}

	var scasheAct = function (ids, key, resultsKey, reload, storageparameters) {

		if (!_.isArray(ids)) ids = [ids]

		var waitLoading = {}

		if (!resultsKey)
			resultsKey = key

		if (!cache[key]) {
			cache[key] = {}
		}

		if (!loading[key]) {
			loading[key] = {}
		}

		return (storageparameters ? getstorage(storageparameters) : f.ep()).then(storage => {

			if (storage) {

				return Promise.all(_.map(ids, (id) => {

					if (cache[key][id]) {
						return Promise.resolve()
					}

					return storage.get(id).then((stored) => {
						cache[key][stored[resultsKey]] = stored

						return Promise.resolve()
					}).catch(e => {
						return Promise.resolve()
					})

				}))

			}

			return Promise.resolve()


		}).then(r => {

			var idtoloadPrev = _.uniq(_.filter(ids, function (id) {
				return reload || !cache[key][id] || cache[key][id].nocache
			}))

			var idtoload = _.filter(idtoloadPrev, function (id) {

				if (!loading[key][id]) {
					loading[key][id] = true
					return true
				}

				waitLoading[id] = true
			})

			var handleResults = function (result, _ids) {

				return (storageparameters ? getstorage(storageparameters) : f.ep()).then(storage => {

					if (storage) {
						return Promise.all(_.map(result, (row) => {

							if (!row[resultsKey]) {
								return Promise.resolve()
							}

							return storage.set(row[resultsKey], row)

						}))
					}

					return Promise.resolve()

				}).then(() => {

					_.each(result, function (row) {

						if (row[resultsKey]) {
							cache[key][row[resultsKey]] = row
						}

					})

					_.each(_ids, function (id) {
						delete loading[key][id]
						delete waitLoading[id]

						if (!cache[key][id])
							cache[key][id] = 'error'
					})

					var nresult = {};

					return f.pretry(() => {

						_.each(ids, function (id) {

							if (cache[key][id]) {

								if (cache[key][id] != 'error')

									nresult[id] = (cache[key][id])

								delete loading[key][id]
								delete waitLoading[id]
							}

						})

						return _.toArray(waitLoading).length == 0

					}).then(() => {
						return Promise.resolve(nresult)
					})

				})



			}

			return Promise.resolve({
				id: idtoload,
				handle: handleResults
			})
		})
	}

	var crequest = function (ids, key, rkey, reload, storageparameters) {

		return scasheAct(ids, key, rkey, reload, storageparameters).then(sh => {

			if (!sh.id.length) {
				return sh.handle([])
			}

			return Promise.reject(sh)

		})


	}

	var dbdividerequest = function(data, system, to, p = {}){

		if(!p.storageparameters) return Promise.reject('p.storageparameters')
		if(!p.storageparameters.divide) return Promise.reject('p.storageparameters.divide')

		var ids = data[p.storageparameters.divide.requestIndex]

		return getstorage(p.storageparameters).then(storage => {


			var loaded = {}
			var needtoload = []

			return Promise.all(

				_.map(ids, (id) => {


					return storage.get(id).catch(e => {
						return Promise.resolve()
					}).then(r => {


						if(r) {
							loaded[id] = r
						}
						else{
							needtoload.push(id)
						}

						return Promise.resolve()
					})
				})

			).then(() => {


				if(!needtoload.length){
					return f.ep()
				}

				data[p.storageparameters.divide.requestIndex] = needtoload

				return request(data, system, to, p).then(r => {
					var data = r

					if(p.storageparameters.divide.path) data = f.deep(r, p.storageparameters.divide.path)

					_.each(data, (obj) => {

						var index = obj[p.storageparameters.divide.getloaded]


						if (index){
							loaded[index] = obj

							storage.set(index, obj).catch(e => {
							})
						}

						
					})

					return Promise.resolve()
				})
			}).then(() => {
				var result = {}

				if (p.storageparameters.divide.path)
					f.deepInsert(result, p.storageparameters.divide.path, _.toArray(loaded))
				else
					result = loaded

				return Promise.resolve(result)
			})

		})

		
	}

	var dbrequest = function(data, system, to, p){


		var _storage = null
		var datahash = sha1(system + to + JSON.stringify(data))
		
		return (p.storageparameters ? getstorage(p.storageparameters) : f.ep()).then(storage => {

			_storage = storage

			if (storage && !p.refreshDb) {
				return storage.get(datahash).catch(e => {
					return Promise.resolve()
				})
			}

			
			return Promise.resolve()

		}).then(cached => {

			if(!cached){

				/// return request(data, system, to, p).then(r => {

				

				return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

					if(_storage){
						return _storage.set(datahash, r, p.storageparameters.invalidate).then(() => {

							return Promise.resolve(r)
	
						})
					}
					return Promise.resolve(r)
					

				})
			}

			return Promise.resolve(cached)

		})
	}	

	var request = function (data, system, to, p = {}, attempt) {

		var alreadyLoaded = []


		if (!attempt) attempt = 0

		

		if (p.vxstorage && p.vxstorage.index){
			var r = core.vxstorage.get(p.vxstorage.index, p.vxstorage.type)

			if (r) return Promise.resolve(r)
		}

		var breakLoading = false

		if (p.vxstorage && p.vxstorage.getloaded){

			if(!p.vxstorage.one){

				alreadyLoaded = _.filter(_.map(data[p.vxstorage.getloaded], function(index){
					return core.vxstorage.get(index, p.vxstorage.type)
				}), (r) => {
					return r
				})
	
				data[p.vxstorage.getloaded] = _.filter(data[p.vxstorage.getloaded], (index) => {
					return !_.find(alreadyLoaded, (obj) => {
						return obj[core.vxstorage.index(p.vxstorage.type)] == index
					})
				})

				if(!data[p.vxstorage.getloaded].length){

					breakLoading = true

				}
			}

			else{

				breakLoading = true

				alreadyLoaded = core.vxstorage.get(p.vxstorage.getloaded, p.vxstorage.type)
				

				if (r) return Promise.resolve(r)
			}

			if(breakLoading){
				var r = {}

				if (p.vxstorage.path){
					f.deepInsert(r, p.vxstorage.path, alreadyLoaded)
				}	
				else{
					r = alreadyLoaded
				}

				if (r) return Promise.resolve(r)
			}

		}

		if (p.preloader){
			core.store.commit('globalpreloader', true)
		}

		return waitonline().then(() => {

			data || (data = {})

			return dbrequest(data, system, to, p).then(r => {

			//return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

				if (p.kit){
					var dk = r

					if (p.kit.path){
						dk = f.deep(dk, p.kit.path) || (p.kit.one ? null : [])
					}


					if(p.kit.one){
						dk = new p.kit.class(dk)
					}
					else{
						dk = _.map(dk, (d) => {return new p.kit.class(d)})
					}

					if (p.kit.path){
						f.deepInsert(r, p.kit.path, dk)
					}	
					else{
						r = dk
					}

				}

				if (p.vxstorage){

					var ds = r

					if(p.vxstorage.path) ds = f.deep(ds, p.vxstorage.path) || (p.vxstorage.one ? null : [])

					if(p.vxstorage.one){
						var stored = core.vxstorage.set(ds, p.vxstorage.type)
					}
					else{

						var stored = core.vxstorage.sets(ds, p.vxstorage.type)

						if (p.vxstorage.getloaded)
							stored = stored.concat(alreadyLoaded)

					}

					if (p.vxstorage.path){
						f.deepInsert(r, p.vxstorage.path, stored)
					}	
					else{
						r = stored
					}

				}

				if (p.showStatus){
					core.store.commit('icon', {
						icon: 'success',
					})
				}

				return Promise.resolve(r)

			}).catch(e => {	

				if (attempt < 3 && e && e.code == 20) {

					core.notifier.simplemessage({
						icon : "fas fa-wifi",
						title : "Please wait",
						message : "Loading takes longer than usual"
					})

					return new Promise((resolve, reject) => {

						attempt++

						setTimeout(function () {
							request(data, system, to, p, attempt).then(r => {
								return resolve(r)
							}).catch(e => {
								return reject(e)
							})

						}, 1000)
					})

				}

				if (p.showStatus || p.showStatusFailed){
					core.store.commit('icon', {
                        icon: 'error',
                        message: e.error
                    })
				}

				return Promise.reject(e)

			}).finally(() => {
				if (p.preloader){
					core.store.commit('globalpreloader', false)
				}
			})


		})


	}
	
	self.invalidateDb = function(dbindex, updated, data){
		if (storages[dbindex]){
			var _updated = f.date.fromstring(updated, true) / 1000 //todo check, utc

			return storages[dbindex].invalidate(_updated, data)
		}

		return Promise.reject("empty Storage")
	}

	self.clearCache = function () {
		var keys = []

		_.each(cache, function(c,i){
			keys.push(i)
		})

		_.each(storages, function(c,i){
			keys.push(i)
		})

		keys = _.uniq(keys)

		_.each(keys, function(k){
			self.clearCacheKey(k)
		})

	}

	self.clearCacheKey = function(key){

		if (cache[key]) delete cache[key]

		

		if (storages[key]) {
			storages[key].clearall().catch(e => {console.error(e)})
			delete storages[key]
		}
	}

	self.pct = {
		tickers : {
			search : function(d){

				if(!d.value) return Promise.resolve([])

				d.count || (d.count = 7)

				return request({RowsToReturn : d.count, SearchStr : d.value}, 'pct', '?Action=GETINCREMENTALSEARCHONTICKERS', {
					method: "POST"
				}).then(r => {

					return Promise.resolve(f.deep(r, 'IncrementalSearch.c') || [])
				})
			}
		},

		portfolio : {
			getassets : function(){
				return request({
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'
				}, 'pct', '?Action=GETPORTFOLIOASSETS', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PortfolioAssets.c)
				})
			},

			standartDeviation : function(){
				return request({
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'
				}, 'pct', '?Action=GETPORTFOLIOSTANDARDDEVIATION', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.GetPortfolioStandardDeviation)
				})
			},

			fromfile : function(data = {}, p = {}){

				/*

				data.File
				data.FileType

				*/

				data.JustParse = 1
				data.Portfolio = 'uploadtemp'

				p.method = "GET"

				return request(data, 'pct', '?Action=LOADPORTFOLIOFROMFILE', p).then(r => {
					return Promise.resolve(r.LoadPortfolioFromFile.Position)
				})

			}
		},

		settings : {
			get : function(){
				return request({Type : 'UserSettings', ValStr : ''}, 'pct', '?Action=GETUSERDATA', {
					method: "GET"
				}).then(r => {

					var data = {}	
					
					try{
						data = JSON.parse(f.deep(r, 'GetUserData.ValObj') || "{}")
					}
					catch(e){}
					

					return Promise.resolve(data)
				})
			}
		},

		crashtest : {
			get : function(){

				////temp

				return request({
					UseIntegration: 0,
					CalculateSW: 0,
					CountPlausibility: 0,
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'

				}, 'pct', '?Action=GETPCT', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PCT)
				})


			}
		},

		contributors : {
			get : function(id){
				return request({
					ScenarioID: id,
					ContributorsCnt: 10000,
					ModelType: 'RIXTREMA',
					WeightType: 'HBWPORTFOLIO',
					Portfolio: 'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover'

				}, 'pct', '?Action=GETPCTCONTRIBUTORSWITHOPTIONS', {
					method: "GET"
				}).then(r => {
					return Promise.resolve(r.PCTContributors.c)
				})

			}
		}

	}

	self.common = {
		search : function(value){
			var apis = {
				lead : self.crm.contacts.search(value, {type : "LEAD"}),
				client : self.crm.contacts.search(value, {type : "CLIENT"}),
				portfolio : self.pctapi.portfolios.search(value, {})
			} 

			var result = {}


			return Promise.all( _.map(apis, (action, i) => {

				return action.then(r => {
					result[i] = r
				})

			})).then(r => {
				return Promise.resolve(result)
			})
		}
	}

	self.pctapi = {
		stress : {
			deviation : function(data, p = {}){
				if(!data.portfolioId) return Promise.reject({error : 'Portfolio id empty'}) 

				p.storageparameters = dbmeta.stress()
				p.storageparameters.invalidate = {
					index : data.portfolioId,
					type : 'portfolio'
				}
			
				return request(data, 'pctapi', 'StressTest/GetStandardDeviation', p).then((r) => {

					r = f.deep(r, 'records.0')

					if(!r) return Promise.reject({error : 'empty result'})

					return Promise.resolve(r)
				})
			},
			test : function(data, p = {}){

				if(!data.portfolioId) return Promise.reject({error : 'Portfolio id empty'}) 

				data.stressTestTypes = ["Losses", "Ltr", "Yield", "CrashRating"]
				//data.onlyKeyScenarios = true

				p.storageparameters = dbmeta.stress()
				p.storageparameters.invalidate = {
					index : data.portfolioId,
					type : 'portfolio'
				}

				return request(data, 'pctapi', 'StressTest/GetStressTest', p).then((r) => {

					r = f.deep(r, 'records.0')

					if(!r) return Promise.reject({error : 'empty result'})

					return Promise.resolve(r)
				})

			},

			details : function(data, p = {}){

				if(!data.portfolioId) return Promise.reject({error : 'Portfolio id empty'}) 

				data.stressTestTypes = ["Losses"]
				//data.onlyKeyScenarios = true

				p.storageparameters = dbmeta.stress()
				p.storageparameters.invalidate = {
					index : data.portfolioId,
					type : 'portfolio'
				}

				return request(data, 'pctapi', 'StressTest/GetStressTestDetailed', p).then((r) => {

					r = f.deep(r, 'records.0')

					if(!r) return Promise.reject({error : 'empty result'})

					return Promise.resolve(r)
				})

			}, 

			scenarios : function(data, p = {}){
				p.storageparameters = dbmeta.system()

				return request(data, 'pctapi', 'StressTest/GetScenariosList', p).then(r => {

					return Promise.resolve(r.records)
				})
			}
		},
		assets : {
			search : function(d, p = {}){

				d.count || (d.count = 7)

				p.storageparameters = dbmeta.financial()
				p.method = "POST"

				return request(d, 'pctapi', 'Assets/IncrementalSearch', p).then(r => {

					return Promise.resolve(r.records)
				})
			},

			info : function(tickers, p = {}){
				p.storageparameters = dbmeta.financial()

				p.storageparameters.divide = {
					requestIndex : 'tickers',
					getloaded : 'ticker',
					path : 'records'
				}

				p.method = "POST"

				var d = {
					tickers
				}

				return dbdividerequest(d, 'pctapi', 'Assets/GetAssetsInfo', p).then(r => {

					return Promise.resolve(r.records)
				})
			}
		},
		portfolios : {

			search : function(value, data = {}, p = {}){
				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])
				data.searchStrFilter = value
				data.includePositions = true
				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/List', p).then(r => {
					return r.records
				})
			},

			list : function(data = {}, p = {}){

				p.method = "POST"
				p.count = 'pageSize'
				p.from = 'pageNumber'
				p.bypages = true
				p.includeCount = "includeCount"

				p.kit = {
					class : Portfolio,
					path : 'records'
				}

				p.vxstorage = {
					type : 'portfolio',
					path : 'records'
				}

				p.storageparameters = dbmeta.portfolios()

				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])

				return paginatedrequest(data, 'pctapi', 'Portfolio/List', p)

			},

			listwithClients : function(data, p){

				return self.pctapi.portfolios.list(data, p).then(r => {

					
					var clientsIds = _.map(r.data, (p) => {
						return p.crmContactId
					})

					clientsIds = _.filter(clientsIds, (c) => {return c})

					return self.crm.contacts.gets({Ids : clientsIds}).then(c => {
						return Promise.resolve(r)
					})
				})

			},

			add : function(data, p = {}){

				p.method = "POST"

				if (data.catalogId){
					core.vxstorage.invalidateMany(
						[data.catalogId], 
						['filesystem']
					)
				}

				if (data.crmContactId){
					core.vxstorage.invalidateManyQueue(
						[updated.crmContactId], 
						['client', 'lead']
					)
				}

				self.invalidateStorageNow(['portfolios', 'contacts'])

				return request(data, 'pctapi', 'Portfolio/Add', p).then(r => {

					core.ignore('portfolio', {
						id : r.id
					})

					return Promise.resolve({
						id : r.id
					})
					
				})
			},
			update : function(data, p = {}){
				p.method = "POST"

				self.invalidateStorageNow(['portfolios', 'contacts'])

				data.updated = f.date.toserverFormatDate()

				var {updated, from = {}} = core.vxstorage.update(data, 'portfolio')

				if (updated){

					core.vxstorage.invalidateManyQueue(
						[updated.crmContactId, from.crmContactId], 
						['client', 'lead']
					)

					core.vxstorage.invalidateMany(
						[updated.catalogId, from.catalogId], 
						['filesystem']
					)

					core.user.activity.template('portfolio', updated)
				}

				return request(data, 'pctapi', 'Portfolio/Update', p).then(r => {

					core.ignore('portfolio', {
						id : data.id
					})

					return Promise.resolve(updated)
				})
			},

			get : function(id, p = {}){

				p.method = "POST"

				var data = {
					id, 
					includePositions : true
				}

				p.kit = {
					class : Portfolio,
					one : true
				}

				p.vxstorage = {
					type : 'portfolio',
					index : id
				}

				p.storageparameters = dbmeta.portfolios()

				return request(data, 'pctapi', 'Portfolio/GetById', p)
			},

			gets : function(ids = [], p = {}){


				if(!ids.length) return Promise.resolve([])

				var data = {
					pageSize : ids.length,
					idsFilter : ids
				}

				p.method = "POST"

				p.kit = {
					class : Portfolio,
					path : 'records',
				}

				p.vxstorage = {
					type : 'portfolio',
					path : 'records',
					getloaded : 'idsFilter'
				}

				p.storageparameters = dbmeta.portfolios()

				return request(data, 'pctapi', 'Portfolio/List', p).then(r => {
					return Promise.resolve(r.records)
				})

			}, 

			delete : function(ids, p = {}){

				if(!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids 
				}

				_.each(ids, (id) => {
					var { updated } = core.vxstorage.update({
						status : "DELETED",
						id
					}, 'portfolio')

					core.user.activity.remove('portfolio', id)

					if (updated){
						core.vxstorage.invalidateManyQueue(
							[updated.crmContactId], 
							['client', 'lead']
						)

						core.vxstorage.invalidateMany(
							[updated.catalogId], 
							['filesystem']
						)
					}
				})

				self.invalidateStorageNow(['portfolios', 'contacts'])

				return request(data, 'pctapi', 'Portfolio/DeleteByIds', p).then(r => {

					

					return Promise.resolve(r)
					
				})
			},

			recover : function(ids, p = {}){

				if(!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids 
				}

				return request(data, 'pctapi', 'Portfolio/RecoverByIds', p).then(r => {
					_.each(ids, (id) => {

						var { updated } = core.vxstorage.update({
							status : "ACTIVE",
							id
						}, 'portfolio')

						if (updated){
							core.vxstorage.invalidateManyQueue(
								[updated.crmContactId], 
								['client', 'lead']
							)

							core.vxstorage.invalidateMany(
								[updated.catalogId], 
								['filesystem']
							)
						}
					})

					self.invalidateStorageNow(['portfolios', 'contacts'])

					return Promise.resolve(r)
					
				})
			},

			
		}
	}

	self.crm = {
		contacts : {
			search : function(value, data = {}, p = {}){
				p.method = "POST"
				data.From = 1
				data.To = 7

				data.orderBy = {FName: "asc"}

				data.query = core.crm.query('simplesearch', {search : value, type : data.type || "CLIENT"})

				p.kit = {
					class : Contact,
					path : 'records'
				}

				return request(data, 'api', 'crm/Contacts/List', p).then(r => {
					return r.records
				})
			},
			list : function(data, p = {}){

				p.method = "POST"

				p.vxstorage = {
					type : 'client',
					path : 'records'
				}

				p.kit = {
					class : Contact,
					path : 'records'
				}

				p.storageparameters = dbmeta.contacts()

				return paginatedrequest(data, 'api', 'crm/Contacts/List', p)

			},

			getbyids : function(ids, p = {}){

				p.kit = {
					class : Contact,
					path : 'records'
				}

				return self.crm.contacts.gets({Ids : ids}, p)
			},

			gets : function(data, p = {}){
				p.method = "POST"

				p.vxstorage = {
					type : 'client',
					path : 'records',
					getloaded : 'Ids'
				}

				p.kit = {
					class : Contact,
					path : 'records'
				}

				p.storageparameters = dbmeta.contacts()

				return request(data, 'api', 'crm/Contacts/GetByIds', p).then(r => {
					return f.deep(r, 'records')
				})
			},

			counts : function(p = {}){
				p.storageparameters = dbmeta.contacts()

				return request({
					Product : 'pct'
				}, 'api', 'crm/Contacts/GetCountsByType', p)
			},

			update : function(data = {}, p = {}){
				p.method = "POST"

				data.Modified = f.date.toserverFormatDate()

				var {updated, from} = core.vxstorage.update(data, 'client')

				core.vxstorage.update(data, 'lead')

				core.user.activity.remove('client', data.ID)
				core.user.activity.remove('lead', data.ID)

				console.log("updated", updated, from)

				if(updated){
					core.user.activity.template('client', updated)
					core.user.activity.template('lead', updated)

					if(from.Status == 'LEAD_NEW' && updated.Status == "LEAD"){
						core.updates.decrease('leads')
					}

					if(from.Type == 'LEAD' && updated.Type == "CLIENT"){
						core.updates.decrease('totalLeads')
						core.updates.increase('totalClients')
					}
				}

				self.invalidateStorageNow(['portfolios', 'contacts'])

				return request(data, 'api', 'crm/Contacts/Update', p).then(r => {

					core.ignore('client', {
						ID : data.ID
					})

					core.ignore('lead', {
						ID : data.ID
					})

					return Promise.resolve(data)
				})
			},

			add : function(data = {}, p = {}){
				p.method = "POST"

				self.invalidateStorageNow(['portfolios', 'contacts'])

				data.products = 'PCT'

				return request(data, 'api', 'crm/Contacts/Insert', p).then(r => {

					if (r.alreadyExists){
						return Promise.reject(r)
					}

					data.ID = r.id

					if (data.type == 'CLIENT'){
						core.ignore('client', {
							ID : data.ID
						})

						core.updates.increase('totalClients')
					}

					if(data.type == 'LEAD'){
						core.ignore('lead', {
							ID : data.ID
						})

						core.updates.increase('totalLeads')
					}

					//// TO DO CHECK DOUBLE

					self.invalidateStorageNow(['portfolios', 'contacts'])

					return Promise.resolve(data)
				})
			},

			get : function(id, p = {}){
				p.method = "GET"

				p.vxstorage = {
					type : 'client',
					getloaded : id,
					one : true
				}

				p.kit = {
					class : Contact,
					path : '',
					one : true
				}

				return request({}, 'api', 'crm/Contacts/' + id, p)
			},

			scheme : function(p = {}){
				p.method = "GET"

				p.storageparameters = dbmeta.system()

				return request({}, 'api', 'crm/Contacts/Scheme', p).then(r => {
					return r.Contacts
				})
			},

			getidbyemail : function(email, p = {}){
				var companyId = f.deep(core, 'user.info.Company.ID')

				if(!companyId) return Promise.reject('user.info.Company.ID')

				p.method = "GET"
				

				return request({companyId, email}, 'api', 'crm/Contacts/GetContactByEmail', p)
			},

			getbyemail : function(email, p = {}){
				return self.crm.contacts.getidbyemail(email, p).then(id => {


					return self.crm.contacts.get(id)
				})
			}
		},

		upload : {

			avatarId : function(data, p = {}){
				p.method = "POST"

				return request(data, 'api', 'crm/Contacts/LoadAvatar', p).then(r => {
					return Promise.resolve(r.Id)
				})
			},

			avatar : function(formData, ContactId, id){

				formData.append('Id', id.split('.')[0]);
				formData.append('Start', 0);

				return self.crm.upload.attachment(formData).then(r => {

					var ud = {
						ID : ContactId,
						AvatarId : id
					}

					var {updated} = core.vxstorage.update(ud, 'client')

					if (updated){
						core.user.activity.template('client', updated)
					}

					var {updated} = core.vxstorage.update(ud, 'lead')

					if (updated){
						core.user.activity.template('lead', updated)
					}

					self.invalidateStorageNow(['portfolios', 'contacts'])

					core.ignore('client', {
						ID : ContactId
					})

					core.ignore('lead', {
						ID : ContactId
					})

					

					return Promise.resolve()
				})
			},

			attachment : function(formData, p = {}){
				return request(formData, 'apiFD', 'crm/Attachments/Upload', p)
			}

			
		},

		questionnaire : {
			getlink : function(clientid, p = {}){	

				p.method = "GET"

				var d = {}

				if(clientid) d.leadId = clientid

					p.storageparameters = dbmeta.system()

				return request(d, 'api', 'crm/Surveys/GetKeyForPctQuiz', p).then(r => {

					var prefix = 'https://rixtrema.net/pctnew/'
					
					/*window.location.origin

					if(window.cordova) prefix = 'https://rixtrema.net/pctnew/'
					else prefix = prefix + process.env.publicPath

					console.log('prefix', prefix)*/

					return Promise.resolve(prefix + 'riskscore/' + r.token)
	
				})
				
			},

			getdata : function(token, p = {}){

				p.method = "GET"

				return request({token}, 'api', 'crm/Surveys/GetInfoForPctQuiz', p).then(r => {

					return Promise.resolve(r)
	
				})

			},
			response : {
				first : function(Token, client = {}, p = {}){
					p.method = "POST"

					return request({
						Token,
						...client
					}, 'api', 'crm/SurveysAnswers/InsertPctAnswerFirst', p).then(r => {
	
						return Promise.resolve(r.id)
		
					})
				},

				second : function(Token, SurveyAnswerId, Json = "", p = {}){
					p.method = "POST"

					return request({
						Token,
						SurveyAnswerId,
						Json
					}, 'api', 'crm/SurveysAnswers/InsertPctAnswerSecond', p).then(r => {
	
						return Promise.resolve(r.id)
		
					})
				},

				third : function(Token, SurveyAnswerId, data = {}, p = {}){
					p.method = "POST"

					return request({
						Token,
						SurveyAnswerId,
						...data
					}, 'api', 'crm/SurveysAnswers/InsertPctAnswerThird', p).then(r => {
	
						return Promise.resolve(r.id)
		
					})
				}
			},

			getresult : function(id, p = {}){

				p.method = "GET"
	
				return request({}, 'api', 'crm/SurveysAnswers/' + id, p).then(r => {
					var js = null

					try{
						js = JSON.parse(r.Json || "{}")
					}catch(e){
						
					}


					if(!js) return Promise.reject('json')

					return Promise.resolve(js)
	
				})

				
			}
		}
	}

	self.notifications = {
		list : function(data = {}, p){
			if(!p) p = {}

			p.method = "POST"
			p.count = 'pageSize'
			p.from = 'pageNumber'
			p.bypages = true
			p.includeCount = "includeCount"

			data.appIdFilter = self.appid

			return paginatedrequest(data, 'api', 'notifier/Event/webSocketsList', p)
		},

		get : function(id, p = {}){

			p.method = "POST"

			return request({id}, 'api', 'notifier/Event/webSocketEvent', p)
		},

		register : function({token, device}, p = {}){

			p.method = "POST"


			return request({registerId : token, device, appId : self.appid}, 'api', 'notifier/Firebase/Register', p).then(r => {
			})

		},

		revoke : function({device}, p = {}){
			p.method = "POST"

			return request({device, appId : self.appid}, 'api', 'notifier/Firebase/Revoke', p).then(r => {
			})
		},

		hide : function(id, p = {}){

			p.method = "POST"

			return request({id}, 'api', 'notifier/Event/hide', p)

		},

		makeRead : function(ids, p = {}){

			if(!_.isArray(ids)) ids = [ids]

			ids = _.map(ids, (id) => {
				if(_.isObject(id)) return id.id || id.eventid

				return id
			})

			p.method = "POST"

			return request({ids}, 'api', 'notifier/Event/markListAsRead', p)

		},

		makeReadAll : function(p = {}){

			p.method = "POST"

			return request({
				appId : self.appid
			}, 'api', 'notifier/Event/markListByAppAsRead', p)

		},

		count : function(data = {}, p){
			if(!p) p = {}

			p.method = "POST"

			data.includeCount = true
			data.pageSize = 0
			data.appIdFilter = self.appid
			data.pageNumber = 0
			data.includeOnlyUnreadFilter = true

			return request(data, 'api', 'notifier/Event/webSocketsList', p).then(r => {
				return Promise.resolve({
					count : r.pagination.total || 0
				})
			})
		}
	}

	self.filesystem = {
		/* {root} */
		get : function(rootid, p = {}){

			p.method = "POST"

			p.vxstorage = {
				type : 'filesystem',
				getloaded : rootid,
				one : true
			}

			return request({
				id : rootid || '0'
			}, 'pctapi', 'Catalog/GetCatalogContent', p).then(r => {

				var result = {
					name : r.name,
					content : [],
					id : r.id
				}

				_.each(r.catalogs, (c) => {
					result.content.push({
						type : 'folder',
						id : c.id,
						name : c.name,

						context : 'filesystem'
					})
				})

				_.each(r.portfolios, (p) => {
					result.content.push({
						type : 'portfolio',
						id : p.id,
						name : p.name,

						context : 'filesystem'
					})
				})

				return result
			})
		},

		gets : function(ids){

			var r = []

			return _.Promise.all(_.map(ids, (id) => {
				return self.filesystem.get(id).then(c => {
					r.push(c)

					return Promise.resolve()
				})
			})).then(() => {
				return Promise.resolve(r)
			})
		},

		create : {
			/* {root, name} */
			folder : function(data, p){
				return request(data, 'pctapi', 'Catalog/Add', p).then((r) => {

					core.vxstorage.invalidate(data.catalogId, 'filesystem')

					return Promise.resolve(r)
				})
			}
		},

		move : {
			folder : function({id, to, from}, p){

				var data = {
					id,
					destinationCatalogId : to
				}

				core.vxstorage.invalidateMany(
					[to, from], 
					['filesystem']
				)

				return request(data, 'pctapi', 'Catalog/MoveCatalog', p)
			},
			portfolio : function({id, to, from}, p){

				var data = {
					id,
					destinationCatalogId : to
				}

				core.vxstorage.invalidateMany(
					[to, from], 
					['filesystem']
				)

				return request(data, 'pctapi', 'Catalog/MovePortfolio', p)
			}
		},

		delete : {
			folder : function({id, from}, p){

				var data = {
					id
				}

				core.vxstorage.invalidateMany(
					[from], 
					['filesystem']
				)

				return request(data, 'pctapi', 'Catalog/DeleteCatalog', p)
			},

			portfolio : function({id, from}, p){

				core.vxstorage.invalidateMany(
					[from], 
					['filesystem']
				)

				return self.pctapi.portfolios.delete([id], p)
			}
		}
	}

	self.user = {
		signin: function (headers) {
			return request({}, 'api', 'userdata/user/SignIn', {
				method: "GET",
				headers
			})
		},

		sendFcmInfo: function (data) {

			return Promise.resolve()

			return request(data, 'api', 'userdata/user/SignIn', {
				method: "POST",
			})
		},

		settings : {
			getall : function(type){
				return request({type, product : 'PCT'}, 'api', 'userdata/settings/list', {
					method: "GET",
				})
			},

			create : function(key, value, type){

				var data = {}
					data.Product = 'PCT'
					data.IsPublic = true
					data.Type = type
					data.Name = key
					data.Info = JSON.stringify(value)

				return request(data, 'api', 'userdata/settings/create', {
					method: "POST",
				})
			},

			update : function(id, key, value, type){

				var data = {}
					data.product = 'PCT'
					data.IsPublic = true
					data.Type = type
					data.Name = key
					data.Info = JSON.stringify(value)

				return request(data, 'api', 'userdata/settings/update/' + id, {
					method: "POST",
				})
			}
		},

		updated : function(p = {}){
			return request({}, 'pctapi', 'User/GetLastUpdates', {
				method: "POST"
			}).then(r => {

				var invalidateStorage = []

				if(r.lastClientUpdate) 
					invalidateStorage.push({
						updated : f.date.fromstring(r.lastClientUpdate, true) / 1000,
						type : ['contacts'] 
					})
				
				if(r.lastLeadUpdate) 
					invalidateStorage.push({
						updated : f.date.fromstring(r.lastLeadUpdate, true) / 1000,
						type : ['contacts'] 
					})

				if(r.lastPortfolioUpdate) 
					invalidateStorage.push({
						updated : f.date.fromstring(r.lastPortfolioUpdate, true) / 1000,
						type : ['portfolios'] 
					})

				if(r.lastScenariosUpdate) 
					invalidateStorage.push({
						updated : f.date.fromstring(r.lastScenariosUpdate, true) / 1000,
						type : ['system', 'stress', 'financial'] 
					})

				return Promise.resolve(invalidateStorage)

			})
		}
	}

	self.checkUpdates = function(){
		return self.user.updated().then(inv => {
			return invalidateStorage(inv)
		}).catch(e => {
			return Promise.resolve()
		})
	}

	var invalidateStorageType = function(type, updated){
		if(!storages[type]) return Promise.resolve()

		return storages[type].invalidateMany(updated)
	}

	self.invalidateStorageNow = function(type){
		var inv = [{
			updated : f.date.nowUtc1000(),
			type
		}]

		return invalidateStorage(inv)
	}

	var invalidateStorage = function(inv){
		return Promise.all(_.map(inv, (item) => {
			
			return Promise.all(_.map(item.type, (type) => {
				return invalidateStorageType(type, item.updated)
			}))

		}))
	}

	self.rixtrema = {
		aws : {
			get : function(data = {}, p = {}){

				p.method = "GET"

				data.data = 1

				return request(data, '401k', '?action=AWSTEXTRACTOR_GET', p).then(r => {
					return Promise.resolve(r.FCT.records || [])
				})
			},

			original: function(id, type, p = {}){

				p.storageparameters = dbmeta.files()

				return request({}, '401k', '?action=AWSTEXTRACTOR_FILE&id=' + id, p).then(r => {

					return Promise.resolve(new Blob([r.Message], { type }))
				})
				
			},

			upload: function(info, file, p){

				let formData = new FormData();

					formData.append('action', 'AWSTEXTRACTOR_POST');
					formData.append('info', JSON.stringify(info));
					formData.append("data", file);


				return request(formData, '401kFD', '', p).then(r => {
					return Promise.resolve(r.FCT)
				})


			}
		}
	}

	self.prepare = function(){
		return Promise.all(_.map(dbmeta, (mf) => {
			return getstorage(mf())
		})).catch(e => {

			console.error(e)

			return Promise.resolve()
		})
	}

	return self;
}

export default ApiWrapper

