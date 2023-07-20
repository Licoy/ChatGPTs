<div align="center">

<h1 align="center">🍭 ChatGPT-Midjourney</h1>

中文 | [English](./README_EN.md) | [日本語](./README_JA.md)

一键免费部署你的私人 ChatGPT+Midjourney 网页应用（基于[ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)开发）

[QQ交流群](https://github.com/Licoy/ChatGPT-Midjourney/issues/30) | [💥PRO版本](https://github.com/Licoy/ChatGPT-Midjourney-Pro)

[![WordPress+ChatGPT支持](https://img.shields.io/badge/WordPress-AIGC%20部署-red.svg?logo=wordpress&logoColor=red)](https://github.com/Licoy/wordpress-theme-puock)

![主界面](./docs/images/cover.png)

</div>

## 功能支持
🍭 PRO版本支持更强大的功能，**宝塔5分钟部署**，配置超简单，强大的在线后台管理及配置框架让你丝滑体验，**占用内存不到100M**，**包含对话+绘画账号池支持等等**，支持高并发：[💥 点我立即查看及体验PRO版本](https://github.com/Licoy/ChatGPT-Midjourney-Pro)，**最低1C1G的服务器就能流畅运行**。

- [x] 原`ChatGPT-Next-Web`所有功能
- [x] Midjourney `Imgine` 想象
- [x] Midjourney `Upscale` 放大
- [x] Midjourney `Variation` 变幻
- [x] Midjourney `Describe` 识图
- [x] Midjourney `Blend` 混图
- [x] Midjourney 垫图
- [x] 绘图进度百分比、实时图像显示
- [ ] 自身支持 Midjourney 服务
- [ ] 基于 Vue + NaiveUI 重构

## 参数说明
### MIDJOURNEY_PROXY_URL
```shell
MIDJOURNEY_PROXY_URL=http://yourip:port
```
> ⚠️注意：如果你使用的是Docker部署，那么这里的地址应该是`http://公网IP:port`，而不是`http://localhost:port`，因为Docker中的容器是隔离的，`localhost`指向的是容器内部的地址，而不是宿主机的地址。
- 界面中

![mj-6](./docs/images/mj-6.png)

### MIDJOURNEY_PROXY_API_SECRET
（可选）`midjourney-proxy`的API请求密钥，防止他人恶意调用，可在环境变量中配置。

### CODE
（可选）设置页面中的访问密码，防止被其他人轻易使用消耗余额

## 部署
### ChatGPT-Midjourney 前端部署
#### Docker
```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxx" \
   -e CODE="123456" \
   -e BASE_URL="https://api.openai.com" \
   -e MIDJOURNEY_PROXY_URL="http://ip:port" \
   licoy/chatgpt-midjourney:v1.3.9
```
#### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MIDJOURNEY_PROXY_URL&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)
#### Zeabur
> - 新注册的 Github 账号可立即使用 Zeabur
> - Zeabur 服务器运行在国外，其生成的域名 *.zeabur.app 国内可直接访问

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://dash.zeabur.com/templates/AX8RDG)

<details> <summary>开始部署（点我展开）</summary>

打开网址

[Zeabur：https://zeabur.com](https://zeabur.com/zh-CN)

点击现在开始

点击 `Sign in with GitHub`

登陆你的 `Github` 账号

点击 `Authorize zeabur` 授权

点击 `创建项目` 并输入一个项目名称，点击 `创建`

点击 `+` 添加服务，选择 `Git-Deploy service from source code in GitHub repository.`

点击 `Configure GitHub` 根据需要选择 `All repositories` 或者 `Only select repositories`

点击 `install`,之后自动跳转，最好再刷新一下页面

点击 你 fork 的 `ChatGPT-Midjourney` 项目

点击环境变量，添加你需要的环境变量

然后取消 `Building`，点击 `Redeploy` (此做法是为了让环境变量生效)

部署 `ChatGPT-Midjourney` 大概需要 `6` 分钟，此时你可以做的是：配置域名

点击下方的域名，点击生成域名，输入前缀，例如我的是 `chatgpt-midjourney.zeabur.app`，点击保存

或者也可添加自定义域名，之后加上 `CNAME` 解析即可

等待部署成功即可

</details>

#### 手动部署
- clone本项目到本地
- 安装依赖
```shell
npm install
npm run build
npm run start // #或者开发模式启动： npm run dev
```
### midjourney-proxy 服务部署
#### Docker
- 运行 `midjourney-proxy` (Midjourney API服务，更多参数配置可以参考：[midjourney-proxy](https://github.com/novicezk/midjourney-proxy))
```shell
docker run -d --name midjourney-proxy \
 -p 8080:8080 \
 -e mj.discord.guild-id=xxx \
 -e mj.discord.channel-id=xxx \
 -e mj.discord.user-token=xxx \
 -e mj.discord.bot-token=xxx \
 --restart=always \
 novicezk/midjourney-proxy:2.3.5
```
#### Railway
> Railway是一个提供弹性部署方案的平台，服务在海外，方便MidJourney的调用。

参考：[midjourney-proxy - Railway 部署教程](https://github.com/novicezk/midjourney-proxy/blob/main/docs/railway-start.md)

#### Zeabur 
> - 新注册的 Github 账号可能无法使用 Railway，但是能用 Zeabur 
> - 通过 Railway 部署的项目会自动生成一个域名，然而因为某些原因，形如 *.up.railway.app 的域名在国内无法访问
> - Zeabur 服务器运行在国外，但是其生成的域名 *.zeabur.app 没有被污染,国内可直接访问

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://dash.zeabur.com/templates/B04F4M)

参考：[midjourney-proxy - Zeabur 部署教程](https://github.com/novicezk/midjourney-proxy/blob/main/docs/zeabur-start.md)

## 使用
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
- 等你自行发掘

## 鸣谢
- [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
- [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)

## 开源协议
[Anti 996 LICENSE](./LICENSE)
