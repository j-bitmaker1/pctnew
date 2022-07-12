<template>
<div id="campaigns_signle_main">

	<div class="hasOpened mobp">

		<div v-if="campaign.HaveOpenedMail">
			<sticker src="successmarketing.png" />
			<div class="label">
				<span>Campaign has opened email</span>
			</div>
		</div>

		<div v-if="!campaign.HaveOpenedMail && campaign.Status == 'PROCESS'">
			<sticker src="free-sticker-play-button-4522545.png" />
			<div class="label">
				<span>Campaign active</span>
			</div>
		</div>


		<div class="statusrow mobp" v-if="!campaign.HaveOpenedMail && campaign.Status != 'PROCESS'">
			<sticker :src="stickerdefault" />
		</div>

		
	</div>


	<div class="statusrow mobp" v-if="!campaign.HaveOpenedMail && campaign.Status != 'PROCESS'">
        <status :status="campaign.Status" />
    </div>

    <div class="stepsWrapper mobp">
		<linepreloader v-if="loading"/>
		<campaignsStepsList :steps="steps" :campaign="campaign" v-else/>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
