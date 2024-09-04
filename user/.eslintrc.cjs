/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ], //使用别人规范好的包
  "env": {   //由于 ESLint 的各种规范中，一般都不允许使用未在页面内声明的成员，所以要设置环境
     "browser": true,
     "commonjs": true,
     "es2021": true,
     "node": true
  },
  /* 指定如何解析语法 */
  parser: 'vue-eslint-parser',
  // 小程序全局变量
  globals: {
    uni: true,
    wx: true,
    WechatMiniprogram: true,
    getCurrentPages: true,
    getApp: true,
    UniApp: true,
    UniHelper: true,
    App: true,
    Page: true,
    Component: true,
    AnyObject: true,
  },
  parserOptions: {   //ESLint 解析器 解析代码时，可以指定 用哪个 js 的版本
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier':'off',
    'vue/multi-word-component-names': ['off'],  
    'vue/no-setup-props-destructure': ['off'],  
    'vue/no-deprecated-html-element-is': ['off'], 
    '@typescript-eslint/no-unused-vars': ['off'],  
    'for-direction': 'error', 
    'getter-return': [  
      'error',
      {
        allowImplicit: false
      }
    ], 
    'no-compare-neg-zero': 'error'
  },
}