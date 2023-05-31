<template>
  <div class="cart__block">
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in products" :key="item.product.id">
        <h3>{{ item.product.title }}</h3>
        <b>
          {{
            Math.abs(item.product.price * item.amount) ||
            Math.abs(item.product.price * item.quantity)
          }}
          ₽
        </b>
        <span>Артикул: {{ item.product.id }}</span>
        <span> {{ item.quantity || item.amount }} шт.</span>
        <span>Размер: {{ item.sizeTitle || item.size.title }}</span>
        <!-- <span>Цвет: {{ item.color.color.title || item.product.colorName.title || null }} </span> -->
      </li>
    </ul>

    <div class="cart__total">
      <p>
        Доставка: <b>{{ priceDelivery }} ₽</b>
      </p>
      <p>
        Итого: <b>{{ amount }}</b> товара на сумму <b>{{ pricePretty }} ₽</b>
      </p>
    </div>

    <button
      :disabled="orderLoading"
      class="cart__button button button--primery"
      type="submit"
      v-if="btnSend"
    >
      Оформить заказ
      <BaseLoaderMini :loading="orderLoading"></BaseLoaderMini>
    </button>
  </div>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';
import BaseLoaderMini from '@/components/base/BaseLoaderMini.vue';

export default {
  components: { BaseLoaderMini },
  props: ['products', 'totalPrice', 'amount', 'orderLoading', 'btnSend', 'delivery'],
  computed: {
    pricePretty() {
      return numberFormat(Math.abs(this.totalPrice) + Math.abs(this.delivery));
    },
    priceDelivery() {
      return numberFormat(this.delivery);
    },
  },
};
</script>
