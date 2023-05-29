<template>
<div id="masterpanel">
        
    <div class="item" v-if="status.type" @click="startover">
        <span>Start over</span>
        <i class="fas fa-redo"></i>
    </div>

    <div class="item" v-if="status.type" @click="e => change('type')">
        <span>{{status.type.name}}</span>
        <i class="fas fa-times"></i>
    </div>

    <template v-if="status.context.portfolio && portfolio" >
        <div class="item" @click="e => change('portfolio')">
            <span>{{portfolio.name}}</span>
            <i class="fas fa-times"></i>
        </div>
    </template>

    <template v-if="status.context.client && client" >
        <div class="item" @click="e => change('client')">
            <span>{{client.FName}} {{client.LName}}</span>
            <i class="fas fa-times"></i>
        </div>
    </template>

    <template v-if="status.type && status.type.parameters">
        <div v-if="typeof status.parameters[parameter.Id] != 'undefined' && status.parameters[parameter.Id]" v-for="parameter in status.type.parameters" :key="parameter.Id" class="item" @click="e => change('parameter', parameter.Id)">
            <span>{{status.parameters[parameter.Id]}}</span>
            <i class="fas fa-times"></i>
        </div>
    </template>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
