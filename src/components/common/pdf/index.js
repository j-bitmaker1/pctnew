import { mapState } from 'vuex';
import pdfvuer from 'pdfvuer'
export default {
    name: 'pdf',
    props: {
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
            scale: 'page-width'
        }
    },

    computed: {
        formattedZoom () {
            return Number.parseInt(this.scale * 100);
        },
    },

    mounted () {
        this.getPdf()
    },

    watch: {
        show: function (s) {
            if(s) {
                this.getPdf();
            }
        },
        page: function (p) {
            if( window.pageYOffset <= this.findPos(document.getElementById(p)) || ( document.getElementById(p+1) && window.pageYOffset >= this.findPos(document.getElementById(p+1)) )) {
            // window.scrollTo(0,this.findPos(document.getElementById(p)));
                document.getElementById(p).scrollIntoView();
            }
        }
    },
    methods: {

        handle_pdf_link: function (params) {

            var page = document.getElementById(String(params.pageNumber));
                page.scrollIntoView();

        },
        getPdf () {

            var self = this;

            self.pdfdata = pdfvuer.createLoadingTask('./static/relativity.pdf');

            self.pdfdata.then(pdf => {
                self.numPages = pdf.numPages;

                window.onscroll = function() { 
                    changePage() 
                    stickyNav()  
                }
        
                /*// Get the offset position of the navbar
                var sticky = $('#buttons')[0].offsetTop
        
                // Add the sticky class to the self.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
                function stickyNav() {
                    if (window.pageYOffset >= sticky) {
                        $('#buttons')[0].classList.remove("hidden")
                    } else {
                        $('#buttons')[0].classList.add("hidden")
                    }
                }*/
        
                function changePage () {
                    var i = 1, count = Number(pdf.numPages);
                    
                    do {
                        if (window.pageYOffset >= self.findPos(document.getElementById(i)) && 
                            window.pageYOffset <= self.findPos(document.getElementById(i+1))) {

                            self.page = i
                        }

                        i++
                    } while ( i < count)

                    if (window.pageYOffset >= self.findPos(document.getElementById(i))) {
                        self.page = i
                    }
                }
            });

        },

        findPos(obj) {
            return obj.offsetTop;
        }
    }
}