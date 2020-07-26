// src/components/index.js
import Vue from "vue";
import TimeAxisAuto from "./TimeAxisAuto.vue";

const Components = {
  TimeAxisAuto
};

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;