<template>
<div class="listgroupedslised">
	<listgrouped :group="groupedslised" :select="select">

        <template v-slot:group="slotProps">
            <slot name="group" :item="slotProps.item" :index="slotProps.index"></slot>
        </template>

        <template v-slot:list="slotProps">
            <slot name="list" :item="slotProps.item" :index="slotProps.index"></slot>
        </template>

        <template v-slot:groupafter="slotProps" >
            <div class="showmore mobp" v-if="showmore[slotProps.index]" @click="e => opengroup(slotProps.index)">
                <span>Show more</span>
            </div>
        </template>

    </listgrouped>
</div>
</template>

<style scoped lang="sass">
.showmore
    cursor: pointer
</style>

<script>
import {
	mapState
} from 'vuex';

export default {
	name: 'listgroupedslised',
	props: {
		group: Object,
		count : Number,
        select : null
	},
	data : function(){

        return {
            openedgroups : {}
        }

    },
	computed: mapState({
		auth: state => state.auth,

		groupedslised : function(){
            var gs = {}

            _.each(this.group, (g, i) => {
                gs[i] = (this.openedgroups[i] || !this.count) ? g : _.first(g, this.count)
            })

            return gs
        },

        showmore : function(){
            var sm = {}

            _.each(this.group, (g, i) => {
                sm[i] = g.length != this.groupedslised[i].length
            })

            return sm
        },

	}),

	methods: {
		opengroup : function(i){
            this.$set(this.openedgroups, i, true)
        }
	},
}
</script>
