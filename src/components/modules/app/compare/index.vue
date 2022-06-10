<template>
<div id="compare">



    <linepreloader v-if="loading"/>

    <div class="ctwrapper" v-else>

        <div class="header mobp">
			<div class="forpanel">
				<span>Portfolios crash test</span>
			</div>	

			<div class="forsettigns">
				<iconstoggle :icons="valuemodes" @change="changevaluemode" :value="valuemode"/>
			</div>

			<div class="settings">
				<ctmenu  @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged"/>
			</div>

			
		</div>

        <ctmain :cts="cts" :portfolios="portfolios" :mode="valuemode"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
