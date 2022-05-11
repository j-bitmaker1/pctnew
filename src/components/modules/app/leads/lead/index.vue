<template>
<div class="leads_lead">

    <div class="line">

        <div class="profilerow row">
            <div class="userpicWrapper">
                <userpic :userinfo="profile" />
            </div>

            <div class="data" v-if="profile">
                <div class="name"><span>{{profile.FName}} {{profile.LName}}</span></div>
                <div class="email"><span>{{profile.Email}}</span></div>
            </div>

            <!---->
        </div>

        <div class="statsrow row">
            <div>
                <span class="label">Crash Rating</span>
                <coloredNumber :number="15"/>
            </div>

            <div>
                <span class="label">Capacity</span>
                <coloredNumber :number="55"/>
            </div>

            <div>
                <span class="label">Tolerance</span>
                <coloredNumber :number="85"/>
            </div>
        </div>

        <div class="menurow row">
            <div class="menuWrapper">
                <i class="fas fa-ellipsis-v"></i>
            </div>
        </div>
    </div>

    <div class="daterow row">
        <date :date="profile.Modified || profile.Created"/>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
