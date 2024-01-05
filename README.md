<div align="center">

<h1 align="center">🍭 ChatGPT-Midjourney</h1>

中文 | [English](./README_EN.md)

一键免费部署你的私人 ChatGPT+Midjourney 网页应用（基于[ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)开发）

[QQ交流群](https://github.com/Licoy/ChatGPT-Midjourney/issues/30) | [💥PRO版本](https://github.com/Licoy/ChatGPT-Midjourney-Pro)

[![WordPress+ChatGPT支持](https://img.shields.io/badge/WordPress-AIGC%20部署-red.svg?logo=wordpress&logoColor=red)](https://github.com/Licoy/wordpress-theme-puock)

![主界面](./docs/images/cover.png)

</div>

## 功能支持
> 🍭 PRO版本支持更强大的功能，**宝塔5分钟部署**，配置超简单，强大的在线后台管理及配置框架让你丝滑体验，**占用内存不到100M**，**包含对话+绘画账号池支持等等**，支持高并发：[💥 点我立即查看及体验PRO版本](https://github.com/Licoy/ChatGPT-Midjourney-Pro)，**最低1C1G的服务器就能流畅运行**。

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
- [x] 自定义Discord的API、CDN、Websocket支持
- [x] 自身内部支持 Midjourney 服务，无需任何第三方依赖

## 参数说明
### MJ_SERVER_ID
Discord 服务器ID
### MJ_CHANNEL_ID
Discord 频道ID
### MJ_USER_TOKEN
Discord 用户Token
### MJ_DISCORD_PROXY
Discord 代理域名，默认为：`https://discord.com`
### MJ_DISCORD_WSS_PROXY
Discord Websocket代理域名，默认为：`wss://gateway.discord.gg`
### MJ_DISCORD_WSS_PROXY
Discord CDN代理域名，默认为：`https://cdn.discordapp.com`
### CODE
（可选）设置页面中的访问密码
### 其余参数
与 ChatGPT-Next-Web 一致

## 部署
### Docker
```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxx" \
   -e BASE_URL="https://api.openai.com" \
   -e MJ_SERVER_ID="" \
   -e MJ_CHANNEL_ID="" \
   -e MJ_USER_TOKEN="" \
   licoy/chatgpt-midjourney:v3.2.1
```
### Sealos
[![](https://raw.githubusercontent.com/labring-actions/templates/main/Deploy-on-Sealos.svg)](https://cloud.sealos.io/?openapp=system-template%3FtemplateName%3Dchatgpt-midjourney)
### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MJ_SERVER_ID&env=MJ_CHANNEL_ID&env=MJ_USER_TOKEN&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)
### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/1g6vDL?referralCode=vvEj-K)
### 手动部署
- clone本项目到本地
- 安装依赖
```shell
npm install
npm run build
npm run start // #或者开发模式启动： npm run dev
```
## 使用
### ⚠ 注意事项
- 在绘画之前需要关闭Remix模式，否则会出现无法Vary、Pan、Zoom等无法绘画的情况：在Discord中输入`/setting`，然后点击`Remix Mode`即可关闭。
### 创建绘画
在输入框中以`/mj`开头输入您的绘画描述，即可进行创建绘画，例如：
```
/mj a dog
```
### 混图、识图、垫图
![mj-5](./docs/images/mj-5.png)
> 提示：垫图模式/识图(describe)模式只会使用第一张图片，混图(blend)模式会按顺序使用选中的两张图片（点击图片可以移除）

## 截图
### 混图、识图、垫图
![mj-4](./docs/images/mj-4.png)
### 状态实时获取
![mj-2](./docs/images/mj-1.png)
### 自定义midjourney参数
![mj-2](./docs/images/mj-2.png)
### 更多功能
等你自行发掘

## 开源协议
[MIT](./LICENSE)
