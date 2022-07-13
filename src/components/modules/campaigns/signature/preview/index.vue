<template>
<div class="signature_preview">
    <div class="header">

        <div class="icon" @click="open">
            <i class="fas fa-signature"></i>
        </div>
        
        <div class="info" @click="open">
            <div class="name">
                <span>{{signature.Name}}</span>
            </div>

        </div>
        <div class="formenu">
            <cmenu @deleted="deleted" :signature="signature"/>
        </div>
    </div>

   

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
