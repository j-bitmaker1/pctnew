<template>
<div id="buylists_lists">

    <div class="panel mobp">
        <button class="button" @click="createbuylist">
            <i class="fas fa-plus"></i> New buy list
        </button>
    </div>

    <div class="controls mobp">
        <listcontrols :searchvalue="searchvalue" :count="count" :sortvalue="sort" :sorting="sorting" @search="search" @sort="sortchange" store="buylists"/>
    </div>

    <listpaginated placeholder="No Buylists found" :api="api" :payload="payload" @count="setcount" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
		<template v-slot:default="slotProps">

			<div class="wrapper mobp" @click="e => click(e, slotProps.item)">
                <buylist :buylist="slotProps.item" @deleted="e => deletebl(slotProps.item)"/>
            </div>

		</template>
	</listpaginated>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
