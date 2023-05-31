<template>
  <header class="header">
    <div class="header__wrapper container">
      <span class="header__info">Каталог</span>

      <router-link to="/" class="header__logo">
        <img
          src="/moire/img/svg/logo-moire.svg"
          alt="Логотип интернет магазина Moire"
          width="116"
          height="34"
        />
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09"> 8 800 600 90 09 </a>
      <CartIndicator></CartIndicator>
    </div>
  </header>
</template>
<script>
import CartIndicator from '@/components/CartIndicator.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  components: { CartIndicator },
});
</script>
