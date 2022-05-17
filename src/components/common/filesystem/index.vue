<template>
<div class="filesystem">
	<linepreloader v-if="loading" />

	<div class="items" ref="items">

		<div class="cnt back" v-if="showback" @click="up">

			<div class="icon">
				<i class="fas fa-arrow-left small"></i>
			</div>
			<div class="name">
				<span>Back</span>
			</div>
		</div>

		<div class="cnt createnew" v-if="!select">

			<div class="icon">
				<i class="fas fa-plus small"></i>
			</div>
			<div class="name">
				<span>New folder</span>
			</div>
		</div>
		<!-- :selectMultiple="true" selectMultipleClass="onobject" -->
		<list :items="sorted">
			<template v-slot:default="slotProps">

				<div class="cnt" @click="e => { open(slotProps.item) }">
					<div class="icon">
						<i class="fas fa-folder" v-if="slotProps.item.type == 'directory'"></i>
						<i class="fas fa-file" v-if="slotProps.item.type == 'portfolio'"></i>
					</div>
					<div class="name">
						<span>{{slotProps.item.name}}</span>
					</div>
				</div>

			</template>
		</list>

		
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
