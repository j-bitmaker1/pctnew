<template>
<div id="portfolios_list">

	<div class="controls mobp">
		<listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange"/>
	</div>

	<slot name="prepend">
	</slot>

	<listpaginated placeholder="No portfolios found" activity="portfolio" :select="select" :api="api" :payload="payload" @count="setcount" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<portfolio @gotofolder="gotofolder" :showClient="showClient" @changeClient="changeClient" :hasmenu="hasmenu" :portfolio="slotProps.item" @click="open" @deleteportfolio="deleteportfolio"/>
			</div>
		</template>
	</listpaginated>

	<selection :context="select.context" v-if="!select && !select.disableMenu" :menu="menu"/>
	
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
