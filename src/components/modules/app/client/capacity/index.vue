<template>
<div id="client_capacity">

	<div class="header mobp stickedTop">
		<div class="caption">
			<span>Capacity</span>
		</div>
		<div class="result" v-if="simulation">
			<value :value="simulation.capacity.toFixed(0)" v-if="simulation.capacity"/>
			<span v-else>&mdash;</span>
		</div>
	</div>

	<div class="chartWrapper mobp">
		<highcharts :options="chartOptions"></highcharts>

		<div class="unrealistic" v-if="!simulation.capacity">
			<div>
				<span>Unrealistic parameters. Increase savings or initial investment.</span>
			</div>
		</div>
	</div>

	<div class="legend mobp">
		<div class="item" v-if="simulation.top">
			<div class="icon green"></div>
			<div class="text"><value :value="simulation.topp" mode="p"/> of outcomes are above your retirement goal</div>
		</div>

		<div class="item" v-if="simulation.under">
			<div class="icon bad"></div>
			<div class="text"><value :value="simulation.underp" mode="p"/> of outcomes are below your retirement goal</div>
		</div>
	</div>

	<div class="options">
		<div class="slider mobp" :key="i" v-for="(slider, i) in sliders">

			<div class="sheader">

				<div class="name">
					<span>{{slider.text}}</span>
				</div>

				<div class="value">
				</div>

				
				
			</div>

			<div class="inputwrapper">
				<vue-slider :lazy="true" v-model="values[i]" v-bind="slider.options" />
			</div>

			<div class="minmax">
				<div class="min">
					<value :value="slider.options.min" :mode="slider.mode" />
				</div>
				<div class="max">
					<value :value="slider.options.max" :mode="slider.mode" />
				</div>
			</div>
		</div>
		
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
