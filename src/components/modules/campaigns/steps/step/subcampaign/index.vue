<template>
<div class="campaign_step_subcampaign">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon>
            <i class="fas fa-route"></i>
        </template>
        <template v-slot:content>
            <div>
                <div class="caption">

                    <div class="header">

                        <linepreloader v-if="loading"/>
                        <template v-else>
                         
                            <div class="txt">
                                <div class="subcaption"><span>Sub campaign</span></div>
                                <div class="name">
                                    <span v-if="template" class="nm">{{template.Name}}</span>
                                    <span v-else>Sub campaign hasn't loaded</span>
                                </div>
                                
                            </div>
                        </template>
                    </div>
                    
                </div>

                <div class="subbody">

                    <div class="expandlabel" @click="() => {expanded = !expanded}">
                        <template v-if="!expanded"><i class="fas fa-expand"></i> <span>Expand campaign</span></template>
                        <template v-else><i class="fas fa-compress"></i> <span>Collapse campaign</span></template>
                    </div>
                    <div class="stepsWrapper" v-if="expanded">
                        <campaignsStepsList :steps="template.content"/>
                    </div>
                     
                   
                </div>
            </div>
        </template>

        <template v-slot:menu>
            <slot name="menu"></slot>
        </template>

    </smeta>

    
</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
