<template>
<div id="ai_history">

    <template v-if="history && history.length">
        <div class="caption">
            <span>Chats history</span>
        </div>

        <div class="chatinhistory" v-for="chat in history" :cid="chat.id" :key="chat.id" @click="e => selectchat(chat)">
            <div class="title">
                <span>{{chat.title}}</span>
            </div>

            <div class="lastmessage" v-if="chat.lastMessage">

                <div class="avatar">
                    <div class="userpicch">
                        <span>{{ chat.lastMessage.role == 'ASSISTANT' ? 'AI: ' : 'You: ' }}</span>
                    </div>
                </div>
    
    
                <div class="message">
                    <span v-if="chat.lastMessage.type == 'message'">{{chat.lastMessage.content}}</span>
                    <span v-if="chat.lastMessage.type == 'html'">Html code</span>
                </div>

                
            </div>

            <div class="date">
                <date :date="chat.date"/>
            </div>
        </div>
    </template>

    <template v-else>
        <div class="empty" v-if="!loading">
            <span>You don't have any chat history with 401kAI</span>
        </div>
        <div class="loading" v-if="loading">
            <linepreloader />
        </div>
    </template>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
