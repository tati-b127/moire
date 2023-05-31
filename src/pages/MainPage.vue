<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> {{ countProducts }} товаров </span>
      <div class="catalog__btns-page">
        <p>Товаров на странице</p>
        <div>
          <button
            class="catalog__btn-paginate"
            :class="{ 'catalog__btn-active': productsPerPage === 6 }"
            @click.prevent="changePerPage(6)"
          >
            6
          </button>
          <button
            class="catalog__btn-paginate"
            :class="{ 'catalog__btn-active': productsPerPage === 9 }"
            @click.prevent="changePerPage(9)"
          >
            9
          </button>
          <button
            class="catalog__btn-paginate"
            :class="{ 'catalog__btn-active': productsPerPage === 12 }"
            @click.prevent="changePerPage(12)"
          >
            12
          </button>
        </div>
      </div>
      <div class="catalog__btn-filter" v-if="showMobileMenu">
        <button class="button button--primery button--filter" @click.prevent="showFilter">
          Фильтр
        </button>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-if="showMobileFilter"
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:color-id="filterColorId"
        v-model:material-id="filterMaterialId"
        v-model:season-id="filterSeasonId"
      ></ProductFilter>
      <section class="catalog">
        <BaseLoader v-if="productsLoading" :loading="productsLoading"></BaseLoader>
        <div class="catalog__message" v-else-if="productsLoadingFailed">
          Произошла ошибка загрузки товаров =( <br />
          Попробуйте перезагрузить страницу <br />
          <button class="button button--primery button--back" @click.prevent="loadProducts">
            Перезагрузить
          </button>
        </div>
        <ProductList v-else :products="products"> </ProductList>
        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        ></BasePagination>
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import BaseLoader from '@/components/base/BaseLoader.vue';
import { defineComponent, ref, computed, watch } from 'vue';
export default defineComponent({
  components: { BasePagination, ProductFilter, ProductList, BaseLoader },
  setup() {
    const filterPriceFrom = ref(0);
    const filterPriceTo = ref(0);
    const filterCategoryId = ref(0);
    const filterColorId = ref(null);
    const filterMaterialId = ref(null);
    const filterSeasonId = ref(null);
    const productsData = ref(null);
    const productsLoading = ref(false);
    const productsLoadingFailed = ref(false);
    const showMobileMenu = ref(false);
    const showMobileFilter = ref(true);
    const page = ref(1);
    const productsPerPage = ref(6);
    const changePerPage = (perPage) => {
      productsPerPage.value = perPage;
      doLoadProducts();
    };
    const doLoadProducts = () => {
      productsLoading.value = true;
      productsLoadingFailed.value = false;
      axios
        .get(`${API_BASE_URL}/products`, {
          params: {
            page: page.value,
            limit: productsPerPage.value,
            categoryId: filterCategoryId.value,
            colorIds: filterColorId.value,
            materialIds: filterMaterialId.value,
            seasonIds: filterSeasonId.value,
            minPrice: filterPriceFrom.value,
            maxPrice: filterPriceTo.value,
          },
        })
        .then((response) => {
          productsData.value = response.data;
          productsLoading.value = false;
        })
        .catch(() => {
          productsLoadingFailed.value = true;
        })
        .then(() => {
          productsLoading.value = false;
        });
    };
    doLoadProducts();

    const products = computed(() => {
      return productsData.value
        ? productsData.value.items.map((product) => ({
            ...product,
            colorsImgIds: product.colors.map((item) => {
              return { colorId: item.id, color: item.color, image: item.gallery };
            }),
          }))
        : [];
    });
    const onResize = () => {
      showMobileMenu.value = document.documentElement.clientWidth > 664 ? false : true;
      showMobileFilter.value = document.documentElement.clientWidth > 664 ? true : false;
    };
    window.addEventListener('resize', onResize);
    onResize();
    const showFilter = () => {
      if (showMobileFilter.value === true) {
        showMobileFilter.value = false;
      } else if (showMobileFilter.value === false) {
        showMobileFilter.value = true;
      }
    };
    const countProducts = computed(() => {
      return productsData.value ? productsData.value.pagination.total : 0;
    });
    watch(
      [
        page,
        filterCategoryId,
        filterColorId,
        filterMaterialId,
        filterSeasonId,
        filterPriceFrom,
        filterPriceTo,
      ],
      () => {
        doLoadProducts();
      }
    );
    watch(showMobileFilter, (value) => {
      showMobileFilter.value = value;
    });
    return {
      filterPriceFrom,
      filterPriceTo,
      filterCategoryId,
      filterColorId,
      filterMaterialId,
      filterSeasonId,
      productsData,
      productsLoading,
      productsLoadingFailed,
      products,
      countProducts,
      page,
      productsPerPage,
      doLoadProducts,
      changePerPage,
      showMobileMenu,
      showMobileFilter,
      onResize,
      showFilter,
    };
  },
});
</script>
