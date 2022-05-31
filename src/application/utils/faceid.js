import f from './functions'

class FaceId {
	constructor(core){

		this.core = core
		this.store = this.core.store
        this.key = 'authorization'

	}


	setfaceid(password){

        return this.faceidAvailable().then(() => {
            return new Promise((resolve, reject) => {

                window.plugins.touchid.save(this.key, password, true, function() {
                    resolve()
                }, () => {
                    reject()
                });

            })
        })
        
	}
    /// unauthorize and delete
	deletefaceid(){

        return this.hasFaceid().then(() => {
            return new Promise((resolve, reject) => {

                window.plugins.touchid.delete(this.key, function() {
                    resolve()
                }, () => {
                    reject()
                });

            })
        }).catch(e => {

            if(e == 'notavailable' || e == 'notset') return Promise.resolve()

            return Promise.reject()

        })

       
	}

	faceidAvailable(){

		return new Promise((resolve, reject) => {
			if (window.plugins && window.plugins.touchid) {
				window.plugins.touchid.isAvailable(function(biometryType) {

					resolve(biometryType)
	
				}, function(){
					reject('notavailable')
				})
			}
			else{
				reject('notavailable')
			}
		})

		
	}

	hasFaceid(){
		return this.faceidAvailable().then(type => {

			return new Promise((resolve, reject) => {

				window.plugins.touchid.has(this.key, function() {
					resolve()
				}, function() {
					reject('notset')
				});

			})

		})
	}

	faceid(){

		return this.hasFaceid().then(type => {
			window.plugins.touchid.verify(this.key, (type === "face") ? "Face ID" : "Touch ID", function(password) {
				
			}, function(){
				
			});
		})

		if (window.plugins && window.plugins.touchid) {
			

			window.plugins.touchid.isAvailable(function(biometryType) {

				var serviceName = (biometryType === "face") ? "Face ID" : "Touch ID";

				window.plugins.touchid.has("MyKey", function() {
					alert(serviceName + " avaialble and Password key available");
				}, function() {
					alert(serviceName + " available but no Password Key available");
				});

			}, function(msg) {
				alert("no Touch ID available");
			});
			
			/*if (window.plugins) {
				window.plugins.touchid.verify("MyKey", "My Message", function(password) {
					alert("Touch " + password);
				});
			}
			
			if (window.plugins) {
				window.plugins.touchid.save("MyKey", "My Password", true, function() {
					alert("Password saved");
				});
			}
			
			if (window.plugins) {
				window.plugins.touchid.delete("MyKey", function() {
					alert("Password key deleted");
				});
			}*/
		}
		else{
			return Promise.reject('notavailable')
		}
	}


}

export default FaceId