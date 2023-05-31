import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { basketItemId, amount }) {
      const item = state.cartProducts.find((p) => p.basketItemId === basketItemId);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, basketItemId) {
      state.cartProducts = state.cartProducts.filter((p) => p.basketItemId !== basketItemId);
    },
    incrementAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((p) => p.productId === productId);
      if (item) {
        item.amount = amount + 1;
      }
    },
    decrementAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((p) => p.productId === productId);
      if (item) {
        if (amount <= 1) {
          item.amount = amount;
        } else {
          item.amount = amount - 1;
        }
      }
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updatecartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => {
        return {
          productId: item.product.id,
          amount: item.quantity,
          colorId: item.color.id,
          sizeId: item.size.id,
          sizeTitle: item.size.title,
          basketItemId: item.id,
        };
      });
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const product = state.cartProductsData.find((p) => p.product.id === item.productId).product;
        return {
          ...item,
          product: {
            ...product,
            image:
              product.colors.find((color) => color.id === item.colorId).gallery[0].file.url ||
              './img/default.jpg',
            colorName: product.colors.find((c) => c.id === item.colorId).color,
          },
        };
      });
    },
    cartTotalPrice(_state, getters) {
      return getters.cartDetailProducts.reduce(
        (sum, item) => item.product.price * item.amount + sum,
        0
      );
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL + `/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          console.log(response);
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      return axios
        .get(API_BASE_URL + '/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    addProductToCart(context, { productId, amount, sizeId, colorId }) {
      return axios
        .post(
          API_BASE_URL + '/baskets/products',
          {
            productId: productId,
            colorId: colorId,
            sizeId: sizeId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, { basketItemId, amount }) {
      if (amount < 1) return;
      return axios
        .put(
          API_BASE_URL + '/baskets/products',
          {
            basketItemId: basketItemId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit('updateCartProductAmount', { basketItemId, amount });
          context.commit('updatecartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, { basketItemId }) {
      return axios
        .delete(API_BASE_URL + '/baskets/products', {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
          data: {
            basketItemId: basketItemId,
          },
        })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
  },
});
