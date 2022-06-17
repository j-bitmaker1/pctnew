<template>
<div id="allfactors">


	<linepreloader v-if="loading" />
	<div class="cnt" v-else>

		<div class="controls mobp">
			<listcontrols @search="search" :searchvalue="searchvalue"/>
		</div>

		<listgroupedsliced :select="select" :group="grouped" :count="10" ref="list">

			 <template v-slot:group="slotProps">
				<div class="groupCaption mobp">
					<span>{{slotProps.index}}</span>
				</div>
			</template>

			<template v-slot:list="slotProps">
				<div class="factorWrapper mobp" @click="e => selectFactor(slotProps.item)">
					<div class="name">
						<span>{{slotProps.item.name}}</span>
					</div>
					<div class="tv">
						<div class="type">
							<span>{{slotProps.item.type}}</span> <i v-if="slotProps.item.key" class="fas fa-certificate"></i>
						</div>

						<div class="volatility">
							<div class="label">
								<span>Volatility</span>
							</div>
							<div class="value">
								<value :value="slotProps.item.volatility / 100" mode="p"/>
							</div>
						</div>
					</div>
				</div>
			</template>
		</listgroupedsliced>

	</div>	

	<selection :context="select.context" @success="selected"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
