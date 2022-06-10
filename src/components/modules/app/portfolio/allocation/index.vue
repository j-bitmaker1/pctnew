<template>
<div id="allocation">

	<div class="controls mobp">
		<div class="grouping">
			<select class="custom likecaption" @change="grouping" :value="activegrouping">
				<option :value="group.id" v-for="group in groups" :key="group.id">{{$t(group.text)}}</option>
			</select>
		</div>
	</div>

	<allocationMain :assets="assets" :activegrouping="activegrouping"/>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
