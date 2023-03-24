<template>
<div id="comparewith_stress">



    <linepreloader v-if="loading"/>

    <div class="ctwrapper" v-else>

        <div class="header mobp">
			<div class="forpanel">
				<span>Crash test</span>
			</div>	
			

			<div class="forsettigns" >
				<iconstoggle v-if="hasdollarsvm" :icons="valuemodes" @change="changevaluemode" :value="valuemode"/>
			</div>
		</div>

		<div class="crsliderWrapper mobp" v-if="portfolios && cts">
            <crsliders :cts="cts" :portfolios="portfolios"/>
        </div>

        <ctmain :cts="cts" :portfolios="portfolios" :mode="valuemodecomposed"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
