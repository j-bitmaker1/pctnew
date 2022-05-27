import f from './functions'

class Cordovakit {
    constructor(core){

        this.core = core
        this.store = this.core.store
        this.vm = this.core.vm

    }

    prepare(){

        document.documentElement.style.setProperty('--keyboardheight', `0px`);

        if (!window.cordova) return

        if (navigator.splashscreen) navigator.splashscreen.hide();

        window.screen.orientation.lock('portrait')

        this.keyboard()
        //window.StatusBar.hide()
        window.StatusBar.backgroundColorByHexString('#00000000');
        window.StatusBar.styleDefault()
        //self.platform.sdk.theme.current == 'white' ? window.StatusBar.styleDefault() : window.StatusBar.styleLightContent()
    }

    keyboard(){
        window.addEventListener('keyboardWillShow', (event) => {
            document.documentElement.style.setProperty('--keyboardheight', `${event.keyboardHeight}px`);
        });

        window.addEventListener('keyboardWillHide', () => {
            document.documentElement.style.setProperty('--keyboardheight', `${0}px`);
        });
    }

    vibration(total){

        if(f.isios()){

            if(typeof TapticEngine != 'undefined')
                TapticEngine.impact({
                    style: "medium"
                });

        }
        else{
            if (navigator.vibrate && total){
                navigator.vibrate(50)
            }
        }

       
    }

}

export default Cordovakit