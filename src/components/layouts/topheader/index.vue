<template>
  <div
	id="topheader"
	class="fixedOnPageTop"
	:class="{
	  hasback:back,
	  gray
	}"
  >
	<div class="topheader">
	  <div class="work">
		<div class="headerLine">
		  <div class="leftIcon icon" v-if="back">
			<backButton :action="back"/>
		  </div>

		  <div class="infoPart">
			<div>
			  <slot name="info"> &nbsp; </slot>
			</div>
		  </div>

		  <div class="rightIcons icon">
			<slot name="right"> &nbsp; </slot>
		  </div>
		</div>
		<div class="additionalWrapper">
		  <slot name="additional"></slot>
		</div>
	  </div>
	</div>
  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->





















