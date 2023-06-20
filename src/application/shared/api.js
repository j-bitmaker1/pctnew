import f from './functions.js'
import { Contact, Portfolio, Task, Scenario, Buylist, TFile, TTask } from './kit.js'
import { Campaign, Batch, ViewStep, Template, EmailTemplate, Signature } from '../campaigns/kit.js'

var Axios = require('axios');

var sha1 = require('sha1');
var { parseerror } = require('./error')

import moment from 'moment';
import dbstorage from "./dbstorage.js";
import _ from 'underscore';

var FormDataRequest = function (core = {}, url, system) {

	var self = this

	self.fetch = function (to, formData, p) {
		const headers = { 'content-type': 'multipart/form-data' }
		
		return (core.user ? core.user.extendA({ formData, system }) : Promise.resolve()).then(r => {

			return Axios({
				baseURL: url,
				url: to || '',
				data: formData,
				method: 'post',
				headers,
			}).then(r => {

				if (f.deep(r, 'data.errors')) {
					return Promise.reject(parseerror({
						code: 500,
						errors: r.data.errors
					}))
				}


				return Promise.resolve(r.data)
			})
		})

	}

}

var FormDataRequestAu_Headers = function (core = {}, url, system) {

	var self = this

	self.fetch = function (to, formData, p) {
		const headers = { 'content-type': 'multipart/form-data' }
		
		return (core.user ? core.user.extendA({ headers, system }) : Promise.resolve()).then(r => {

			return Axios({
				baseURL: url,
				url: to || '',
				data: formData,
				method: 'post',
				headers,
			}).then(r => {

				if (f.deep(r, 'data.errors')) {
					return Promise.reject(parseerror({
						code: 500,
						errors: r.data.errors
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

			var time = p.timeout || 60000

			if (typeof window != 'undefined' && window.cordova) {
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
		var token = ''


		return (core.user ? core.user.extendA({ headers, data, system }) : Promise.resolve()).then(r => {

			var parameters = {

				method: p.method || 'POST',
				mode: 'cors',
				headers: headers,
				signal: signal
			}

			
			if (parameters.method == 'POST') {
				if (p.urldata){

					const us = new URLSearchParams();

					_.each(data, (d, i) => {
						us.append(i, d);
					})

					parameters.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

					parameters.body = us
				}
				
				else{
					parameters.body = JSON.stringify(data)
				}
				
			}


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

			if(p.blob){
				return response.blob()
			}


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

			if(p.blob) {
				return Promise.resolve(result)
			}

			if(!_.isObject(result)){
				result = {
					Message : result
				}
			}

			result.code = status

			if (result.result == 'failed') {
				result.code = 500
				result.Error = result.errors
				er = true
			}

			if (result.AuthSession && result.AuthSession.Error) { /// oldpct
				result.code = 500
				result.Error = result.AuthSession.Error
				er = true
			}

			if (er) {
				return Promise.reject(parseerror(result))
			}

			else {

				if (!result.token)
					result.token = token

				core.user.extendU(result, system)
			}

			var data = (result || {}).data || result || {}

			return Promise.resolve(data)

		}).catch(e => {


			if (e && e.toString() && e.toString().indexOf('Failed to fetch') > -1) {
				e.code = 20
			}

			return Promise.reject(e)
		})
	}

	var doublePreventRequest = function (path, data, p) {
		var datahash = sha1(path + JSON.stringify(data))

		if (loading[datahash]) {
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

		if (!path) path = ''

		return doublePreventRequest(url ? (url + (path.indexOf('?') == 0 ? '' : '/') + path) : path, data, p)
	}

	return self
}

var ApiWrapper = function (core = {}, platform = "PCT") {

	var self = this;

	var cache = {}
	var storages = {}
	var blockNotify = false

	self.appid = core.appid
	self.platform = platform

	self.prepare = function () {
		return Promise.all(_.map(dbmeta, (mf) => {
			return getstorage(mf())
		})).catch(e => {

			return Promise.resolve()
		})
	}

	var dbmeta = {
		stress: function () {
			return {
				storage: 'stress',
				time: 60 * 60 * 48,
				version: 2
			}
		},

		campaigns: function () {
			return {
				storage: 'campaigns',
				time: 60 * 60 * 148,
				version: 2
			}
		},
		campaignsFast: function () {
			return {
				storage: 'campaigns',
				time: 60 * 10,
				version: 2
			}
		},

		ai: function () {
			return {
				storage: 'ai',
				time: 60 * 10,
				version: 2
			}
		},

		system: function () {
			return {
				storage: 'system',
				time: 60 * 60 * 148,
				version: 2
			}
		},

		files: function () {
			return {
				storage: 'files',
				time: 60 * 60 * 12
			}
		},

		portfolios: function () {
			return {
				storage: 'portfolios',
				time: 60 * 60 * 12
			}
		},

		buylists: function () {
			return {
				storage: 'buylists',
				time: 60 * 60 * 12
			}
		},

		tasks: function () {
			return {
				storage: 'tasks',
				time: 60 * 60 * 12
			}
		},

		contacts: function () {
			return {
				storage: 'contacts',
				time: 60 * 60 * 12
			}
		},

		financial: function () {
			return {
				storage: 'financial',
				time: 60 * 60 * 248,
				version: 2
			}
		},

		financialOneDay: function () {
			return {
				storage: 'financialOneDay',
				time: 60 * 60 * 12,
				version: 2
			}
		},

		customscenarios: function () {
			return {
				storage: 'customscenarios',
				time: 60 * 60 * 48
			}
		},
	}

	var requests = {
		pct: new Request(core, "https://rixtrema.net/RixtremaWS/AJAXPCT.aspx", 'pct'),
		pctapi: new Request(core, "https://rixtrema.net/api/pct", 'pctapi'),
		api: new Request(core, "https://rixtrema.net/api", 'api'),
		campaigns: new Request(core, "https://rixtrema.net/api/campaigns", 'campaigns'),
		chat_ai: new Request(core, "https://rixtrema.net/api/chat_ai", 'chat_ai'),

		

		apiFD: new FormDataRequest(core, "https://rixtrema.net/api", 'api'),
		apiFDH: new FormDataRequestAu_Headers(core, "https://rixtrema.net/api", 'api'),

		/* temp */
		'401k': new Request(core, "https://rixtrema.net/RixtremaWS401k/AJAXFCT.aspx", '401k'),
		'401kFD': new FormDataRequest(core, "https://rixtrema.net/RixtremaWS401k/AJAXFCT.aspx", '401k'),
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

	var prepareliststorage = function (data, system, to, p) {

		liststorage[system] || (liststorage[system] = {})
		liststorage[system][to] || (liststorage[system][to] = {})

		var datahash = ''

		_.each(data, function (v, k) {
			if (k != p.from && k != p.to && v && k != p.includeCount) datahash += JSON.stringify(v)
		})

		datahash = sha1(datahash)

		liststorage[system][to][datahash] || (liststorage[system][to][datahash] = {
			count: undefined,
			data: {}
		})


		return datahash
	}

	var getloaded = function (datahash, data, system, to, p) {

		var _fr = data[p.from] || 0
		var _count = data[p.count]

		if (p.bypages) _fr = (_fr * _count)


		var storage = liststorage[system][to][datahash]

		var loaded = _.filter(storage.data, function (e, i) {

			if(typeof _count == 'undefined') return true

			if (i >= _fr && (i < _count + _fr)) {
				return true
			}
		})

		var flength = _.filter(storage.data, function (e, i) {
			return e
		}).length

		var r = {
			data: loaded,
			count: storage.count,
			last: _.isEmpty(storage.data) ? undefined : _.max(_.map(Object.keys(storage.data), v => Number(v))),
			first: _.isEmpty(storage.data) ? undefined : _.min(_.map(Object.keys(storage.data), v => Number(v)))
		}



		if (flength == storage.count) return r

	

		if (typeof _count != 'undefined' && _count == loaded.length) return r

		return null

	}

	var paginatedrequest = function (data, system, to, p) {

		if (!p) p = {}
		if (!data) data = {}

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

		if (!liststorage[system][to][datahash].count && !p.countLater) data[p.includeCount] = true


		return request(data, system, to, p).then(r => {

			if (r.Pagination) r.pagination = r.Pagination
			if (r.Records) r.records = r.Records

			if (r.pagination) {
				r.count = (typeof r.pagination.total != 'undefined' ? r.pagination.total : 0) || 
					(typeof r.pagination.Total != 'undefined' ? r.pagination.Total : 0)
			}

			prepareliststorage(data, system, to, p) /// async. maybe clear

			if (!data[p.from]) data[p.from] = 0

			_.each(r.records || [], (e, i) => {
				var c = 0

				if (p.bypages) { c = data[p.from] * data[p.count] + i } else { c = data[p.from] + i }

				liststorage[system][to][datahash].data[c] = e
			})

			if (typeof r.count != 'undefined' && (data[p.includeCount] || p.countLater)){
				liststorage[system][to][datahash].count = r.count
			}
				

			var loaded = getloaded(datahash, data, system, to, p)

			if (!loaded) return Promise.reject('notloaded')

			return Promise.resolve(loaded)
		}).catch(e => {
			console.error(e)

			return Promise.reject(e)
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

	var dbdividerequest = function (data, system, to, p = {}) {

		if (!p.storageparameters) return Promise.reject('p.storageparameters')
		if (!p.storageparameters.divide) return Promise.reject('p.storageparameters.divide')

		var ids = data[p.storageparameters.divide.requestIndex]

		return getstorage(p.storageparameters).then(storage => {


			var loaded = {}
			var needtoload = []

			return Promise.all(

				_.map(ids, (id) => {

					try{

						return storage.get(id).catch(e => {
							return Promise.resolve()
						}).then(r => {


							if (r) {
								loaded[id] = r
							}
							else {
								needtoload.push(id)
							}

							return Promise.resolve()
						})

					}

					catch(e){
						return Promise.resolve()
					}
				})

			).then(() => {


				if (!needtoload.length) {
					return f.ep()
				}

				data[p.storageparameters.divide.requestIndex] = needtoload

				return request(data, system, to, p).then(r => {
					var data = r

					if (p.storageparameters.divide.path) data = f.deep(r, p.storageparameters.divide.path)

					_.each(data, (obj) => {

						var index = obj[p.storageparameters.divide.getloaded]


						if (index) {
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

	var dbaction = function (datahash, action, p = {}) {

		var _storage = null

		return (p.storageparameters ? getstorage(p.storageparameters) : f.ep()).then(storage => {

			_storage = storage

			try{

				if (storage && !p.refreshDb) {
					return storage.get(datahash).catch(e => {
						return Promise.resolve()
					})
				}

			}

			catch(e){
				return Promise.resolve()
			}


			return Promise.resolve()

		}).then(cached => {
			

			if (!cached) {

				/// return request(data, system, to, p).then(r => {

				return action().then(r => {
					if (_storage) {
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

	var dbrequest = function (data, system, to, p) {

		var datahash = sha1(system + to + JSON.stringify(data))

		return dbaction(datahash, () => {

			if(p.payloadChange) data = p.payloadChange(data)

			return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

				if(p.transformResponse) p.transformResponse(r)

				return Promise.resolve(r)
			})
		}, p)

	}

	var request = function (data, system, to, p = {}, attempt) {

		var alreadyLoaded = []


		if (!attempt) attempt = 0



		if (p.vxstorage && p.vxstorage.index && core.vxstorage) {
			var r = core.vxstorage.get(p.vxstorage.index, p.vxstorage.type)

			if (r) return Promise.resolve(r)
		}

		var breakLoading = false

		if (p.vxstorage && p.vxstorage.getloaded && core.vxstorage) {

			if (!p.vxstorage.one) {

				alreadyLoaded = _.filter(_.map(data[p.vxstorage.getloaded], function (index) {
					return core.vxstorage.get(index, p.vxstorage.type)
				}), (r) => {
					return r
				})

				data[p.vxstorage.getloaded] = _.filter(data[p.vxstorage.getloaded], (index) => {
					return !_.find(alreadyLoaded, (obj) => {
						return obj[core.vxstorage.index(p.vxstorage.type)] == index
					})
				})

				if (!data[p.vxstorage.getloaded].length) {

					breakLoading = true

				}
			}

			else {

				breakLoading = true

				alreadyLoaded = core.vxstorage.get(p.vxstorage.getloaded, p.vxstorage.type)


				if (r) return Promise.resolve(r)
			}

			if (breakLoading) {
				var r = {}

				if (p.vxstorage.path) {
					f.deepInsert(r, p.vxstorage.path, alreadyLoaded)
				}
				else {
					r = alreadyLoaded
				}

				if (r) return Promise.resolve(r)
			}

		}

		if (p.preloader && core.store) {
			core.store.commit('globalpreloader', true)
		}

		return waitonline().then(() => {

			data || (data = {})

			return dbrequest(data, system, to, p).then(r => {

				//return (requests[system] || requests['default']).fetch(to, data, p).then(r => {

				if (p.kit) {
					var dk = r

					if (p.kit.path) {
						dk = f.deep(dk, p.kit.path) || (p.kit.one ? null : [])
					}


					if (p.kit.one) {
						dk = new p.kit.class(dk)
					}
					else {
						dk = _.map(dk, (d) => { return new p.kit.class(d) })
					}

					if (p.kit.path) {
						f.deepInsert(r, p.kit.path, dk)
					}
					else {
						r = dk
					}

				}

				if (p.vxstorage && core.vxstorage) {

					if(!p.vxstorage.setcustom){
						var ds = r

						if (p.vxstorage.path) ds = f.deep(ds, p.vxstorage.path) || (p.vxstorage.one ? null : [])

						if (p.vxstorage.one) {
							var stored = core.vxstorage.set(ds, p.vxstorage.type)
						}
						else {

							var stored = core.vxstorage.sets(ds, p.vxstorage.type)

							if (p.vxstorage.getloaded)
								stored = stored.concat(alreadyLoaded)

						}

						if (p.vxstorage.path) {
							f.deepInsert(r, p.vxstorage.path, stored)
						}
						else {
							r = stored
						}
					}
					else{
						r = p.vxstorage.setcustom(r)
					}

					

				}

				if (p.showStatus && core.store) {
					core.store.commit('icon', {
						icon: 'success',
					})
				}

				return Promise.resolve(r)

			}).catch(e => {

				console.error(e)

				if (attempt < 3 && e && e.code == 20) {

					if (!attempt && !blockNotify && core.notifier){

						core.notifier.simplemessage({
							icon: "fas fa-wifi",
							title: "Please wait",
							message: "Loading takes longer than usual"
						})

						blockNotify = true

						setTimeout(() => {
							blockNotify = false
						}, 30000)

					}
						

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

				if (core.store && (p.showStatus || p.showStatusFailed)) {
					core.store.commit('icon', {
						icon: 'error',
						message: e.error
					})
				}

				return Promise.reject(e)

			}).finally(() => {
				if (core.store && p.preloader) {
					core.store.commit('globalpreloader', false)
				}
			})


		})


	}

	var invalidateStorageType = function (type, updated) {
		if (!storages[type]) return Promise.resolve()

		return storages[type].invalidateMany(updated)
	}

	var invalidateStorage = function (inv) {
		return Promise.all(_.map(inv, (item) => {

			return Promise.all(_.map(item.type, (type) => {
				return invalidateStorageType(type, item.updated)
			}))

		}))
	}

	self.invalidateDb = function (dbindex, updated, data) {
		if (storages[dbindex]) {
			var _updated = f.date.fromstring(updated, true) / 1000 //todo check, utc

			return storages[dbindex].invalidate(_updated, data)
		}

		return Promise.reject("empty Storage")
	}

	self.clearCache = function () {
		var keys = []

		_.each(cache, function (c, i) {
			keys.push(i)
		})

		_.each(storages, function (c, i) {
			keys.push(i)
		})

		_.each(liststorage, function (c, i) {
			keys.push(i)
		})

		keys = _.uniq(keys)

		_.each(keys, function (k) {
			self.clearCacheKey(k)
		})

	}

	self.clearCacheKey = function (key) {

		if (cache[key]) delete cache[key]

		if (liststorage[key]) delete liststorage[key]

		if (storages[key]) {


			try{
				storages[key].clearall().catch(e => { console.error(e) })
			}

			catch(e){
				
			}
			delete storages[key]
		}
	}

	self.checkUpdates = function () {
		return self.user.updated().then(inv => {
			return invalidateStorage(inv)
		}).catch(e => {
			return Promise.resolve()
		})
	}

	self.invalidateStorageNow = function (type) {
		var inv = [{
			updated: f.date.nowUtc1000(),
			type
		}]

		return invalidateStorage(inv)
	}

	/////////

	self.pct = {
        tickers: {
            search: function (d) {
                if (!d.value) return Promise.resolve([]);

                d.count || (d.count = 7);

                return request(
                    { RowsToReturn: d.count, SearchStr: d.value },
                    'pct',
                    '?Action=GETINCREMENTALSEARCHONTICKERS',
                    {
                        method: 'POST',
                    },
                ).then((r) => {
                    return Promise.resolve(
                        f.deep(r, 'IncrementalSearch.c') || [],
                    );
                });
            },
        },

        portfolio: {
            getassets: function () {
                return request(
                    {
                        Portfolio:
                            'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover',
                    },
                    'pct',
                    '?Action=GETPORTFOLIOASSETS',
                    {
                        method: 'GET',
                    },
                ).then((r) => {
                    return Promise.resolve(r.PortfolioAssets.c);
                });
            },

            standartDeviation: function () {
                return request(
                    {
                        Portfolio:
                            'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover',
                    },
                    'pct',
                    '?Action=GETPORTFOLIOSTANDARDDEVIATION',
                    {
                        method: 'GET',
                    },
                ).then((r) => {
                    return Promise.resolve(r.GetPortfolioStandardDeviation);
                });
            },

            fromfile: function (data = {}, p = {}) {
                /*

				data.File
				data.FileType

				*/

                data.JustParse = 1;
                data.Portfolio = 'uploadtemp';

                p.method = 'GET';

                return request(
                    data,
                    'pct',
                    '?Action=LOADPORTFOLIOFROMFILE',
                    p,
                ).then((r) => {
                    return Promise.resolve(r.LoadPortfolioFromFile.Position);
                });
            },
        },

        settings: {
            get: function () {
                return request(
                    { Type: 'UserSettings', ValStr: '' },
                    'pct',
                    '?Action=GETUSERDATA',
                    {
                        method: 'GET',
                    },
                ).then((r) => {
                    var data = {};

                    try {
                        data = JSON.parse(
                            f.deep(r, 'GetUserData.ValObj') || '{}',
                        );
                    } catch (e) {}

                    return Promise.resolve(data);
                });
            },
        },

        crashtest: {
            get: function () {
                ////temp

                return request(
                    {
                        UseIntegration: 0,
                        CalculateSW: 0,
                        CountPlausibility: 0,
                        Portfolio:
                            'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover',
                    },
                    'pct',
                    '?Action=GETPCT',
                    {
                        method: 'GET',
                    },
                ).then((r) => {
                    return Promise.resolve(r.PCT);
                });
            },

            gets: function (portfolios, p = {}) {
                p.method = 'GET';
                p.storageparameters = dbmeta.system();

                return request(
                    {
                        Portfolios: JSON.stringify(portfolios),
                    },
                    'pct',
                    '?Action=GETOCRFORPORTFOLIOS',
                    p,
                ).then((r) => {
                    return Promise.resolve(r.PCT.portfolios);
                });
            },
        },

        contributors: {
            get: function (id) {
                return request(
                    {
                        ScenarioID: id,
                        ContributorsCnt: 10000,
                        ModelType: 'RIXTREMA',
                        WeightType: 'HBWPORTFOLIO',
                        Portfolio:
                            'IRAFO!ALM MEDIA, LLC 401(K) PLAN Proposed Rollover',
                    },
                    'pct',
                    '?Action=GETPCTCONTRIBUTORSWITHOPTIONS',
                    {
                        method: 'GET',
                    },
                ).then((r) => {
                    return Promise.resolve(r.PCTContributors.c);
                });
            },
        },

        integrations: {
            get() {
                return request(
                    {
                        Action: 'GETINTEGRATIONCONNECTIONS',
                    },
                    'pct',
					'GETINTEGRATIONCONNECTIONS',
                    {
                        method: 'POST',
						urldata: true,
                    },
                ).then((r = {}) => {
					if (!r.PCT) return Promise.reject(r);

                    return Promise.resolve(r.PCT.Connections);
                });
            },

            addOrEdit({ NewName, OldName, Type, ILogin, IPassword, Repcode }) {
                return request(
                    {
                        Action: 'ADDINTEGRATIONCONNECTION',
                        NewName,
                        OldName,
                        Type,
                        ILogin,
                        IPassword,
                        Repcode,
                    },
                    'pct',
                    'ADDINTEGRATIONCONNECTION',
                    {
                        method: 'POST',
						urldata: true,
                    },
                ).then((r) => {
                    return Promise.resolve(r);
                });
            },

			remove({ Name }) {
                return request(
                    {
                        Action: 'REMOVEINTEGRATIONCONNECTION',
                        Name,
                    },
                    'pct',
                    'REMOVEINTEGRATIONCONNECTION',
                    {
                        method: 'POST',
						urldata: true,
                    },
                ).then((r) => {
                    return Promise.resolve(r);
                });
            },
        },
    };

	self.common = {
		search: function (value) {
			var apis = {
				lead: self.crm.contacts.search(value, { type: "LEAD" }),
				client: self.crm.contacts.search(value, { type: "CLIENT" }),
				portfolio: self.pctapi.portfolios.search(value, {})
			}

			var result = {}


			return Promise.all(_.map(apis, (action, i) => {

				return action.then(r => {
					result[i] = r
				})

			})).then(r => {
				return Promise.resolve(result)
			})
		}
	}

	self.pctapi = {

		customscenarios : {

			add: function (data, p = {}) {

				p.method = "POST"

				self.invalidateStorageNow(['customscenarios'])
				

				return request(data, 'pctapi', 'CustomScenario/Add', p).then(r => {

					core.ignore('customscenarios', {
						id: r.id
					})

					return Promise.resolve({
						id: r.id
					})

				})
				
			},
			update: function (data, p = {}) {
				p.method = "POST"

				self.invalidateStorageNow(['customscenarios', 'stress'])

				data.updated = f.date.toserverFormatDate()

				var { updated, from = {} } = core.vxstorage.update(data, 'customscenario')

				return request(data, 'pctapi', 'CustomScenario/Update', p).then(r => {

					core.ignore('customscenario', {
						id: data.id
					})

					return Promise.resolve(updated)
				})
			},

			delete: function (id, p = {}) {

				p.method = "POST"

				var data = {
					id
				}

				var { updated } = core.vxstorage.update({
					status: "DELETED",
					id
				}, 'customscenario')


				self.invalidateStorageNow(['customscenarios', 'stress'])

				return request(data, 'pctapi', 'CustomScenario/Delete', p).then(r => {
					return Promise.resolve(r)
				})
			},
			
			list: function (p = {}) {

				p.method = "POST"

				p.kit = {
					class: Scenario,
					path: 'records',
				}

				p.vxstorage = {
					type: 'customscenario',
					path: 'records'
				}

				p.storageparameters = dbmeta.customscenarios()

				return request({
					includeFactors : true
				}, 'pctapi', 'CustomScenario/List', p).then(r => {
					return Promise.resolve(r.records)
				})

			},

			gets: function (ids = [], p = {}) {

				if (!ids.length) return Promise.resolve([])

				var data = {
					pageSize: ids.length,
					idsFilter: ids,
					includeFactors : true
				}

				p.method = "POST"

				p.kit = {
					class: Scenario,
					path: 'records',
				}

				p.vxstorage = {
					type: 'customscenario',
					path: 'records',
					getloaded: 'idsFilter'
				}

				p.storageparameters = dbmeta.customscenarios()

				return request(data, 'pctapi', 'CustomScenario/List', p).then(r => {
					return Promise.resolve(r.records)
				})

			},
		},

		stress: {

			annuities : {
				list : function(data = {}, p = {}){
				
					p.storageparameters = dbmeta.system()
	
					return request(data, 'pctapi', 'StressTest/GetAnnuitiesList', p).then(r => {
	
						return Promise.resolve(r.records)
					}).then((assets) => {
						return _.map(assets, (asset) => {
							return {...asset, name : asset.id.replace(/_/g, ' '), ticker : asset.id }
						})
					})
				},

				get : function(id){
					return this.list().then((r) => {
						return _.find(r, (a) => {
							return a.id == id
						})
					})
				}
			},

			deviation: function (data, p = {}) {
				if (!data.portfolioId) return Promise.reject({ error: 'Portfolio id empty' })

				p.storageparameters = dbmeta.stress()

				if (data.portfolioId > 0)
					p.storageparameters.invalidate = {
						index: data.portfolioId,
						type: 'portfolio'
					}

				return request(data, 'pctapi', 'StressTest/GetStandardDeviation', p).then((r) => {

					r = f.deep(r, 'records.0')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})
			},

			ltrdetails: function (data, p = {}) {


				//if (!data.portfolioId) return Promise.reject({ error: 'Portfolio id empty' })

				p.storageparameters = dbmeta.stress()


				if (data.portfolioId > 0)
					p.storageparameters.invalidate = {
						index: data.portfolioId,
						type: 'portfolio'
					}

				return request(data, 'pctapi', 'Assets/GetLtrCalculation', p).then((r) => {


					r = f.deep(r, 'records')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})
			},

			customtestScenarios : function({portfolio, scenarios}, p = {}){

				var id = portfolio.originalid || portfolio.id
				var positions = []

				p.storageparameters = dbmeta.stress()

				if (id > 0){
					p.storageparameters.invalidate = {
						index: id,
						type: 'portfolio'
					}
				}

				if (portfolio.originalid){
					positions = _.map(_.filter(portfolio.positions, (p) => {
						return p.external
					}), asset => {
						return {
							name : asset.name,
							ticker : asset.ticker,
							value : asset.value,
							annuity_type : asset.annuity_type
						}
					})
				}
				else{
					if(id <= 0){
						positions = _.filter(portfolio.positions, asset => {
							return {
								name : asset.name,
								ticker : asset.ticker,
								value : asset.value,
								annuity_type : asset.annuity_type
							}
						})
					}
				}



				return request({
					portfolioId : id,
					positions : positions.length ? positions : null,
					scenarios : scenarios
					
				}, 'pctapi', 'StressTest/GetCustomStressTestDetailed', p).then((r) => {

					r = f.deep(r, 'records.0')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})
			},

			customtestScenariosFromFactors : function({portfolio, factors}, p = {}){

				var scenarios = _.map(factors, (factor) => {

					return {
						name : factor.name + ' ' + (factor.value || 0).toString(),
						factors : [{
							name : factor.name,
							value : (factor.value || 0).toString()
						}]
					}

				})


				return this.customtestScenarios({portfolio, scenarios}, p)
				
			},

			customtest : function({portfolio, factors}, p = {}){

				p.storageparameters = dbmeta.stress()

				if (portfolio.id > 0)
					p.storageparameters.invalidate = {
						index: portfolio.id,
						type: 'portfolio'
					}

				return request({
					portfolioId : portfolio.id,
					scenarios : [{
						factors : _.map(factors, (f) => {
							return {
								name : f.name,
								value : (f.value || 0).toString()
							}
						})
					}]
					
				}, 'pctapi', 'StressTest/GetCustomStressTestDetailed', p).then((r) => {

					r = f.deep(r, 'records.0')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})
			},

			test: function (data, p = {}) {

				if (!data.portfolioId) return Promise.reject({ error: 'Portfolio id empty' })

				data.stressTestTypes = ["Losses", "Ltr", "Yield", "CrashRating"]
				//data.onlyKeyScenarios = true

				p.storageparameters = dbmeta.stress()

				if (data.portfolioId > 0)
					p.storageparameters.invalidate = {
						index: data.portfolioId,
						type: 'portfolio'
					}

				return request(data, 'pctapi', 'StressTest/GetStressTest', p).then((r) => {

					r = f.deep(r, 'records.0')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})

			},

			details: function (data, p = {}) {

				if (!data.portfolioId) return Promise.reject({ error: 'Portfolio id empty' })

				data.stressTestTypes = p.stressTestTypes || ["Losses"]
				//data.onlyKeyScenarios = true

				p.storageparameters = dbmeta.stress()
				p.storageparameters.invalidate = {
					index: data.portfolioId,
					type: 'portfolio'
				}

				return request(data, 'pctapi', 'StressTest/GetStressTestDetailed', p).then((r) => {

					r = f.deep(r, 'records.0')

					if (!r) return Promise.reject({ error: 'empty result' })

					return Promise.resolve(r)
				})

			},

			scenarios: function (data, p = {}) {
				p.storageparameters = dbmeta.system()

				return request(data, 'pctapi', 'StressTest/GetScenariosList', p).then(r => {

					return Promise.resolve(r.records)
				})
			},

			factors: function (data, p = {}) {
				p.storageparameters = dbmeta.system()

				return request(data, 'pctapi', 'StressTest/GetFactorsList', p).then(r => {

					var factors = _.map(r.records, (f) => {

						return {
							...f,
							id: f.name,
							min: Math.max(Math.min(-1, Number((-3 * f.volatility).toFixed(1))), -60),
							max: Math.min(Math.max(1, Number((+3 * f.volatility).toFixed(1))), 60)
						}

					})

					return Promise.resolve(factors)
				})
			},

			optimization : {
				get : function(data, p = {}){

					if (!data.portfolioId) return Promise.reject({ error: 'Portfolio id empty' })

					p.storageparameters = dbmeta.stress()
	
					if (data.portfolioId > 0)
						p.storageparameters.invalidate = {
							index: data.portfolioId,
							type: 'portfolio'
						}
	
					return request(data, 'pctapi', 'Optimization/GetPctOptimizer', p).then((r) => {

						if(!r){
							return Promise.reject({ error: 'empty result' })
						}

						/*if(r && r.msg == "Objective could not be reached"){
							return Promise.reject({ error: "Optimize the portfolio according to the given parameters is impossible" })
						}*/

						return Promise.resolve(r)
					})
				},

				correctloss : function(data, p = {}){

				}
			}
		},
		assets: {
			search: function (d, p = {}) {

				d.count || (d.count = 11)

				p.storageparameters = dbmeta.financial()
				p.method = "POST"

				return request(d, 'pctapi', 'Assets/IncrementalSearch', p).then(r => {

					return Promise.resolve(r.records)
				})
			},

			info: function (tickers, p = {}) {
				p.storageparameters = dbmeta.financial()

				p.storageparameters.divide = {
					requestIndex: 'tickers',
					getloaded: 'ticker',
					path: 'records'
				}

				p.method = "POST"

				var d = {
					tickers
				}

				return dbdividerequest(d, 'pctapi', 'Assets/GetAssetsInfo', p).then(r => {

					var result = _.map(r.records, (r) => {
						return {
							...r,
							isCovered : true
						}
					})

					return Promise.resolve(result)
				})
			},

			fundsinfo: function (tickers, p = {}) {
				p.storageparameters = dbmeta.financialOneDay()

				p.storageparameters.divide = {
					requestIndex: 'tickers',
					getloaded: 'ticker',
					path: 'records'
				}

				p.method = "POST"

				var d = {
					tickers
				}

				return dbdividerequest(d, 'pctapi', 'Assets/GetFundsInfo', p).then(r => {

					var result = _.map(r.records, (r) => {
						return {
							...r
						}
					})

					return Promise.resolve(result)
				})
			}
		},
		portfolios: {

			search: function (value, data = {}, p = {}) {
				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])
				data.searchStrFilter = value
				data.includePositions = true
				p.method = "POST"

				return request(data, 'pctapi', 'Portfolio/List', p).then(r => {
					return r.records
				})
			},

			list: function (data = {}, p = {}) {

				p.method = "POST"
				p.count = 'pageSize'
				p.from = 'pageNumber'
				p.bypages = true
				p.includeCount = "includeCount"

				p.kit = {
					class: Portfolio,
					path: 'records'
				}

				p.vxstorage = {
					type: 'portfolio',
					path: 'records'
				}

				p.storageparameters = dbmeta.portfolios()

				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])

				return paginatedrequest(data, 'pctapi', 'Portfolio/List', p)

			},

			listwithClients: function (data, p) {

				return self.pctapi.portfolios.list(data, p).then(r => {


					var clientsIds = _.map(r.data, (p) => {
						return p.crmContactId
					})

					clientsIds = _.filter(clientsIds, (c) => { return c })

					return self.crm.contacts.gets({ Ids: clientsIds }).then(c => {
						return Promise.resolve(r)
					})
				})

			},

			add: function (data, p = {}) {

				p.method = "POST"

				if (data.catalogId) {
					core.vxstorage.invalidateMany(
						[data.catalogId],
						['filesystem']
					)
				}

				if (data.crmContactId) {
					core.vxstorage.invalidateManyQueue(
						[data.crmContactId],
						['client']
					)
				}

				self.invalidateStorageNow(['portfolios', 'contacts'])

				return request(data, 'pctapi', 'Portfolio/Add', p).then(r => {

					core.ignore('portfolio', {
						id: r.id
					})

					return Promise.resolve({
						id: r.id
					})

				})
			},
			update: function (data, p = {}) {
				p.method = "POST"

				self.invalidateStorageNow(['portfolios', 'contacts'])

				data.updated = f.date.toserverFormatDate()

				var { updated, from = {} } = core.vxstorage.update(data, 'portfolio')

				if (updated) {

					core.vxstorage.invalidateManyQueue(
						[updated.crmContactId, from.crmContactId],
						['client']
					)

					core.vxstorage.invalidateMany(
						[updated.catalogId, from.catalogId],
						['filesystem']
					)

					core.activity.template('portfolio', updated)
				}

				return request(data, 'pctapi', 'Portfolio/Update', p).then(r => {

					core.ignore('portfolio', {
						id: data.id
					})

					return Promise.resolve(updated)
				})
			},

			get: function (id, p = {}) {

				p.method = "POST"

				var data = {
					id,
					includePositions: true
				}

				p.kit = {
					class: Portfolio,
					one: true
				}

				p.vxstorage = {
					type: 'portfolio',
					index: id
				}

				p.storageparameters = dbmeta.portfolios()

				return request(data, 'pctapi', 'Portfolio/GetById', p)
			},

			gets: function (ids = [], p = {}) {


				if (!ids.length) return Promise.resolve([])

				var data = {
					pageSize: ids.length,
					idsFilter: ids,
					includePositions: true
				}

				p.method = "POST"

				p.kit = {
					class: Portfolio,
					path: 'records',
				}

				p.vxstorage = {
					type: 'portfolio',
					path: 'records',
					getloaded: 'idsFilter'
				}

				p.storageparameters = dbmeta.portfolios()

				return request(data, 'pctapi', 'Portfolio/List', p).then(r => {
					return Promise.resolve(r.records)
				})

			},

			delete: function (ids, p = {}) {

				if (!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids
				}

				_.each(ids, (id) => {
					var { updated } = core.vxstorage.update({
						status: "DELETED",
						id
					}, 'portfolio')

					core.activity.remove('portfolio', id)

					if (updated) {
						core.vxstorage.invalidateManyQueue(
							[updated.crmContactId],
							['client']
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

			recover: function (ids, p = {}) {

				if (!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids
				}

				return request(data, 'pctapi', 'Portfolio/RecoverByIds', p).then(r => {
					_.each(ids, (id) => {

						var { updated } = core.vxstorage.update({
							status: "ACTIVE",
							id
						}, 'portfolio')

						if (updated) {
							core.vxstorage.invalidateManyQueue(
								[updated.crmContactId],
								['client']
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
		},
		integrations: {
			update(name) {
				return request({
					name,
				}, 'pctapi', 'Integration/Update', {
					method: 'POST',
				});
			},
		},
		buylists: {

			search: function (value, data = {}, p = {}) {
				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])
				data.searchStrFilter = value
				data.includePositions = true
				p.method = "POST"

				return request(data, 'pctapi', 'BuyLists/List', p).then(r => {
					return r.records
				})
			},

			list: function (data = {}, p = {}) {

				p.method = "POST"
				p.count = 'pageSize'
				p.from = 'pageNumber'
				p.bypages = true
				p.includeCount = "includeCount"

				p.kit = {
					class: Buylist,
					path: 'records'
				}

				p.vxstorage = {
					type: 'buylist',
					path: 'records'
				}

				p.storageparameters = dbmeta.buylists()

				data.statusesFilter || (data.statusesFilter = ["ACTIVE"])

				return paginatedrequest(data, 'pctapi', 'BuyLists/List', p)

			},


			add: function (data, p = {}) {

				p.method = "POST"

				self.invalidateStorageNow(['buylists'])

				return request(data, 'pctapi', 'BuyLists/Add', p).then(r => {

					core.ignore('buylist', {
						id: r.id
					})

					return Promise.resolve({
						id: r.id
					})

				})
			},
			update: function (data, p = {}) {
				p.method = "POST"

				self.invalidateStorageNow(['buylists'])

				data.updated = f.date.toserverFormatDate()

				var { updated, from = {} } = core.vxstorage.update(data, 'buylist')

				return request(data, 'pctapi', 'BuyLists/Update', p).then(r => {

					core.ignore('buylist', {
						id: data.id
					})

					return Promise.resolve(updated)
				})
			},

			get: function (id, p = {}) {

				p.method = "POST"

				var data = {
					id,
					includePositions: true
				}

				p.kit = {
					class: Buylist,
					one: true
				}

				p.vxstorage = {
					type: 'buylist',
					index: id
				}

				p.storageparameters = dbmeta.buylists()

				return request(data, 'pctapi', 'BuyLists/GetById', p)
			},

			gets: function (ids = [], p = {}) {


				if (!ids.length) return Promise.resolve([])

				var data = {
					pageSize: ids.length,
					idsFilter: ids,
					includePositions: true
				}

				p.method = "POST"

				p.kit = {
					class: Buylist,
					path: 'records',
				}

				p.vxstorage = {
					type: 'buylist',
					path: 'records',
					getloaded: 'idsFilter'
				}

				p.storageparameters = dbmeta.buylists()

				return request(data, 'pctapi', 'BuyLists/List', p).then(r => {
					return Promise.resolve(r.records)
				})

			},

			delete: function (ids, p = {}) {

				if (!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids
				}

				_.each(ids, (id) => {

					var { updated } = core.vxstorage.update({
						status: "DELETED",
						id
					}, 'buylist')
					
				})

				self.invalidateStorageNow(['buylists'])

				return request(data, 'pctapi', 'BuyLists/DeleteByIds', p).then(r => {

					return Promise.resolve(r)

				})
			},

			recover: function (ids, p = {}) {

				if (!_.isArray(ids)) ids = [ids]

				p.method = "POST"

				var data = {
					ids
				}

				return request(data, 'pctapi', 'BuyLists/RecoverByIds', p).then(r => {
					_.each(ids, (id) => {

						var { updated } = core.vxstorage.update({
							status: "ACTIVE",
							id
						}, 'buylist')

					})

					self.invalidateStorageNow(['buylists'])

					return Promise.resolve(r)

				})
			},

		}
	}

	self.crm = {
		contacts: {
			search: function (value, data = {}, p = {}) {
				p.method = "POST"
				data.From = 1
				data.To = 7

				data.orderBy = { FName: "asc" }

				data.query = core.crm.query('simplesearch', { search: value, type: data.type || "CLIENT" })

				p.kit = {
					class: Contact,
					path: 'records'
				}

				return request(data, 'api', 'crm/Contacts/List', p).then(r => {
					return r.records
				})
			},
			list: function (data, p = {}) {

				p.method = "POST"

				p.vxstorage = {
					type: 'client',
					path: 'records'
				}

				p.kit = {
					class: Contact,
					path: 'records'
				}

				p.storageparameters = dbmeta.contacts()

				return paginatedrequest(data, 'api', 'crm/Contacts/List', p)

			},

			getbyids: function (ids, p = {}) {

				p.kit = {
					class: Contact,
					path: 'records'
				}

				return self.crm.contacts.gets({ Ids: ids }, p)
			},

			gets: function (data, p = {}) {
				p.method = "POST"

				p.vxstorage = {
					type: 'client',
					path: 'records',
					getloaded: 'Ids'
				}

				p.kit = {
					class: Contact,
					path: 'records'
				}

				p.storageparameters = dbmeta.contacts()

				return request(data, 'api', 'crm/Contacts/GetByIds', p).then(r => {
					return f.deep(r, 'records')
				})
			},

			counts: function (p = {}) {
				p.storageparameters = dbmeta.contacts()

				return request({
					Product: 'pct',
					OnlyUserInfo : true
				}, 'api', 'crm/Contacts/GetCountsByType', p)
			},

			updateCapacity : function(ID, capacity){
				var data = {
					ID,
					__customfields__ : {
						$$PCT_Capacity : capacity
					},
					IsUpdateOnlyThisCustomFields : true
				}

				return self.crm.contacts.update(data)
			},

			update: function (data = {}, p = {}) {
				p.method = "POST"

				data.Modified = f.date.toserverFormatDate()

				var edata = {...data}

				if (edata.__customfields__){
					if(edata.__customfields__.$$PCT_Capacity){
						edata.capacity = Number(edata.__customfields__.$$PCT_Capacity)
					}
					
				}

				var { updated, from } = core.vxstorage.update(edata, 'client')

				//core.vxstorage.update(data, 'contact')

				core.activity.remove('client', data.ID)
				core.activity.remove('lead', data.ID)

				if (updated) {
					core.activity.template('client', updated)
					core.activity.template('lead', updated)

					if (from.Status == 'LEAD_NEW' && updated.Status == "LEAD") {
						core.updates.decrease('leads')
					}

					if (from.Type == 'LEAD' && updated.Type == "CLIENT") {
						core.updates.decrease('totalLeads')
						core.updates.increase('totalClients')
					}
				}

				self.invalidateStorageNow(['portfolios', 'contacts'])

				return request(data, 'api', 'crm/Contacts/Update', p).then(r => {

					core.ignore('client', {
						ID: data.ID
					})

					/*core.ignore('lead', {
						ID: data.ID
					})*/

					return Promise.resolve(data)
				})
			},

			add: function (data = {}, p = {}) {
				p.method = "POST"

				self.invalidateStorageNow(['portfolios', 'contacts'])

				data.products = self.platform

				return request(data, 'api', 'crm/Contacts/Insert', p).then(r => {

					if (r.alreadyExists) {
						return Promise.reject(r)
					}

					data.ID = r.id

					core.ignore('client', {
						ID: data.ID
					})

					if (data.type == 'CLIENT') {
						core.updates.increase('totalClients')
					}

					if (data.type == 'LEAD') {
						core.updates.increase('totalLeads')
					}

					//// TO DO CHECK DOUBLE

					self.invalidateStorageNow(['portfolios', 'contacts'])

					return Promise.resolve(data)
				})
			},

			get: function (id, p = {}) {
				p.method = "GET"

				p.vxstorage = {
					type: 'client',
					getloaded: id,
					one: true
				}

				p.kit = {
					class: Contact,
					path: '',
					one: true
				}

				return request({}, 'api', 'crm/Contacts/' + id, p)
			},

			scheme: function (p = {}) {
				p.method = "GET"

				p.storageparameters = dbmeta.system()

				return request({}, 'api', 'crm/Contacts/Scheme', p).then(r => {
					return r.Contacts
				}).catch(e => {

					if(e && e.error && e.error.indexOf('Access denied') > -1){
						return Promise.resolve(null)
					}

					return Promise.reject(e)
				})
			},

			getidbyemail: function (email, p = {}) {
				var companyId = f.deep(core, 'user.info.Company.ID')

				if (!companyId) return Promise.reject('user.info.Company.ID')

				p.method = "GET"


				return request({ companyId, email }, 'api', 'crm/Contacts/GetContactByEmail', p)
			},

			getbyemail: function (email, p = {}) {
				return self.crm.contacts.getidbyemail(email, p).then(id => {


					return self.crm.contacts.get(id)
				})
			}
		},

		upload: {

			avatarId: function (data, p = {}) {
				p.method = "POST"

				return request(data, 'api', 'crm/Contacts/LoadAvatar', p).then(r => {
					return Promise.resolve(r.Id)
				})
			},

			avatar: function (formData, ContactId, id) {

				formData.append('Id', id.split('.')[0]);
				formData.append('Start', 0);

				return self.crm.upload.attachment(formData).then(r => {

					var ud = {
						ID: ContactId,
						AvatarId: id
					}

					var { updated } = core.vxstorage.update(ud, 'client')

					if (updated) {

						if (updated.Type == "CLIENT")
							core.activity.template('client', updated)

						if (updated.Type == "LEAD")
							core.activity.template('lead', updated)

					}

					/*var { updated } = core.vxstorage.update(ud, 'lead')

					if (updated) {
						core.activity.template('lead', updated)
					}*/

					self.invalidateStorageNow(['portfolios', 'contacts'])

					core.ignore('client', {
						ID: ContactId
					})

					/*core.ignore('lead', {
						ID: ContactId
					})*/



					return Promise.resolve()
				})
			},

			attachment: function (formData, p = {}) {
				return request(formData, 'apiFD', 'crm/Attachments/Upload', p)
			}


		},

		questionnaire: {
			getlink: function (clientid, p = {}) {

				p.method = "GET"

				var d = {}

				if (clientid) d.leadId = clientid

				p.storageparameters = dbmeta.system()

				return request(d, 'api', 'crm/Surveys/GetKeyForPctQuiz', p).then(r => {

					var prefix = 'https://rixtrema.net/pctnew/'


					return Promise.resolve(prefix + 'riskscore/' + r.token)

				})

			},

			getdata: function (token, p = {}) {

				p.method = "GET"

				return request({ token }, 'api', 'crm/Surveys/GetInfoForPctQuiz', p).then(r => {

					return Promise.resolve(r)

				})

			},
			response: {
				first: function (Token, client = {}, p = {}) {
					p.method = "POST"

					return request({
						Token,
						...client
					}, 'api', 'crm/SurveysAnswers/InsertPctAnswerFirst', p).then(r => {

						return Promise.resolve(r.id)

					})
				},

				second: function (Token, SurveyAnswerId, Json = "", p = {}) {
					p.method = "POST"

					return request({
						Token,
						SurveyAnswerId,
						Json
					}, 'api', 'crm/SurveysAnswers/InsertPctAnswerSecond', p).then(r => {

						return Promise.resolve(r.id)

					})
				},

				third: function (Token, SurveyAnswerId, data = {}, p = {}) {
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

			getresult: function (id, p = {}) {

				p.method = "GET"

				return request({}, 'api', 'crm/SurveysAnswers/' + id, p).then(r => {
					var js = null

					try {
						js = JSON.parse(r.Json || "{}")
					} catch (e) {

					}


					if (!js) return Promise.reject('json')

					return Promise.resolve(js)

				})


			}
		}
	}

	self.notifications = {
		list: function (data = {}, p) {
			if (!p) p = {}

			p.method = "POST"
			p.count = 'pageSize'
			p.from = 'pageNumber'
			p.bypages = true
			p.includeCount = "includeCount"

			data.appIdFilter = self.appid

			return paginatedrequest(data, 'api', 'notifier/Event/webSocketsList', p)
		},

		get: function (id, p = {}) {

			p.method = "POST"

			return request({ id }, 'api', 'notifier/Event/webSocketEvent', p)
		},

		register: function ({ token, device }, p = {}) {

			p.method = "POST"


			return request({ registerId: token, device, appId: self.appid }, 'api', 'notifier/Firebase/Register', p).then(r => {
			})

		},

		revoke: function ({ device }, p = {}) {
			p.method = "POST"

			return request({ device, appId: self.appid }, 'api', 'notifier/Firebase/Revoke', p).then(r => {
			})
		},

		hide: function (id, p = {}) {

			p.method = "POST"

			return request({ id }, 'api', 'notifier/Event/hide', p)

		},

		makeRead: function (ids, p = {}) {

			if (!_.isArray(ids)) ids = [ids]

			ids = _.map(ids, (id) => {
				if (_.isObject(id)) return id.id || id.eventid

				return id
			})

			p.method = "POST"

			return request({ ids }, 'api', 'notifier/Event/markListAsRead', p)

		},

		makeReadAll: function (p = {}) {

			p.method = "POST"

			return request({
				appId: self.appid
			}, 'api', 'notifier/Event/markListByAppAsRead', p)

		},

		count: function (data = {}, p) {
			if (!p) p = {}

			p.method = "POST"

			data.includeCount = true
			data.pageSize = 0
			data.appIdFilter = self.appid
			data.pageNumber = 0
			data.includeOnlyUnreadFilter = true

			return request(data, 'api', 'notifier/Event/webSocketsList', p).then(r => {
				return Promise.resolve({
					count: r.pagination.total || 0
				})
			})
		}
	}

	self.filesystem = {
		/* {root} */
		get: function (rootid, p = {}) {

			p.method = "POST"

			p.vxstorage = {
				type: 'filesystem',
				getloaded: p.reload ? false : rootid,
				one: true
			}

			return request({
				id: rootid || '0'
			}, 'pctapi', 'Catalog/GetCatalogContent', p).then(r => {
				const isIntegration = r.nonremovable || r.readOnly || r.name.includes('integration_') || false;

				var result = {
					name: r.name,
					content: [],
					id: r.id,
					from : r.catalogId,
					attributes : {
						readOnly : r.readOnly || false,
						nonremovable : r.nonremovable || r.readOnly || r.name == 'Models' || false,
						isIntegration,
					}
				}

				_.each(r.catalogs, (c) => {
					result.content.push({
						type: 'folder',
						id: c.id,
						name: c.name,
						from: rootid || '0',
						context: 'filesystem',
						attributes : {
							readOnly : c.readOnly || false,
							nonremovable : c.nonremovable || c.readOnly || c.name == 'Models' || false,
							isIntegration,
						}
					})
				})

				_.each(r.portfolios, (p) => {
					result.content.push({
						type: 'portfolio',
						id: p.id,
						name: p.name,
						from: rootid || '0',
						context: 'filesystem',
						attributes : {
							readOnly : p.readOnly || false,
							nonremovable : p.nonremovable || p.readOnly || false,
							isIntegration,
						}
					})
				})

				return result
			})
		},

		gets: function (ids) {

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

		create: {
			/* {root, name} */
			folder: function (data, p) {
				return request(data, 'pctapi', 'Catalog/Add', p).then((r) => {

					core.vxstorage.invalidate(data.catalogId, 'filesystem')

					return Promise.resolve(r)
				})
			}
		},

		move: {
			folder: function ({ id, to, from }, p) {

				var data = {
					id,
					destinationCatalogId: to
				}
				

				core.vxstorage.invalidateMany(
					[to, from],
					['filesystem']
				)

				return request(data, 'pctapi', 'Catalog/MoveCatalog', p)
			},
			portfolio: function ({ id, to, from }, p) {

				var data = {
					id,
					destinationCatalogId: to
				}

				core.vxstorage.invalidateMany(
					[to, from],
					['filesystem']
				)

				return request(data, 'pctapi', 'Catalog/MovePortfolio', p)
			}
		},

		delete: {
			folder: function ({ id, from }, p) {

				var data = {
					id
				}

				if(from){
					core.vxstorage.invalidateMany(
						[from],
						['filesystem']
					)
				}
				else{
					self.invalidateStorageNow(['filesystem'])
				}
				
				

				return request(data, 'pctapi', 'Catalog/DeleteCatalog', p)
			},

			portfolio: function ({ id, from }, p) {

				if(from){
					core.vxstorage.invalidateMany(
						[from],
						['filesystem']
					)
				}
				else{
					self.invalidateStorageNow(['filesystem'])
				}

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

		register : function(data){
			return request(data, 'api', 'userdata/user/Register', {
				method: "POST"
			})
		},

		activate : function(id){
			return request({id}, 'api', 'userdata/user/Activate', {
				method: "POST"
			})
		},

		trial : {
			activate : function(id, p = {}){

				p.method = 'POST'

				return request({}, 'api', 'userdata/user/TrialCreate?trialDto.product=' + id, p).then(r => {

					_.each(r, licence => {
						core.user.extendFeatures(licence)
					})

					return Promise.resolve()
				}).then(() => {
					return core.user.prepare()
				})
			}
		},

		prechangePassword: function (password, p = {}) {
			return request({
				OldPassword: password
			}, 'api', 'userdata/user/PreChangePassword', p)
		},

		changePassword: function ({ password, pin }, p = {}) {

			return request({

				NewPassword: password,
				Pin: pin

			}, 'api', 'userdata/user/PreChangePassword', p)

		},

		restorePassword: function ({ email }, p = {}) {
			return request({
				Email: email,
				Link: self.platform
			}, 'api', 'userdata/user/RestorePassword', p)
		},

		restorePasswordContinue: function ({ email, pin, password }, p = {}) {
			return request({
				Email: email,
				Code: pin,
				NewPassword: password
			}, 'api', 'userdata/user/SetNewPassword', p)
		},

		settings: {
			getall: function (type) {
				return request({ type, product: self.platform }, 'api', 'userdata/settings/list', {
					method: "GET",
				})
			},

			create: function (key, value, type) {

				var data = {}
				data.Product = self.platform
				data.IsPublic = true
				data.Type = type
				data.Name = key
				data.Info = JSON.stringify(value)

				return request(data, 'api', 'userdata/settings/create', {
					method: "POST",
				})
			},

			update: function (id, key, value, type) {

				var data = {}
				data.product = self.platform
				data.IsPublic = true
				data.Type = type
				data.Name = key
				data.Info = JSON.stringify(value)

				return request(data, 'api', 'userdata/settings/update/' + id, {
					method: "POST",
				})
			}
		},

		initlookup : function(){
			return request({}, 'pctapi', 'User/Init', {
				method: "POST"
			}).then(r => {
				return Promise.resolve()
			})
			
			/*.catch(e => {
				console.error(e)

				return Promise.resolve()
			})*/
		},

		updated: function (p = {}) {
			return request({}, 'pctapi', 'User/GetLastUpdates', {
				method: "POST"
			}).then(r => {

				var invalidateStorage = []

				if (r.lastClientUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastClientUpdate, true) / 1000,
						type: ['contacts']
					})

				if (r.lastLeadUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastLeadUpdate, true) / 1000,
						type: ['contacts']
					})

				if (r.lastPortfolioUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastPortfolioUpdate, true) / 1000,
						type: ['portfolios']
					})

				if (r.lastBuyListUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastBuyListUpdate, true) / 1000,
						type: ['buylists']
					})
					

				if (r.LastModelUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.LastModelUpdate, true) / 1000,
						type: ['system', 'stress', 'financial', 'financialOneDay']
					})

				if (r.lastScenariosUpdate)
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastScenariosUpdate, true) / 1000,
						type: ['system', 'stress', 'financial', 'financialOneDay']
					})

				if (r.lastAsyncTasksUpdate) {
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastAsyncTasksUpdate, true) / 1000,
						type: ['tasks', 'files']
					})
				}

				if (r.lastFilesUpdate) {
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastFilesUpdate, true) / 1000,
						type: ['files']
					})
				}

				if (r.lastCustomScenarioUpdate) {
					invalidateStorage.push({
						updated: f.date.fromstring(r.lastCustomScenarioUpdate, true) / 1000,
						type: ['customscenarios', 'stress']
					})
				}

				

				return Promise.resolve(invalidateStorage)

			})
		}
	}

	self.tasks = {

		create: function (FileId, Type, TaskParameters = '', p = {}) {

			p.method = "POST"

			return request({ Type, FileId, TaskParameters }, 'api', 'async_task_manager/Tasks/Create', p).then(r => {
				return Promise.resolve(r.id)
			})

		},

		restart: function (FileId, Type, TaskParameters = '', p = {}) {

			p.method = "POST"

			return request({ Type, FileId, TaskParameters }, 'api', 'async_task_manager/Tasks/Restart', p).then(r => {
				return Promise.resolve(r.id)
			})

		},

		fromfiles : function(tasksraw, id){

			return _.map(tasksraw, (taskraw) => {

				taskraw.fileId = id

				var task = new TTask(taskraw)

				core.vxstorage.set(task, 'task')

				return task
			})
		},

		update: function (id, dataManual, p = {}) {
			p.method = "POST"

			self.invalidateStorageNow(['tasks'])

			core.ignore('task', {
				id
			})

			var { updated, from } = core.vxstorage.update({
				data: dataManual,
				manual: true,
				id
			}, 'task')

			return request({ id, dataManual: JSON.stringify({ Infos: dataManual }) }, 'api', 'async_task_manager/Tasks/Update', p)
		},


	}

	self.files = {

		upload: function (data = {}, p = {}) {


			if(!data.file && !data.files) return Promise.reject('empty')

			self.invalidateStorageNow(['files'])

			let formData = new FormData();

			formData.append('AppId', self.platform);

			if(data.file){
				formData.append("File", data.file);
			}

			if(data.files){
				_.each(data.files, (file) => {
					formData.append("File", file);
				})
			}

			return request(formData, 'apiFDH', 'async_task_manager/Files/Upload', p).then(r => {

				/*core.ignore('task', {
					id: r.id
				})*/

				return Promise.resolve(r.id)
			})


		},

		list: function (data = {}, p = {}) {
			p.method = "POST"

			p.count = 'pageSize'
			p.from = 'pageNumber'
			p.bypages = true
			p.includeCount = "includeCount"

			p.kit = {
				class: TFile,
				path: 'records'
			}

			p.vxstorage = {
				type: 'file',
				path: 'records'
			}

			data.includeStatusesFilter = ["ACTIVE"]

			p.storageparameters = dbmeta.files()

			data.appIdsFilter = [self.platform]

			return paginatedrequest(data, 'api', 'async_task_manager/Files/List', p).then(r => {

				_.each(r.data || [], (file) => {
					/*file.processes = */self.tasks.fromfiles(file.tasks, file.id)
				})

				console.log("R", r)

				return Promise.resolve(r)
			})
		},

		get: function (id, p = {}) {
			p.method = "POST"

			p.kit = {
				class: TFile,
				one: true,
				path: 'records'
			}

			p.vxstorage = {
				type: 'file',
				index: id
			}

			p.storageparameters = dbmeta.files()

			return request({ fileId : id }, 'api', 'async_task_manager/Files/Get', p).then((file) => {
				/*file.processes = */self.tasks.fromfiles(file.tasks, file.id)

				return Promise.resolve(file)
			})
		},

		delete: function (id, p = {}) {
			p.method = "POST"

			self.invalidateStorageNow(['files'])

			core.vxstorage.update({
				status: "DELETED",
				id : id
			}, 'file')

			return request({ filesIds : [id] }, 'api', 'async_task_manager/Files/Delete', p)
		},
		deleteItems: function (filesIds, p = {}) {
			p.method = "POST"

			self.invalidateStorageNow(['files'])

			_.each(filesIds, (id) => {
				core.vxstorage.update({
					status: "DELETED",
					id : id
				}, 'file')
			})

			return request({ filesIds }, 'api', 'async_task_manager/Files/Delete', p)
		},

		getattachment: function (key, fileID, p = {}) {
			p.method = "POST"

			var datahash = sha1(key + fileID)

			core.store.commit('globalpreloader', true)

			return dbaction(datahash, () => {

				return request({ fileID, storageKey: key }, 'api', 'async_task_manager/Files/GetAttachmentLink', p).then(r => {


					return Axios({
						url: r.url,
						responseType: 'blob'
					})

				}).then(r => {

					var file = new Blob([r.data], { type: r.headers['content-type'] })

					return Promise.resolve(file)
				})
			}, {
				storageparameters: dbmeta.files()
			}).then(r => {

				core.store.commit('globalpreloader', false)

				return Promise.resolve(r)
			}).catch(e => {

				core.store.commit('globalpreloader', false)
				return Promise.reject(e)
			})

		}
	}

	self.rixtrema = {
		aws: {
			get: function (data = {}, p = {}) {

				p.method = "GET"

				data.data = 1

				return request(data, '401k', '?action=AWSTEXTRACTOR_GET', p).then(r => {
					return Promise.resolve(r.FCT.records || [])
				})
			},

			original: function (id, type, p = {}) {

				p.storageparameters = dbmeta.files()

				return request({}, '401k', '?action=AWSTEXTRACTOR_FILE&id=' + id, p).then(r => {

					return Promise.resolve(new Blob([r.Message], { type }))
				})

			},

			upload: function (info, file, p) {

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

	self.campaigns = {
		batches : {

			getbyids : function(ids, p){
				return Promise.all(_.map(ids, id => {
					return self.campaigns.batches.get(id)
				}))
			},

			get : function(id, p = {}){

				p.kit = {
					class: Batch,
					path: '',
					getloaded : id,
					one: true
				}

				p.vxstorage = {
					type: 'batch',
					index: id
				}
				
				return request({}, 'campaigns', 'batches/get/' + id, p)
			},

			list: function (data = {}, p = {}) {

				p.method = "POST"
				p.count = 'PageSize'
				p.from = 'PageNumber'
				p.bypages = true
				p.countLater = true
				//p.includeCount = "IncludeCount"

				p.payloadChange = (data) => {
					var d = {
						Parameters : data,
						Product : self.platform
					}

					return d
				}

				p.kit = {
					class: Batch,
					path: 'Records'
				}

				p.vxstorage = {
					type: 'batch',
					path: 'Records'
				}

				/*p.storageparameters = dbmeta.portfolios()*/

				//data.statusesFilter || (data.statusesFilter = ["ACTIVE"])

				data.PlatformFilter = self.platform
				data.ExcludeStatusesFilter = ["DELETED"]

				return paginatedrequest(data, 'campaigns', 'batches/list', p)

			},

			create : function(data, p = {}){
				return request(data, 'campaigns', 'batches/create', p)
			},

			delete : function(id, p = {}){
				return request({}, 'campaigns', 'batches/delete/' + id, p)
			},

			cancel : function(id, p = {}){
				return request({}, 'campaigns', 'batches/cancel/' + id, p)
			},

			pause : function(id, p = {}){
				return request({}, 'campaigns', 'batches/pause/' + id, p)
			},

			resume : function(id, p = {}){
				return request({}, 'campaigns', 'batches/start/' + id, p)
			},

			update: function(data, p = {}){
				return request(data, 'campaigns', 'batches/update', p)
			},

			
		},

		single : {

			getbyids : function(ids, p){
				return Promise.all(_.map(ids, id => {
					return self.campaigns.single.get(id)
				}))
			},

			get : function(id, p = {}){

				p.kit = {
					class: Campaign,
					path: '',
					getloaded : id,
					one: true
				}

				p.vxstorage = {
					type: 'campaign',
					index: id
				}
				
				return request({}, 'campaigns', 'campaigns/get/' + id, p)
			},

			pause : function(ids, p = {}){
				if(!_.isArray(ids)) ids = [ids]

				return request({Ids : ids}, 'campaigns', 'campaigns/pause', p)
			},
			resume : function(ids, p = {}){
				if(!_.isArray(ids)) ids = [ids]
				
				return request({Ids : ids}, 'campaigns', 'campaigns/start', p)
			},
			delete : function(ids, p = {}){
				if(!_.isArray(ids)) ids = [ids]

				return request({Ids : ids}, 'campaigns', 'campaigns/delete', p)
			},
			cancel : function(ids, p = {}){
				if(!_.isArray(ids)) ids = [ids]

				return request({Ids : ids}, 'campaigns', 'campaigns/cancel', p)
			},
			
			list : function(data, p = {}){

				p.method = "POST"
				p.count = 'PageSize'
				p.from = 'PageNumber'
				p.bypages = true
				p.countLater = true
				//p.includeCount = "IncludeCount"

				p.payloadChange = (data) => {
					var d = {
						Parameters : data,
						BatchId : data.BatchId
					}

					return d
				}

				p.kit = {
					class: Campaign,
					path: 'Records'
				}

				p.vxstorage = {
					type: 'campaign',
					path: 'Records'
				}

				data.ExcludeStatusesFilter = ["DELETED"]

				return paginatedrequest(data, 'campaigns', 'campaigns/list', p)
			},

			listall : function(batchId, p = {}){

				p.method = "POST"

				p.kit = {
					class: Campaign,
					path: 'Records'
				}

				p.vxstorage = {
					type: 'campaign',
					path: 'Records'
				}

				var data = {
					BatchId : batchId
				}

				return request(data, 'campaigns', 'campaigns/list', p).then(r => {
					return Promise.resolve(r.Records)
				})
			},

			steps : function(campaignId, p = {}){

				p.method = "GET"

				p.kit = {
					class: ViewStep,
					path: 'Records',
				}

				p.vxstorage = {
					type: 'step',
					path: 'Records',

					setcustom : function(r){
						var steps = r.Records

						f.reqstepsSync(steps, (step, i, steps) => {
							var stored = core.vxstorage.set(step, 'step')

							steps[i] = stored
						})

						return {
							Records : steps
						}
					}
				}

				return request({campaignId}, 'campaigns', 'steps/list', p).then(r => {


					return Promise.resolve(r.Records)
				})
			},

			email : function(campaignId, stepId, p = {}){

				p.method = "GET"
				p.storageparameters = dbmeta.campaigns()

				return request({
					campaignId, stepId
				}, 'campaigns', 'steps/jsonemailpreview', p).then(r => {
					var email = {}
					try{
						email.body = f.Base64.decode(r.Body)
						email.subject = f.Base64.decode(r.subject)
					}
					catch(e){
						return Promise.reject(e)
					}

					return email
				})

			}, 
			
		},

		templates : {
			gets : function(data = {}, p = {}){

				p.kit = {
					class: Template,
					path: 'Records',
				}

				p.vxstorage = {
					path: 'Records',
					type: 'template',
				}

				data.Compact = false

				return request(data, 'campaigns', 'template/list', p).then(r => {

					return Promise.resolve(r)

				})

			},

			add : function(data = {}, p = {}){
				return request(data, 'campaigns', 'template/add', p).then(r => {

					var obj = new Template(data)

					core.vxstorage.set(obj, 'template')

					return Promise.resolve(obj)

				})
			},

			update : function(data = {}, p = {}){
				return request(data, 'campaigns', 'template/add', p).then(r => {

					var obj = new Template(data)

					var {updated} = core.vxstorage.update(obj, 'template')

					return Promise.resolve(updated)

				})
			},

			remove: function(data = {}, p = {}){
				return request(data, 'campaigns', 'template/delete', p).then(r => {

					core.vxstorage.invalidate(data.Id, 'template')

					return Promise.resolve()

				})
			},
		},

		signatures : {

			getdata : function(id, p = {}){

				var data = {
					Parameters : {
						IdsFilter : [id]
					},
					Compact : false
				}

				return request(data, 'campaigns', 'signatures/list', p).then(r => {

					var html = f.deep(r, 'Records.0.Html') || ''
					var json = f.deep(r, 'Records.0.Json') || ''

					return {html, json}
				})

			},

			gets : function(data = {}, p = {}){

				p.kit = {
					class: Signature,
					path: 'Records',
				}

				p.vxstorage = {
					path: 'Records',
					type: 'signature',
				}

				data.Compact = true

				return request(data, 'campaigns', 'signatures/list', p).then(r => {

					var signatures = _.filter(r.Records, (r) => {
						return r.Type == 'html'
					})

					return Promise.resolve(signatures)

				})

			},

			create : function(data = {}, p = {}){
				return request(data, 'campaigns', 'signatures/add', p).then(r => {

					var obj = new Signature(data)

					core.vxstorage.set(obj, 'signature')

					return Promise.resolve(obj)

				})
			},

			update : function(data = {}, p = {}){
				return request(data, 'campaigns', 'signatures/update', p).then(r => {

					var obj = new Signature(data)

					var {updated} = core.vxstorage.update(obj, 'signature')

					return Promise.resolve(updated)

				})
			},

			delete: function(data = {}, p = {}){
				return request(data, 'campaigns', 'signatures/delete', p).then(r => {

					core.vxstorage.invalidate(data.Id, 'signature')

					return Promise.resolve()

				})
			},
		},

		misc : {
			stats : function(p = {}){
				p.method = "GET"

				p.storageparameters = dbmeta.campaignsFast()

				//GET /statistic/getStatisticByAllCampaigns
				return request({}, 'campaigns', 'statistic/campaignstotal', p)
			},

			campaignsCount : function(data, p = {}){
				p.method = "GET"
				//GET /statistic/getStatisticByAllCampaigns
				return request({
					startDate : data.date ? f.date.toserverFormatDate(data.date.start, true) : null, 
					endDate : data.date ? f.date.toserverFormatDate(data.date.end, true) : null
				}, 'campaigns', 'statistic/campaignscount', p).then(r => {
					return Promise.resolve(r.Count)
				})
			},

			campaignsFile : function(data, p = {}){
				p.method = "GET"
				p.blob = true
				//p.withheaders = true
				//GET /statistic/getStatisticByAllCampaigns
				return request({
					startDate : data.date ? f.date.toserverFormatDate(data.date.start, true) : null, 
					endDate : data.date ? f.date.toserverFormatDate(data.date.end, true) : null
				}, 'campaigns', 'statistic/campaigns', p).then(r => {

					//var type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8'

					//var file = new Blob([r.Message], { type })

					/*saveAs(file, "hello world.xlsx");
					
					return Promise.reject()*/
					//

					return Promise.resolve({
						base64 : f.Base64.fromBlob(r),
						name : "Campaigns " + moment().format('MMMM/DD/YYYY') + '.xlsx',
                    	type : r.type
					})
				})
			},

		},

		emails : {
			templates : {
				getall : function(data, p = {}){

					p.kit = {
						class: EmailTemplate,
						path: 'Records'
					}
	
					p.vxstorage = {
						type: 'emailtemplate',
						path: 'Records'
					}

					data.Parameters || (data.Parameters = {})
					data.Parameters.PageSize = -1
					data.Parameters.SystemFilter = data.MailSystem
					data.WithoutBody = true

					delete data.MailSystem

					return request(data, 'campaigns', 'mailtemplate/list', p).then(r => {
						return r.Records
					})
				},

				create : function(data, p = {}){

					return request(data, 'campaigns', 'mailtemplate/add', p).then(r => {

						data.Id = r.Id

						return Promise.resolve(new EmailTemplate(data))
						
					})
				},

				delete : function(Id, p = {}){

					return request({Id}, 'campaigns', 'mailtemplate/delete', p).then(r => {
						return Promise.resolve()
						
					})
				},

				update : function(data, p = {}){

					return request(data, 'campaigns', 'mailtemplate/update', p).then(r => {

						var obj = new EmailTemplate(data)

						var {updated} = core.vxstorage.update(obj, 'emailtemplate')

						return Promise.resolve(updated)
					})
				},

				getBody : function(id, p = {}){

					var data = {
						Parameters : {
							IdsFilter : [id]
						},
						WithoutBody : false
					}

					return request(data, 'campaigns', 'mailtemplate/list', p).then(r => {

						var body = f.deep(r, 'Records.0.Body') || ''

						return body
					})

				},

				getbyids : function(ids = []){
					return self.campaigns.emails.templates.getall().then((r) => {

						var res = {}

						_.each(r, (et) => {

							if(_.indexOf(ids, et.Id) > -1){
								res[et.Id] = et
							}

						})

						return Promise.resolve(res)
					})
				}
			}
		},

		variables : {
			get : function(types, p){

				var data = {
					Parameters : {
						GroupsFilter : types
					}
				}

				return request(data, 'campaigns', 'dynamicparameters/list', p).then(r => {
					return Promise.resolve(r.Records)
				})
			}
		}
	}

	self.ai = {

		extra : {
			ainfo : {
				value : undefined,
				set : function(text, clbk){

					
				},
				get : function(clbk){

					return Promise.resolve('')
				}
			}
		},

		pdf : function(parameters = {}, context = {}, extra = {}, p = {}){

			p.timeout = 600000

			var data = {}

			if (context.plan){
				data.AckId = context.plan.ACK_ID
			}

			data.Query = context.query || ''
			data.SessionId = extra.session || ''
			data.History = true

			return request(data, 'chat_ai', 'ai/pdfchat', p).then(function(result){

				return Promise.resolve({
					text : f.clearstring(result.Body || result.answer || ""),
					caption : f.clearstring(result.Subject || ""),

					fullrequest : f.clearstring(result.fullBody || ''),
					shortrequest : f.clearstring(result.shortBody || '')
				})
			}).catch(e => {
				console.error(e)
				return Promise.reject((((e || {}).responseJSON || {}).Message || e) || "Undefined Error")
			})
		},

		generate : function(id, parameters = {}, context = {}, extra = {}, p = {}){

			p.timeout = 600000

			var data = {
				ModelTarget: "LANGCHAIN",
				makeprompt : context.test ? true : false,
				AiEmailTemplateId : id,
				Parameters : _.map(parameters, function(value, id){
					return {
						Id : id,
						Value : value
					}
				}),
				RecipientInfo : {}
			}

			if(context.automatization){
				data.Highload = context.automatization
			}


			if (extra.refinetext){
				data.Parameters.push({
					Id : "refinetext__",
					Value : extra.refinetext
				})
			}

			if (typeof extra.temperature != 'undefined'){
				data.Temperature = extra.temperature
			}

			console.log('extra.history', extra.history)

			if (extra.history){

				var history = _.map(extra.history, function(hst){
					return hst.speaker + ": " + hst.text
				}).join("\n\n")

				var historyUser = _.map(_.filter(extra.history, function(h){
					return h.userask
				}), function(hst){
					return hst.text
				}).join("\n\n")

				data.Parameters.push({
					Id : "gpthistoryOfChat__",
					Value : history
				})

				data.Parameters.push({
					Id : "gpthistoryOfChatFromUser__",
					Value : historyUser
				})

			}

			data.Parameters.push({
				Id : "gptcapacity",
				Value : JSON.stringify(extra.capacity || {})
			})
			
			data.Parameters.push({
				Id : "gptbenchmarks",
				Value : JSON.stringify(extra.benchmarks || {})
			})

			if (extra.positions){
				data.Parameters.push({
					Id : "gptpositions",
					Value : JSON.stringify(extra.positions)
				})
			}

			if (extra.crashtest){
				data.Parameters.push({
					Id : "gptcrashtest",
					Value : JSON.stringify(extra.crashtest)
				})
			}

			

			if (context.portfolio){
				data.RecipientInfo.PortfolioId = context.portfolio
			}

			if (context.client){
				data.RecipientInfo.RecipientId = context.client
				
			}

			if (extra.clientName){
				data.RecipientInfo.RecipientName = extra.clientName
			}
			
			if (extra.advisorInfo){
				data.Parameters.push({
					Id : "advisorInfo__",
					Value : extra.advisorInfo
				})
			}

			if(extra.files){
				data.files = extra.files
			}

			return self.ai.extra.ainfo.get().then(function(info){

				data.Parameters.push({
					Id : "advisorInfo__",
					Value : info
				})

				return request(data, 'chat_ai', 'ai/aimail', p)

			})

			.then(function(result){

				return Promise.resolve({
					text : f.formatDollarsInText(f.clearstring(result.Body || result.body || "")),
					caption : f.formatDollarsInText(f.clearstring(result.Subject || result.subject || "")),

					fullrequest : f.clearstring(result.fullBody || ''),
					shortrequest : f.clearstring(result.shortBody || ''),
					completion : f.clearstring(result.completion || ''),
					html : f.clearstring(result.html || ''),

					requestId : (result.service || {}).requestId
				})

			}).catch(e => {

				console.error(e)

				var textoferror = (

					((e || {}).responseJSON || {}).Message ||
					((e || {}).responseJSON || {}).error ||
					((e || {}).error)

				) || e || "Undefined Error"

				return Promise.reject(textoferror)
			})

		},

		template : {
			loadedlist : null,
			list : function(p = {}){

				if(this.loadedlist) return Promise.resolve(this.loadedlist)

				var d = {
					Parameters : {

					}
				}

				d.Parameters.StatusFilter = 'ACTIVE'

				return request(d, 'campaigns', 'AiEmailTemplates/list', p).then(function(data){

					data.Records = _.filter(data.Records, function(r){
						return r.Status != 'DELETED' && r.Platform == self.platform
					})

					return Promise.resolve(_.map(data.Records, function(record){

						try{
							record.Body = decodeURIComponent(record.Body)

						}
						catch(e){
							record.Body = ''
						}

						try{
							record.Parameters = JSON.parse(record.Parameters)

						}
						catch(e){
							
							record.Parameters = _.isObject(record.Parameters) ? record.Parameters : {}
							record.Body = ''
						}
						

						return record

					}))

				}).then((result) => {

					this.loadedlist = result
					 
					return Promise.resolve(result)
				})
			}
		},

		
	}

	self.ai_messages = {
		lists : {},
		request : function(path, data, p = {}){

			return request(data, 'chat_ai', 'Messages/' + path, p)

		},

		add : function(data){

			return self.ai_messages.request('Add', data).then(function(r){

				data.id = r.id

				if(self.ai_messages.lists[data.chatId]) self.ai_messages.lists[data.chatId].push(data)

				if (data.chatId)
					self.ai_chats.quickupdate(data.chatId, '', data)

				return Promise.resolve(r.id)
			})

		},

		list : function(id, reload){

			if (self.ai_messages.lists[id] && !reload){
				return Promise.resolve(self.ai_messages.lists[id])
			}

			var d = {
				chatIdFilter : id,
				"sortFields": [
					{
					  "field": "id",
					  "order": "Asc"
					}
				]
			}

			return self.ai_messages.request('List', d).then(function(data){

				data.records = _.filter(data.records, function(r){
					return r.Status != 'DELETED'
				})

				return Promise.resolve(_.map(data.records, function(record){

					return record

				}))

			}).then(function(result) {

				self.ai_messages.lists[id] = result

				return Promise.resolve(result)
			})

		}
	}

	self.ai_chats = {

		allchats : null,

		request : function(path, data, p = {}){

			return request(data, 'chat_ai', 'Chats/' + path, p)

		},

		rate : function(requestId, Score, p = {}){
			var data = {
				"RequestId": requestId,
				"Score": Score || 1
			}

			return request(data, 'chat_ai', 'OpenAiHistory/Rate', p)
		},

		add : function(title, state){


			return self.ai_chats.request('Add', {
				title : title,
				currentState : JSON.stringify(state),
				system : self.platform
			}).then(function(r){

				self.ai_messages.lists[r.id] = []

				return Promise.resolve(r.id)
			})

		},

		update : function(data = {}){

			data = _.clone(data)

			if(data.currentState) data.currentState = JSON.stringify(data.currentState)

			return self.ai_chats.request('Update', data).then(function(r){

				self.ai_chats.quickupdate(data.id, data.title)

				return Promise.resolve(r)
			})

		},

		delete : function(id){

			return self.ai_chats.update({status : "DELETED", id : id}).then(function(data){
				return Promise.resolve(data)
			})

		},

		quickupdate : function(id, title, lastmessage){
			
			var upd = _.find(self.ai_chats.allchats || [], function(chat){
				return chat.id == id
			})

			if (upd){

				if(title) upd.title = title
				if(lastmessage) upd.lastMessage = lastmessage

			}
		},

		list : function(reload){

			if (self.ai_chats.allchats && !reload){
				return Promise.resolve(self.ai_chats.allchats)
			}

			var d = {
				pageNumber : 0,
				pageSize : 50,
				StatusFilter : "ACTIVE",
				SystemFilter : self.platform,
				sortFields : [
					{
						"field": "updated",
						"order": "DESC"
					}
				]
			}

			return self.ai_chats.request('list', d).then(function(data){

				return Promise.resolve(_.map(data.records, function(record){

					try{
						record.currentState = JSON.parse(record.currentState)
					}
					catch(e){
						console.error(e)
						record.currentState = {}
					}

					record.date = (record.updated || record.created)

					return record

				}))

			}).then(function(result){
				self.ai_chats.allchats = result

				return Promise.resolve(result)
			})

		},

		get : function(id){
			return self.ai_chats.list().then(function(result){
				var upd = _.find(result, function(r){
					return r.id == id
				})

				if	(upd){

					return self.ai_messages.list(upd.id).then(function(messages){
						return Promise.resolve({
							chat : upd,
							messages : messages
						})
					})

				}

				return Promise.reject('notfound')
			})
		}
	}

	self.paginatedrequest = paginatedrequest
	self.request = request

	return self;
}

export default ApiWrapper

