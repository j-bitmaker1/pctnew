<template>
<div id="portfolios_edit">

	<div class="namewrapper" >
		<input placeholder="Portfolio name" @keyup="changename" :value="name"/>
	</div>

	<div class="addwrapper" v-if="!aggregation">

		<div>
			<upload :extensions="['csv', 'xls', 'xlsx']" @start="uploadFromFileStart" @uploadedAll="uploadFromFileUploadedAll" @uploaded="uploadFromFileUploaded" @error="uploadFromFileError">
				<template v-slot:content>
					<button class="button" key="file">
						<i class="fas fa-file"></i> Add from file
					</button>
				</template>
			</upload>
		</div>

		<button class="button" key="pdfparser" @click="pdfparser">
			<i class="fas fa-file-pdf"></i> Recognize PDF
		</button>

		<button class="button black" key="aggregate" @click="aggregate" v-if="!assets.length">
			<i class="fas fa-tasks"></i> Create aggregate
		</button>

		<button class="button black" key="scan" :disabled="assets.length > 0">
			<i class="fas fa-camera"></i> Scan document
		</button>

		<button class="button black" key="other" :disabled="assets.length > 0">
			<i class="fas fa-cloud"></i> Get from other applications
		</button>

		

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
				<b>Total:</b> <value :value="total" mode="auto"/>
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
							<assetsEdit :ref="slotProps.index" :name="slotProps.item.name" :ticker="slotProps.item.ticker" :value="slotProps.item.value" @changed="(v) => {assetchanged(slotProps.index, v)}" />
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

		<button class="button black" @click="saveas" :disabled="!haschanges || validate">
			Save As
		</button>

		<button class="button" @click="e => save()" :disabled="!haschanges || validate">
			Save
		</button>

		
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
