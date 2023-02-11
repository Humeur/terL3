import util from 'util';
import { pipeline } from "stream";
import fs from 'fs';

const pump = util.promisify(pipeline);

export const index = (req, res) => {
    res.view('templates/index.ejs');
}

export const upload = async (req, res) => {
    const parts = req.parts();
    for await (const part of parts) {
        if (part.file) {
            await pump(part.file, fs.createWriteStream(`./input_nifi/${part.filename}`));
        } else {
            console.log('got field: ', part);
        }
    }

    console.log('Upload completed !');
    res.redirect('/');
}