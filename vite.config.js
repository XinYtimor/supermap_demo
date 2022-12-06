import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import cesium from "vite-plugin-cesium";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    cesium(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ["src/components"], // 配置需要默认导入的自定义组件文件夹，该文件夹下的所有组件都会自动 import，无需再 install 自定义的公共组件
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
