<template>
<div class="emails_templates_preview">
    <div class="header">
        
        <div class="info" @click="open">
            <div class="name">
                <span>{{template.Name}}</span>
            </div>

            <div class="subject">
                <span>{{template.Subject}}</span>
            </div>

            <div class="smallinfo">
                <div class="item good">
                    <i class="fas fa-envelope-open"></i> <span>{{template.OPENED}}</span>
                </div>

                <div class="item bad" v-if="template.UNSUBSCRIBED">
                    <i class="fas fa-ban"></i> <span>{{template.UNSUBSCRIBED}}</span>
                </div>

                <div class="item" v-if="template.COMPLETED">
                    <i class="fas fa-check-circle"></i> <span>{{template.COMPLETED}}</span>
                </div>

                <div class="item" v-if="template.LINKSVISITED">
                    <i class="fas fa-link"></i> <span>{{template.LINKSVISITED}}</span>
                </div>
            </div>
        </div>
        <div class="formenu">
            <cmenu :template="template"/>
        </div>
    </div>

   

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
