<template>
  <div class="product__counter form__counter">
    <button
      type="button"
      aria-label="Убрать один товар"
      @click.prevent="dec"
      :disabled="amount <= 1"
    >
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <label for="count">
      <input
        type="text"
        name="count"
        :value="amount"
        @input="$emit('update:amount', Math.abs($event.target.value))"
      />
    </label>

    <button type="button" aria-label="Добавить один товар" @click.prevent="inc">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  props: ['productId', 'amount'],
  methods: {
    inc() {
      this.$emit('update:amount', this.amount + 1);
    },
    dec() {
      this.$emit('update:amount', this.amount - 1);
    },
  },
};
</script>
<style>
.form__counter button {
  cursor: pointer;
}
</style>
