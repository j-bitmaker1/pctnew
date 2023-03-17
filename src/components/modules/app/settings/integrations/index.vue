<template>
    <div id="settings_integrations">
        <linepreloader v-if="loading" />
        <div class="cnt" v-else>
            <div class="empty mobp" v-if="!integrations.length">
                <span> Empty </span>
            </div>

            <list v-else :items="integrations">
                <template v-slot:default="slotProps">
                    <div class="integration">
                        <div class="header">
                            <span>{{
                                integrationTextByType(slotProps.item.Type)
                            }}</span>
                        </div>
                        <div class="body">
                            <div class="textcontent">
                                <div class="textfield name">
                                    <span>{{ slotProps.item.Name }}</span>
                                </div>
                                <div class="textfield login">
                                    <span>{{ slotProps.item.Login }}</span>
                                </div>
                                <div class="textfield password">
                                    <span>{{ slotProps.item.Password }}</span>
                                </div>
                                <div class="textfield repcode">
                                    <span>{{ slotProps.item.Repcode }}</span>
                                </div>
                            </div>
                            <div class="removebutton">
                                <button
                                    class="button"
                                    @click="() => remove(slotProps.item.Name)"
                                >
                                    <i class="fas fa-times"></i>
                                </button>
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
