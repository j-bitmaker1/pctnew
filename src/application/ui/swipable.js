SwipeParallaxNew = function(p){
    if(!p) p = {};

        p.directions || (p.directions = {})

        _.each(p.directions, function(d,i){
            d.i = i
        })

    var self = this;
    var needclear = false

    self.destroyed = false

    var throttle = isios() ? 0 : 50
    var transitionstr = throttle ? ''+throttle+'ms linear' : 'none'


    let ticking = false;

    var directiontoprop = function(direction, value){

        if(direction == 'up') return 'y'
        if(direction == 'down') return 'y'
        if(direction == 'left') return 'x'
        if(direction == 'right') return 'x'

    }

    var ms = false

    var set = function(direction, value){

        var __el = (p.transformel || p.el)[0]

        var prop = directiontoprop(direction);
        var pd = 'left'
        var pb = 'top'

        var scaledifmax = 0.1
        var scaledif = scaledifmax * Math.min(Math.abs(value), 100) / 100
        var scale = (1 - scaledif).toFixed(3)

        if(direction == 'up' || direction == 'left') {
            value = -value
            pd = 'right'
            pb = 'bottom'
        }

        if(p.directions[direction] && p.directions[direction].basevalue) value = value + p.directions[direction].basevalue()

        if(p.directions[direction] && p.directions[direction].scale100) scale = 1

        if(!value) value = 0

        value = value.toFixed(0)

        if (prop == 'x'){
            __el.style["transform"] = "translate3d("+value+"px, 0, 0)"

            //if(!ms)
                //__el.style['transform-origin'] = pd + ' center'
        }

        if (prop == 'y'){
            __el.style["transform"] = "translate3d(0, "+value+"px, 0)"

            //if(!ms)
                //__el.style['transform-origin'] = 'center ' + pb
        }

        if(!ms){

            __el.style["-moz-transition"] = transitionstr
            __el.style["-o-transition"] = transitionstr
            __el.style["-webkit-transition"] = transitionstr
            __el.style["transition"] = transitionstr

            __el.style["-webkit-overflow-scrolling"] = 'touch'
        }

        ms = true

    }

    var applyDirection = function(direction, v, e){
        if (direction.positionclbk){
            needclear = true
            direction.positionclbk(v, e)
        }
    }

    self.clear = function(){

        if (needclear){

            var __el = p.transformel || p.el


            __el.css({"transform": ""});

            __el.css({"-moz-transition": transitionstr});
            __el.css({"-o-transition": transitionstr});
            __el.css({"-webkit-transition": transitionstr});
            __el.css({"transition": transitionstr});


            __el.css({"-webkit-overflow-scrolling": ''});

            _.each(p.directions, function(d){
                applyDirection(d, 0)
            })


            setTimeout(() => {
                __el.css({"-moz-transition": ""});
                __el.css({"-o-transition": ""});
                __el.css({"-webkit-transition": ""});
                __el.css({"transition": ""});

                __el = null
            }, 100)
        }

        ms = false
        needclear = false
    }

    self.init = function(){

        var mainDirection = null;

        var statusf = function(e, phase, direction, distance){

            if (self.destroyed) return

            if (mainDirection && mainDirection.i != direction){
                phase = 'cancel'
                direction = mainDirection.i
            }

            if (phase == 'cancel' || phase == 'end'){

                if (mainDirection){

                    if(phase == 'end' && mainDirection.clbk && direction == mainDirection.i){

                        if((!mainDirection.distance || mainDirection.distance < distance)){
                            mainDirection.clbk()
                        }

                    }
                }

                self.clear()
                document.ontouchmove = () => true

                return

            }

            if(!direction) return

            if(!p.directions[direction]){
                return
            }

            var dir = p.directions[direction]

            if (dir.constraints && !dir.constraints(e)) {

                if (mainDirection){
                    mainDirection = null;
                }

                if (e.cancelable !== false){
                    e.stopPropagation();
                    e.preventDefault();
                }

                return false
            }

            if (phase == 'start'){
                mainDirection = null

                document.ontouchmove = (e) => {

                    e.stopPropagation();
                    e.preventDefault();

                    return false
                }
            }

            if (phase == 'move'){

                if (distance > (dir.trueshold || 30)){

                    mainDirection = dir

                    applyDirection(mainDirection, distance, e)

                    set(mainDirection.i, distance)

                }

                if (e.cancelable !== false){
                    e.stopPropagation();
                    e.preventDefault();
                }

                return true
            }

        }

        p.el.swipe({
            preventDefaultEvents : p.preventDefaultEvents,
            allowPageScroll : p.allowPageScroll,
            swipeStatus : throttle ? _.throttle(statusf, throttle) : statusf,
        })

        return self
    }

    self.destroy = function(){

        p.el.swipe('destroy')
        p = {}
        needclear = false

        self.destroyed = true

    }

    return self;
}

var Swipable = {
    bind : function(el, binding){
        var parameters = {...binding.value}

        
    },
    unbind : function(){

    }
}

export default Swipable