import BaseFormField from '@/components/base/BaseFormField.vue';

export default {
  components: {
    BaseFormField,
  },
  props: ['title', 'error', 'placeholder', 'modelValue', 'name'],
  computed: {
    dataValue: {
      get() {
        return this.modelValue;
      },
      set(modelValue) {
        this.$emit('update:modelValue', modelValue);
      },
    },
  },
};
