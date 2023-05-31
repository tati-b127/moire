<template>
  <div class="cssload-mini-container">
    <div class="cssload-mini-zenith" v-if="loading"></div>
  </div>
</template>
<script>
export default {
  props: ['loading'],
};
</script>
<style>
.cssload-mini-container {
  width: 20px;
  height: 20px;
  text-align: center;
  position: absolute;
  margin-top: -20px;
  margin-left: 20px;
  z-index: 100;
}

.cssload-mini-zenith {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  border-radius: 50%;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  box-shadow: 1px 1px 0px #ffffff;
  animation: cssload-spin 420ms infinite linear;
  -o-animation: cssload-spin 420ms infinite linear;
  -ms-animation: cssload-spin 420ms infinite linear;
  -webkit-animation: cssload-spin 420ms infinite linear;
  -moz-animation: cssload-spin 420ms infinite linear;
}

@keyframes cssload-spin {
  100% {
    transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-o-keyframes cssload-spin {
  100% {
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-ms-keyframes cssload-spin {
  100% {
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes cssload-spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-moz-keyframes cssload-spin {
  100% {
    -moz-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
