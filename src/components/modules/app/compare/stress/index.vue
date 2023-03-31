<template>
<div id="compare">



    <linepreloader v-if="loading"/>

    <div class="ctwrapper" v-else>

        <div class="header mobp">
			<div class="forpanel">
				<span>Portfolios crash test</span>
			</div>	

			<div class="forsettigns" v-if="hasdollarsvm">
				<iconstoggle :icons="valuemodes" @change="changevaluemode" :value="valuemode"/>
			</div>

			<div class="settings">
				<ctmenu :portfolios="portfolios" @scenariosChanged="scenariosChanged" @scoreConverterChanged="scoreConverterChanged"/>
			</div>

			
		</div>

		<div class="summary mobp" v-if="cts">
			<div class="crsliderWrapper" v-for="(ct, id) in cts.cts">
				<div class="label">
					<div class="detailspanel" @click="e => showassets(id)">
						<i class="fas fa-list-ul"></i>
					</div>
					<span>{{summatytext(id)}}</span>
					<div class="selectionpanel">
						<i class="fas fa-search" @click="e => selectone(id)"></i>
						<i class="fas fa-times" @click="e => removeitem(id)"></i>
					</div>
				</div>
				
			</div>

			<!--<summarybutton :reversed="true" :colored="true" v-for="(item, id) in cts.cts" :key="id" :text="summatytext(id)" :number="core.pct.ocr(item.ocr)"/>-->
		</div>

		<div class="crsliderWrapperWR" v-if="cts">
			<crslider :cts="cts" :portfolios="portfolios"/>
		</div>
		
        <ctmain :cts="cts" :portfolios="portfolios" :mode="valuemodecomposed"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
