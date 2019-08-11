import Vue from 'vue';
import items from './components/items.vue';

import { createStore, applyMiddleware } from 'redux';
import { reducers } from './reducers';
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(logger)(createStore);
const store = createStoreWithMiddleware(reducers);

import * as ItemAction from './actions/item-action';
import reduxMixinsCreator from 'vue-redux';
const reduxMixins = reduxMixinsCreator(ItemAction);

new Vue({
  el: 'body',
  mixins: [reduxMixins],
  data: {
    store: store
  },
  components: {
    'items-view': items
  }
})
