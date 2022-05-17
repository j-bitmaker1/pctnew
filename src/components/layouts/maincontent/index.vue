<template>
  <div
	id="maincontent"
	class="fixedOnPageTop"
	:class="{
	  modalShowed: modalShowed ? true : false,
	}"
  >
	<slot name="content"> &nbsp; </slot>

	
  </div>
</template>

<script src="./index.js"></script>
<style scoped lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->





















