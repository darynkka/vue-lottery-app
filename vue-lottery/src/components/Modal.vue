<template>
  <div class="modal" tabindex="-1" @keyup.esc="$emit('close')">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><slot name="header"></slot></h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Custom-Modal',
  emits: ['close'],
  mounted() {
    document.addEventListener('keyup', this.handleKeyup)
  },
  unmounted() {
    document.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup(event) {
      if (event.key === 'Escape') {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
