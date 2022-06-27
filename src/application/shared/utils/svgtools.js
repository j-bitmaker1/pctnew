import { svg2png } from 'svg-png-converter'

import _ from 'underscore'

class SVGTools {

    constructor() {
    }

    getText = function (text, size) {
        // re-use canvas object for better performance
        var ss = text.split(' ');
        var ww = this.getTextWidth(ss[0], "italic 50px Segoe UI");
        var resultSS = [];
        var sn = ss[0];
        for (var i = 1; i < ss.length; i++) {
            var wn = this.getTextWidth(ss[i], "italic 50px Segoe UI");
            if (wn + ww + 13.7 > size) {
                ww = wn;
                resultSS.push(sn);
                sn = ss[i];
            }
            else {
                sn += ' ' + ss[i];
                ww += wn + 13.7;
            }
        }
        resultSS.push(sn);
        return resultSS;
    }

    getTextWidth = function (text, font) {
        // re-use canvas object for better performance
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    topng = function (xml, size) {
        return svg2png({
            input: xml,
            encoding: 'dataURL',
            format: 'jpeg',
            multiplier: size.width / 2789,
            quality: .5
        })
    }

}

export default SVGTools