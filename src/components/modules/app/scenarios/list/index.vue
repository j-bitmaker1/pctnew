<template>
<div class="scenarios_list">
    <linepreloader v-if="loading" />
    <div class="cnt" v-else>

        <div class="panel mobp">

			<div>
                <button class="button" @click="createCustomScenario">Create custom scenario <i class="fas fa-plus"></i></button>
            </div>

			<div>
                <button class="button black" @click="unselectAll">Unselect all</button>
            </div>

			<div>
                <button class="button black" @click="useDefault">Use default scenarios</button>
            </div>

            <!--<div>
                <button class="button small black">All scenarios</button>
            </div>
            <div>
                <button class="button small black">Custom scenarios</button>
            </div>-->

            <!--<div class="keyscenariosWrapper ">
                <div class="wr2">
                    <iconstoggle :icons="keyscenarios" :value="usekeyscenarios" @change="changeKeyScenariosUse" />
                    <div class="label">
                        <span>Use key scenarios</span>
                    </div>
                </div>
            </div>-->

        </div>

        <div class="controls mobp">
            <listcontrols @search="search" :searchvalue="searchvalue" />
        </div>
		<listgroupedsliced :group="grouped" :count="10" ref="list">

            
			<template v-slot:group="slotProps">
				<div class="groupCaption mobp">
					<span>{{slotProps.index}}</span>
				</div>
			</template>

            <template v-slot:list="slotProps">
                <div class="scenarioWrapper ">
                    <scenario @removed="e => removed(slotProps.item)" @changed="scenario => changed(slotProps.item, scenario)" @use="v => useChange(slotProps.item.id, v)" :scenario="slotProps.item" :using="using[slotProps.item.id]" />
                </div>
            </template>


        </listgroupedsliced>

        <div class="savePanel" v-if="showsave">
            <button class="button black" @click="cancel">
                Cancel
            </button>

            <button class="button" @click="apply">
                Apply
            </button>

        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
