import f from './functions'
var sha1 = require('sha1');
var { parseerror } = require('./error')

import dbstorage from "./dbstorage";
import _ from 'underscore';


var Request = function (core = {}, url, system) {
	var self = this

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


		return core.user.extendA({ headers, data, system }).then(r => {

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

			if (er) {

				console.log('result', result)

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

			/*if (e.code == 20){
				return Promise.reject(e)
			}*/

			return Promise.reject(e)
		})
	}

	self.fetch = function (path, data, p) {

		if(!path) path = ''

		return direct(url ? (url + (path.indexOf('?') == 0 ? '' : '/') + path) : path, data, p)
	}

	return self
}

var ApiWrapper = function (core) {

	var self = this;

	var cache = {}
	var loading = {}
	var storages = {}
	var requests = {
		pct: new Request(core, "https://rixtrema.net/RixtremaWS/AJAXPCT.aspx", 'pct'),
		pctapi: new Request(core, "https://rixtrema.net/api/pct", 'pctapi'),
		api: new Request(core, "https://rixtrema.net/api", 'api'),
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

		var r = {
			data : 	loaded,
			count : storage.count,
			last : 	_.isEmpty(storage.data) ? undefined : _.max(_.map(Object.keys(storage.data), v => Number(v))),
			first : _.isEmpty(storage.data) ? undefined : _.min(_.map(Object.keys(storage.data), v => Number(v)))
		}

		if(loaded.length == storage.count) return r

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

	var dbrequest = function(data, system, to, p){

		var _storage = null
		var datahash = sha1(system + to + JSON.stringify(data))
		
		return (p.storageparameters ? getstorage(p.storageparameters) : f.ep()).then(storage => {

			_storage = storage

			if (storage && !p.refresh) {
				return storage.get(datahash).catch(e => {
					return Promise.resolve()
				})
			}
			return Promise.resolve()

		}).then(cached => {

			if(!cached){
				return request(data, system, to, p).then(r => {

					if(_storage){
						return _storage.set(datahash, r).then(() => {

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

		if (!attempt) attempt = 0

		if (p.preloader){
			core.store.commit('globalpreloader', true)
		}

		return waitonline().then(() => {

			data || (data = {})

			return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

				if (p.showStatus){
					core.store.commit('icon', {
						icon: 'success',
					})
				}

				return Promise.resolve(r)

			}).catch(e => {

				if (attempt < 3 && e && e.code == 20) {

					return new Promise((resolve, reject) => {

						attempt++

						setTimeout(function () {
							request(data, to, p, attempt).then(r => {
								return resolve(r)
							}).catch(e => {
								return reject(e)
							})

						}, 1000)
					})

				}

				if (p.showStatus){
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
	

	self.clearCache = function (key) {
		var keys = []

		_.each(cache, function(c,i){
			keys.push(i)
		})

		_.each(storages, function(c,i){
			keys.push(i)
		})

		keys = _.uniq(keys)

		_.each(self.clearCacheKey, function(k){
			self.clearCacheKey(k)
		})

	}

	self.clearCacheKey = function(){

		if (cache[key]) delete cache[key]

		if (storages[key]) {
			storage[key].clearall().catch(e => {console.error(e)})
			delete storage[key]
		}
	}

	self.pct = {
		tickers : {
			search : function(d){

				if(!d.value) return Promise.resolve([])

				d.count || (d.count = 7)

				return dbrequest({RowsToReturn : d.count, SearchStr : d.value}, 'pct', '?Action=GETINCREMENTALSEARCHONTICKERS', {
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
			}
		},

		settings : {
			get : function(){
				return dbrequest({Type : 'UserSettings', ValStr : ''}, 'pct', '?Action=GETUSERDATA', {
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

	self.pctapi = {
		portfolios : {
			list : function(data, p = {}){

				p.method = "POST"
				p.count = 'pageSize'
				p.from = 'pageNumber'
				p.bypages = true
				p.includeCount = "includeCount"

				return paginatedrequest(data, 'pctapi', 'Portfolio/List', p)

			},
			add : function(data, p = {}){

				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/Add', p)
			},
			update : function(data, p = {}){
				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/Update', p)
			}
		}
	}

	self.crm = {
		contacts : {
			list : function(data, p = {}){

				p.method = "POST"

				return paginatedrequest(data, 'api', 'crm/Contacts/List', p)

			},

			update : function(data = {}, p = {}){
				p.method = "POST"

				return request(data, 'api', 'crm/Contacts/Update', p)
			},

			get : function(id, p = {}){
				p.method = "GET"

				return request({}, 'api', 'crm/Contacts/' + id, p)
			},

			scheme : function(p = {}){
				p.method = "GET"

				p.storageparameters = {
					storage : 'system',
					time : 60 * 60 * 48 
				}

				return dbrequest({}, 'api', 'crm/Contacts/Scheme', p).then(r => {
					return r.Contacts
				})
			},
		}
	}

	self.notifications = {
		list : function(data, p){
			if(!p) p = {}

			p.method = "POST"
			p.count = 'pageSize'
			p.from = 'pageNumber'
			p.bypages = true
			p.includeCount = "includeCount"

			return paginatedrequest(data, 'api', 'notifier/Event/webSocketsList', p)
		}
	}

	self.filesystem = {
		/* {root} */
		get : function(data){

			return Promise.resolve([{
				name : 'folder' + f.rand(0, 10),
				type : 'directory',
				id : f.rand(0, 1000)
			},{
				name : 'folder' + f.rand(0, 10),
				id : f.rand(0, 1000),
				type : 'directory'
			},{
				name : 'portfolio' + f.rand(0, 10),
				id : f.rand(0, 1000),
				type : 'portfolio'
			},{
				name : 'folder' + f.rand(0, 10),
				type : 'directory',
				id : f.rand(0, 1000)
			},{
				name : 'folder' + f.rand(0, 10),
				id : f.rand(0, 1000),
				type : 'directory'
			},{
				name : 'portfolio' + f.rand(0, 10),
				id : f.rand(0, 1000),
				type : 'portfolio'
			}])
		},

		create : {
			/* {root, name} */
			folder : function(data){

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
	}

	return self;
}

export default ApiWrapper

