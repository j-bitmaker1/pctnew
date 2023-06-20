<template>
<div :class="{
    rendered : rendered ? true : false,
    notrendered : !rendered ? true : false,
    willremoving,
    removing,
    saved : event.sid

}" class="ai_event" ref="evnt" :eid="event.id" :session="event.session" :style="height ? 'height:' + height + 'px;' : ''">


    <template v-if="event.type == 'message'">

        <div  class="avatar" :class="event.data.you ? 'you' : 'assi'">
            <div class="userpicch">
                <span class="lbl" v-if="!event.data.you">401kAI</span>
                <span v-else>{{firstName.substr(0,1).toUpperCase()}}{{lastName.substr(0,1).toUpperCase()}}</span>        
            </div>
        </div>


        <div class="message" v-if="!itisfile" :class="event.data.you ? 'you' : 'assi'">
            
            <template v-if="event.data.message">

                <div class="msg visiblemessage cancopy">
                    <span v-html="convertNewLinesToBr(event.data.visiblepart)"></span>
                </div>
                <div class="msg unvisiblemessage">
                    <span v-html="convertNewLinesToBr(event.data.message)"></span>
                </div>

            </template>

            <div class="icons" v-if="event.data.icons && event.data.icons.length">
                <i :key="icon.i" v-for="icon in event.data.icons" :class="icon.i + ' ' + icon.style "></i>
            </div>

        </div>

        <div class="file" v-if="itisfile">
            <filepreview :id="fileid" :cut="true" :nomenu="true"/>
        </div>

        <div class="messagestatuspanel" v-if="!itisfile">
            <div class="panelitems">
                <div class="messagestatuspanelitem copymessage" @click="copymessage">
                    <i class="fas fa-copy"></i>
                </div>

                <div class="messagestatuspanelitem thumbsup" v-if="event.data.requestId" :class="{active : thumbs > 0}" @click="thumbsup">
                    <i class="fas fa-thumbs-up"></i>
                </div>

                <div class="messagestatuspanelitem thumbsdown" v-if="event.data.requestId" :class="{active : thumbs < 0}" @click="thumbsdown">
                    <i class="fas fa-thumbs-down"></i>
                </div>
            </div>
        </div>

        <div class="messagestatuspanel" v-if="itisfile">
            <div class="panelitems">
                <div class="messagestatuspanelitem deletefile" @click="deletefile">
                    <i class="far fa-times-circle"></i>
                </div>
            </div>
        </div>

    </template>

    <template v-if="event.type == 'html'">

            <div class="html">
                <iframe height="633" width="292" :srcdoc="event.data.html"></iframe>
            </div>

            <div class="messagestatuspanel">
                <div class="panelitems">
                    <div class="messagestatuspanelitem copycode" @click="copycode">
                        <i class="fas fa-copy"></i>
                    </div>

                    <div class="messagestatuspanelitem expandhtmlresult" @click="expandhtmlresult">
                        <i class="fas fa-expand"></i>
                    </div>
                </div>
            </div>

    </template>

    <template v-if="event.type == 'intro'">
        <div class="intro">
            <sticker src="ai.png" :width="128"/>
            <div>
            <span>Rixtrema Assistant</span>
            </div>
        </div>
    </template>

    <template v-if="event.type == 'parameter'">
        <div class="parameter">
                <div class="answers" v-if="event.data.type == 'answers'" :class="{showedallanswers : showedallanswers}">

                    <template v-key="answer.answerid" v-for="(answer, i) in event.data.answers">

                        <div :class="'answer ' + (answer.style || '')" :value="answer.text" :answerid="answer.answerid">
                            <button class="button medium" :class="{leloading : eventsinaction[answer.answerid]}" @click="e => clickanswer(answer.text, event)">
                                {{answer.text}} <i v-key="icon.i" v-for="(icon) in answer.icons" :class="icon.i + ' ' + icon.style"></i>
                            </button>
                        </div>

                        <div class="answerShowMore" v-if="i == 6 && event.data.answers.length > 7" @click="showmore">
                            <span>Show more</span>
                        </div>

                    </template>
                    
                </div>
        </div>
    </template>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
