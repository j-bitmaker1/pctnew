<template>
  <div class="m-message" v-show="visible">
    <div class="m-message-icons" @click="handleClick" v-if="img || $slots.icon">
      <img :src="img" v-if="img" class="m-message--icon" alt="Img"/>
      <slot name="icon" v-else></slot>
    </div>
    <div class="m-message-content" @click="handleClick">
      <div class="m-message--title" v-if="title || $slots.title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <div class="m-message--body">
        <slot name="message">
          {{ message }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'm-mmessage',
  props: {
    img: String,
    icon : String,
    closable: Boolean,
    closeHandler: Function,
    clickHandler: Function,
    chat: {},
    title: String,
    message : String,
    supportHTML: Boolean, // content support html
    isCollapsed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: true,
      collapsed: this.isCollapsed,
    }
  },
  
 
  methods: {
    
    triggerCollapse() {
      this.collapsed = !this.collapsed
    },
    handleClick: function () {
      if (typeof this.clickHandler === 'function') this.clickHandler(this.close)

    },
    close() {
      this.visible = false
    },
    handleClose() {
      if (typeof this.closeHandler === 'function') this.closeHandler(this.close)
      else this.close()
    }
  },
  mounted() {

  }


}
</script>
