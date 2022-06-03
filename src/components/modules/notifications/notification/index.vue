<template>
<div class="notificaion">

	<div class="notificaionRow">
		<div class="iconWrapper">
			<div class="icon">
			<i :class="event.icon" />
			</div>
		</div>
		<div class="text">
			<div class="title" v-if="event.title || event.body">
				<span class="txt">{{event.title || event.body}}</span> <date :date="event.created" />
			</div>
			<div class="body" v-if="event.title">
				<span>{{event.body}}</span>
			</div>

		

			<div class="actionsWrapper" v-if="actions.length">
				<div class="actions">
					<action v-for="(action, i) in actions" :key="action.text" :action="action" v-if="i < 2" />

					<div class="more" v-if="actions.length > 2">

						<tooltip>
							<template v-slot:item>
								<div class="buttonpanel">
									<i class="fas fa-ellipsis-h"></i>
								</div>
							</template>

							<template v-slot:content>
								<div class="menuactions">
									<action v-for="(action, i) in actions" :key="action.text" :action="action"/>
								</div>

								<!-- <listmenu :items="menu" @action="menuaction" :close="i.close"/> -->
							</template>

						</tooltip>
					</div>

				</div>

			</div>

		</div>
	</div>

</div>
</template>

<script src="./index.js"></script>

<style scoped lang="sass" src="./index.sass"></style>
