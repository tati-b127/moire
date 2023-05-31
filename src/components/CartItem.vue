<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :srcset="item.product.image"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i class="colors__value" :style="{ 'background-color': item.product.colorName.code }"> </i>

        {{ item.product.colorName.title }}
      </span>
    </p>
    <p class="product__info product__info--size">
      Размер:
      <span>
        {{ item.sizeTitle }}
      </span>
    </p>

    <span class="product__code"> Артикул: {{ item.product.id }} </span>
    <ChangeAmount :product-id="item.basketItemId" v-model:amount="amount"></ChangeAmount>
    <b class="product__price"> {{ productPrice }} ₽ </b>
    <button
      class="product__del button-del"
      :disabled="cartItemDeleting"
      type="button"
      style="cursor: pointer"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
      <span v-if="cartItemDeletedFailed">Ошибка</span>
    </button>
  </li>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';
import { useStore } from 'vuex';
import { defineComponent, ref, computed, watch } from 'vue';
import ChangeAmount from '@/components/ChangeAmount.vue';

export default defineComponent({
  props: {
    item: { type: Object },
  },
  components: { ChangeAmount },
  setup(props) {
    const $store = useStore();
    const amount = ref(props.item.amount);

    const cartItemDeleting = ref(false);
    const cartItemDeletedFailed = ref(false);

    const productPrice = computed(() => {
      return numberFormat(amount.value * props.item.product.price);
    });

    const deleteProduct = () => {
      cartItemDeleting.value = true;
      $store.commit('deleteCartProduct', props.item.basketItemId);
      $store
        .dispatch('deleteCartProduct', { basketItemId: props.item.basketItemId })
        .catch(() => {
          cartItemDeletedFailed.value = true;
        })
        .then(() => {
          cartItemDeleting.value = false;
        });
    };
    watch(amount, (value) => {
      $store.dispatch('updateCartProductAmount', {
        basketItemId: props.item.basketItemId,
        amount: value,
      });
      amount.value = value;
    });

    return {
      deleteProduct,
      productPrice,
      amount,
      cartItemDeleting,
      cartItemDeletedFailed,
    };
  },
});
</script>
