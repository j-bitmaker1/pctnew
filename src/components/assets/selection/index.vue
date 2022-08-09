<template>
<div id="selection">

    <div class="selectionControls mobp" v-if="selection">
        <div class="caption">
            <span>Select elements from list</span>
        </div>
        <div class="controls">
           
            <button class="button" v-if="selectionLength" @click="success">Select ({{selectionLength}})</button>
            <button class="button black" @click="selectallclick" v-if="selectall">Select all</button>
            <button class="button black" @click="cancel" v-if="selectionLength">Unselect all</button>
            
        </div>
    </div>

    <transition name="fademodal">
		<modal v-if="menu && showmenu" @close="close" mclass="small likemenu">

			<template v-slot:body>
				<listmenu :items="selectedMenu" :close="close" />
			</template>

		</modal>
	</transition>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
