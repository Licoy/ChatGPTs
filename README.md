<div align="center">

<h1 align="center">🍭 ChatGPT-Midjourney</h1>

中文 | [English](./README_EN.md)

一一键拥有你自己的 ChatGPT+StabilityAI+Midjourney 网页服务（基于[ChatGPT-Next-Web](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web)开发）

[QQ交流群](https://github.com/Licoy/ChatGPT-Midjourney/issues/30) | [💥PRO版本](https://github.com/Licoy/GoAmzAI)

[![WordPress+ChatGPT支持](https://img.shields.io/badge/WordPress-AIGC%20部署-red.svg?logo=wordpress&logoColor=red)](https://github.com/Licoy/wordpress-theme-puock)

![主界面](./docs/images/cover.png)

</div>

## 功能支持
> 🍭 PRO版本支持更强大的功能，**宝塔5分钟部署**，配置超简单，站点完全自适应支持PC、平板、手机，**占用内存不到100M**，**包含AI对话、AI绘画、AI音乐、AI视频、AI生成PPT、PDF解析对话、AI应用支持等等**，同时具有非常完善的运营机制，包括但不限于套餐系统、兑换码系统、邀请奖励、签到福利、推广返利等等，同时基于Golang开发，天生支持高并发能力：[💥 点我立即查看及体验PRO版本](https://github.com/Licoy/ChatGPT-Midjourney-Pro)，**最低1C1G的服务器就能流畅运行**。

### 已支持
- [x] 原`ChatGPT-Next-Web`所有功能
- [x] Midjourney `Imgine` 想象
- [x] Midjourney `Upscale` 放大
- [x] Midjourney `Variation` 变幻
- [x] Midjourney `Zoom` 扩图
- [x] Midjourney `Vary` 变化
- [x] Midjourney `Pan` 平移
- [x] Midjourney `Reroll` 重新生成
- [x] Midjourney `Describe` 识图
- [x] Midjourney `Blend` 混图
- [x] Midjourney 垫图
- [x] 绘图进度百分比、实时图像显示
- [x] ...
- [x] 支持 Midjourney 图像生成之后的任何操作（暂除Vary Region以外）

## MJ Proxy API支持
> 本项目Midjourney相关API能力由 [trueai-org/midjourney-proxy](https://github.com/trueai-org/midjourney-proxy) 开源项目或同类项目提供API生成能力支持，使用本项目之前您需要先自建此服务，或者使用第三方中转平台的API。

### Midjourney-Proxy
- 项目地址：[trueai-org/midjourney-proxy](https://github.com/trueai-org/midjourney-proxy)
- 支持系统：Linux / Windows / MacOS
- 部署方式：Docker、一键脚本、安装包等

### 第三方中转API
> 以下为第三方中转API，本项目不做任何担保，请自行选择使用，若遇到任何疑问请联系对应的平台客服。

#### [GPTNB中转API](https://goapi.gptnb.ai)
- 支持ChatGPT、Claude、GPTs、Midjourney等多种模型的API接入，且超低成本比例 [[立即访问]](https://goapi.gptnb.me)

## 参数说明
### `MJ_PROXY_URL`
MJ Proxy的API链接地址
### `MJ_PROXY_KEY`
MJ Proxy的API密钥
### `CODE`
（可选）设置页面中的访问密码
### `...其余参数`
与 ChatGPT-Next-Web 一致

## 部署
### Docker
```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxx" \
   -e BASE_URL="https://api.openai.com" \
   -e MJ_PROXY_URL="" \
   -e MJ_PROXY_KEY="" \
   licoy/chatgpt-midjourney:v3.3.1
```
### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MJ_PROXY_URL&env=MJ_PROXY_KEY&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)
### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/1g6vDL?referralCode=vvEj-K)
### Sealos
[![](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-template%3FtemplateName%3Dchatgpt-midjourney)
### 手动部署
- clone本项目到本地
- 安装依赖
```shell
npm install
npm run build
npm run start // #或者开发模式启动： npm run dev
```
## 使用
### 创建绘画
部署好后，点击左上方的绘画，选择您需要使用的绘画模型即可进入：
![step-1](./docs/images/step-1.png)
## 截图
### Midjourney生成主界面
![step-1](./docs/images/step-2.png)
### StabilityAI生成主界面
![step-1](./docs/images/step-3.png)
### 自定义配置接口
![step-1](./docs/images/step-4.png)
### 更多功能
等你自行发掘

## 开源协议
[MIT](./LICENSE)
