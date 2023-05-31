<template>
  <main class="content container container--error" v-if="productLoading">
    <BaseLoader :loading="productLoading"></BaseLoader>
  </main>
  <main class="content container container--error" v-else-if="!productData">
    <h1 class="error-title">Не удалось загрузить товар =(</h1>
  </main>

  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link to="/" class="breadcrumbs__link"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link to="/" class="breadcrumbs__link"> {{ category.title }} </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ product.title }} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <BaseProduct :product-id="product.id" :productItem="product"></BaseProduct>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{ 'tabs__link--current': info === true }"
              @click.prevent="(info = true), (infoDelivery = false)"
            >
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{ 'tabs__link--current': infoDelivery === true }"
              @click.prevent="
                {
                  (infoDelivery = true), (info = false);
                }
              "
            >
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" v-show="info">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br />
            30% полиэстер<br />
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br />
            Гладить при макс. 110ºC<br />
            Не использовать машинную сушку<br />
            Отбеливать запрещено<br />
            Не подвергать химчистке<br />
          </p>
        </div>
        <div class="item__content" v-show="infoDelivery">
          <h3>Стоимость доставки:</h3>
          <p>
            <b>бесплатно</b> при самовывозе <br />
            <b>1 200 руб</b> при заказе курьерской доставки на дом. <br /><br />
            Курьер доставляет заказ до двери.<br />
            Доступна услуга бесконтактной доставки.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import { defineComponent, ref, computed } from 'vue';
import { API_BASE_URL } from '@/config';
import BaseProduct from '@/components/base/BaseProduct.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import axios from 'axios';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
export default defineComponent({
  components: { BaseProduct, BaseLoader },
  setup() {
    const $route = useRoute();
    const info = ref(true);
    const infoDelivery = ref(false);
    const productData = ref(null);
    const productLoading = ref(false);
    const productLoadingError = ref(false);

    const loadProduct = () => {
      productLoading.value = true;
      axios
        .get(`${API_BASE_URL}/products/${$route.params.id}`)
        .then((response) => {
          productData.value = response.data;
        })
        .catch(() => {
          productLoadingError.value = true;
        })
        .then(() => {
          productLoading.value = false;
        });
    };
    loadProduct();

    onBeforeRouteUpdate(() => {
      loadProduct();
    });

    const product = computed(() => {
      return productData.value ? productData.value : {};
    });
    const category = computed(() => {
      return productData.value ? productData.value.category : {};
    });
    return {
      loadProduct,
      productData,
      productLoading,
      productLoadingError,
      product,
      category,
      info,
      infoDelivery,
    };
  },
});
</script>
