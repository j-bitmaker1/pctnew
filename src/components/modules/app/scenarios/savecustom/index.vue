<template>
<div id="scenarios_savecustom">

    

    <div class="info mobp">

        <div class="form ">
            <forms :value="{name, description}" @change="changeInfo" ref="form" :fields="fields"/>
        </div>

    </div>
    <div class="factors">
        <factors :info="{factors}"/>
    </div>

    <div class="savePanel">
        <button class="button black" @click="cancel">
            Cancel
        </button>

        <button class="button" @click="save">
            Save
        </button>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
