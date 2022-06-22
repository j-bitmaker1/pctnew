<template>
<div class="campaign_step_ifstep" >

    <smeta :step="step" :editing="editing">

        <template v-slot:content>
            <div>
                <div class="caption">
                    <linepreloader v-if="loading"/>
                    <template v-else>

                        <div class="header">
                            <div class="iconwrapper">
                                <div class="icon">
                                    <i class="fas fa-map-signs"></i>
                                </div>
                            </div>

                            <div class="txt">
                                <span v-if="template"> The email "{{template.Name}}" has been read? </span>
                                <span v-else>Email template for statement hasn't loaded</span>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="ifbody" :class="result">

                    <div class="ifbridge enter start">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="successpart">
                        <div class="iftime">
                            <div class="timeline">
                                <div class="stepfill"></div>
                            </div>
                        </div>
                        <div class="listWrapper" >
                            <div class="ifcaption">
                                <span>Yes</span>
                            </div>
                            <campaignsStepsList  v-if="step.SuccessSteps && step.SuccessSteps.length" :level="level + 1" :steps="step.SuccessSteps"/>
                        </div>
                    </div>

                    <div class="ifbridge beetween leave">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="ifbridge beetween enter">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
                    </div>

                    <div class="failedpart" >
                        <div class="iftime">
                            <div class="timeline">
                                <div class="stepfill"></div>
                            </div>
                        </div>
                        <div class="listWrapper">
                            <div class="ifcaption">
                                <span>No</span>
                            </div>
                            <campaignsStepsList v-if="step.FailedSteps && step.FailedSteps.length" :level="level + 1" :steps="step.FailedSteps"/>
                        </div>
                        
                    </div>

                    <div class="ifbridge leave end">
                        <div class="inner">
                            <div class="left cb"><div class="bridge"></div></div>
                            <div class="right cb"><div class="bridge"></div></div>
                        </div>
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
