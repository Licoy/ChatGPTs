import {Midjourney} from "midjourney";
import express from "express";
import {randomUUID} from "crypto";

const workerpool = require('workerpool');

export class MidjourneyApi {
    private client?: Midjourney
    private pool = workerpool.pool();
    private tasks:any = {}

    generateTaskId() {
        return randomUUID()
    }

    handler(server: express.Application) {
        const router = express.Router();
        router.post('/task/submit', async (req, res) => {
            const data = req.body
            const taskId = this.generateTaskId()
            this.tasks[taskId] = null
            this.pool.exec(async (taskId: string,data:any) => {
                try{
                    const res = await this.client?.Imagine(
                        data.prompt,
                        (uri: string, progress: string) => {
                            this.tasks[taskId] = {taskId, loading: true, url: uri, progress}
                        }
                    )
                    this.tasks[taskId] = {taskId, ...res}
                }catch (e) {
                    console.error('task error',e)
                    this.tasks[taskId] = {err:e}
                }
            })
            res.send({taskId})
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
}