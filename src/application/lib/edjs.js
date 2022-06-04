var edjsPdfMake = function() {
    "use strict";

    var e = {

        header: function(e, tools) {

            return tools.helpers.caption({
                text : e.data.text,
                style: 'h2',
            })

        },

        paragraph: function(e, tools) {

            return tools.helpers.paragraph({
                text : e.data.text
            })

        },

        list: function(e, tools) {

            var t = e.data,
                r = "unordered" === t.style ? "ul" : "ol",

                n = function(e, t) {

                    var r = e.map((function(e) {
                        if (!e.content && !e.items) return  {text : e};
                        var r = "";
                        return e.items && (r = n(e.items, t)), e.content ? {text : e, ...r} : void 0
                    }));

                    return tools.helpers.list({
                        [t] : r
                    })
                };
            return n(t.items, r)
        }
    };

    function t(e) {
        return new Error('[31m The Parser function of type "' + _.escape(e) + '" is not defined. \n\n  Define your custom parser functions as: [34mhttps://github.com/pavittarx/editorjs-html#extend-for-custom-blocks [0m')
    }

    var r = function(tools, n) {

        void 0 === n && (n = {});

        var i = Object.assign({}, e, n);

        return {

            parse: function(e) {
                return e.blocks.map((function(e) {
                    return i[e.type] ? i[e.type](e, tools) : t(e.type, tools)
                }))
            },

            parseBlock: function(e) {
                return i[e.type] ? i[e.type](e, tools) : t(e.type, tools)
            },

            parseStrict: function(e) {
                var n = e.blocks,
                    o = r(i).validate({
                        blocks: n
                    });
                if (o.length) throw new Error("Parser Functions missing for blocks: " + o.toString());
                for (var a = [], u = 0; u < n.length; u++) {
                    if (!i[n[u].type]) throw t(n[u].type);
                    a.push(i[n[u].type](n[u], tools))
                }
                return a
            },

            validate: function(e) {
                var t = e.blocks.map((function(e) {
                        return e.type
                    })).filter((function(e, t, r) {
                        return r.indexOf(e) === t
                    })),
                    r = Object.keys(i);
                return t.filter((function(e) {
                    return !r.includes(e)
                }))
            }
        }
    };
    return r
}();

export {edjsPdfMake} 