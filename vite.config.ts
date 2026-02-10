import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import pkg from './package.json';
import setting from './setting.ts';



// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  console.log(command, mode);
  return {
    base: setting.base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, `src`),
      },
    },
    define: {
      __IS_DEV__: mode === 'development', // 是否是开发环境
      __IS_SIT__: mode === 'sit', // 是否是测试环境
      __IS_PROD__: mode === 'production', // 是否是生产环境
      __BASE_URL__: JSON.stringify(setting.base), // 一级路由
      __VERSION__: JSON.stringify(pkg.version), // 版本号
      __PROJECT_NAME__: JSON.stringify(pkg.name), // 项目名称
      __SUCESS_CODE__: JSON.stringify(setting.successCode), // 成功状态码
      __SYSID__: JSON.stringify(setting.sysId) // 系统id  飞书H5用到
    },
    plugins: [
      react()
    ],
    server: {
      port: 8000,
      open: true,
      proxy: {
        // 接口转发
        "/api": {
          target: 'https://feishu.hnzycfc.com',
          changeOrigin: true,
        },
        // 飞书H5用到
        /*[`/${setting.sysId}`]: {
          target: 'https://feishu.hnzycfc.com',
          changeOrigin: true,
        },*/
      },
    },
    build: {
      outDir: path.resolve(__dirname, `dist`),
      emptyOutDir: true,
      sourcemap: mode === 'sit',
    },
  }
})
