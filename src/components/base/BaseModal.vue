<template>
  <Teleport v-if="open" to="#teleport">
    <div class="modal-wrapper">
      <div class="modal-overlay" @click="outsideClose">
        <div ref="content" class="modal-content">
          <button type="button" class="modal-close" @click="close"></button>
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script>
let openedCount = 0;
let atleastOneOpen = false;
export default {
  props: {
    open: { type: Boolean },
  },
  methods: {
    close() {
      this.$emit('update:open', false);
    },
    outsideClose($event) {
      if ($event.target !== this.$refs.content && $event.target.contains(this.$refs.content)) {
        this.close();
      }
    },
    checkWrapperState() {
      if (!openedCount) {
        atleastOneOpen = false;
        document.body.style.overflow = null;
        document.body.style.paddingRight = null;
      } else if (!atleastOneOpen && openedCount === 1) {
        atleastOneOpen = true;
        document.body.style.paddingRight =
          window.innerWidth - document.documentElement.clientWidth + 'px';
        document.body.style.overflow = 'hidden';
      }
    },
  },
  watch: {
    open: {
      handler(isOpen) {
        if (isOpen) {
          openedCount += 1;
        } else {
          openedCount -= 1;
        }
        this.checkWrapperState();
      },
    },
  },
  created() {
    if (this.open) {
      openedCount += 1;
      this.checkWrapperState();
    }
  },
};
</script>
<style lang="scss">
.modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // opacity: 0.7;
  background: #222222bd;
  z-index: 500;
}
.modal-overlay {
  position: fixed;
  display: flex;
  justify-content: center;
  overflow: auto;
  overflow-y: scroll;
  z-index: 500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 50px;
}
.modal-content {
  position: relative;
  max-width: 1000px;
  margin: auto auto;
  padding: 40px;
  background-color: #fff;
}
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 15px;
  background-color: transparent;
  border: none;
  transition: color 0.3s ease-in-out;
  &:hover::before,
  &:focus-visible::before {
    color: #e02d71;
  }
}
.modal-close::before {
  position: absolute;
  content: '\2716';
  width: 100%;
  height: 100%;
  color: #222;
  top: 0;
  left: 0;
  object-fit: contain;
  transition: color 0.3s ease-in-out;
}
@media (max-width: 576px) {
  .modal-overlay {
    padding: 20px;
  }
  .modal-content {
    padding: 15px;
  }
}
</style>
