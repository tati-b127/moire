<template>
  <main class="content container container--error">
    <h1 class="error-title">Страница не найдена</h1>
    <router-link :to="{ name: 'main' }" class="button button--primery button--back"
      >Вернуться на главную</router-link
    >
  </main>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({});
</script>
<style>
.error-title {
  text-align: center;
  font-family: 'Geometria';
}
.button--back:not(:disabled):hover {
  background-color: #222;
}
.button--back:not(:disabled):focus {
  background-color: #222;
}
.container--error {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
