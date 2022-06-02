//import { SVG } from '@svgdotjs/svg.js'
var XMLWriter = require('xml-writer')
import {svg2png} from 'svg-png-converter'

import f from '@/application/functions'
import _ from 'underscore'

class SVGCreator {


    constructor(){
    }

    make = function(size){

        var xw = new XMLWriter;

        var _name = '12'

        xw.startDocument();
        xw.startElement("svg", "http://www.w3.org/2000/svg");

            xw.writeAttribute("version", "1.1");
            xw.writeAttribute("class", "highcharts-root");
            xw.writeAttribute("style", "font-family:'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;");
            xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
            /*xw.writeAttribute("xmlns", "xlink", null, "http://www.w3.org/1999/xlink");*/
            xw.writeAttribute("width", size.width);
            xw.writeAttribute("height", size.height);
            xw.writeAttribute("viewBox", "0 0 "+size.width+" "+size.height+"");

            xw.startElement("rect");

                xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
                xw.writeAttribute("fill", "#fff");
                xw.writeAttribute("class", "highcharts-background");
                xw.writeAttribute("x", "0");
                xw.writeAttribute("y", "0");
                xw.writeAttribute("width", size.width);
                xw.writeAttribute("height", size.height);

            xw.endElement();

            xw.startElement("text");

                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "1395"); //// convert to percents
                xw.writeAttribute("y", "100");
                xw.writeAttribute("text-anchor", "middle");
                xw.text(_name);

            xw.endElement();

       
        xw.endDocument();

        console.log('xw.toString()', xw.toString())

        return xw.toString()
       
    }

    topng = function(xml, size){
 
        return svg2png({ 
            input: xml, 
            encoding: 'dataURL', 
            format: 'jpeg',
            width: size.width,
            height: size.height,
            multiplier: .7,
            quality: .5
        })
    }
    
}

export default SVGCreator