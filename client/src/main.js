import Vue from "vue";
import dayjs from "dayjs";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "./http";
import { resetForm } from "@/utils/index";

Vue.config.productionTip = false;
Vue.use(ElementUI);
console.dir(axios);
Vue.prototype.$axios = axios;
Vue.prototype.$resetForm = resetForm;
Vue.prototype.$dayjs = dayjs;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
