---
order: 2
title: 脚手架
---
使用脚手架可以更加方便的初始化项目，生成模板代码，节省开发时间。
> 脚手架部分完全基于 [Schematics](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) 部分进行开发。


## 生成组件

快速生成模板代码，每个官网的代码演示都附有可生成的模板，开发者可以通过展开每个组件的代码演示部分获取其生成代码。

### 命令

```bash
ng g @supine/dy-form-zorro:[schematic] <name> [options]
```

例如通过以下代码可以快速生成一个表单模型

```bash
ng g @supine/dy-form:model LoginModel
```
