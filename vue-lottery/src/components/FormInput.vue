<template>
  <div class="form-group mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      class="form-control custom-input"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="{ 'is-invalid': error }"
      v-bind="$attrs"
      :disabled="disabled"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  error: '',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.custom-input {
  background-color: rgba(207, 207, 207, 0.2);
}

.custom-input:disabled {
  background-color: rgba(207, 207, 207, 0.4);
  cursor: not-allowed;
}
</style>
