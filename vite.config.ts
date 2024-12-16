import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    // 构建选项
    lib: {
      entry: "src/main.ts", // 入口文件
      formats: ["cjs"], // 只输出 CommonJS 格式
      fileName: () => "main.js", // 输出的文件名为 main.js
    },
    outDir: "dist.bobplugin",
    minify: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/info.json",
          dest: ".",
        },
      ],
    }),
  ],
});
