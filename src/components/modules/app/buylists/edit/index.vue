<template>
<div id="portfolios_edit" :class="{haschanges}">

	<div class="namewrapper" >
		<input placeholder="Buylist name" ref="inputname" @keyup="changename" :value="name"/>
	</div>

	<div class="addwrapper">

		<button class="button" key="addasset" @click="addasset">
			<i class="fas fa-plus"></i> Add asset
		</button>

		<button class="button" key="filemanager" @click="e => {filemanager()}" :disabled="assets.length > 0">
			<i class="fas fa-file"></i> Add from file
		</button>


		<button class="button black" key="scan" v-if="cordova" :disabled="assets.length > 0" @click="scan">
			<i class="fas fa-camera"></i> Photo document
		</button> 

	</div>


	<div>

		<div class="assetsList" ref="assetsList">
			<div class="assetsListWrapper">
				<div class="removedassets">
					<list v-if="showdif && haschanges && !_.isEmpty(difference.rms)" :items="difference.rms">
						<template v-slot:default="slotProps">
							<div class="ticker">
								<span>{{slotProps.item.ticker}}</span>
							</div>
						</template>
					</list>
				</div>
				<list :items="extended">
					<template v-slot:default="slotProps">
						<div class="assetWrapper" :class="{last : slotProps.index == extended.length - 1}">
							<div class="remove" @click="remove(slotProps.index)">
								<i class="fas fa-times-circle"></i> 
							</div>
							<assetsEdit :mode="isModel ? 'p' : 'd'" @multiple="multiple" @leaveAsset="e => leaveAsset(slotProps.index)" @focus="focus" @blur="blur" :ref="slotProps.index" :name="slotProps.item.name" :isCovered="slotProps.item.isCovered" :ticker="slotProps.item.ticker" :value="slotProps.item.value" @changed="(v) => {assetchanged(slotProps.index, v)}" :withoutvalue="true" />
						</div>
					</template>
				</list>
			</div>

		</div>
	</div>


	<div class="savePanel">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="e => save()" :disabled="!haschanges">
			Save
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
