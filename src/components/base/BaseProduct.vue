<template>
  <div class="item__pics pics">
    <div class="pics__wrapper">
      <img width="570" height="570" :src="currentImage" :alt="product.title" />
    </div>
    <ul class="pics__list">
      <li class="pics__item" v-for="image in images" :key="image">
        <a
          @click.prevent="changeImage(image.file.url)"
          class="pics__link"
          :class="{ 'pics__link--current': currentImage === image.file.url }"
        >
          <img width="98" height="98" :src="image.file.url" :alt="product.title" />
        </a>
      </li>
    </ul>
  </div>
  <div class="item__info">
    <span class="item__code">Артикул: {{ product.id }}</span>
    <h2 class="item__title">{{ product.title }}</h2>
    <div class="item__form">
      <form class="form" action="#" method="POST" @submit.prevent="addToCart">
        <div class="item__row item__row--center">
          <ChangeAmount :product-id="product.id" v-model:amount="productAmount"></ChangeAmount>
          <b class="item__price"> {{ totalPrice }} ₽ </b>
        </div>

        <div class="item__row">
          <fieldset class="form__block">
            <legend class="form__legend">Цвет</legend>
            <ul class="colors colors--black">
              <li class="colors__item" v-for="color in colors" :key="color.id">
                <label class="colors__label">
                  <input
                    class="colors__radio sr-only"
                    type="radio"
                    name="color-item"
                    :value="color.id"
                    v-model="currentColor"
                    @select="$emit('update:currentColor', color.id)"
                  />
                  <span class="colors__value" :style="{ 'background-color': color.code }"> </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Размер</legend>
            <label class="form__label form__label--small form__label--select">
              <select class="form__select" type="text" name="category" v-model="currentSize">
                <option :value="size.id" v-for="size in sizes" :key="size.id">
                  {{ size.title }}
                </option>
              </select>
            </label>
          </fieldset>
        </div>
        <div class="form__block-message">
          <button
            class="item__button button button--primery"
            type="submit"
            :disabled="productAddSending"
          >
            В корзину
            <BaseLoaderMini :loading="productAddSending"></BaseLoaderMini>
          </button>
          <div class="form__message" v-if="productAdded">Товар в корзине!</div>
          <div class="form__message form__message_error" v-if="productAddedError">
            {{ errorMessage }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { API_BASE_URL } from '@/config';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { useStore } from 'vuex';
import ChangeAmount from '@/components/ChangeAmount.vue';
import BaseLoaderMini from '@/components/base/BaseLoaderMini.vue';
export default defineComponent({
  components: { ChangeAmount, BaseLoaderMini },
  props: {
    productId: { type: [Number, String], required: true },
    open: { type: [Boolean, String] },
  },
  setup(props, { emit: $emit }) {
    const $store = useStore();

    const productAmount = ref(1);
    const productData = ref(null);
    const productLoading = ref(false);
    const productLoadingError = ref(false);
    const productAdded = ref(false);
    const productAddSending = ref(false);
    const errorMessage = ref('');
    const productAddedError = ref(false);

    const loadProduct = () => {
      productLoading.value = true;
      axios
        .get(`${API_BASE_URL}/products/${props.productId}`)
        .then((response) => {
          productData.value = response.data;
        })
        .catch(() => {
          productLoadingError.value = true;
        })
        .then(() => {
          currentColor.value = productData.value.colors[0].color.id;
          currentSize.value = productData.value.sizes[0].id;
          productLoading.value = false;
        });
    };
    loadProduct();
    const product = computed(() => {
      return productData.value ? productData.value : {};
    });
    const currentColorId = computed(() => {
      return productData.value ? productData.value.colors[0].color.id : [];
    });
    const currentSizeId = computed(() => {
      return productData.value ? productData.value.sizes[0].id : [];
    });
    const currentColor = ref(currentColorId.value);
    const currentSize = ref(currentSizeId.value);

    const seasons = computed(() => {
      return productData.value ? productData.value.seasons : [];
    });
    const materials = computed(() => {
      return productData.value ? productData.value.materials : [];
    });
    const sizes = computed(() => {
      return productData.value ? productData.value.sizes : [];
    });
    const colors = computed(() => {
      return productData.value ? productData.value.colors.map((item) => item.color) : [];
    });
    const images = computed(() => {
      return productData.value ? productData.value.colors.map((item) => item.gallery[0]) : [];
    });
    const totalPrice = computed(() => {
      return numberFormat(product.value.price * productAmount.value);
    });
    const currentImage = computed(() => {
      const img = productData.value
        ? productData.value.colors.find((item) => item.color.id === currentColor.value)
        : null;
      return img !== undefined && img !== null && img.gallery !== null
        ? img.gallery[0].file.url
        : './img/default.jpg';
    });
    const changeImage = (image) => {
      const item = productData.value
        ? productData.value.colors.find((item) => item.gallery[0].file.url === image)
        : {};
      currentColor.value = item.color.id;
      $emit('update:currentColor', item.color.id);
    };
    const close = () => {
      console.log(props.open);
      $emit('upadate:open', false);
      console.log(props.open);
    };
    const addToCart = () => {
      productAdded.value = false;
      productAddSending.value = true;
      productAddedError.value = false;
      $store
        .dispatch('addProductToCart', {
          productId: product.value.id,
          colorId: currentColor.value,
          sizeId: currentSize.value,
          amount: productAmount.value,
        })
        .then(() => {
          productAdded.value = true;
          productAddSending.value = false;
          $emit('upadate:open', false);

          close();
          // document.querySelector('.modal-wrapper').style.display = 'none';
        })
        .catch((error) => {
          productAddedError.value = true;
          errorMessage.value = error.response.data.error.request.quantity;
          productAddSending.value = false;
        });
    };
    watch(currentColor, (value) => {
      $emit('update:currentColor', value);
    });
    watch(currentImage, (value) => {
      $emit('update:currentImage', value);
    });
    watch(currentSize, (value) => {
      $emit('update:currentSize', value);
    });
    watch(productAmount, (value) => {
      if (value <= 1 || value === undefined || value === null) {
        return productAmount.value;
      } else {
        productAmount.value = value;
      }
    });

    return {
      addToCart,
      loadProduct,
      changeImage,

      productAmount,
      productData,
      productLoading,
      productLoadingError,
      productAdded,
      productAddSending,
      errorMessage,
      productAddedError,
      totalPrice,

      product,
      currentColor,
      currentImage,
      currentSize,
      colors,
      images,
      seasons,
      materials,
      sizes,
    };
  },
});
</script>
