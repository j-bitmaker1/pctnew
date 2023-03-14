<template>
<div id="settings_integrations">
    <linepreloader v-if="loading" />
    <div class="cnt" v-else>

        <div class="empty mobp" v-if="!integrations.length">
            <span>
                Empty
            </span>
        </div>

        <list v-else :items="integrations" @click="click">
            <template v-slot:default="slotProps">

                <div class="integration">
                    <div class="name">
                        <span>{{slotProps.item.name}}</span>
                    </div>
                </div>

            </template>
        </list>

    </div>

    <div class="savePanel left">
        <button class="button" @click="add">
            New Connection <i class="fas fa-plus"></i>
        </button>

    </div>
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
