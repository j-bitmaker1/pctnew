<template>
<div class="filemanager_pages_list">
    <div class="controls mobp">
		<listcontrols :sortvalue="sort" :sorting="sorting" @search="search" :count="count" @sort="sortchange" :searchvalue="searchvalue"/>
	</div>

	<div class="added mobp" v-if="added">
		<button class="button" @click="reload">You have a new file recognition tasks ({{added}})</button>
	</div>


	<listpaginated @loading="listloading" placeholder="No files found" activity="client" :select="{context : 'filemanager'}" api="files.list" :payload="payload" :start="1" ref="list" @count="setcount" from="pageNumber" to="pageSize" :bypages="true">

		<template v-slot:default="slotProps">
			<div class="fileWrapper mobp">
                <file @runprocess="(type) => {runprocess(slotProps.item, type)}" @restartprocess="(type) => {restartprocess(slotProps.item, type)}" @createPortfolio="createPortfolio" @deleted="() => {deleted(slotProps.item)}" :file="slotProps.item" @open="e => {open(slotProps.item)}"/>
			</div>
		</template>
	   
	</listpaginated>

    <selection context="filemanager" :menu="menu"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
