<template>
<div id="changepassword">

    <div class="caption mobp">
        <span>{{ $t("common.2901009") }}</span>
    </div>

    <div class="item mobp">
        <div class="label">
            <span>{{ $t("common.2901011") }}</span>
        </div>
        <div class="input"><input type="password" value="" v-model="password" autocomplete="off" /></div>
    </div>

    <div class="savePanel mobp">
        <button class="button" @click="send" :disabled="!password">
            Next
        </button>
    </div>


</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
