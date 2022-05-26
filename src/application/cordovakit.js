import f from './functions'

class Cordovakit {
    constructor(core){

        this.core = core
        this.store = this.core.store
        this.vm = this.core.vm

    }

    prepare(){

        if (!window.cordova) return

        if (navigator.splashscreen) navigator.splashscreen.hide();

        window.screen.orientation.lock('portrait')

        this.keyboard()
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