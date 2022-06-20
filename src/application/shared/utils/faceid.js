
class FaceId {
	constructor(){

        this.key = 'authorization'

	}


	set(password){

        return this.available().then(() => {
            return new Promise((resolve, reject) => {

                window.plugins.touchid.save(this.key, password, function() {
                    resolve()
                }, () => {
                    reject()
                });

            })
        })
        
	}
    /// unauthorize and delete
	remove(){
        return this.has().then(() => {
            return new Promise((resolve, reject) => {

                window.plugins.touchid.delete(this.key, function() {
                    resolve()
                }, (e) => {
					console.error(e)
                    reject(e)
                });

            })
        }).catch(e => {

            if(e == 'notavailable' || e == 'notset') return Promise.resolve()

            return Promise.reject()

        })

       
	}

	available(){

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

	has(){
		return this.available().then(type => {

			return new Promise((resolve, reject) => {

				window.plugins.touchid.has(this.key, function() {
					resolve()
				}, function() {
					reject('notset')
				});

			})

		})
	}

	verify(){

		return this.has().then(type => {

			return new Promise((resolve, reject) => {
				window.plugins.touchid.verify(this.key, (type === "face") ? "Face ID" : "Touch ID", function(password) {
					resolve(password)
				}, function(){
					reject('verify')
				});
			})

			
		})

		
	}


}

export default FaceId