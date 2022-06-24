import f from '@/application/shared/functions.js'

import Condition from './condition.js'

var h = {
    getsearch(position, text) {
        var sposition = h.getsearchposition(position, text)

        if (!sposition) return null

        return {
            position: sposition,
            value: text.substring(sposition.start, sposition.middle)

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
                } else br = true
            }

            i--

        } while (i >= 0 && i <= position.start && !dg && !br)

        if (!dg) {
            sposition = null
        } else {

            br = false
            i = position.end

            do {
                if (!text[i] || reg.test(text[i])) {
                    sposition.end = i
                } else {
                    br = true
                }

                i++

            } while (i <= text.length && !br)
        }

        return sposition

    }
}

var PluginFactory = function (core) {
    return {
        Condition,
        Variables: class Variables {
            constructor({ data, api }) {
                this.api = api;

                this.api.listeners.on(api.ui.nodes.redactor, 'keyup', this.keyup.bind(this), false);
            }

            render() {
                const button = document.createElement('button');

                button.type = 'button';
                button.innerHTML = '<i class="fas fa-at"></i>';

                return button;
            }

            surround(range) {
                console.log('surround', range)
            }

            checkState(selection) {
                console.log('selection', selection)
            }

            apply(el) {
                var position = f.getCaretPosition(el)

                var vp = h.getsearch(position, el.innerText)

                if (vp) {
                    var selection = f.saveSelection()

                    core.vueapi.searchAssets((asset) => {

                        f.restoreSelection(selection)

                        f.insertTextAtCursor(el, asset.name, {
                            left: -position.start + vp.position.start,
                            right: -position.end + vp.position.end
                        })

                    }, null, vp.value)
                }
            }

            keyup(evt) {

                console.log("THI", this)

                this.apply(evt.target)

            }

            destroy() {
                this.api.listeners.off(api.ui.nodes.redactor, 'click', this.keyup, false);
            }
        }
    }
}

export default PluginFactory