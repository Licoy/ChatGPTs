import {Midjourney, MJMessage} from "midjourney";
import {MJConfigParam} from "midjourney/src/interfaces";
import {nextNonce} from "midjourney/libs/utils";

const {v4: uuidv4} = require('uuid');

export interface MidjourneyConfig {
    serverId: string
    channelId: string,
    token: string,
    discordProxy: string
    discordWssProxy: string
    discordCdnProxy: string
}

export class MidjourneyApi {
    private client?: Midjourney
    private tasks: any = {}
    private initLock: boolean = false
    public readonly config: MidjourneyConfig

    constructor() {
        console.log('midjourney api server constructor')
        this.config = {
            serverId: <string>process.env.MJ_SERVER_ID,
            channelId: <string>process.env.MJ_CHANNEL_ID,
            token: <string>process.env.MJ_USER_TOKEN,
            discordProxy: <string>process.env.MJ_DISCORD_PROXY || 'https://discord.com',
            discordWssProxy: <string>process.env.MJ_DISCORD_WSS_PROXY || 'wss://gateway.discord.gg',
            discordCdnProxy: <string>process.env.MJ_DISCORD_CDN_PROXY || 'https://cdn.discordapp.com',
        }
        console.log('midjourney api config', this.config)
    }

    isStarted() {
        return !!this.client
    }

    generateTaskId() {
        return uuidv4()
    }

    preStatusCheck() {
        if (!this.client) {
            throw new Error('midjourney client not started')
        }
    }

    async submit(data: any) {
        this.preStatusCheck()
        const taskId = this.generateTaskId()
        let afterCall: any
        if (data.action === 'IMAGINE') {
            let prompt = data.prompt
            if ((data.images?.length || 0) > 0) {
                const uploadRes: any = await this.uploadImage(data.images[0], true)
                prompt = uploadRes.url + " " + prompt
            }
            this.taskCall(taskId, this.client?.Imagine(
                prompt,
                this.taskLoading(taskId)
            ))
        } else if (data.action === 'BLEND') {
            if ((data.images?.length || 0) < 2) {
                throw new Error('need at least 2 images')
            }
            const images = []
            for (let i = 0; i < data.images.length; i++) {
                let uploadRes: any
                uploadRes = await this.uploadImage(data.images[i], true)
                images.push(uploadRes.url)
            }
            this.taskCall(taskId, this.client?.Imagine(
                images.join(' '),
                this.taskLoading(taskId)
            ))
        } else if (data.action === 'DESCRIBE') {
            //@ts-ignore
            const wsClient = await this.client?.getWsClient()
            if (!wsClient) {
                throw new Error('ws client not found')
            }
            const uploadRes = await this.uploadImage(data.images[0])
            console.log('upload res', uploadRes)
            const nonce = nextNonce();
            uploadRes.filename = (new Date()).getTime() + ".png"
            const httpStatus = await this.client?.MJApi.DescribeApi(uploadRes, nonce);
            if (httpStatus !== 204) {
                throw new Error(`DescribeApi failed with status ${httpStatus}`);
            }
            const res = await wsClient.waitDescribe(nonce);
            if (!res) {
                throw new Error('describe failed')
            }
            afterCall = (taskId: string) => {
                this.tasks[taskId] = Object.assign(this.tasks[taskId], {
                    prompt: res.descriptions?.join('\n\n'),
                    status: 'SUCCESS',
                    // options: res.options,
                    msgId: res.id,
                    flags: res.flags
                })
            }
        } else if (data.action === 'CUSTOM') {
            this.taskCall(taskId, this.client?.Custom({
                msgId: data.msgId,
                flags: data.flags,
                customId: data.cmd,
                loading: this.taskLoading(taskId)
            }))
        } else {
            throw new Error('not support action')
        }
        const res = {
            taskId,
            prompt: data.prompt,
            action: data.action,
            cmd: data.cmd,
            status: 'SUBMITTED',
            code: 0
        }
        const returnRes = JSON.parse(JSON.stringify(res))
        this.tasks[taskId] = res
        if (afterCall) afterCall(taskId)
        return returnRes
    }

    status(taskId: string) {
        this.preStatusCheck()
        const d = this.tasks[taskId]
        if (!d) {
            throw new Error('not found task')
        }
        return d
    }

