<template>
<div id="portfolio_crashtest_scenariodetails">
	<div class="losswrapper">
		<value :value="scenario.loss" :mode="portfolio.isModel ? 'p100' : 'd'" colored="true" />
	</div>

	<linepreloader v-if="!info" />
	
	<div class="infoWrapper" v-else>
		<scenariosinfo :info="info"/>
	</div>
	

	<div class="contributors">
		<linepreloader v-if="loading" />
		<div v-else>
			<div class="header">
				<div class="headercaption">
					<span>Contributors</span>
				</div>
				<div class="lossicons">

					
					

					<div class="positive" :class="{active : filter == 'positive'}" @click="e => setfilter('positive')" v-if="positives"><i class="fas fa-arrow-up"></i>
						<value :value="positives" />
					</div>
					<div class="negative" :class="{active : filter == 'negative'}" @click="e => setfilter('negative')" v-if="negatives"><i class="fas fa-arrow-down"></i>
						<value :value="negatives" />
					</div>
					<div class="reversed" :class="{active : filter == 'reversed'}" @click="e => setfilter('reversed')">
						<i class="fas fa-redo"></i>
					</div>
				</div>
			</div>

			<div class="contributorsList">
				<list :items="filtered" v-if="filtered.length">
					<template v-slot:default="slotProps">

						<div class="contributorWrapper">
							<contributor :portfolio="portfolio" :contributor="slotProps.item" :maxabs="maxabs" />
						</div>

					</template>
				</list>

				<div class="empty" v-else>
					<span>There are no contributors for the specified filter in the scenario</span>
				</div>
			</div>

		</div>
	</div>

	<div class="factors" v-if="!loading">
		<scenariosfactors :info="info"/>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
