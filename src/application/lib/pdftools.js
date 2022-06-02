import f from '@/application/functions'
import _ from "underscore"
import moment from 'moment'

var lazyEach = function(p){

    var progressMap = {
        "after" : ["success", "fail", "after"]
    }

    var failbool = false;

    var progressIncrease = function(name){

        if(name == "fail") failbool = true;

        var newName;

        _.find(progressMap, function(item, _name){
            if(_.indexOf(item, name) > -1){
                newName = _name;
                return true;
            }
        })

        if(newName){
            if(!i[newName]) i[newName] = 0;

            i[newName]++;
        }
    }

    var calcProgress = function(i){
        return _.reduce(i, function(sum, value){
            return sum + value;
        }, 0)
    }

    var go = function(index){
        var each = extendFunctions(p.array[index], p.each, index);

        each.item = p.array[index];

        p.action(each, index);
    }

    var extendFunctions = function(item, each, index){
        var newEach = {};


        _.each(each, function(_each, name){

            if(typeof _each === 'function' && (name == "success" || name == "fail" || name == "after" ))
            {
                newEach[name] = function(){

                    var _arguments = arguments;

                    var callback = function(){

                        var proggressend = function(){

                            if(p.all.success &&    !failbool) 	p.all.success(p);
                            if(p.all.fail &&  		failbool) 	p.all.fail(p);

                            //else
                            if(p.all.after) p.all.after(p);
                        }

                        progressIncrease(name);
                        progress = calcProgress(i);

                        _each(item, progress, l, _arguments, index);

                        if(p.sync)
                        {

                            if(p.array[index + 1])
                            {
                                go(index + 1);
                            }
                            else
                            {
                                proggressend();
                            }
                        }
                        else
                            if(progress == l) proggressend();
                    }

                    if(!p.syncCallbacks || progress >= index || p.sync)
                    {

                        callback();
                    }
                    else
                    {
                        var interval = setInterval(function(){

                            if(progress >= index)
                            {
                                callback();
                                clearInterval(interval);
                            }

                        },10)
                    }
                }
            }
            else
            {
                newEach[name] = _each;
            }
        })

        return newEach;
    }

    if(!p) p = {};

    p.array || (p.array = []);
    p.each || (p.each = {});
    p.all || (p.all = {});

    p.each.success || (p.each.success = function(){});
    p.each.fail || (p.each.fail = function(){});

    if (!p.array || p.array.length == 0)
    {
        if (p.all.success)
        {
            p.all.success();
        }

        return;
    }

    var l = p.array.length,
        i = {};

    var progress = 0;

    if (p.all.before)
        p.all.before(p);

    if(!p.sync)
    {
        _.each(p.array, function(item, index){
            go(index)
        })
    }
    else
    {
        go(0);
    }
}

