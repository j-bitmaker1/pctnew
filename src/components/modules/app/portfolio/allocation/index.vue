<template>
<div id="allocation">

	<div class="controls mobp">
		<div class="grouping">
			<select class="custom likecaption" @change="grouping" :value="activegrouping">
				<option :value="group.id" v-for="group in groups" :key="group.id">{{$t(group.text)}}</option>
			</select>
		</div>

		<!--<div class="forlist">
			<div class="diconbutton">
				<i class="fas fa-list" @click="edit"></i>
			</div>
		</div>-->
	</div>

	<div class="chartWrapper mobp">
		<highcharts ref="chart" :options="chartOptions"></highcharts>
	</div>

	<div class="legend">

		<div class="caption mobp" v-if="drilldown">
			<span>{{drilldown.name}}</span>
		</div>

		<list :items="currentSerie.data" @click="clickLegend">
			<template v-slot:default="slotProps">

				<div class="serie mobp">
					<serie :name="slotProps.item.name" :y="slotProps.item.y" :color="slotProps.item.color"/>
				</div>

			</template>
		</list>
	</div>

	<!--<div class="assets">
		<assets :assets="assets"/>
	</div>-->
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
