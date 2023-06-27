<div align="center">

<h1 align="center">ChatGPT-Midjourney</h1>

[中文](./README.md) | English | [日本語](./README_JA.md)

One-click free deployment of your private ChatGPT+Midjourney web application (based on [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web) development)

[QQ Group](https://github.com/Licoy/ChatGPT-Midjourney/issues/30) | [Sponsor](https://licoy.cn/open-sponsor.html) | [PRO VERSION](https://github.com/Licoy/ChatGPT-Midjourney-Pro)

[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Deploy-00CCCC.svg?logo=vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MIDJOURNEY_PROXY_URL&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)
[![Deploy with Railway](https://img.shields.io/badge/MidjourneyProxy-RailwayDeploy-009900.svg?logo=railway)](https://github.com/novicezk/midjourney-proxy/blob/main/docs/railway-start.md)

[![WordPress+ChatGPT支持](https://img.shields.io/badge/WordPress-ChatGPT%20Deploy-red.svg?logo=wordpress&logoColor=red&style=for-the-badge)](https://github.com/Licoy/wordpress-theme-puock)

![Main interface](./docs/images/cover.png)

</div>

## Support
- [x] All features of the original `ChatGPT-Next-Web`
- [x] midjourney `imagine`
- [x] midjourney `upscale` Zoom in
- [x] midjourney `variation`
- [x] midjourney `describe`
- [x] midjourney `blend`
- [x] midjourney pad figure
- [x] Drawing progress percentage, live image display
- [ ] Supports midjournal API on its own

## Parameter Description
### MIDJOURNEY_PROXY_URL
```shell
MIDJOURNEY_PROXY_URL=http://yourip:port
```
> ⚠️ Note: If you are using Docker deployment, the address here should be `http://public IP:port`, not `http://localhost:port`, because the container in Docker is isolated , `localhost` points to the address inside the container, not the address of the host.
- in the interface

![mj-6](./docs/images/mj-6.png)

### MIDJOURNEY_PROXY_API_SECRET
(optional) The API request key of `midjourney-proxy`, to prevent malicious calls from others, can be configured in environment variables.

### CODE
(optional) Set the access password on the page to prevent it from being easily used by others to consume the balance

## Deployment
### ChatGPT-Midjourney front-end deployment
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
#### Manual deployment
- clone this project to local
- Install dependencies
```shell
npm install
npm run build
npm run start // #or start in development mode: npm run dev
```
### midjourney-proxy service deployment
#### Docker
- Run `midjourney-proxy` (Midjourney API service, for more parameter configuration, please refer to: [midjourney-proxy](https://github.com/novicezk/midjourney-proxy))
```shell
docker run -d --name midjourney-proxy \
  -p 8080:8080 \
  -e mj.discord.guild-id=xxx \
  -e mj.discord.channel-id=xxx \
  -e mj.discord.user-token=xxx\
  -e mj.discord.bot-token=xxx\
  --restart=always \
  novicezk/midjourney-proxy:2.3.2
```
#### Railway
> Railway is a platform that provides flexible deployment solutions. The service is overseas, which is convenient for MidJourney to call.

Reference: [midjourney-proxy - Railway Deployment Tutorial](https://github.com/novicezk/midjourney-proxy/blob/main/docs/railway-start.md)


## Use
Enter your painting description starting with `/mj` in the input box to create a painting, for example:
```
/mj a dog
```
### Mixing images, recognizing images, matting images
![mj-5](./docs/images/mj-5.png)
> Tips: Pad mode/describe mode will only use the first picture, and blend mode will use the two selected pictures in order (click on the picture to remove)

## Screenshot
### Mixing images, recognizing images, matting images
![mj-4](./docs/images/mj-4.png)
### Status real-time acquisition
![mj-2](./docs/images/mj-1.png)
### Custom midjourney parameters
![mj-2](./docs/images/mj-2.png)
### More features
- Waiting for you to discover

## Acknowledgments
- [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web)
- [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)

## Open source agreement
[Anti 996 LICENSE](./LICENSE)
