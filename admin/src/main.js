import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import router from "./router";
import VueHighlightJS from "vue3-highlightjs";
import "highlight.js/styles/night-owl.css";

const app = createApp(App);

app.use(
  createVuetify({
    components,
    directives,
    icons: { defaultSet: "mdi" },
    theme: { defaultTheme: "dark" },
  })
);

app.use(VueHighlightJS);

app.use(router);

app.mount("#app");
