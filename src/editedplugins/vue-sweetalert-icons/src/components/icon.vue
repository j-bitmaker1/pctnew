<template>
<div class="sa" :style="cssVars">
	<div class="sa-error" v-if="isIcon('error')">
		<div class="sa-error-x">
			<div class="sa-error-left"></div>
			<div class="sa-error-right"></div>
		</div>
		<div class="sa-error-placeholder"></div>
		<div class="sa-error-fix"></div>
	</div>

	<div class="sa-warning" v-else-if="isIcon('warning')">
		<div class="sa-warning-body"></div>
		<div class="sa-warning-dot"></div>
	</div>

	<div class="sa-info" v-else-if="isIcon('info')">
		<div class="sa-info-body"></div>
		<div class="sa-info-dot"></div>
	</div>

	<div class="sa-loading" v-else-if="isIcon('loading')">
		<div class="sa-loading-body"></div>
	</div>

	<div class="sa-success" v-else>
		<div class="sa-success-tip"></div>
		<div class="sa-success-long"></div>
		<div class="sa-success-placeholder"></div>
		<div class="sa-success-fix"></div>
	</div>
</div>
</template>

<script>
import validateColor from "validate-color";
import convertColor from "color";
const availableIcons = ['success', 'warning', 'error', 'info', 'loading'];
const iconColors = {
	success: "#007d09",
	warning: "#ff7800",
	error: "#ff007e",
	info: "#0600ff",
	loading: "#0600ff"
};

export default {
	name: 'sweetalert-icon',

	props: {
		icon: {
			type: String,
			default: 'success',
			validator: (value) => {
				return availableIcons.indexOf(value) !== -1;
			}
		},
		color: {
			type: String,
			validator: validateColor
		}
	},

	computed: {
		cssVars() {
			const outputColor = validateColor(this.color) ?
				this.color :
				iconColors[this.icon];
			return {
				"--icon-color": outputColor,
				"--icon-color-alpha": convertColor(outputColor).alpha(0.25)
			};
		}
	},

	methods: {
		isIcon(icon) {
			return icon === this.icon;
		}
	}
}
</script>

<style scoped lang="sass" src="./index.sass"></style>
