<template>
<div class="filemanager_pages_list">
    <div class="controls mobp">
		<listcontrols :sortvalue="sort" :sorting="sorting" @search="search" :count="count" @sort="sortchange" :searchvalue="searchvalue"/>
	</div>

	<linepreloader v-if="loading"/>

	<listpaginated placeholder="No files found" activity="client" :select="{context : 'filemanager'}" api="tasks.list" :payload="payload" :start="1" ref="list" @count="setcount" from="pageNumber" to="pageSize" :bypages="true">

		<template v-slot:default="slotProps">
			<div class="fileWrapper mobp">
                <file @deleted="() => {deleted(slotProps.item)}" :file="slotProps.item" @open="e => {open(slotProps.item)}"/>
			</div>
		</template>
	   
	</listpaginated>

    <selection context="filemanager" :menu="menu"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
