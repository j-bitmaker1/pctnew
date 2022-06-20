var colors = {}

colors.colorFromGradient = function(p){

    p.mode || (p.mode = 'equal')

    p.gradient || (p.gradient = [{
        color : [0,0,0,0],
        image : "red",
        position : 0
    },{
        color : [255,255,255,255],
        image : "green",
        position : 100
    }])

    if(typeof p.value == 'undefined')
    {
        p.value = 50;
    }

    var left = _.find(p.gradient, function(cp, i){
        if(cp.position <= p.value && (!p.gradient[i + 1] || p.gradient[i + 1].position > p.value)) return true;
    })

    var right = _.find(p.gradient, function(cp, i){
        if(cp.position >= p.value  && (!p.gradient[i - 1] || p.gradient[i - 1].position < p.value)) return true;
    })

    var color = [0,0,0,0],
        image = "red";

    if(!right) right 	= p.gradient[p.gradient.length - 1];
    if(!left) left 		= p.gradient[0];

    if(right.position == left.position)
    {
        color = left.color;
        image = left.image;
        left.opacity = 255;
        right.opacity = 255;
    }
    else
    {
        var proportion = (p.value - left.position) / (right.position - left.position);

        if (p.mode == 'like')
        {

            var using = left;
                left.opacity = 255;
                right.opacity = 0;
            if (proportion > 0.5) {
                using = right;
                left.opacity = 0;
                right.opacity = 255;
            }

            _.each(color, function(cc, i){
                color[i] = using.color[i]
            })
        }

        if (p.mode == 'equal'){
            _.each(color, function(cc, i){
                color[i] = (left.color[i] * (1 - proportion) + right.color[i] * proportion).toFixed(0);
            })

            left.opacity = 1 - proportion;
            right.opacity = proportion;
        }
    }

    if(p.mode && p.mode == "pdf")
        return {
            left : left,
            right : right
        };



        var c = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")"

    if(p.toHex)
    {
        return colors.rgb2hex(c);
    }

    return c;
}

colors.rgb2hex = function(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

colors.randomColor = function(){
    var r=Math.floor(Math.random() * (256));
    var g=Math.floor(Math.random() * (256));
    var b=Math.floor(Math.random() * (256));

    var c='rgb(' + r +',' + g + ',' + b +')';

    return c;
}

colors.rgbaOpacity = function(rgba, opacity){
    var clear = rgba.replace("rgba(", '').replace(")", '');

    var points = clear.split(",");

        points[3] = opacity

        rgba = 'rgba(' + points.join(",") + ")";

    return rgba;
}

export default colors