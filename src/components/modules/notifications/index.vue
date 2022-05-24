<template>
<div id="notifications">

	<listpaginated context="notifications" api="notifications.list" :payload="payload" :start="0" from="pageNumber" to="pageSize" ref="list" :bypages="true">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<notification :event="slotProps.item"/>
			</div>
		</template>
	</listpaginated>

	<selection context="notifications" :menu="menu"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
