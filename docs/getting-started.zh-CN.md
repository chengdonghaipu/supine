---
order: 1
title: 快速上手
---

@supine 系列库 致力于提供给程序员**愉悦**的开发体验。

<blockquote style="border-color: red;"><p><strong>官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识，并且已经完全掌握了 Angular 及配套设施的正确开发方式。如果你刚开始学习前端或者 Angular ，将框架作为你的第一步可能不是最好的主意 —— 掌握好基础知识再来吧！</strong></p></blockquote>

## 在线演示

最简单的使用方式参照以下 StackBlitz 演示，也推荐 Fork 本例来进行 `Bug Report`，注意不要在实际项目中这样使用。

## 第一个本地实例

实际项目开发中，你会需要对 TypeScript 代码的构建、调试、代理、打包部署等一系列工程化的需求。
我们强烈建议使用官方的 `@angular/cli` 工具链辅助进行开发，下面我们用一个简单的实例来说明。

### 安装脚手架工具

> 如果你想了解更多CLI工具链的功能和命令，建议访问 [Angular](https://angular.cn/cli) 了解更多。

```bash
$ npm install -g @angular/cli
```

### 创建一个项目

> 在创建项目之前，请确保 `@angular/cli` 已被成功安装。

执行以下命令，`@angular/cli` 会在当前目录下新建一个名称为 `PROJECT-NAME` 的文件夹，并自动安装好相应依赖。

```bash
$ ng new PROJECT-NAME
```

### 初始化配置

进入项目文件夹，执行以下命令后将自动完成 `@supine/dy-form` 的初始化配置。

```bash
$ ng add @supine/dy-form
```


### 开发调试

一键启动调试，运行成功后显示欢迎页面。

```bash
$ ng serve --port 0 --open
```

### 构建和部署

```bash
$ ng build --prod
```

文件会被打包到 `dist` 目录中。
