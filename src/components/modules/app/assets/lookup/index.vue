<template>
<div id="assets_lookup">

    <div class="linenavigation">
        <linenavigation :items="navigation" :navdefault="navdefault" :navkey="navkey"/>
    </div>

    <div class="componentWrapper">
	    <component :value="searchvalue" :is="active" @search="search" @selected="selected" :nfb="true"/>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
