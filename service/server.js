const express = require('express')
const fs = require('fs');
const child_process = require('child_process');
var bodyParser = require('body-parser'); 




const app = express()


app.get('/tsne', (req, res) => {
    console.log('tsne...')
    // res.send({'success': true})
    // return;
    child_process.exec('python E:\\virtualDesktop\\家谱\\app\\service\\handle.py', function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
            console.log("object")
            res.send({'success': false})
        }
        res.send({'success': true})
    });
    
})

app.get('/cluster', (req, res) => {
    const {cluster_number, properties} = req.query
    console.log('cluster...')
    console.log(properties);
    // return ;
    child_process.exec(`python E:\\virtualDesktop\\家谱\\app\\service\\kmeans.py ${cluster_number} ${properties}`, function (error, stdout, stderr) {
        // console.log('"object" :>> ', req.query);
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
            console.log("object")
            res.send({'success': false})
        }
        fs.readFile('./data/data_by_kmeans.json', {}, (err, data)=> {
            if (err) {
                return console.log(err)
            }
            res.send(data.toString())
        })
        // res.send(stdout)
    });
    
})

app.get('/getGly', (req, res) => {
    const {cluster_index} = req.query
    console.log('getGly...')
    // return ;
    child_process.exec(`python E:\\virtualDesktop\\家谱\\app\\service\\divide_area.py ${cluster_index}`, function (error, stdout, stderr) {
        // console.log('"object" :>> ', req.query);
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
            console.log("object")
            res.send({'success': false})
        }
        fs.readFile('./data/data_by_divide.json', {}, (err, data)=> {
            if (err) {
                return console.log(err)
            }
            res.send(data.toString())
        })
        // res.send(stdout)
    });
    
})


app.listen(3001, () => {
    console.log("http://localhost:3001");
})