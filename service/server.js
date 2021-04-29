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
    const {cluster_number} = req.query
    console.log('cluster...')
    // return ;
    child_process.exec('python E:\\virtualDesktop\\家谱\\app\\service\\kmeans.py ' + cluster_number, function (error, stdout, stderr) {
        // console.log('"object" :>> ', req.query);
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
            console.log("object")
            res.send({'success': false})
        }
        res.send(stdout)
    });
    
})


app.listen(3001, () => {
    console.log("http://localhost:3001");
})