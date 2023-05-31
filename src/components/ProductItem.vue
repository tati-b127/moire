<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :alt="product.title" :src="currentImage" />
    </router-link>
    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price"> {{ productPrice }} ₽ </span>
    <div class="catalog__block-color">
      <ul class="colors colors--black">
        <li class="colors__item" v-for="colorItem in colorsImgIds" :key="colorItem.colorId">
          <label :for="colorItem.id" class="colors__label">
            <input
              class="colors__radio sr-only"
              type="radio"
              :value="colorItem.color.id"
              v-model="currentColor"
            />
            <span class="colors__value" :style="{ 'background-color': colorItem.color.code }">
            </span>
          </label>
        </li>
      </ul>
      <button
        class="item__button button button--primery button-open-modal"
        type="submit"
        @click="openModalWindow"
      >
        Купить
      </button>
    </div>
  </li>
  <BaseModal v-model:open="isShow">
    <BaseProduct
      :product-id="product.id"
      :productItem="product"
      v-model:open="isShow"
    ></BaseProduct>
  </BaseModal>
</template>
<script>
import numberFormat from '@/helpers/numberFormat';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseProduct from '@/components/base/BaseProduct.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  props: ['product'],
  components: { BaseModal, BaseProduct },
  data() {
    return {
      currentColor: this.product.colorsImgIds[0].color.id,
      isShow: false,
    };
  },
  computed: {
    productColors() {
      return this.product.colors;
    },
    productImages() {
      return this.product.images;
    },
    productPrice() {
      return numberFormat(this.product.price);
    },
    colorsImgIds() {
      return this.product.colorsImgIds;
    },
    currentImage() {
      const img = this.product.colorsImgIds.find((item) => item.color.id === this.currentColor);
      return img !== undefined && img.image !== null ? img.image[0].file.url : './img/default.jpg';
    },
  },

  methods: {
    openModalWindow() {
      this.isShow = true;
    },
  },
  watch: {
    currentColor(value) {
      this.$emit('update:currentColor', value);
    },
    currentImage(value) {
      this.$emit('update:currentImage', value);
    },
  },
});
</script>
<style>
.button-open-modal {
  min-width: min-content;
  padding: 15px 25px;
  margin-left: auto;
  /* margin-top: 20px; */
}
</style>
