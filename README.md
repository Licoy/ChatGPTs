<div align="center">

<h1 align="center">ChatGPT-Midjourney</h1>

一键免费部署你的私人 ChatGPT 网页应用（基于[ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)开发）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MIDJOURNEY_PROXY_URL&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Licoy/ChatGPT-Midjourney)

![主界面](./docs/images/cover.png)

</div>

## 准备工作
- Web部署与原项目[ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)一致，请参考原项目。
- Midjourney服务请参考[midjourney-proxy](https://github.com/novicezk/midjourney-proxy)部署。

## 部署
在项目的根目录下的`.env`文件中的`MIDJOURNEY_PROXY_URL`填入你的midjourney服务地址，例如：
```
MIDJOURNEY_PROXY_URL=http://localhost:8080
```
接着其他的就跟[ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)使用方法一致。

## 使用
在输入框中以`/mj`开头输入您的绘画描述，即可进行创建绘画，例如：
```
/mj a dog
```
![mj-1](./docs/images/mj-1.png)

## 鸣谢
- [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
- [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)

## 开源协议
[Anti 996 LICENSE](./LICENSE)