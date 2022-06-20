var XMLWriter = require('xml-writer')

import f from '@/application/shared/functions.js'
import _ from 'underscore'

class SVGMainChart {


    constructor() {
    }

    _maxV = 150;

    createSvgs = function (data, name, portfolio) {
        var result = [];
        var dataN = _.sortBy(data.scenarios, (scenario) => { return -scenario.loss });
        var ints = this.getFirstGraphCount(dataN.length);

        //console.log(ints);
        this._maxV = Math.max(Math.abs(dataN[0].loss), Math.abs(dataN[dataN.length - 1].loss));

        for (var i = 0; i < ints.length - 1; i++) {
            if (ints[i + 1] - ints[i] == 4) {
                result.push(this.make4(portfolio, dataN.slice(ints[i], ints[i + 1]), name));
            }
            else {
                result.push(this.make(portfolio, dataN.slice(ints[i], ints[i + 1]), name));
            }
        }
        return result;
    }

    getFirstGraphCount = function (len) {
        var result = [0];

        var k = 0;

        if (len == 4) {
            result.push(4);
            return result;
        }
        if (len < 16) {
            result.push(len);
            return result;
        }
        while (k < len - 23)       //15 + 7
        {
            k += 15;
            result.push(k);
        }
        if (k + 15 >= len) {
            result.push(len);
            return result;
        }
        else {                           //15 < (len - k) <= 23
            result.push(len - Math.floor(((len - k) / 2)));

            result.push(len);
            return result;
        }
    }

