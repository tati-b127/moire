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
      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> {{ $store.state.cartProducts.length }} товара </span>
    </div>

    <section class="cart">
      <BaseLoader v-if="orderPageLoading" :loading="orderPageLoading"></BaseLoader>
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
              name="name"
              type="text"
              v-model="formData.name"
            ></BaseFormText>
            <BaseFormText
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              type="text"
              name="address"
              v-model="formData.address"
            >
            </BaseFormText>
            <BaseFormText
              title="Телефон"
              :error="formError.phone"
              type="tel"
              name="phone"
              placeholder="Введите ваш телефон"
              v-model="formData.phone"
              :mask="'+(###)########'"
            >
            </BaseFormText>
            <BaseFormText
              title="Email"
              :error="formError.email"
              type="email"
              name="email"
              placeholder="Введите ваш Email"
              v-model="formData.email"
            >
            </BaseFormText>
            <BaseFormTextarea
              title="Комментарий к заказу"
              :error="formError.comment"
              name="comment"
              placeholder="Ваши пожелания"
              v-model="formData.comment"
            >
            </BaseFormTextarea>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveries" :key="item.title">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    :value="item.id"
                    v-model="currentDelivery"
                  />
                  <span class="options__value" v-if="item.price === '0'">
                    {{ item.title }} <b>Бесплатно</b>
                  </span>
                  <span class="options__value" v-if="item.price !== '0'">
                    {{ item.title }} <b>{{ item.price }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in payments" :key="item.title">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    :value="item.id"
                    v-model="currentPayment"
                  />
                  <span class="options__value"> {{ item.title }} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <OrderItem
          :products="products"
          :totalPrice="totalPrice"
          :amount="amount"
          :orderLoading="orderLoading"
          :btnSend="true"
          :delivery="delivery"
        ></OrderItem>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>
<script>
import { useStore } from 'vuex';
import BaseFormText from '@/components/base/BaseFormText.vue';
import BaseFormTextarea from '@/components/base/BaseFormTextarea.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import OrderItem from '@/components/OrderItem.vue';
import { defineComponent, ref, computed } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { watch } from 'vue';

export default defineComponent({
  components: {
    BaseFormText,
    BaseFormTextarea,
    OrderItem,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const formData = ref({});
    const formError = ref({});
    const orderLoading = ref(false);
    const formErrorMessage = ref('');
    const currentDelivery = ref(null);
    const currentPayment = ref(null);
    const deliveries = ref(null);
    const payments = ref(null);

    const products = computed(() => {
      return $store.getters.cartDetailProducts;
    });
    const totalPrice = computed(() => {
      return $store.getters.cartTotalPrice;
    });
    const amount = computed(() => {
      return products.value.map((item) => item.amount).reduce((acc, i) => acc + i, 0);
    });
    const delivery = computed(() => {
      return deliveries.value
        ? deliveries.value.find((item) => item.id === currentDelivery.value).price
        : 0;
    });
    const loadDeliveries = () => {
      return axios.get(API_BASE_URL + '/deliveries').then((response) => {
        deliveries.value = response.data;
        currentDelivery.value = deliveries.value[0].id;
        loadPayments(currentDelivery.value);
      });
    };
    const loadPayments = (deliveryId) => {
      return axios
        .get(API_BASE_URL + '/payments', {
          params: {
            deliveryTypeId: deliveryId,
          },
        })
        .then((response) => {
          payments.value = response.data;
          currentPayment.value = payments.value[0].id;
        });
    };
    loadDeliveries();
    onBeforeRouteUpdate(() => {
      loadDeliveries();
    });

    const order = () => {
      formError.value = {};
      formErrorMessage.value = '';
      orderLoading.value = true;
      axios
        .post(
          `${API_BASE_URL}/orders`,
          {
            ...formData.value,
            deliveryTypeId: currentDelivery.value,
            paymentTypeId: currentPayment.value,
          },
          {
            params: {
              userAccessKey: $store.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          $store.commit('resetCart');
          $store.commit('updateOrderInfo', response.data);
          $router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          formError.value = error.response.data.error.request || {};
          formErrorMessage.value = error.response.data.error.message;
        })
        .then(() => {
          orderLoading.value = false;
        });
    };
    watch(currentDelivery, (value) => {
      currentDelivery.value = value;
      loadPayments(currentDelivery.value);
    });
    watch(currentPayment, (value) => {
      currentPayment.value = value;
    });
    watch(delivery, (value) => {
      delivery.value = value;
    });
    return {
      formData,
      formError,
      formErrorMessage,
      orderLoading,
      products,
      totalPrice,
      currentDelivery,
      currentPayment,
      payments,
      deliveries,
      delivery,
      amount,
      order,
    };
  },
});
</script>
