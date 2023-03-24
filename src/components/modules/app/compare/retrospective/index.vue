<template>
<div id="compare_retrospective">
    <linepreloader v-if="loading" />

    <div class="cnt" v-else>

        <div class="names">
            <div class="name" v-for="portfolio in portfolios" :key="portfolio.id">
                <div class="nameB">
                    <div class="detailspanel" @click="e => showassets(portfolio.id)">
						<i class="fas fa-list-ul"></i>
					</div>
                    <span>{{portfolio.name}}</span>
                    <div class="selectionpanel">
						<i class="fas fa-search" @click="e => selectone(portfolio.id)"></i>
						<i class="fas fa-times" @click="e => removeitem(portfolio.id)"></i>
					</div>
                </div>
            </div>
          
        </div>  


        <portfolioRetrospective :portfolios="portfolios" />

    </div>
   

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
