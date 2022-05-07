import f from './functions'
var sha1 = require('sha1');
var { error } = require('./error')

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
			if (parameters.method == 'GET') url = url + '?' + new URLSearchParams(data)

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

				return Promise.reject(result)
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

		return direct(url ? (url + '/' + path) : path, data, p)
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
			if(k != p.from && k != p.to && v && k!= 'Count') datahash += JSON.stringify(v)
		})

		datahash = sha1(datahash)

		liststorage[system][to][datahash] || (liststorage[system][to][datahash] = {
			count : undefined,
			data : {}
		})

		console.log('liststorage', liststorage)

		return datahash
	}

	var getloaded = function(datahash, data, system, to, p){

		var _fr = data[p.from] || 0
		var _count = data[p.count] || 100

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

		var datahash = prepareliststorage(data, system, to, p)

		if (p.refresh) {

			liststorage[system][to][datahash].data = []
			liststorage[system][to][datahash].count = undefined

		}

		var loaded = getloaded(datahash, data, system, to, p)

		if (loaded) return Promise.resolve(loaded)

		if(!liststorage[system][to][datahash].count) data.Count = true

		return request(data, system, to, p).then(r => {

			prepareliststorage(data, system, to, p) /// async. maybe clear

			if(!data[p.from]) data[p.from] = 0

			_.each(r.records || [], (e, i) => {
				var c = data[p.from] + i

				liststorage[system][to][datahash].data[c] = e
			})

			if (typeof r.count != 'undefined' && data.Count)
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

	var request = function (data, system, to, p, attempt) {

		if (!attempt) attempt = 0

		return waitonline().then(() => {

			data || (data = {})

			return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

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

				return Promise.reject(e)

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

	}

	self.crm = {
		contacts : {
			list : function(data, p){

				if(!p) p = {}

				p.method = "POST"

				return paginatedrequest(data, 'api', 'crm/Contacts/List', p)

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

