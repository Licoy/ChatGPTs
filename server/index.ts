import express from 'express'
import next from 'next'
import {MidjourneyApi} from "./midjourney";
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const api = new MidjourneyApi()

app.prepare().then(async () => {
    await api.start()
    const server: express.Application = express();
    server.use(bodyParser.json());
    api.handler(server)
    server.all('*', (req, res) => handle(req, res));
    server.listen(port, () => {
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
        console.log('> Github: https://github.com/Licoy/ChatGPT-Midjourney')
        console.log(`> Ready on http://localhost:${port}`);
    });
})