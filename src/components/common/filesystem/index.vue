<template>
<div class="filesystem" :class="[fclass, purpose || '']">
	

	<div class="items customscrollHorizontal" ref="items">

		<div class="cnt back" v-if="showback" @click="up">

			<div class="icon">
				<i class="fas fa-arrow-left small"></i>
			</div>
			<div class="name">
				<span>Back</span>
			</div>
		</div>

		<div class="cnt placehere" v-if="moving" @click="placehere">
			<div class="icon">
				<i class="fas fa-arrows-alt small"></i>
			</div>
			<div class="name">
				<span>Place here</span>
			</div>
		</div>

		<div class="cnt createnew" @click="create">
			<div class="icon">
				<i class="fas fa-plus small"></i>
			</div>
			<div class="name">
				<span>New folder</span>
			</div>
		</div>

		

		
		<div class="cnt" v-if="purpose != 'selectFolder' && !moving && showback && !select.disableMenu">
			<fsmenu :currentroot="current" @reload="load">
				<template v-slot:default>
					<div class="icon">
						<i class="fas small fa-ellipsis-h"></i>
					</div>
					<div class="name">
						<span>Menu</span>
					</div>
				</template>
			</fsmenu>
		</div>

		<div class="preloaderWrapper" v-if="loading">
			<linepreloader  />
		</div>

		<!--  -->
		<listselectable simplelistClass="fslist" :filter="select.filter" :disabled="purpose == 'selectFolder'" view="onobject" :context="select.context" v-if="!loading && sorted.length" :items="sorted">
			<template v-slot:default="slotProps">

				<div class="cnt" :ref="slotProps.item.id" @click="e => { open(slotProps.item) }">
					<div class="icon">
						<i class="fas fa-folder" v-if="slotProps.item.type == 'folder'"></i>
						<i class="fas fa-file" v-if="slotProps.item.type == 'portfolio'"></i>
					</div>
					<div class="name">
						<span>{{slotProps.item.name}}</span>
					</div>
				</div>

			</template>
		</listselectable>

		

		

		<div class="emptyWrapper" v-if="!loading && !sorted.length && root != '0'">
			<span>Folder is empty</span>
		</div>
		
	</div>

	<div class="savePanel" v-if="purpose == 'selectFolder'">
		<button class="button black" @click="close">
			Cancel
		</button>

		<button class="button" @click="selectCurrent">
			Select
		</button>
	</div>

	<transition name="fademodal">
		<modal v-if="moving" @close="cancelmoving" mclass="small likelabel">
			<template v-slot:body>
				Moving items
			</template>
		</modal>
	</transition>

	<selection :context="select.context" :menu="menu" v-if="select.disableMenu || purpose != 'selectFolder'"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
