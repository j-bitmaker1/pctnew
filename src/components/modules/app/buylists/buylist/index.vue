<template>
<div id="buylist">

    <div class="namerow">
		<div class="namewrapper">
			<div class="name">
				<span>{{buylist.name}}</span>
			</div> 
			<div class="date"><date :date="buylist.created" /></div>
		</div>

		<div class="forsettings">
			<bmenu :buylist="buylist" buttonclass="diconbutton"/>
		</div>
	</div>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
