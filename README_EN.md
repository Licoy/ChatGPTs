<div align="center">

<h1 align="center">🍭 ChatGPT-Midjourney</h1>

[中文](./README.md) | English

One-click free deployment of your private ChatGPT+Midjourney web application (based on [ChatGPT-Next-Web](https://github.com/Yidadaa/ChatGPT-Next-Web) development)

[QQ exchange group](https://github.com/Licoy/ChatGPT-Midjourney/issues/30) | [💥PRO version](https://github.com/Licoy/ChatGPT-Midjourney-Pro)

[![WordPress+ChatGPT support](https://img.shields.io/badge/WordPress-AIGC%20deployment-red.svg?logo=wordpress&logoColor=red)](https://github.com/Licoy/wordpress-theme-puock)

![Main interface](./docs/images/cover.png)

</div>

## Function support
> 🍭 The PRO version supports more powerful functions, **Pagoda 5-minute deployment**, super simple configuration, powerful online background management and configuration framework gives you a smooth experience, **occupies less than 100M of memory**, **included Dialogue + painting account pool support, etc. **, supports high concurrency: [💥 Click me to view and experience the PRO version immediately](https://github.com/Licoy/ChatGPT-Midjourney-Pro), **Minimum 1C1G server It will run smoothly**.

- [x] All functions of original `ChatGPT-Next-Web`
- [x] Midjourney `Imgine` imagine
- [x] Midjourney `Upscale`
- [x] Midjourney `Variation` changes
- [x] Midjourney `Zoom` image expansion
- [x] Midjourney `Vary` changes
- [x] Midjourney `Pan`
- [x] Midjourney `Reroll` respawn
- [x] Midjourney `Describe` image recognition
- [x] Midjourney `Blend`
- [x] Midjourney pad map
- [x] Drawing progress percentage, real-time image display
- [x] Customized Discord API, CDN, and Websocket support
- [x] Support Midjourney service internally without any third-party dependencies

## Parameter Description
### MJ_SERVER_ID
Discord server ID
### MJ_CHANNEL_ID
Discord ChannelID
### MJ_USER_TOKEN
Discord User Token
### MJ_DISCORD_PROXY
Discord proxy domain, default to: `https://discord.com`
### MJ_DISCORD_WSS_PROXY
Discord Websocket proxy domain, default to: `wss://gateway.discord.gg`
### MJ_DISCORD_WSS_PROXY
Discord CDN proxy domain, default to: `https://cdn.discordapp.com`
### CODE
(Optional) Set the access password on the page to prevent others from easily using it to consume the balance
### Other Parameters
Consistent with ChatGPT-Next Web

## Deployment
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
### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLicoy%2FChatGPT-Midjourney&env=OPENAI_API_KEY&env=MJ_SERVER_ID&env=MJ_CHANNEL_ID&env=MJ_USER_TOKEN&env=CODE&project-name=chatgpt-midjourney&repository-name=ChatGPT-Midjourney)
### Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/1g6vDL?referralCode=vvEj-K)
### Manual deployment
- clone this project locally
- Install dependencies
```shell
npm install
npm run build
npm run start // #or start in development mode: npm run dev
```
## Use
### ⚠ Notes
- Remix mode needs to be turned off before drawing, otherwise you will be unable to Vary, Pan, Zoom, etc. and draw: enter `/setting` in Discord, and then click `Remix Mode` to turn it off.
### Create a painting
Enter your painting description starting with `/mj` in the input box to create a painting, for example:
```
/mj a dog
```
### Mixing images, recognizing images, and matting images
![mj-5](./docs/images/mj-5.png)
> Tip: The pad mode/describe mode will only use the first picture, and the blend mode will use the two selected pictures in order (click the picture to remove it)

## screenshot
### Mixing images, recognizing images, matting images
![mj-4](./docs/images/mj-4.png)
### Status real-time acquisition
![mj-2](./docs/images/mj-1.png)
### Custom midjourney parameters
![mj-2](./docs/images/mj-2.png)
### More features
Waiting for you to discover

## Open source protocol
[MIT](./LICENSE)