    async start() {
        if (this.initLock) {
            throw new Error('midjourney client init, please wait')
        }
        if (this.isStarted()) {
            return
        }
        this.initLock = true
        console.log('midjourney api server begin start')
        const args: MJConfigParam = {
            ServerId: this.config.serverId,
            ChannelId: this.config.channelId,
            SalaiToken: this.config.token,
            Debug: true,
            Ws: true,
            DiscordBaseUrl: this.config.discordProxy,
            WsBaseUrl: this.config.discordWssProxy,
            ImageProxy: this.config.discordCdnProxy + '/'
        }
        console.debug('midjourney api server args', args)
        try {
            this.client = new Midjourney(args);
            await this.client.init();
            console.log(`
     _________ .__            __     _____________________________
     \\_   ___ \\|  |__ _____ _/  |_  /  _____/\\______   \\__    ___/
     /    \\  \\/|  |  \\\\__  \\\\   __\\/   \\  ___ |     ___/ |    |   
     \\     \\___|   Y  \\/ __ \\|  |  \\    \\_\\  \\|    |     |    |   
      \\______  /___|  (____  /__|   \\______  /|____|     |____|   
             \\/     \\/     \\/              \\/                     
     _____  .__    .___    __                                         
    /     \\ |__| __| _/   |__| ____  __ _________  ____   ____ ___.__.
   /  \\ /  \\|  |/ __ |    |  |/  _ \\|  |  \\_  __ \\/    \\_/ __ <   |  |
  /    Y    \\  / /_/ |    |  (  <_> )  |  /|  | \\/   |  \\  ___/\\___  |
  \\____|__  /__\\____ |/\\__|  |\\____/|____/ |__|  |___|  /\\___  > ____|
          \\/        \\/\\______|                        \\/     \\/\\/     
        `)
            console.log('midjourney api server success started')
        } catch (e) {
            console.error(e)
            throw new Error('midjourney api server start failed')
        } finally {
            this.initLock = false
        }
    }

    taskCall(taskId: string, call: Promise<MJMessage | null> | undefined) {
        if (!call) {
            return
        }
        call.then((res: any) => {
            const options = res?.options?.filter((item: any) => {
                return ['U1', 'U2', 'U3', 'U4', 'V1', 'V2', 'V3', 'V4', '🔄', 'Vary (Strong)', 'Vary (Subtle)', 'Zoom Out 2x', 'Zoom Out 1.5x',
                    '⬅️', '➡️', '⬆️', '⬇️'].includes(item.label)
            }) || []
            this.tasks[taskId] = Object.assign(this.tasks[taskId], {
                status: 'SUCCESS',
                code: 0,
                progress: res.progress,
                uri: res.uri,
                options: options,
                width: res.width,
                height: res.height,
                msgId: res.id,
                flags: res.flags,
                msgHash: res.hash
            })
        }).catch((e) => {
            this.tasks[taskId] = Object.assign(this.tasks[taskId], {error: e, status: 'FAIL', code: 1})
        })
    }

    taskLoading(taskId: string) {
        return (uri: string, progress: string) => {
            this.tasks[taskId] = Object.assign(this.tasks[taskId], {
                status: 'PROGRESS',
                code: 0,
                uri,
                progress
            })
        }
    }


    async uploadImage(base64: string, toMsg: boolean = false) {
        const id = ((new Date()).getTime()) + "";
        const filename = id + ".png"
        const imgBase64 = base64.split(';base64,')[1];
        const imgBuf = Buffer.from(imgBase64, 'base64');
        const res = await fetch(`${this.config.discordProxy}/api/v9/channels/${this.config.channelId}/attachments`, {
            method: "POST",
            headers: {
                "Authorization": `${this.config.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                files: [{
                    filename,
                    file_size: imgBuf.length,
                    id,
                }]
            })
        })
        if (res.status != 200) {
            throw new Error("upload image fail")
        } else {
            const json = await res.json()
            if (json?.attachments?.length != 1) {
                throw new Error("upload image fail, because of no attachment")
            }
            const uploadRes = await fetch(json.attachments[0].upload_url, {
                method: 'PUT',
                body: imgBuf,
                headers: {
                    'Content-Type': 'image/png',
                }
            })
            if (uploadRes.status != 200) {
                throw new Error("upload image fail, because of upload fail")
            }
            if (!toMsg) {
                return json.attachments[0]
            }
            const filename = json.attachments[0].upload_filename
            const fns = filename.split('/')
            const fn = fns.length > 1 ? fns[1] : fns[0]
            const uploadMsgRes = await fetch(`${this.config.discordProxy}/api/v9/channels/${this.config.channelId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `${this.config.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: fn,
                    channel_id: this.config.channelId,
                    type: 0,
                    sticker_ids: [],
                    attachments: [{
                        id: 0,
                        filename: fn,
                        uploaded_filename: filename
                    }]
                })
            })
            if (uploadMsgRes.status !== 200) {
                throw new Error("upload image fail, because of upload message fail")
            }
            const uploadMsgResJson = await uploadMsgRes.json()
            if (uploadMsgResJson.attachments?.length != 1) {
                throw new Error("upload image fail, because of upload message fail")
            }
            return uploadMsgResJson.attachments[0]
        }
    }
}