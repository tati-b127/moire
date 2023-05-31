<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Корзина </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> {{ $store.state.cartProducts.length }} товара </span>
    </div>

    <section class="cart">
      <BaseLoader v-if="cartProductsLoading" :loading="cartProductsLoading"></BaseLoader>
      <div class="catalog__message" v-else-if="cartProductsLoadingFailed">
        Произошла ошибка загрузки товаров =( <br />
        Попробуйте перезагрузить страницу <br />
        <button
          class="button button--primery button--back"
          @click.prevent="$router.go($router.currentRoute)"
        >
          Перезагрузить
        </button>
      </div>

      <form v-else class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item"></CartItem>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе</p>
          <p class="cart__price">
            Итого: <span>{{ totalPriceFormat }} ₽</span>
          </p>

          <router-link v-slot="{ navigate }" custom :to="{ name: 'order' }">
            <button
              @click="navigate"
              type="button"
              class="cart__button button button--primery"
              :disabled="$store.state.cartProducts.length <= 0"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';
import { useStore } from 'vuex';
import { onBeforeRouteUpdate } from 'vue-router';
import CartItem from '@/components/CartItem.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import { defineComponent, ref } from 'vue';
import { computed, watch } from 'vue';

export default defineComponent({
  components: { CartItem, BaseLoader },
  setup() {
    const $store = useStore();
    const cartProductsLoading = ref(false);
    const cartProductsLoadingFailed = ref(false);
    const loadCart = () => {
      $store.dispatch('loadCart');
    };
    loadCart();
    const totalPriceFormat = computed(() => {
      return numberFormat($store.getters.cartTotalPrice);
    });
    const products = computed(() => {
      return $store.getters.cartDetailProducts;
    });

    onBeforeRouteUpdate(() => {
      cartProductsLoading.value = true;
      cartProductsLoadingFailed.value = false;
      loadCart()
        .catch(() => (cartProductsLoadingFailed.value = true))
        .then(() => (cartProductsLoading.value = false));
    });
    watch(products, (value) => {
      products.value = value;
    });
    watch((totalPriceFormat) => {
      totalPriceFormat.value = $store.getters.cartTotalPrice;
    });
    return {
      cartProductsLoading,
      cartProductsLoadingFailed,
      products,
      totalPriceFormat,
    };
  },
});
</script>
