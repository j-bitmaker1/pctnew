<template>
<div class="portfolio_crashtest_chart" :class="{increased : dwidth < 768 && length > 10}">

	

	<div class="scale">
		<div class="num" v-for="index in intervals" :key="-index">
			<div><value :value="num(index - 1 - intervals)" :mode="mode"/></div>
		</div>
		<div class="num" :key="0">
			<div><value :value="0" :mode="mode"/></div>
		</div>
		<div class="num" v-for="index in intervals" :key="index">
			<div><value :value="num(index)" :mode="mode"/></div>
		</div>
	</div>

	<div class="wrapper">

		<div class="wrp">

			<div class="background">
			</div>

			<div class="scenarios">

				<div class="scenario" :class="{custom : scenario.custom}" v-for="scenario in cts.scenarios" :key="scenario.id" >
					<div class="barswrapper" :class="{positive : loss > 0, negative : loss < 0}" :key="i" v-for="(loss, i) in scenario.loss" @click="e => scenarioClick(scenario)">
						<div class="barwrapper">
							<div class="bar" :style="{height : height(scenario, loss) + '%', background : color(scenario, loss) }"></div>
						</div>
					</div>

					<div class="name" v-touch="e => zoom(scenario.id)" :class="{zoomed : zoomed == scenario.id}">
						<span>{{scenario.name}}</span>
					</div>
				</div>

				
			</div>
		</div>

	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
