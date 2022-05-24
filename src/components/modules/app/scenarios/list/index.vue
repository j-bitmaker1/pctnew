<template>
<div class="scenarios_list">
    <div class="controls mobp">
		<listcontrols />
	</div>


	<listselectable :context="select.context" :items="scenarios" ref="list">
		<template v-slot:default="slotProps">
			<div class="cardWrapper mobp">
				s
			</div>
		</template>
	</listselectable>

	<selection :context="select.context" :menu="menu"/>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
