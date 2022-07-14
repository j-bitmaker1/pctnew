import f from '@/application/shared/functions.js'


var h = {
    getsearch(position, text) {
        var sposition = h.getsearchposition(position, text)

        if (!sposition) return null

        return {
            position: sposition,
            value: text.substring(sposition.start, sposition.end)

        }
    },

    getsearchposition(position, text) {

        if (!position.start || !text.length) return null

        var sposition = { start: position.start, middle: 0, end: position.end }

        var i = position.start
        var dg = false
        var br = false

        var reg = /[a-zA-Z0-9]{1}/

        sposition.middle = i

        if(i){
            do {

                var char = text[i]
    
                if (char == '@') {
    
                    if (position.start == i || (i > 0 && reg.test(text[i - 1]))) {
                        br = true
                    } else {
                        dg = true
                    }
                } else {

                    if (reg.test(char)) {
                        sposition.start = i
                    } else {

                        if (i!= position.start){
                            br = true
                        }
                            
                    }
                }
    
                i--
    
            } while (i >= 0 && i <= position.start && !dg && !br)
        }
        
        if (!dg) {
            sposition = null
        } else {

            br = false
            i = position.end

            do {

                if (text[i] && reg.test(text[i])) {
                    sposition.end = i + 1
                } else {
                    br = true
                }

                i++

            } while (i <= text.length && !br)
        }

        return sposition

    }
}

var varhelper = function(el, searher, added){

    var position = f.getCaretPosition(el)

    var vp = h.getsearch(position, el.innerText || el.value || el.nodeValue)

    if (vp) {
        var selection = f.saveSelection()

        if (el.blur){
            el.blur()
        }
        else{
            document.activeElement.blur();
        }
        //el.blur()

        searher(vp.value, (result) => {

            f.restoreSelection(selection)

            f.insertTextAtCursor(el, result, {
                left: -position.start + vp.position.start,
                right: -position.end + vp.position.end
            })

            if(added) added()

            
        })
    }
}

export default varhelper;



       