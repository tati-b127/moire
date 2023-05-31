<template>
  <aside class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="submit()">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo" />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            type="text"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>
      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__radio sr-only"
                type="radio"
                name="color"
                :value="color.id"
                v-model="currentColorId"
              />
              <span class="colors__value" :style="{ 'background-color': color.code }"> </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model="currentMaterialId"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="season in seasons" :key="season.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model="currentSeasonId"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">Применить</button>
      <button
        class="filter__reset button button--second"
        type="button"
        v-if="showBtnReset"
        @click.prevent="reset"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>
<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorId: 0,
      currentMaterialId: [],
      currentSeasonId: [],
      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null,
      showBtnReset: false,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'colorId', 'materialId', 'seasonId'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
      if (this.currentPriceFrom !== 0) this.showBtnReset = true;
    },
    priceTo(value) {
      this.currentPriceTo = value;
      if (this.currentPriceTo !== 0) this.showBtnReset = true;
    },
    categoryId(value) {
      this.currentCategoryId = value;
      if (this.currentCategoryId !== 0) this.showBtnReset = true;
    },
    colorId(value) {
      this.currentColorId = value;
      if (this.currentColorId !== 0) this.showBtnReset = true;
    },
    materialId(value) {
      this.currentMaterialId = value;
      if (this.currentMaterialId.length !== 0) this.showBtnReset = true;
    },
    seasonId(value) {
      this.currentSeasonId = value;
      if (this.currentSeasonId.length !== 0) this.showBtnReset = true;
    },
  },
  methods: {
    loadCategories() {
      axios.get(`${API_BASE_URL}/productCategories`).then((response) => {
        this.categoriesData = response.data;
      });
    },
    loadColors() {
      axios.get(`${API_BASE_URL}/colors`).then((response) => {
        this.colorsData = response.data;
      });
    },
    loadMaterials() {
      axios.get(`${API_BASE_URL}/materials`).then((response) => {
        this.materialsData = response.data;
      });
    },
    loadSeasons() {
      axios.get(`${API_BASE_URL}/seasons`).then((response) => {
        this.seasonsData = response.data;
      });
    },
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorId', this.currentColorId);
      this.$emit('update:materialId', this.currentMaterialId);
      this.$emit('update:seasonId', this.currentSeasonId);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorId', 0);
      this.$emit('update:materialId', []);
      this.$emit('update:seasonId', []);
      this.showBtnReset = false;
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadSeasons();
  },
});
</script>
