<template>
<div class="filesystem" :class="fclass">
	

	<div class="items" ref="items">

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

		<div class="cnt createnew" v-if="!select || select.type == 'folder'" @click="create">
			<div class="icon">
				<i class="fas fa-plus small"></i>
			</div>
			<div class="name">
				<span>New folder</span>
			</div>
		</div>

		<div class="preloaderWrapper" v-if="loading">
			<linepreloader  />
		</div>

		<div class="emptyWrapper" v-if="!loading && !sorted.length && root != '0'">
			<span>Folder is empty</span>
		</div>
		
		<!--  -->
		<list :selectMultiple="selectMultiple" selectMultipleClass="onobject" @selectionSuccess="selectionSuccess" v-if="!loading && sorted.length" :items="sorted">
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
		</list>

		

		
	</div>

	

	<div class="savePanel" v-if="select && select.type == 'folder'">
		<button class="button black" @click="close">
			Cancel
		</button>

		<button class="button" @click="selectCurrent">
			Select
		</button>

		
	</div>

	<transition name="fademodal">
		<modal v-if="selected" @close="closeselected" mclass="small likemenu">
			<template v-slot:body>
				<listmenu :items="menu" @action="menuaction" :close="closeselected" />
			</template>
		</modal>
	</transition>

	<transition name="fademodal">
		<modal v-if="moving" @close="cancelmoving" mclass="small likelabel">
			<template v-slot:body>
				Moving items
			</template>
		</modal>
	</transition>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
