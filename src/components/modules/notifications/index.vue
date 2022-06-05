<template>
<div id="notifications">
	
	<div class="panelWrapper mobp">

		<div class="panel1" @click="changeRead">
			<span>{{$t('labels.notifications.show.' + this.mode)}}</span>
		</div>

		<div class="panel2" @click="clearAll" v-if="mode == 'onlyunread' && counts[mode]">
			<span>Read all</span>
		</div>
	</div>
	

	<listpaginated @count="setcount" :select="{context : 'notifications'}" api="notifications.list" :payload="payload" :start="0" from="pageNumber" to="pageSize" ref="list" transition="list" :bypages="true">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				<swipable :directions="directions" @end="e => makeAsRead(slotProps.item)">
					<notification :event="slotProps.item"/>
				</swipable>
			</div>
		</template>
	</listpaginated>

	<selection context="notifications" :menu="menu"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
