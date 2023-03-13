<template>
<div id="portfolio_crashtest_scenariodetails">
	<div class="losswrapper">
		<portfoliovalue :value="scenario.loss" :portfolio="portfolio" colored="true" />
	</div>

	<linepreloader v-if="!info" />
	
	<div class="infoWrapper" v-else>
		<scenariosinfo :info="info"/>
	</div>
	

	<div class="contributors">
		<linepreloader v-if="loading" />
		
		<div v-else>

			<template v-if="lossgain">
				<div class="lossgain">

					<div :class="'lgpart customscroll ' + i" v-for="i in lg" :key="i">

						<div class="csubheader mobp">
							<div class="icon">
								<i class="fas fa-arrow-up" v-if="i == 'gain'"></i>
								<i class="fas fa-arrow-down" v-if="i == 'loss'"></i>
								<value :value="lgs[i].length" />
							</div>
							<div class="label">
								<span>{{scenario.name}}</span>
							</div>
							<div class="value">
								<portfoliovalue :value="lgssum[i]" :portfolio="portfolio" colored="true" />
							</div>
						</div>

						<div class="listempty">

							<div class="list" v-if="lgs[i].length">
								<list :items="lgs[i]" >
									<template v-slot:default="slotProps">

										<div class="contributorWrapper">
											<contributor :portfolio="portfolio" :contributor="slotProps.item" :maxabs="maxabs" />
										</div>

									</template>
								</list>
								<div class="end">
									<i class="fas fa-dot-circle"></i>
								</div>
							</div>

							<div class="empty" v-else>
								<span>{{$e('labels.nocontributors.' + i)}}</span>
							</div>
						</div>

					</div>
				</div>
			</template>

			<template v-else>
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
			</template>

		</div>
	</div>

	<div class="factors" v-if="!loading">
		<scenariosfactors :info="info"/>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
