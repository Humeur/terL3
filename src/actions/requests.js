import util from 'util';
import { pipeline } from "stream";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { setTimeout } from "timers/promises";

const pump = util.promisify(pipeline);
const outputFolderPath="output_nifi";
var result =[];
var fileNames = [];

//Read csv files
const readMyFiles = async () => {
    const fileNameArray = fs.readdirSync(outputFolderPath);
    console.log("File names : "+fileNameArray);
    fileNames = [];
    result = [];
    //Parcours les fichiers un à un.
    for(var i in fileNameArray){
        var currentFile = [];
        if(path.extname(fileNameArray[i])=='.csv'){
            fileNames.push(fileNameArray[i])
            console.log("On accède à : " + outputFolderPath+"/"+fileNameArray[i]);
            fs.createReadStream(outputFolderPath+"/"+fileNameArray[i])
            .pipe(csv({separator : ','}))
            .on('data', (data) => {
                currentFile.push(data);
            })
            .on('end', () => {
                console.log("data in function : ", currentFile);
                result.push(currentFile)
            });
            await setTimeout(10);
        }
    }
    return result;
}

//Javascript Promises pour le retour de la fonction
export const index = (req, res) => {
    readMyFiles()
    .then( result =>{
        // await setTimeout(1000);
    console.log("Le résultat est : ", result, ". La liste de fichier est : ", fileNames);
    res.view('templates/index.ejs', {result, fileNames})
    })
    .catch( error=>{
        console.error('Error! ${error}')
    })
    console.log("On attend le resultat");
}

//export const index = 

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