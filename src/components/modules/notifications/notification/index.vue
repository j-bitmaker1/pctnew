<template>
<div class="notificaion">

    <div class="notificaionRow">
        <div class="icon">
            <i :class="event.icon" />
        </div>
        <div class="text">
            <div class="title" v-if="event.title">
                <span>{{event.title}}</span>
            </div>
            <div class="body" v-if="event.body">
                <span>{{event.body}}</span>
            </div>

            <div class="date">
                <date :date="event.created" />
            </div>

            <div class="actionsWrapper" v-if="event.actions">
                <div class="actions">
                    <action v-for="(action, i) in event.actions" :key="action.text" :action="action" v-if="i < 2" />

                    <div class="more" v-if="event.actions.length > 2">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>

                </div>

            </div>

        </div>
    </div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
