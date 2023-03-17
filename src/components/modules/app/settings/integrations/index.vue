<template>
    <div id="settings_integrations">
        <linepreloader v-if="loading" />
        <div class="cnt" v-else>
            <div class="empty mobp" v-if="!integrations.length">
                <span> Empty </span>
            </div>

            <list v-else :items="integrations" @click="click">
                <template v-slot:default="slotProps">
                    <div class="integration">
                        <div class="header">
                            <span>{{ slotProps.item.Type }}</span>
                        </div>
                        <div class="body">
                            <div class="name">
                                <span>{{ slotProps.item.Name }}</span>
                            </div>
                            <div class="login">
                                <span>{{ slotProps.item.Login }}</span>
                            </div>
                            <div class="password">
                                <span>{{ slotProps.item.Password }}</span>
                            </div>
                            <div class="repcode">
                                <span>{{ slotProps.item.Repcode }}</span>
                            </div>
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
