<template>
<div class="campaign_step_ifstep">

    <smeta :step="step" :editing="editing">
        <template v-slot:icon><i class="fas fa-map-signs"></i></template>

        <template v-slot:content>
            <div>

                <div class="caption">
                    <linepreloader v-if="loading"/>
                    <template v-else>
                        <span v-if="template"> The email "{{template.Name}}" has been read? </span>
                        <span v-else>Email template for statement hasn't loaded</span>
                    </template>
                </div>

                <div class="ifbridge enter">
                </div>

                <div class="successpart">
                    <div class="iftime">
                        <div class="timeline">
                            <div class="stepfill"></div>
                        </div>
                    </div>
                    <campaignsStepsList :level="level + 1" :steps="step.SuccessSteps"/>
                </div>

                <div class="failedpart">
                    <div class="iftime">
                        <div class="timeline">
                            <div class="stepfill"></div>
                        </div>
                    </div>
                    <campaignsStepsList :level="level + 1" :steps="step.FailedSteps"/>
                </div>

                <div class="ifbridge leave">
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
