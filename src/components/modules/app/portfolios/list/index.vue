<template>
<div id="portfolios_list">

	<div class="controls mobp">
		<listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange"/>
	</div>

	<slot name="prepend">
	</slot>

	<listpaginated :selectOptions="selectOptions" @selectionSuccess="selectionSuccess" @selectionChange="selectionChange" @selectionCancel="selectionCancel" :api="api" :payload="payload" @count="setcount" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<portfolio :showClient="showClient" @changeClient="changeClient" :hasmenu="select ? false : true" :portfolio="slotProps.item" @click="open" @editportfolio="editportfolio" @deleteportfolio="deleteportfolio"/>
			</div>
		</template>
	</listpaginated>

	<transition name="fademodal">
		<modal v-if="selected && menu" @close="selectionCancel" mclass="small likemenu">

			<template v-slot:body>
				<listmenu :items="menu" @action="menuaction" :close="selectionCancel" />
			</template>

		</modal>
	</transition>
	
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