var Tools = function(p, data){

    if(!p) p = {};

    var pageSizes = p.pageSizes
    var doc = p.doc;
    var key = 0;

    var self = this;

    self.glossary = {};
    self.data = data || {};

    self.logotype = p.parent.logotype

    self.tables = {
        one : function (body) {

            var table = {
                layout: {
                    vLineWidth: function (i, node) {

                        if (i === 0 || i === node.table.widths.length)
                            return 0;
                        else
                            return 1;

                    },
                    vLineColor: function (i) {
                        return "#2E69F7";
                    },
                    hLineWidth: function (i) {
                        return 0;
                    },
                    paddingLeft: function (i) {
                        return i && 6 || 0;
                    },
                    paddingRight: function (i, node) {
                        return (i < node.table.widths.length - 1) ? 6 : 0;
                    },
                },
                table: {
                    widths: ["*"],

                    body: body
                }
            }

            return table
        },

        nobp : function (p) {
            if(!p)
                p = {};

            return {
                pageBreak: p.pageBreak || null,
                layout: {
                    vLineWidth: function (i, node) {
                        return 0;
                    },

                    hLineWidth: function (i) {
                        return 0;
                    },

                    paddingLeft: function (i) {
                        return 0;
                    },
                    paddingRight: function (i, node) {
                        return 0;
                    },

                    paddingTop: function (i) {
                        return 0;
                    },
                    paddingBottom: function (i, node) {
                        return 0;
                    }
                },
                margin: p.margin,
                table: {
                    widths: p.widths,
                    heights : p.heights,
                    body: p.body
                }
            }
        },

        standart : function (p) {
            if(!p)
                p = {};

            return {
                pageBreak: p.pageBreak || null,
                layout: p.layout || {
                    vLineWidth: function (i, node) {

                        if (i === 0 || i === node.table.widths.length)
                            return 0;
                        else
                            return 0.5;

                    },
                    vLineColor: function (i) {
                        return "#999";
                    },
                    hLineWidth: function (i) {
                        return 0;
                    },
                    hLineColor: function (i) {
                        return "#999";
                    },
                    paddingLeft: function (i) {
                        return i && 6 || 0;
                    },
                    paddingRight: function (i, node) {
                        return (i < node.table.widths.length - 1) ? 6 : 0;
                    },
                },
                margin: p.margin || [0, 10, 0, 0],
                table: {
                    heights : p.heights,
                    widths: p.widths,
                    style : "table",
                    body: p.body
                }
            }
        }
    }

    self.compose = function(ar){

        if(!ar) return

        if(_.isArray(ar)){
            _.each(ar, (a) => {
                self.compose(a)
            })

            return
        }

        console.log("AR", ar)

        if (ar.cnt){
            self.compose(ar.cnt)
        }
        else
        {
            doc.content.push(ar)
        }

    }

    self.canvas = function (w, h) {

        var printing = document.getElementById("printing");

        var canvas = document.createElement('canvas');
            canvas.id = "printingCanvas";
            canvas.width = w;
            canvas.height = h;

        printing.appendChild(canvas)

        var element = document.getElementById("printingCanvas");

            ctx = element.getContext('2d');

            element.height = h;
            element.width = w;

        return {
            element: element,
            ctx: ctx
        };
    }

    self.figures = {
        round : function(p, _p){

            _p || (_p = {});
            _p.w || (_p.w = 200);
            _p.h || (_p.h = 200);

            var c = self.canvas(_p.w, _p.h);
            var ctx = c.ctx;
            var element = c.element;


            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            ctx.fillStyle = _p.color;

            ctx.globalAlpha = _p.opacity;

            ctx.arc(element.width/2, element.height/2, _p.size * element.width/2, 0, 2*Math.PI);

            ctx.stroke();
            ctx.fill();

            
            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image
        },
        imageInRound : function(p, url, clbk){

            var fail = function(){
                var i = self.figures.round(p, {
                    color : "#FFF",
                    opacity : 1,
                    size : 1,
                    w : p.w,
                    h : p.h
                })

                if (clbk)
                    clbk(i)
            }

            if(!url)
            {
                fail();

                return;
            }

            var secured_url;
            /*	if (url.indexOf("https://") == 0) {
                secured_url = url;
            } else {*/
                // remove the protocol from the passed-in url
                secured_url = "//images.weserv.nl/?url=" + url.substring(7) + "&h=100";
            //}

            var img = document.createElement("img");
                img.setAttribute('crossOrigin', 'anonymous');

                img.src = secured_url;

            img.onload = function() {
                var c = self.canvas(p.w, p.h);
                var ctx = c.ctx;
                var element = c.element;

                var minsize = img.width;

                if(img.height < img.width) minsize = img.height

                element.width = minsize;
                element.height = minsize;

                ctx.beginPath();
                ctx.arc(minsize/2, minsize/2, minsize/2, 0, Math.PI * 2, true);
                ctx.clip();

                ctx.drawImage(img, (minsize - img.width) / 2, (minsize - img.height) / 2);

                var image = element.toDataURL('image/jpeg');

                    element.remove()
                    
                if (clbk)
                    clbk(image)

                    img.remove();
                    element.remove();
            }

            img.onerror = function(){
                fail();
            }

        },
        arrow: function (color) {

            var w = 30,
                h = 100;


            var c = self.canvas(w, h);
            var ctx = c.ctx;
            var element = c.element;

            var path1 = [0, 0, w - 3, h / 2, 0, h];
            var path2 = [3, 0, w, h / 2, 3, h];


            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            ctx.fillStyle = color;
            ctx.globalAlpha = 1;

            ctx.beginPath();

            for (var item = 0; item < path1.length - 1; item += 2) {

                ctx.lineTo(path1[item], path1[item + 1])

            }

            ctx.closePath();

            ctx.beginPath();

            for (var item = 0; item < path2.length - 1; item += 2) {

                ctx.lineTo(path2[item], path2[item + 1])

            }

            ctx.closePath();
            ctx.fill();

            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image

        },
        labelInSqare : function(bg, label, _p){

            _p || (_p = {});
            _p.w || (_p.w = 60);
            _p.h || (_p.h = 60);

            var c = self.canvas(_p.w, _p.h);
            var ctx = c.ctx;
            var element = c.element;

            var poly = [
                0, 0,
                _p.w, 0,
                _p.w, _p.h,
                0, _p.h
            ];

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            ctx.fillStyle = bg;
            ctx.globalAlpha = 1;

            ctx.beginPath();

            for (var item = 0; item < poly.length - 1; item += 2) {

                ctx.lineTo(poly[item], poly[item + 1])

            }

            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.font = (_p.font || "10") + "pt Arial";

            ctx.fillText(label, _p.w / 2, _p.h / 2 + (_p.font || "10") / 2);

            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image
        },
        scoreRound : function(score, color, _p){

            _p || (_p = {});
            _p.w || (_p.w = 160);
            _p.h || (_p.h = 160);

            var c = self.canvas(_p.w, _p.h);
            var ctx = c.ctx;
            var element = c.element;


            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            var gradient = ctx.createLinearGradient(0, 10, 0, 100);


            gradient.addColorStop(0, "#FAF9F9");
            gradient.addColorStop(1, "#fff");

            ctx.fillStyle = gradient;
            ctx.globalAlpha = 1;

            ctx.shadowColor = "#bbbbbb";
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;

            ctx.arc(0.9 * element.width / 2, element.height/2, 0.9 * element.width / 2, 0, 2 * Math.PI);

            //ctx.stroke();
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.font = (_p.font || "30") + "pt Arial";

            ctx.fillText(score, (0.9 * _p.w) / 2, _p.h / 2 + (_p.font || "30") / 2);

            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image
        },
        bar: function (color, _bh, label, _p, negativeall, negative) {

            _p || (_p = {});
            _p.w || (_p.w = 60);
            _p.h || (_p.h = 120);

            _p.labelColor || (_p.labelColor = "#020202")

            var c = self.canvas(_p.w, _p.h);
            var ctx = c.ctx;
            var element = c.element;

            var bh = _bh * _p.h * .8

            var poly = [
                0, _p.h - bh,
                _p.w, _p.h - bh,
                _p.w, _p.h,
                0, _p.h
            ];

            if (negativeall == 'medium'){
                bh = _bh * _p.h * .7
            }

            if (negativeall == 'negative'){
                poly = [
                    0, 0,
                    _p.w, 0,
                    _p.w, bh,
                    0, bh
                ]
            }

            if (negativeall == 'medium'){

                if(negative){

                    poly = [
                        0, _p.h / 2,
                        _p.w, _p.h / 2,
                        _p.w, _p.h / 2 + bh / 2,
                        0, _p.h / 2 + bh / 2
                    ]

                }
                else{
                    poly = [
                        0, _p.h / 2 - bh / 2,
                        _p.w, _p.h / 2 - bh / 2,
                        _p.w, _p.h / 2,
                        0, _p.h / 2
                    ]
                }

            }


            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            ctx.fillStyle = color;
            ctx.globalAlpha = 1;

            ctx.beginPath();

            for (var item = 0; item < poly.length - 1; item += 2) {

                ctx.lineTo(poly[item], poly[item + 1])

            }

            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = _p.labelColor;
            ctx.textAlign = "center";
            ctx.font = p.font || "18pt Arial";

            var y = _p.h - bh - 18;

            if (negativeall == 'negative'){
                y = bh + 28;
            }

            if (negativeall == 'medium'){

                if(negative){

                    y = _p.h / 2 + bh / 2  + 28;

                }
                else{
                    y = _p.h / 2 - bh / 2 - 18;
                }

            }

            ctx.fillText(label, _p.w / 2, y);

            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image
        },
        parallelogramm: function (color, bg) {

            var w = 120,
                h = 100,
                s = 15;

            var c = self.canvas(w, h);
            var ctx = c.ctx;
            var element = c.element;

            var poly = [s, 0, 0, h, w - s, h, w, 0];


            ctx.fillStyle = bg || "#fff";
            ctx.fillRect(0, 0, element.width, element.height);

            ctx.fillStyle = color;
            ctx.globalAlpha = 1;

            ctx.beginPath();

            for (var item = 0; item < poly.length - 1; item += 2) {

                ctx.lineTo(poly[item], poly[item + 1])

            }

            ctx.closePath();
            ctx.fill();

            var image = element.toDataURL('image/jpeg');

                element.remove()

            return image
        }
    }

    self.add = {
        noteline : function(p){
            p.text = "___________________________";
            p.style = "note";

            doc.content.push(p);
        },
        notekey : function(obj, index){

            key++;

            if(obj.text){
                var text = _.clone(obj.text);

                delete obj.text;

                var notekey = {
                    layout: {
                        hLineWidth: function(i) { return 0; },
                        vLineWidth: function(i) { return 0; },
                        paddingLeft: function(i) { return 0; },
                        paddingRight: function(i) { return 0; },
                    },
                    table : {
                        body: [
                            [{
                                text : text,
                                margin: [0, 2, 0, 0],
                            },{
                                text : key.toString(),
                                style : 'notekey',
                                margin: [2, 0, 0, 0],
                            }]
                        ]
                    }
                };

                obj = _.extend(obj, notekey);

                if(obj.alignment == "center") self.helpers.center(obj);

                return obj

            }
        },

        sup : function(obj, sup, index){

            if(obj.text){
                var text = _.clone(obj.text);

                delete obj.text;

                var notekey = {
                    layout: {
                        hLineWidth: function(i) { return 0; },
                        vLineWidth: function(i) { return 0; },
                        paddingLeft: function(i) { return 0; },
                        paddingRight: function(i) { return 0; },
                    },
                    table : {
                        body: [
                            [{
                                text : text,
                                margin: [0, 2, 0, 0],
                            },{
                                text : sup,
                                style : 'notekey',
                                margin: [2, 0, 0, 0],
                            }]
                        ]
                    }
                };

                obj = _.extend(obj, notekey);

                if(obj.alignment == "center") self.helpers.center(obj);

                return obj
            }
        }
    }

    self.helpers = {
        partOfPage : function(n, k){

            if(!k) k = 'h'

            var koe = f.deep(pageSizes, data.meta.pageSize + '.k.' + k) || 1;

            return  n / koe
        },
        sizeByPage : function(n, k){

            if(!k) k = 'h'
            
            var koe = f.deep(pageSizes, data.meta.pageSize + '.k.' + k) || 1;


            return koe * n
        },
        center : function(obj){

            var table = obj.table;

            delete obj.table;

            var tobj = {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 'auto',
                        table: table,
                        layout: obj.layout
                    },
                    { width: '*', text: '' },
                ]
            }

            obj = _.extend(obj, tobj);

        },

        tables : function(p, clbk){

            var bodies = [];
            var tables = [];
            var pages = -1;
            var index = 0;

                p.rowsInTable || (p.rowsInTable = 18);
                p.pageOffset || (p.pageOffset = 0)

            return new Promise((resolve, reject) => {
                lazyEach({
                    array : p.array,
                    action : function(_p){
                        _p.item;
    
                        var _owsInTable = p.rowsInTable;
    
                        if (pages < 1){
                            _owsInTable = p.rowsInTable * (100 - p.pageOffset) / 100
                        }
    
    
                        if(index >= _owsInTable || index == 0)
                        {
                            bodies.push(p.body(index))
    
                            pages++;
    
                            index = 0;
                        }
    
                        var body = bodies[bodies.length - 1];
    
                        p.row({
    
                            item : _p.item,
                            index : index,
                            pages : pages
    
                        }, function(row){
    
                            body.push(row)
    
                            index++;
    
                            if (_p.success)
                                _p.success();
                        })
    
    
    
                    },
                    sync : true,
    
                    all : {
                        success : function(){
    
                            _.each(bodies, function(body,i){
    
                                var t = p.table(body,i)
    
                                if (i != 0)
                                {
                                    t.pageBreak = 'before';
                                }
                                else
                                {
    
    
                                }
    
                                tables.push(t);
                            })
    
                            var _pp = 500;
                            if (bodies.length > 0) {
                                _pp = 100 * ((bodies[bodies.length - 1].length) / p.rowsInTable)
                            }
    
                            if(!pages) _pp = _pp + p.pageOffset


                            resolve({
                                tables,
                                pageOffset : _pp
                            })
                        }
                    }
                })
            })
            
        },

        caption : function(obj){


            var body = [[obj]];

            var ct = self.tables.one(body)

            if(obj.style == 'h3'){
                ct.layout.hLineWidth = function(i, node){
                    if(i == 1) return 0.5;

                    return 0
                }

                ct.layout.hLineColor = function() {
                    return '#000043';
                }
            }

            return ct;
        }
    }

    self.fontCorrection = function(string) {

        var fontMapping = {
            ': x-small;\"': ': 6px;\"',
            ': small;\"': ': 7px;\"',
            ': medium;\"': ': 8px;\"',
            ': large;\"': ': 9px;\"',
            ': x-large;\"': ': 11px;\"',
        }

        var changeStr = string || '';

        _.each(_.keys(fontMapping), function(font) {
            changeStr = changeStr.replaceAll(font, fontMapping[font]);
        });

        return changeStr;
    }

    self.doc = doc

    return self;
}

