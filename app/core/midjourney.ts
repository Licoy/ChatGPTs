import {Midjourney, MJMessage} from "midjourney";

const {v4: uuidv4} = require('uuid');

export class MidjourneyApi {
    private client?: Midjourney
    private tasks: any = {}
    private initLock: boolean = false

    constructor() {
        console.log('midjourney api server constructor')
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

    submit(data: any) {
        this.preStatusCheck()
        const taskId = this.generateTaskId()
        if (data.action === 'IMAGINE') {
            this.taskCall(taskId, this.client?.Imagine(
                data.prompt,
                this.taskLoading(taskId)
            ))
        } else if (data.action === 'CUSTOM') {
            this.taskCall(taskId, this.client?.Custom({
                msgId: data.msgId,
                flags: data.flags,
                customId: data.cmd,
                loading: this.taskLoading(taskId)
            }))
        } else {
            return {taskId, status: 'FAIL', msg: 'not support action', code: 1}
        }
        this.tasks[taskId] = {
            taskId,
            prompt: data.prompt,
            action: data.action,
            cmd: data.cmd,
            status: 'SUBMITTED',
            code: 0
        }
        console.log('submit tasks', this.tasks)
        return this.tasks[taskId]
    }

    status(taskId: string) {
        console.log('tasks', this.tasks)
        console.log('get task status', taskId)
        this.preStatusCheck()
        return this.tasks[taskId] || {taskId, status: 'FAIL', msg: 'not found task', code: 1}
    }

    async start() {
        if(this.initLock){
            throw new Error('midjourney client init, please wait')
        }
        if(this.isStarted()){
            return
        }
        this.initLock = true
        console.log('midjourney api server begin start')
        const args = {
            ServerId: <string>process.env.MJ_SERVER_ID,
            ChannelId: <string>process.env.MJ_CHANNEL_ID,
            SalaiToken: <string>process.env.MJ_USER_TOKEN,
            Debug: true,
            Ws: true,
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
        }finally {
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
}