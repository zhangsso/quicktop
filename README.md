# QuickTop - 现代化Vue.js网站模板

QuickTop 是一个使用 Vue 3、Vite 和 Tailwind CSS 构建的现代化网站模板。该项目采用组件化架构，易于扩展和维护。

## 项目概述

- **技术栈**: Vue 3, Vite, Tailwind CSS
- **架构模式**: 组件化开发
- **开发工具**: VS Code 推荐配置

## 项目结构

```
src/
├── components/
│   ├── Header.vue      # 网站头部组件
│   ├── Hero.vue        # 主视觉区域组件
│   ├── Products.vue    # 产品展示组件
│   ├── About.vue       # 关于我们组件
│   ├── Newsletter.vue  # 邮件订阅组件
│   └── Footer.vue      # 网站底部组件
├── App.vue             # 根组件
├── main.js             # 应用入口文件
└── style.css           # 全局样式文件
```

## 自定义主题颜色

项目在 [tailwind.config.js](file:///e:/zhangsso/coding/quicktop/tailwind.config.js) 中定义了以下自定义颜色：

- `quickYellow`: #FFD600
- `quickBlack`: #1E1E1E
- `quickGray`: #FAFAFA

## 开发环境配置

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```
   访问 http://localhost:5173 查看应用

3. **构建生产版本**:
   ```bash
   npm run build
   ```

4. **预览生产构建**:
   ```bash
   npm run preview
   ```

## 组件说明

- [Header.vue](file:///e:/zhangsso/coding/quicktop/src/components/Header.vue): 网站导航栏
- [Hero.vue](file:///e:/zhangsso/coding/quicktop/src/components/Hero.vue): 主视觉区域，通常包含标题和行动按钮
- [Products.vue](file:///e:/zhangsso/coding/quicktop/src/components/Products.vue): 产品或服务展示区域
- [About.vue](file:///e:/zhangsso/coding/quicktop/src/components/About.vue): 公司或项目介绍
- [Newsletter.vue](file:///e:/zhangsso/coding/quicktop/src/components/Newsletter.vue): 邮件订阅表单
- [Footer.vue](file:///e:/zhangsso/coding/quicktop/src/components/Footer.vue): 网站底部信息

## 开发规范

- 使用 Vue 3 `<script setup>` 语法糖
- 组件采用单文件组件 (SFC) 格式
- 样式使用 Tailwind CSS 实用类
- 遵循组件化开发原则，保持组件的单一职责

## 浏览器支持

- 最新版本的 Chrome, Firefox, Safari, Edge

## 许可证

[MIT](LICENSE)