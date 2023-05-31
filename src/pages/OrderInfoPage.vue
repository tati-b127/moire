<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }"> Корзина </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо
            с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для
            уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key"> Получатель </span>
              <span class="dictionary__value"> {{ name }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Адрес доставки </span>
              <span class="dictionary__value"> {{ address }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Телефон </span>
              <span class="dictionary__value"> {{ phone }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Email </span>
              <span class="dictionary__value"> {{ email }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Способ оплаты </span>
              <span class="dictionary__value"> {{ deliveryType }} </span>
            </li>
          </ul>
        </div>
        <OrderItem
          :products="products"
          :total-price="totalPrice"
          :amount="amount"
          :delivery="delivery"
        ></OrderItem>
      </form>
    </section>
  </main>
</template>
<script>
import OrderItem from '@/components/OrderItem.vue';
import { mapActions } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      orderInfo: null,
      orderLoading: false,
    };
  },
  components: { OrderItem },
  computed: {
    products() {
      return this.orderInfo ? this.orderInfo.basket.items : [];
    },
    totalPrice() {
      return this.orderInfo ? this.orderInfo.totalPrice : '';
    },
    amount() {
      return this.orderInfo
        ? this.orderInfo.basket.items
            .map((item) => item.quantity)
            .reduce((sum, item) => sum + item, 0)
        : '';
    },
    delivery() {
      return this.orderInfo ? this.orderInfo.deliveryType.price : '';
    },
    deliveryType() {
      return this.orderInfo ? this.orderInfo.paymentType : '';
    },
    name() {
      return this.orderInfo ? this.orderInfo.name : '';
    },
    address() {
      return this.orderInfo ? this.orderInfo.address : '';
    },
    phone() {
      return this.orderInfo ? this.orderInfo.phone : '';
    },
    email() {
      return this.orderInfo ? this.orderInfo.email : '';
    },
    id() {
      return this.orderInfo ? this.orderInfo.id : '';
    },
  },
  methods: {
    ...mapActions(['loadOrderInfo']),
  },
  created() {
    this.orderLoading = true;
    if (
      this.$store.state.orderInfo !== null &&
      this.$store.state.orderInfo.id === this.$route.params.id
    ) {
      return;
    } else {
      this.loadOrderInfo(this.$route.params.id).then(() => {
        this.orderInfo = this.$store.state.orderInfo;
        this.orderLoading = false;
      });
    }
  },
});
</script>
