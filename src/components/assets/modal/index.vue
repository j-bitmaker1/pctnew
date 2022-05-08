<template>
  <transition name="fade">

    <div id="modal">
      <div class="modal-backdrop" @click="close"></div>
      <div class="modal-wrapper" v-touch:swipe.bottom="close" v-touch:moving="moving">
        <div class="modal customscroll" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" v-scroll="scrolling">

          
          <div class="modal-header">
              <div class="headerWrapper">
                <slot name="header">
                  {{ $t("caption.header") }}
                </slot> 
              </div>

              <div class="modal-close" @click="close">
                <i class="fas fa-times"></i>
              </div>
          </div>

          <div class="modal-body" id="modalDescription">
            <slot v-if="!module" name="body" :scroll="scroll">
            </slot>
            <component v-else :is="module" />
          </div>
          
          <div class="modal-footer" v-if="displayFooter">

          </div>

        </div>
      </div>

    </div>
    
  </transition>
</template>

<script src="./index.js"></script>
<style  lang="sass" src="./index.sass"></style>

<!-- THEMES BEGIN -->
<!-- THEMES END -->



































