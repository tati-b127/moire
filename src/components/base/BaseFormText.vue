<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <BaseFormField :title="title" :error="error">
    <input
      class="form__input"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      v-model="dataValue"
      v-mask="mask"
    />
  </BaseFormField>
</template>
<script>
import formFieldMixin from '@/mixins/formFieldMixin';
export default {
  props: ['type', 'mask'],
  mixins: [formFieldMixin],
};
</script>
