<template>
  <HeaderVue></HeaderVue>
  <router-view :key="$route.fullPath"></router-view>
  <FooterVue></FooterVue>
  <div id="teleport"></div>
</template>

<script>
import HeaderVue from '@/components/main/HeaderVue.vue';
import FooterVue from '@/components/main/FooterVue.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: { HeaderVue, FooterVue },
  created() {
    const userAccessKey = localStorage.getItem('userAccessKey');
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
  methods: {
    ...mapActions(['loadCart']),
    ...mapMutations(['updateUserAccessKey']),
  },
};
</script>
