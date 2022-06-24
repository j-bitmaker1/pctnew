<template>
<div class="step_meta" :class="this.step.status + ' ' + this.step.type()">
	<div class="icontime">
        <div class="icon" :class="this.step.status + ' ' + this.step.type()">
            <slot name="icon"></slot>
        </div>
        <div class="time" :class="this.step.status + ' ' + this.step.type()" v-if="hasTime">
			<div class="timeline">
				<div class="stepfill" v-if="step.started" :key="wkey" :style="wtranform"></div>
			</div>
        </div>
    </div>
	<div class="wrapper" :class="this.step.status + ' ' + this.step.type()">
		<div class="content" :class="this.step.status + ' ' + this.step.type()">
			<slot name="content" ></slot>
			<slot name="menu" v-if="hasmenu"></slot>
		</div>
		<div class="statusWrapper" :class="this.step.status + ' ' + this.step.type()" v-if="hasstatus && step.status">
			<status :status="step.status"/> <date v-if="this.step.ended" :date="this.step.ended" />
		</div>
	</div>
</div>
</template>

<style scoped lang="sass" src="./index.sass"></style>


<script>
import {
	mapState
} from 'vuex';

import status from '../../../status/index.vue'
import f from "@/application/shared/functions.js"

export default {
	name: 'step_meta',
	props: {
		step: Object,
		showtime : Boolean,
        editing : Boolean
	},
	components : {
		status
	},
	computed: mapState({
		auth: state => state.auth,

		hasmenu : function(){
            if(this.step.type() == "finish" || !this.editing) return false

            return true
        },

		hasstatus : function(){
            if(this.step.type() == "ifstep" || this.editing) return false

            return true
        },

		hasTime : function(){
            if(this.step.type() == "finish" || this.step.type() == "ifstep") return false

            return true
        },

		stepProgress : function(){
			return this.step.progress()

		},

		wtranform : function(){
			return {
				transform : 'scale(1, '+this.stepProgress+')'
			}
		},

		wkey : function(){
			return f.date.nowUtc1000() / 10
		}
	}),

	methods: {

	},
}
</script>
