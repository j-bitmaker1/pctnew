import Core from "../src/application/index.js";

var init = function(){

    var core = new Core(this, {vxstorage, i18n});

    core.init();

    console.log("INIT CORE")

    return core.user.signin({
        password_value : 'qwerty1234',
        login_value : 'maximgrishkov@yandex.ru',
    }).then(() => {

        console.log("INIT CORE SUCCESS")

        return core
    }).catch(e => {

        console.log(e)

        return Promise.reject(e)
    })

    /*core.initWithUser().then((r) => {
            
        })
        .catch((g) => {});*/

    /*core.user.state.is().then(state => {
        
    })*/
}

export default {
    init
}
