<template>
<div class="portfolio_crashtest_chart" :class="{

	increased : dwidth < 768 && length > 12, 
	mobileview, 
	standart : !mobileview, 
	calcheight,
	many
	
	}">

	<div class="wrapperAll" v-if="cts && !_.isEmpty(cts)">
		<div class="scale" >
			<div class="num" v-for="index in intervals" :key="-index">
				<div><value :value="num(index - 1 - intervals)" :mode="modecomposed"/></div>
			</div>
			<div class="num" :key="0">
				<div><value :value="0" :mode="modecomposed"/></div>
			</div>
			<div class="num" v-for="index in intervals" :key="index">
				<div><value :value="num(index)" :mode="modecomposed"/></div>
			</div>
		</div>

		<div class="wrapper">

			<div class="wrp">

				<div class="background">
				</div>

				<div class="scenarios">

					<div class="scenario" @mouseover="e => scenarioMouseOverDirectOne(scenario)" @click="e => scenarioClickDirectOne(scenario)" :class="{custom : scenario.custom, negative : _.toArray(scenario.loss)[0] < 0}" v-for="scenario in cts.scenarios" :key="scenario.id" :style="'height:' + (calcheight ? ((chartheight / length)  + 'px'): 'auto')">
						<div class="barswrapper"  @click="e => scenarioClick(scenario)">
							<div class="barwrapper" @click="e => scenarioClickDirect(scenario, i)" :class="{positive : loss > 0, negative : loss < 0}" :key="i" v-for="(loss, i) in scenario.loss">
								<div class="bar" :style="{[mobileview ? 'height' : 'width'] : height(scenario, loss) + '%', background : color(scenario, loss) }"></div>

								<div class="portfolioname" v-if="many">
									<div class="icon" :style="'background:' + rcolor(core.pct.ocr(cts.cts[i].ocr))">
										<span>{{core.pct.ocr(cts.cts[i].ocr)}}</span>
									</div>
									<div class="label" v-if="!currentOptimization || currentOptimization.portfolio.id != i">
										<span>{{portfolios[i].name}}</span>
									</div>
								</div>

								<div class="optimizationSlider" @click.stop="function(e){}" v-if="optimize && optimize == i" :style="{left : invheight(scenario, loss) + '%'}">
									<vue-slider :lazy="true" @change="e => changeSliderOptimization(e, i, scenario)" v-bind="{}"/>
								</div>
							</div>

							
							
						</div>

						<div class="valueswrapper"  @click="e => scenarioClick(scenario)">
							<div class="valuewrapper" :class="{positive : loss > 0, negative : loss < 0}" :key="'v' + i" v-for="(loss, i) in scenario.loss" @click="e => scenarioClickDirect(scenario, i)">
								<div class="value">
									<portfoliovalue :value="cts.total * loss" :portfolio="portfolios[i]" :mode="mode"/>
								</div>
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

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
