<template>
<div id="campaigns_emailpreview">

    
    

    <div class="wrapper mobp">
        <div class="subject">
            <span>{{subject}}</span>
        </div>
    </div>

    <div class="wrapper mobp" v-if="profile">
        <client :profile="profile" />
    </div>

    <div class="wrapper mobp">
        <div class="date">
            <date :date="date"/>
        </div>

        <div class="read">
            <span>Read</span> <date :date="read"/> <i class="fas fa-envelope-open goodcolor"></i>
        </div>
        
    </div>

    

    <div class="wrapper mobp">
        <div v-shadow>
            <div v-html="body">
            </div>
        </div>
    </div>

   
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
