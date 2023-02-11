import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyMultipart from "@fastify/multipart";
import ejs from 'ejs';
import fs from 'fs';
import util from 'util';
import { pipeline } from "stream";
import { index } from "./actions/requests.js";

const PORT = 8083 || process.env.PORT;

const app = Fastify();
const pump = util.promisify(pipeline);

app.register(fastifyMultipart)

app.register(fastifyView, {
    engine:{
        ejs
    }
})


app.get('/', index);

app.post('/upload', async (req, res) => {
    const parts = req.parts();
    for await (const part of parts) {
        if (part.file) {
            await pump(part.file, fs.createWriteStream(`./input_nifi/${part.filename}`));
        } else {
            console.log('got field: ', part);
        }
    }

    console.log('upload completed');
});


const start = async () => {
    try {
        await app.listen({port:PORT})
        console.log(`Server running on port ${PORT}`);
    } catch (err){
        console.error(err);
        process.exit(1);
    }
}

start()