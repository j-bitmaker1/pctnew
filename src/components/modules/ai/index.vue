<template>
	<div id="ai" :class="{loading : loading, inputactive, nospeechrecognition, speech, pip, mobileview, chatstopped}">
		<div class="contents" v-if="!mobileview">
            <contents @startnewchat="startnewchat" @selectchat="selectchat"/>
        </div>

        <div class="report">

            <div class="assistantheader">
                <div class="loadingWrapper">
                    <div class="wrp">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    
                </div>
        
                <div class="masterpanelWrapper" ref="masterpanel">
                    <masterpanel v-if="currentStatus" :status="currentStatus" @startover="startover" @change="changemaster"/> 
                </div>

                <div class="showmenu" @click="showmenu">
                    <i class="fas fa-chevron-circle-left"></i>
                </div>
            </div>

            <div class="reportCenter">
                
                <div class="events customscroll2" :class="{fadeoutend, fadeout}" ref="events" v-scroll="componentscrolling">
                    
                    <div class="eventsflex">
						<aievent 
                            :ref="'event_' + event.id" 
                            @answer="clickanswer" 
                            @deletefile="id => {deletefile(id, event)}"
                            :eventsinaction="eventsinaction" 
                            firstName="Max" 
                            lastName="Grishkov" 
                            :rendered="rendered[event.id] || false" 
                            :key="event.id + event.modkey" 
                            :event="event" 
                            v-for="event in currentEvents"

                            :willremoving="events_willremoving[event.id]"
                            :removing="events_removing[event.id]"
                            :height="events_heights[event.id] || 0"
                            :removed="events_removed[event.id]"

                            v-if="!(event.hidden || event.data.shadow || (event.type == 'parameter' && event.data.type == 'answers' && !event.data.answers.length))"
                        />

                    </div>

                    <div class="stopped">
                        <div>
                            <span>This chat is over</span>
                        </div>
                        <div class="btnwrapper">
                            <button class="button startnewchat" @click="startnewchat">Start new chat</button>
                        </div>
                    </div>
            
                </div>
                
            </div>

            <div class="input">
                <div class="inputPaneCenter">
                    <div class="inputPane">
                        <div class="inputWrapper">
                            <textarea spellcheck="true" :disabled="speech || loading" placeholder="Enter text" ref="input" :value="textareavalue" @keyup="textareakeyup"></textarea>
                            <!--<input type="text" placeholder="Enter text"/>-->
                        </div>
                        <div class="panel">

                            <!--<div class="iconbt attach" @click="attach">
                                <i class="fas fa-paperclip"></i>
                            </div>-->

                            <div class="iconbt microphone" @click="microphoneClick">
                                <i class="fas fa-microphone"></i>
                            </div>
            
                            <div class="iconbt send" @click="sendClick">
                                <i class="fas fa-paper-plane"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
