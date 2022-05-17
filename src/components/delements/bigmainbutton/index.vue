<template>
<div class="bigmainbutton" :class="{active}">

	<div class="fline">
	  <div class="iconwrapper" v-if="icon">
		  <i :class="icon" />
	  </div>
	  <div class="label">
		  <span>{{label}}</span>
	  </div>
	</div>

	<div class="labels">
		<div class="blabel" v-if="blabel">
			<span>{{blabel}}</span>
		</div>
		<div class="nlabel" v-if="nlabel">
			<div class="notification">{{nlabel}}</div>
		</div>
	</div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
