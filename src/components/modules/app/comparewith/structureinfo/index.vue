<template>
<div id="comparewith_structureinfo">
    <div class="name mobp"><span>{{annuity.name}}</span><template v-if="weight"> &middot; </template><value v-if="weight" :mode="mode" :value="weight"/></div>

    <infotable type="annuity" :data="annuity" :fields="fields"/>
    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
