<template>
<div id="portfolios_edit">

	<div class="namewrapper" >
		<input placeholder="Portfolio name" ref="inputname" @keyup="changename" :value="name"/>
	</div>

	<div class="addwrapper" v-if="!aggregation">

		<button class="button" key="addasset" @click="addasset">
			<i class="fas fa-plus"></i> Add asset
		</button>

		<button class="button" key="filemanager" @click="e => {filemanager()}" :disabled="assets.length > 0">
			<i class="fas fa-file"></i> Add from file
		</button>

		<button class="button black" key="model" @click="model">
			<i class="fas fa-percent"></i> <template v-if="!isModel">Model portfolio</template> <template v-else>Currency portfolio</template>
		</button>

		<button class="button black" key="scan" v-if="cordova" :disabled="assets.length > 0" @click="scan">
			<i class="fas fa-camera"></i> Photo document
		</button> 

		<!--<button class="button black" key="aggregate" @click="aggregate" :disabled="assets.length > 0">
			<i class="fas fa-tasks"></i> Create aggregate
		</button> -->

		<!--<button class="button black" key="other" :disabled="assets.length > 0">
			<i class="fas fa-cloud"></i> Get from other applications
		</button>-->

	</div>

	<div class="addwrapper" v-else>

		<button class="button" key="aggregate" @click="aggregate">
			<i class="fas fa-tasks"></i> Select portfolios
		</button>

		<button class="button black" key="cancelAggregation" @click="cancelAggregation">
			<i class="fas fa-times"></i> Cancel aggregate
		</button>
	
	</div>

	<div v-if="!aggregation">


		<div class="captionRow">
			<div class="caption">
				<span>Assets</span>
			</div>
			<div class="totalwrapper" v-if="total">
				<b>Total:</b> <value :value="total" :mode="isModel ? 'p100' : 'd'"/>
			</div>
		</div>

		<div class="captionRow"  v-if="uncovered">
			<div class="uncoveredwrapper">
				<span>Not covered:</span> <value :value="uncovered" mode="auto"/>
			</div>
		</div>

		<div class="assetsList" ref="assetsList">
			<div class="assetsListWrapper">
				<list :items="extended">
					<template v-slot:default="slotProps">
						<div class="assetWrapper">
							<div class="remove" @click="remove(slotProps.index)">
								<i class="fas fa-times-circle"></i> 
							</div>
							<assetsEdit @multiple="multiple" @leaveAsset="leaveAsset" @focus="focus" @blur="blur" :ref="slotProps.index" :name="slotProps.item.name" :isCovered="slotProps.item.isCovered" :ticker="slotProps.item.ticker" :value="slotProps.item.value" @changed="(v) => {assetchanged(slotProps.index, v)}" />
						</div>
					</template>
				</list>
			</div>

		</div>
	</div>

	<div class="aggregatelist" v-else>
		<aggregationsEdit type="portfolio" :aggregation="aggregation"/>
	</div>

	<div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button black" @click="saveas" :disabled="!haschanges">
			Save As
		</button>

		<button class="button" @click="e => savedefault()" :disabled="!haschanges">
			Save
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
