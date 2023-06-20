<template>
<div id="filemanager_filepreview">
    <div class="loading" v-if="loading">
        <linepreloader />
    </div>

    <template v-else>
        <filepreview :file="file" v-if="file" :cut="cut" :nomenu="nomenu"/>
        <div class="empty" v-else>
            <span>Cannot find file</span>
        </div>
    </template>
</div>
</template>

<style scoped lang="sass">

</style>

<script>

import {
    mapState
} from 'vuex';
import filepreview from './index.vue'


export default {
    components : {
        filepreview
    },
    name: 'filemanager_filepreview',
    props: {
        id: String,
        cut : Boolean,
        nomenu : Boolean
    },
    data : function(){
        return { 
            loading : false,
            file : null
        }
    },
    computed: mapState({
        auth: state => state.auth,

        
    }),

    created : function(){
        this.load()
    },

    methods: {
        load : function(){
            this.loading = true
            this.core.api.files.get(this.id).then(c => {
                console.log("C", c)
                this.file = c
            }).catch(e => {
            }).finally(() => {
                this.loading = false

            })
        }
    },
}
</script>
