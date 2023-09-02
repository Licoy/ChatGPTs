import {Midjourney, MJMessage} from "midjourney";
import express from "express";
import {randomUUID} from "crypto";

const workerpool = require('workerpool');

export class MidjourneyApi {
    private client?: Midjourney
    private pool = workerpool.pool();
    private tasks: any = {}

    generateTaskId() {
        return randomUUID()
    }

    handler(server: express.Application) {
        const router = express.Router();
        router.post('/task/submit', async (req, res) => {
            const data = req.body
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
                res.send({taskId, status: 'FAIL', msg: 'not support action', code: 1})
                res.end()
                return
            }
            this.tasks[taskId] = {
                taskId,
                prompt: data.prompt,
                action: data.action,
                cmd: data.cmd,
                status: 'SUBMITTED',
                code: 0
            }
            res.send(this.tasks[taskId])
            res.end()
        })
        router.get('/task/status/:taskId', async (req, res) => {
            const taskId = req.params.taskId;
            res.send(this.tasks[taskId] || {taskId, status: 'FAIL', msg: 'not found task', code: 1})
            res.end()
        })
        server.use('/api/midjourney', router)
    }

    async start() {
        console.log('midjourney api server begin start')
        const args = {
            ServerId: <string>process.env.SERVER_ID,
            ChannelId: <string>process.env.CHANNEL_ID,
            SalaiToken: <string>process.env.SALAI_TOKEN,
            Debug: true,
            Ws: true,
        }
        console.debug('midjourney api server args', args)
        this.client = new Midjourney(args);
        try {
            await this.client.init();
            console.log('midjourney api server success started')
        } catch (e) {
            console.error('midjourney api server start failed')
            console.error(e)
            process.exit(1)
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