    make4 = function (portfolio, data, name) {

        var mode = portfolio.isModel ? 'p100' : 'd'

        //var ints = [1200000,100000,-300000,1200000,100000,-300000,1200000,100000,-300000];
        //var str = ['test1', 'test2', 'test3','test1', 'test2', 'test3','test1', 'test2', 'test3'];

        var xw = new XMLWriter;

        var _name = name;

        var result = data

        xw.startDocument();

        xw.startElement("svg", "http://www.w3.org/2000/svg");


        xw.writeAttribute("version", "1.1");
        xw.writeAttribute("class", "highcharts-root");
        xw.writeAttribute("style", "font-family:'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;");
        xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
        xw.writeAttribute("width", "2789");
        xw.writeAttribute("height", "3520");
        xw.writeAttribute("viewBox", "0 0 2789 3520");

        xw.startElement("rect");
        xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
        xw.writeAttribute("fill", "#fff");
        xw.writeAttribute("class", "highcharts-background");
        xw.writeAttribute("x", "0");
        xw.writeAttribute("y", "0");
        xw.writeAttribute("width", "2789");
        xw.writeAttribute("height", "3520");

        xw.endElement();   //<< </rect>

        xw.startElement("text");
        xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
        xw.writeAttribute("x", "1395");
        xw.writeAttribute("y", "100");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(_name);
        xw.endElement();

        xw.startElement("g");
        xw.writeAttribute("class", "highcharts-grid highcharts-yaxis-grid ");
        xw.writeAttribute("data-z-index", "1");



        xw.startElement("path");       //<<1
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 180 350 L 180 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "180");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<2
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 423 350 L 423 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "423");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (- 4 / 5 * this._maxV)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<3
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 666 350 L 666 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "666");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (-this._maxV * 3 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<4
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 909 350 L 909 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "909");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (-this._maxV * 2 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<5
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1152 350 L 1152 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1152");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (-this._maxV / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<6
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1395 350 L 1395 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1395");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text("0");
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<7
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1638 350 L 1638 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1638");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (this._maxV / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<8
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1881 350 L 1881 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1881");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (this._maxV * 2 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<9
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2124 350 L 2124 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2124");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (this._maxV * 3 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<10
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2367 350 L 2367 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2367");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (this._maxV * 4 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<11
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2610 350 L 2610 1800");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2610");
        xw.writeAttribute("y", "1850");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, 'd', (this._maxV)));
        xw.endElement();
        xw.endElement();


        xw.endElement();   //<< </g>

        for (var i = 0; i < 4; i++) {
            //console.log('id ' + result[i].id);
            var str0 = this.getText(result[i].name, 670);
            this._createG(xw, str0, result[i].loss, i, 8, result[i].id, mode);
        }


        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1395");
        xw.writeAttribute("y", "1940");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "50");
        xw.writeAttribute("fill", "#0A71E8");
        xw.writeAttribute("text-anchor", "middle");
        xw.text("$ Return by Stress Scenario");
        xw.endElement();
        xw.endElement();


        xw.endElement();

        xw.endDocument();

        return xw.toString()

    }

    make = function (portfolio, data, name) {

        var mode = portfolio.isModel ? 'p100' : 'd'

        //console.log(data);
        //var ints = [1200000,100000,-300000,1200000,100000,-300000,1200000,100000,-300000];
        //var str = ['test1', 'test2', 'test3','test1', 'test2', 'test3','test1', 'test2', 'test3'];

        var xw = new XMLWriter;

        var _name = name;

        var result = data;


        xw.startDocument();
        xw.startElement("svg", "http://www.w3.org/2000/svg");

        xw.writeAttribute("version", "1.1");
        xw.writeAttribute("class", "highcharts-root");
        xw.writeAttribute("style", "font-family:'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;");
        xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
        /*xw.writeAttribute("xmlns", "xlink", null, "http://www.w3.org/1999/xlink");*/
        xw.writeAttribute("width", "2789");
        xw.writeAttribute("height", "3520");
        xw.writeAttribute("viewBox", "0 0 2789 3520");

        xw.startElement("rect");

        xw.writeAttribute("xmlns", "http://www.w3.org/2000/svg");
        xw.writeAttribute("fill", "#fff");
        xw.writeAttribute("class", "highcharts-background");
        xw.writeAttribute("x", "0");
        xw.writeAttribute("y", "0");
        xw.writeAttribute("width", "2789");
        xw.writeAttribute("height", "3520");

        xw.endElement();

        xw.startElement("text");

        xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
        xw.writeAttribute("x", "1395"); //// convert to percents
        xw.writeAttribute("y", "100");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(_name);


        xw.endElement();

        xw.startElement("g");

        xw.startElement("path");       //<<1
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 180 350 L 180 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "180");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<2
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 423 350 L 423 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "423");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV * 4 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<3
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 666 350 L 666 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "666");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV * 3 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<4
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 909 350 L 909 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "909");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV * 2 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<5
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1152 350 L 1152 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1152");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (-this._maxV / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<6
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1395 350 L 1395 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1395");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, 0));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<7
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1638 350 L 1638 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1638");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (this._maxV / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<8
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 1881 350 L 1881 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1881");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (this._maxV * 2 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<9
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2124 350 L 2124 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2124");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (this._maxV * 3 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<10
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2367 350 L 2367 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2367");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (this._maxV * 4 / 5)));
        xw.endElement();
        xw.endElement();

        xw.startElement("path");       //<<11
        xw.writeAttribute("fill", "none");
        xw.writeAttribute("stroke", "rgb(228, 221, 222)");
        xw.writeAttribute("stroke-width", "5");
        xw.writeAttribute("data-z-index", "1");
        xw.writeAttribute("class", "highcharts-grid-line");
        xw.writeAttribute("d", "M 2610 350 L 2610 3300");
        xw.writeAttribute("opacity", "1");
        xw.endElement();

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "2610");
        xw.writeAttribute("y", "3350");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "40");
        xw.writeAttribute("text-anchor", "middle");
        xw.text(f.values.format(null, mode, (this._maxV)));
        xw.endElement();
        xw.endElement();


        xw.endElement();   //<< </g>


        //console.log(this.getTextWidth(' ', "italic 50px Segoe UI").toString());

        for (var i = 0; i < result.length; i++) {
            //console.log('id ' + result[i].id);
            var str0 = this.getText(result[i].name, 670);
            this._createG(xw, str0, result[i].loss, i, result.length, result[i].id, mode);
            //console.log(this.getTextWidth(result[i].name, "italic 50px Segoe UI").toString());
        }

        xw.startElement("g");
        xw.startElement("text");
        xw.writeAttribute("x", "1395");
        xw.writeAttribute("y", "3440");
        xw.writeAttribute("font-family", "Segoe UI");
        xw.writeAttribute("font-size", "50");
        xw.writeAttribute("fill", "#0A71E8");
        xw.writeAttribute("text-anchor", "middle");
        xw.text("$ Return by Stress Scenario");
        xw.endElement();
        xw.endElement();

        xw.endElement();

        xw.endDocument();

        return xw.toString()

    }

    _createG = function (xw, c, v, k, count, id, mode) {

        if (v >= 0) {
            xw.startElement("g");

            xw.startElement("rect");
            xw.writeAttribute("x", "1395");
            xw.writeAttribute("y", (400 + 3 * k * 2800 / ((count * 3) - 1)).toString().replace(',', '.'));
            xw.writeAttribute("width", (1215 * (v / this._maxV)).toString().replace(',', '.'));
            xw.writeAttribute("height", (2 * 2800 / ((count * 3))).toString().replace(',', '.'));
            xw.writeAttribute("rx", "20");
            xw.writeAttribute("ry", "20");
            if (id != -1 && id != -2) {
                xw.writeAttribute("fill", "#04B229");
            }
            else {
                xw.writeAttribute("fill", "#f2c94c");
            }
            xw.writeAttribute("fill-opacity", "0.98");
            xw.endElement();

            xw.startElement("rect");
            xw.writeAttribute("x", "927");
            xw.writeAttribute("y", (((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
            xw.writeAttribute("width", "450");
            xw.writeAttribute("height", "120");
            xw.writeAttribute("rx", "20");
            xw.writeAttribute("ry", "20");
            xw.writeAttribute("fill", "White");
            xw.writeAttribute("stroke-width", "3");
            xw.writeAttribute("stroke", "#0A71E8");
            xw.endElement();

            xw.startElement("text");
            xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#0A71E8;");
            xw.writeAttribute("x", "1152");
            xw.writeAttribute("y", (79 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
            xw.writeAttribute("text-anchor", "middle");
            xw.text(f.values.format(null, mode, v));        // $
            xw.endElement();


            if (c.length == 1) {
                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "900");
                xw.writeAttribute("y", (75 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "end");
                xw.text(c[0]);
                xw.endElement();
            }
            else {
                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "900");
                xw.writeAttribute("y", (45 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "end");
                xw.text(c[0]);
                xw.endElement();

                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "900");
                xw.writeAttribute("y", (105 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "end");
                xw.text(c[1]);
                xw.endElement();
            }

            xw.endElement();
        }
        else {
            xw.startElement("g");

            xw.startElement("rect");
            xw.writeAttribute("x", (1395 - (1215 * (-v / this._maxV))).toString().replace(',', '.'));
            xw.writeAttribute("y", (400 + 3 * k * 2800 / ((count * 3) - 1)).toString().replace(',', '.'));
            xw.writeAttribute("width", (1215 * (-v / this._maxV)).toString().replace(',', '.'));
            xw.writeAttribute("height", (2 * 2800 / ((count * 3))).toString().replace(',', '.'));
            xw.writeAttribute("rx", "20");
            xw.writeAttribute("ry", "20");
            xw.writeAttribute("fill", "#FF1F3C");
            xw.writeAttribute("fill-opacity", "0.98");
            xw.endElement();

            xw.startElement("rect");
            xw.writeAttribute("x", "1413");
            xw.writeAttribute("y", (((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
            xw.writeAttribute("width", "450");
            xw.writeAttribute("height", "120");
            xw.writeAttribute("rx", "20");
            xw.writeAttribute("ry", "20");
            xw.writeAttribute("fill", "White");
            xw.writeAttribute("stroke-width", "3");
            xw.writeAttribute("stroke", "#0A71E8");
            xw.endElement();

            xw.startElement("text");
            xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#0A71E8");
            xw.writeAttribute("x", "1638");
            xw.writeAttribute("y", (79 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
            xw.writeAttribute("text-anchor", "middle");
            xw.text(f.values.format(null, mode, v));             // $
            xw.endElement();


            if (c.length == 1) {
                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "1890");
                xw.writeAttribute("y", (75 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "start");
                xw.text(c[0]);
                xw.endElement();
            }
            else {
                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "1890");
                xw.writeAttribute("y", (45 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "start");
                xw.text(c[0]);
                xw.endElement();

                xw.startElement("text");
                xw.writeAttribute("style", "font-size: 4.50em;font-weight: 400;fill:#000;");
                xw.writeAttribute("x", "1890");
                xw.writeAttribute("y", (105 + ((2 * 2800 / ((count * 3))) - 120) / 2 + (400 + 3 * k * 2800 / ((count * 3) - 1))).toString().replace(',', '.'));
                xw.writeAttribute("text-anchor", "start");
                xw.text(c[1]);
                xw.endElement();
            }

            xw.endElement();
        }
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
                //console.log(ss[i]);
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

}

export default SVGMainChart