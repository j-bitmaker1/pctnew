<template>
<div id="filemanager_pages_file">
    <filepreview :file="file" :cut="true" @deleted="deleted"/>

    <div class="filecontents">

        <list :context="file.id" :items="filtered" ref="list">
            <template v-slot:default="slotProps">
                <div class="assetWrapper mobp">
                    <asset :asset="slotProps.item" @changeValue="v => {changeValue(slotProps.item, v)}" @changeAsset="asset => {changeAsset(slotProps.item, asset)}" @remove="asset => {remove(slotProps.item)}"/>
                </div>
            </template>
        </list>

    </div>

    <!--<selection :context="file.id" :menu="menu"/>-->

    <div class="savePanel">
		
        <button class="button black" @click="close" v-if="!haschanges">
			Close
		</button>
        <button class="button black" @click="cancel" v-if="haschanges">
			Cancel
		</button>
        <button class="button" @click="e => save()" v-if="haschanges">
			Save
		</button>
		<button class="button" @click="e => createPortfolio()" v-if="!haschanges" :disabled="!hasassets">
			Create Portfolio
		</button>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
