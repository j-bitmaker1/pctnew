<template>
<div class="filemanager_pages_list">
    <div class="controls mobp">
		<listcontrols :sortvalue="sort" :sorting="sorting" @search="search" :count="count" @sort="sortchange" :searchvalue="searchvalue"/>
	</div>

	<linepreloader v-if="loading"/>


	<listselectable context="filemanager" :items="sorted" ref="list">
		<template v-slot:default="slotProps">
			<div class="fileWrapper mobp">
                <file :file="slotProps.item"/>
			</div>
		</template>
	</listselectable>

    <selection context="filemanager" :menu="menu"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
