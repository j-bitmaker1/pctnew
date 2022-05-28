import { mapState } from 'vuex';
import pdfvuer from 'pdfvuer'
import f from '../../../application/functions';
import 'pdfjs-dist/build/pdf.worker.entry'
export default {
    name: 'pdfviewer',
    props: {
        file : Object,
        scroll : Number
    },

    components : {
        pdfvuer
    },

    data () {
        return {
            page: 1,
            numPages: 0,
            pdfdata: undefined,
            errors: [],
            dscale : 'page-width',
            scale: 'page-width'
        }
    },

    computed: {

        pdf() {
            if(this.file.blob) return f.Base64.fromBlob(this.file.blob)
        },

        zoom () {

            if(this.scale == this.dscale) return 0 

            return this.scale
        },
    },

    mounted () {
        this.getPdf()
    },

    watch: {
        scale : function(){
            console.log(this.scale)
        },
        scroll : function(s){

            var i = 1, count = Number(this.numPages);
            var r = 1

            s = Number(s.toFixed(0))

            do {

                if (s >= this.offsetTop(i) && 
                    s <= this.offsetTop(i + 1) ) {

                    r = i
                }

                i++
            } 
            
            while ( i < count)

            this.page = r
            
        }
    },
    methods: {

        topage(p){
            if (p > 0 && p < this.numPages){
                var value = this.offsetTop(p)
                this.$el.closest('.customscroll').scrollTop = value
            }
        },

        offsetTop(page){
            return this.$refs[page][0].$el.offsetTop - 117
        },

        handle_pdf_link: function (params) {

            var page = document.getElementById(String(params.pageNumber));
                page.scrollIntoView();

        },
        getPdf () {

            this.pdfdata = pdfvuer.createLoadingTask(this.pdf);

            this.pdfdata.then(pdf => {
                this.numPages = pdf.numPages;
            });

        },

        findPos(obj) {
            return obj.offsetTop;
        }
    }
}