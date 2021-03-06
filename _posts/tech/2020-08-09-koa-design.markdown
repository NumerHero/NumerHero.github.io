---
layout: post
title: 基于 Koa 的二次框架封装设计
category: 技术
keywords: 技术, node
---

目前市面上常用的node框架，比较基础的就是Koa

为了团队规范需要和更方便的二次开发，我们可以基于 Koa 作为基础，构建一层自用框架，那么应该如何设计呢？

一种较好的架构方式是需要利于团队分工和逻辑解耦，且为可插拔式地

我们可以将服务定义为一个单元

每个单元有独立的 控制器、业务处理、允许自定义扩展、自定义中间件、插件、路由和配置等等

如果需要分工，就将多个单元组合在一起，不同单元各司其职，当需要新增或干掉某些功能的时候，只需要操作将对应的单元即可

同时，每一个单元也可以自己作为一个单独的服务，独立部署，这样设计就比较灵活

### 单元的目录规范

```js
├── app
│   ├── test             // 单元测试文件夹
│   ├── controller       // 控制器文件夹
│   ├── service          // 业务模型文件夹
│   ├── extension        // 扩展文件夹，内置对象的功能
│   │   ├── app.ts       // 扩展应该实例上的方法和属性
│   │   ├── context.ts   // 扩展上下文
│   │   ├── request.ts   // 扩展请求对象 request
│   │   └── response.ts  // 扩展响应对象 response
│   ├── middleware       // 中间件目录
│   ├── plugin           // 插件目录
│   └── router.ts        // 路由文件
├── config               // 配置文件（配置这个单元引用了那些插件和中间件）
└── app.ts               // 生命周期钩子定义文件(定义生命周期)
└── bootstrap.ts         // 服务启动入口，例如启动一个http服务器
```

## 一个目录单元

一个目录单元的模型大致如下：

![node](../../assets/img/node-desgin.png)

配置文件Config， 在config 中我们可以对该单元进行配置所需的第三方封装好的（中间件、插件等等）或者一些全局环境变量，这些变量属性会被加载到上下文当中

中间件，如果第三方无法提供所需的中间件，那就只能自己动手来写了，客户端请求到达服务端后，会首先经过一系列中间件的处理，例如解析请求体、记录访问日志、鉴权等，然后到达路由中间件，路由中间件会根据请求的信息来识别用户的请求意图，进而将请求派发给相应的控制器进行处理。

路由（Router）负责分发来自客户端的请求，并定义对应的控制器处理请求

业务模型（Service）的概念类似组件，是一个个最小颗粒化的功能方法抽象，可以被各种控制器调用

控制器（Controller）主要负责整体业务流程的控制，它通常会调用底层的一个或者多个业务模型来处理请求，并将业务模型的处理结果进行组装返回给客户端

扩展用于扩展 context 上下文、request、response 对象，提供一些通用的工具方法和属性，在写业务逻辑的时候就能直接使用

生命周期钩子：我们可以在服务启动前和结束前定义 Hook 钩子函数，例如执行定时服务，我们就可以在启动前的钩子函数中做