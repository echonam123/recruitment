/// <reference types="vite/client" />
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
//解决vuex引入 tscongfig不行的
declare module "vuex" {
  export * from "vuex/types/index.d.ts";
  export * from "vuex/types/helpers.d.ts";
  export * from "vuex/types/logger.d.ts";
  export * from "vuex/types/vue.d.ts";
}

declare module 'vue-router'{
  export * from "vue-router/auto"
  export * from "vue-router/auto-routes"
  export * from "vue-router/dist/vue-router.d.ts"
}
  
