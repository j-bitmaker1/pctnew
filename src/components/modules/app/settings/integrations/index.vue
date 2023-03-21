<template>
    <div id="settings_integrations">
        <linepreloader v-if="loading" />
        <div class="cnt" v-else>
            <div class="empty mobp" v-if="!integrations.length">
                <span> Empty </span>
            </div>

            <list v-else :items="integrations" class="listintegrations">
                <template v-slot:default="slotProps">
                    <div
                        :class="{
                            integration: true,
                            [slotProps.item.Type]: true,
                        }"
                    >
                        <!-- <div class="header"></div> -->
                        <div class="textcontent">
                            <div class="textfield type">
                                <span>{{
                                    integrationTextByType(slotProps.item.Type)
                                }}</span>
                            </div>
                            <div class="textfield customname">
                                <span>{{ slotProps.item.Name }}</span>
                            </div>
                        </div>
                        <div class="listmenubutton">
                            <button
                                class="button ghost menubutton"
                                @click="
                                    () => editIntegration(slotProps.item.Name)
                                "
                            >
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                </template>
            </list>
        </div>

        <div class="savePanel left">
            <button class="button" @click="() => add()">
                New Connection <i class="fas fa-plus"></i>
            </button>
        </div>
    </div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