var PDFTools = function(p = {}, data = {}){

    var self = this
    var logo = p.logo

    var pageSizes = {

        LETTER : {
            key : "LETTER",
            k : {
                h : 0.93,
                w : 1.02
            }
        },
        A4 : {
            key : "A4",
            k : {
                h : 1,
                w : 1
            }
        }
    }

    var template = function(){

        return self.logotype.insert().then((_logo) => {
            var tpl = {
    
                content : [],
    
                pageMargins: [40, 50, 40, 35],
    
                header: function(currentPage, pageCount) {
    
                    var logo = _.clone(_logo.logo)
    
                    logo.margin = [40, 20, 0, 0];
    
                    var c1 = logo;
                    var c2 = {
                        text: [
                            {
                                text : data.meta.headers.first + "\n",
                                color : '#000043',
                                bold: false,
                                fontSize: 8,
                            },
                            {
                                text : data.meta.headers.second,
                                color : '#00008b',
                                bold: false,
                                fontSize: 8,
                            },
                        ],
    
                        margin: [0, 25, 40, 0],
    
                        alignment: 'right',
                    };
    
                    if(currentPage == 1) {c2 = ''; c1 = '';}
    
                    return {
                        columns: [c1, c2]
                    }
                },
                footer: function(currentPage, pageCount) {
                    if(currentPage != 1)
                    return {
                        columns : [{
                                text: data.meta.padgeFooter,
                                alignment: 'left',
                                fontSize: 6,
                                italics: true,
                                margin: [40, 0, 0, 0],
                                width: 400,
                            },{
                                text: 'Page ' + currentPage + ' of ' + pageCount,
                                alignment: 'right',
                                fontSize: 8,
                                italics: true,
                                width: "*",
                                margin: [0, 0, 40, 0],
                            }
                        ]
                    };
    
                },
                styles : {
                    bigtext : {
                        fontSize: 9,
                    },
                    text : {
                        fontSize: 8,
                    },
                    table : {
                        fontSize: 7,
                    },
                    small : {
                        fontSize: 6,
                    },
                    h1: {
                        fontSize: 18,
                        bold: true,
                        alignment : "center",
                        margin: [0, 10, 0, 10],
                        color : "#FA0076"
                    },
                    h2: {
                        fontSize: 14,
                        color: '#2C2C2C',
                        alignment : "center",
                        margin: [0, 10, 0, 10]
                    },
                    h3: {
                        fontSize: 12,
                        bold: true,
                        color: '#000043',
                        alignment : "left",
                        margin: [0, 10, 0, 5]
                    },
                    h4: {
                        fontSize: 8,
                        bold: true,
                        color: '#FF0A26',
                        alignment : "left",
                        margin: [0, 0, 0, 5]
                    },
                    h5: {
                        fontSize: 8,
                        bold: true,
                        color : '#41434B',
                        alignment : "center",
                        margin: [0, 0, 0, 5]
                    },
                    symbol : {
                        color : '#00347A',
                        bold : true
                    },
                    weight : {
                        color : '#515B6A',
                        bold : true
                    },
                    coinname : {
                        color : '#0080F8'
                    },
                    bright : {
                        bold: true,
                        color: '#00acff',
                    },
                    good : {
                        color : '#00951C'
                    },
                    bad : {
                        color : '#FF0137'
                    },
                    emptyReport : {
                        fontSize: 10,
                        alignment : 'center',
                        color: '#888888',
                        margin: [50, 0, 50, 0]
                    },
                    note : {
                        fontSize: 7,
                        italics : true,
                        color: '#333333'
                    },
                    notemedium : {
                        fontSize: 8,
                        italics : true,
                        color: '#333333'
                    },
                    link : {
                        fontSize: 7,
                        color : '#002DBE',
                        decoration : 'underline',
                        decorationColor : '#002DBE',
                    }
                },
                images: {
                    logo : _logo.image
                },
                defaultStyle: {
                    fontSize: 8,
                    bold: true
                  },
            };
    
            return Promise.resolve(tpl)
        })
    
    }

    self.logotype = {
        insert : function(p = {}){

            var logoObj = {
                image: 'logo',
            }

            var im = new Image;
                im.src = logo;

            return new Promise((resolve, reject) => {
                im.onload = function(){

                    console.log('data', data)

                    var logoW = (p.w || 180) * (p.applySize ? Number(data.meta.sizeOfLogo) : 1); //157.5;
                    var logoH = (p.h || 30) * (p.applySize ? Number(data.meta.sizeOfLogo) : 1);
    
                    var prEnd = logoW / logoH;
                    var prLogo = this.width / this.height;
    
                    if (prLogo > prEnd)
                    {
                        logoH = this.height / (this.width / logoW);
                    }
                    else
                        if (prLogo < prEnd)
                        {
                            logoW = this.width / (this.height / logoH);
                        }
    
                    logoObj.width = logoW;
                    logoObj.height = logoH;
    
                    resolve({
                        logo : logoObj,
                        image : logo
                    })
                };
            })  
            
        }
    }

    self.prepare = function(){
        return template().then(doc => {

            doc.pageSize = f.deep(pageSizes, data.meta.pageSize + ".key") || "A4";

            var tools = new Tools({
                doc,
                parent : self,
                pageSizes
            }, data)

            return Promise.resolve(tools)
        })
    }

}

export default PDFTools