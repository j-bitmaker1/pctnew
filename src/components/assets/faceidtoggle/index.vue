<template>
<div id="faceidtoggle">
    <iconstoggle :icons="faceId" :value="hasFaceid" @change="changeFaceId" :disabled="faceIdAvailable === false"/>

    <div class="label">
        <span>{{ $t("common.usefaceidcheck_" + faceIdAvailable) }}</span>
    </div>
</div>
</template>

<style scoped lang="sass">
#faceidtoggle
	display: flex
	align-items: center

	.label
		margin-left: $r
</style>

<script>
import {
    mapState
} from 'vuex';

export default {
    name: 'faceidtoggle',
    props: {
        data: Object
    },
    data: function () {
        return {
            faceIdAvailable: false,
            hasFaceid: 'no',

            faceId: [{
                    icon: "fas fa-lock",
                    id: 'use',
                    good: true
                },
                {
                    icon: "fas fa-times",
                    id: 'no'
                }
            ],
        }
    },
    computed: mapState({
        auth: state => state.auth,
    }),

	created : function(){
		this.checkFaceId()
	},

    methods: {
		checkFaceId : function(){
			return this.core.user.faceIdAvailable().then((type) => {
				this.faceIdAvailable = type

				return this.core.user.hasFaceid()
			}).then(r => {
				this.hasFaceid = 'use'
			}).catch(e => {
				this.hasFaceid = 'no'
			})
		},

		changeFaceId : function(v){

			var a = null

			if (v == 'use'){
				a = this.core.user.setfaceid()
			}

			if(v == 'no'){

				a = this.$dialog.confirm(
                    this.$t('common.removefaceid_' + this.faceIdAvailable), {
                    okText: this.$t('yes'),
                    cancelText : this.$t('no')
                }).catch(() => {})
			}

			a.then(() => {
                return this.core.user.deletefaceid().then(() => {
                    return this.checkFaceId()
                })
			}).catch(e => {
                console.error(e)
            })
		}
    },
}
</script>
