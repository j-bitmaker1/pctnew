<template>
<div class="filemanager_list_file">

    <div class="filepreviewWrapper">
        <filespreview :info="file.info" />
    </div>

    <div class="data">

        <div class="name">
            <span v-if="name">{{name}}</span>
            <span v-else>&mdash;</span>
        </div>
        <div class="meta">
            <span v-if="size">{{size}}, </span>
            <date :date="file.completed || file.created" />
        </div>

        <div class="extended" v-if="!cut">

            <div class="contents" v-if="file.status == 'SUCCESS' && file.data && file.data.length">
                <button class="button small black" @click="open">Show result</button>
                <div class="ticker" :key="i" v-for="(asset, i) in file.data">
                    <span>{{asset.Ticker}}</span>
                </div>
            </div>

            <div class="progress" v-if="file.status == 'ACTIVE' || file.status == 'NEW'">
                <div class="row">
                    <div class="bg" :style="{width : (file.progress) + '%'}">
                    </div>
                </div>
                <div class="value">
                    <value :value="file.progress / 100" mode="p" />
                </div>
            </div>

            <div class="failed" v-if="file.status == 'FAULTED' || ((!file.data || !file.data.length) && file.status == 'SUCCESS')">
                <span>Sorry, auto-recognition of this file is not possible.</span>
            </div>
        </div>

    </div>

    <div class="formenu">
        <filemenu :file="file" @deleted="deleted"/>
    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
