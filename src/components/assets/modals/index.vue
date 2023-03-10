<template>
<div id="modals">

    <transition-group name="fade" tag="div">

		<modal v-for="modal in modals" :key="modal.id" :modalid="modal.id" @close="e => close(modal.id, (modal.events || {}).close)" :mclass="modal.mclass || ''" :fromtop="modal.fromtop || false" :path="modal.path" :module="modal.module" :data="modal.data || {}" :events="modal.events || {}" :canpip="modal.canpip">

			<template v-slot:header><span>{{modal.caption}}</span></template>

			<template v-slot:footer></template>

		</modal>
	</transition-group>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
