import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyMultipart from "@fastify/multipart";
import ejs from 'ejs';
import { index, upload } from "./actions/requests.js";

const PORT = 8083 || process.env.PORT;

const app = Fastify();

app.register(fastifyMultipart)

app.register(fastifyView, {
    engine:{
        ejs
    }
});

app.get('/', index);

app.post('/upload', upload);


const start = async () => {
    try {
        await app.listen({port:PORT})
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();