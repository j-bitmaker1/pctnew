<template>
<div id="filemanager_pages_file">
    <filepreview :file="file" :cut="true"/>

    <div class="filecontents">

        <listselectable :context="file.id" :items="file.data" ref="list">
            <template v-slot:default="slotProps">
                <div class="assetWrapper mobp">
                    <asset :asset="slotProps.item"/>
                    
                </div>
            </template>
        </listselectable>

    </div>

    <selection :context="file.id" :menu="menu"/>

    <div class="savePanel">
		
        <button class="button black" @click="close" v-if="!haschanges">
			Close
		</button>

        <button class="button black" @click="cancel" v-if="haschanges">
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
