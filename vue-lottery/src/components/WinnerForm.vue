<template>
  <div class="card p-4 mb-4">
    <h5 class="card-title">{{ initialData ? 'EDIT FORM' : 'REGISTER FORM' }}</h5>
    <p class="text-muted">Please fill in all the fields.</p>

    <Form
      @submit="onSubmit"
      :validation-schema="schema"
      :initial-values="initialValues"
      v-slot="{ isSubmitting }"
    >
      <Field name="name" v-slot="{ field, errors }">
        <FormInput
          id="name"
          label="Name"
          v-bind="field"
          placeholder="Enter user name"
          :error="errors[0]"
          :disabled="isSubmitting"
        />
      </Field>

      <Field name="email" v-slot="{ field, errors }">
        <FormInput
          id="email"
          label="Email"
          v-bind="field"
          placeholder="Enter user email"
          type="email"
          :error="errors[0]"
          :disabled="isSubmitting"
        />
      </Field>

      <Field name="role" v-slot="{ field, errors }">
        <FormInput
          id="role"
          label="Role"
          v-bind="field"
          placeholder="Enter user role"
          :error="errors[0]"
          :disabled="isSubmitting"
        />
      </Field>

      <Field name="password" v-slot="{ field, errors }">
        <FormInput
          id="password"
          label="Password"
          v-bind="field"
          placeholder="Enter user password"
          type="password"
          :error="errors[0]"
          :disabled="isSubmitting"
        />
      </Field>

      <div class="text-end">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitButtonText || 'Save' }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import FormInput from './FormInput.vue'
import type { IWinner } from '@/WinnerRepository'

const props = defineProps<{
  initialData?: IWinner
  submitButtonText?: string
}>()

const emit = defineEmits<{
  (e: 'winner-added', winner: IWinner): void
  (e: 'winner-updated', winner: IWinner): void
}>()

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .trim(),

  email: yup.string().required('Email is required').email('Invalid email format').trim(),

  role: yup
    .string()
    .required('Role is required')
    .min(2, 'Role must be at least 2 characters')
    .trim(),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .trim()
})

const initialValues = computed(() => ({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  role: props.initialData?.role || '',
  password: props.initialData?.password || ''
}))

const onSubmit = async (values: Record<string, string>) => {
  try {
    const winnerData: IWinner = {
      id: props.initialData?.id || 0,
      name: values.name,
      email: values.email.toLowerCase(),
      password: values.password,
      role: values.role
    }

    if (props.initialData) {
      emit('winner-updated', winnerData)
    } else {
      emit('winner-added', winnerData)
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    throw error
  }
}
</script>
