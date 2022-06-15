<template>
<div class="scenarios_info">
        
    <div class="shocks mobp infopt" v-if="info.id > 0 && info.shocks">
        <div class="caption">
            <span>Description</span>
        </div>

        <div class="shortDescription">
            <div>{{info.shocks}}</div>
        </div>
    </div>

    <div class="shocks mobp infopt" v-if="info.description">

        <div class="caption" >
            <span v-if="info.id > 0">Event duration</span>
            <span v-else>Description</span>
        </div>

        <div class="shortDescription">
            {{info.description}}
        </div>
    </div>

    <div class="keywords mobp infopt" v-if="info.region || (info.keywords && info.keywords.length)">

        <span class="liketicker">{{info.region}}</span> <tags :tags="info.keywords"/>
     
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
