<template>
  <div class="cssload-container" v-if="loading">
    <div class="cssload-zenith"></div>
  </div>
</template>
<script>
export default {
  props: ['loading'],
};
</script>
<style>
.cssload-container {
  width: 100%;
  height: 138px;
  text-align: center;
}

.cssload-zenith {
  width: 138px;
  height: 138px;
  margin: 0 auto;
  border-radius: 50%;
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  box-shadow: 8px 8px 3px #e02d71;
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
