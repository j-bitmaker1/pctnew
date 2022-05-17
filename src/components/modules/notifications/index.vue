<template>
<div id="notifications">

	<listpaginated @selectionSuccess="selectionSuccess" :selectMultiple="true" api="notifications.list" :payload="payload" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<notification :event="slotProps.item"/>
			</div>
		</template>
	</listpaginated>

	<transition name="fademodal">
		<modal v-if="selected" @close="closeselected" mclass="small likemenu">

			<template v-slot:body>
				<listmenu :items="menu" @action="menuaction" :close="closeselected" />
			</template>

		</modal>
	</transition>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
