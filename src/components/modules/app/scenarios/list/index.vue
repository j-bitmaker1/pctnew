<template>
<div class="scenarios_list">
    <div class="controls mobp">
		<listcontrols @search="search" :searchvalue="searchvalue"/>
	</div>

	<div class="keyscenariosWrapper mobp">
		<div class="wr2">
			<iconstoggle :icons="keyscenarios" :value="usekeyscenarios" @change="changeKeyScenariosUse"/>
			<div class="label">
				<span>Use key scenarios</span>
			</div>
		</div>
	</div>

	

	<list :items="filtered" ref="list">
		<template v-slot:default="slotProps">
			<div class="scenarioWrapper mobp">
				<scenario @use="v => useChange(slotProps.item.id, v)" :scenario="slotProps.item" :using="using[slotProps.item.id]"/>
			</div>
		</template>
	</list>


	<div class="savePanel" v-if="showsave">
		<button class="button black" @click="cancel">
			Cancel
		</button>

		<button class="button" @click="apply" :disabled="!canapply">
			Apply
		</button>
		
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
