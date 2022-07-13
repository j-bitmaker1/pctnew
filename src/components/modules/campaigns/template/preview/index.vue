<template>
<div class="templates_single_preview">
    <div class="header">
        
        <div class="info" @click="open">
            <div class="name">
                <span>{{template.Name}}</span>
            </div>

            <div class="contentinfo">
                <div class="row">
                    <div class="icon goodcolor"><i class="fas fa-envelope"></i></div>
                    <div class="label"><span>Total emails:</span></div>
                    <div class="value"><span>{{info.totalEmails}}</span></div>
                </div>

                <div class="row">
                    <div class="icon maincolor"><i class="fas fa-clock"></i></div>
                    <div class="label"><span>Median time:</span></div>
                    <div class="value"><span>{{medianTime}}</span></div>
                </div>

            </div>
            
        </div>
        <div class="formenu">
            <cmenu v-if="showMenu && template.canedit()" :campaignTemplate="template" @remove="remove"/>
        </div>
    </div>

   

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
