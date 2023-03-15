<template>
<div id="assets_annuities">
    <linepreloader v-if="loading" />
	<div class="cnt" v-else>

		<div class="controls mobp">
			<listcontrols @search="search" :searchvalue="searchvalue"/>
		</div>

		<listgroupedsliced :group="grouped" :count="10" ref="list">

			 <template v-slot:group="slotProps">
				<div class="groupCaption mobp">
					<span>{{slotProps.index}}</span>
				</div>
			</template>

			<template v-slot:list="slotProps">
				<div class="annuityWrapper mobp" @click="e => select(slotProps.item)">
					<div class="name">
						<span>{{slotProps.item.name}}</span>
					</div>
					<div class="tv">
						<div class="type">
							<span>{{slotProps.item.annuity_type}}</span>
						</div>
					</div>
				</div>
			</template>
		</listgroupedsliced>

	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
