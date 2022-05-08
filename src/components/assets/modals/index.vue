<template>
<div id="modals">

    <transition-group name="fade" tag="div">

		<modal v-for="modal in modals" :key="modal.id" @close="e => close(modal.id)" :module="modal.module">

			<template v-slot:header>{{modal.caption}}</template>

			<template v-slot:body="scope">

				<div class="modalcommoncontent" :scroll="scope.scroll">
					<component v-if="modal.component" :is="modalcomponent" />
				</div>

			</template>

			<template v-slot:footer></template>

		</modal>
	</transition-group>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
