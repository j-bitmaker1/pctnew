<template>
<div class="signature_preview">
    <div class="header">
        
        <div class="info" @click="open">
            <div class="name">
                <span>{{signature.Name}}</span>
            </div>

        </div>
        <div class="formenu">
            <cmenu :signature="signature"/>
        </div>
    </div>

   

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
