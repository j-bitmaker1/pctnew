var _ = require('underscore');

var errors = {
    500 : 'networkerror',
    401 : 'unauthorized',
    511 : 'needcredentials',
    527 : 'emptyresponse',

    600 : "Wrong token",
    601 : "Can not login",
    602 : "Empty response"
}

function error(code, _error){
    return {
        code,
        error : _error || errors[code] || "undefined",
        isError : true
    }
}

function byError(_error){

    if(!_error) return null

    var code = _.findKey(errors, text => {
        return text == _error
    })

    if (code){
        return error(code)
    }

    return _error

   
}

var parseerror = function(_error = {}){

    var message = ''

    if(!_.isObject(_error)) message = _error
    else message = _error.errors || _error.error || _error.Error

    if(!_error.code) _error.code = 500

    if (_error.Message){

        var message = _error.Message

        try{
            var m = JSON.parse(_error.Message)

            if (m.type && m.type.indexOf('tools.ietf.org') > -1){

                if(m.errors){
                    message = _.toArray(m.errors).join('; ')
                }
                else{
                    message = m.title
                }

            }
        }
        catch(e){

        }
    }

 

    return error(_error.code, message)

    /* 
    
    Message: "{\"type\":\"https://tools.ietf.org/html/rfc7231#section-6.5.1\",\"title\":\"One or more validation errors occurred.\",\"status\":400,\"traceId\":\"00-8e1868a98d29a5d9a59276d62a9fcc06-09441672900a5d12-01\",\"errors\":{\"Name\":[\"The Name field is required.\"]}}"
    code: 400
    
    */

}

export {
    error,
    byError,
    parseerror 
}