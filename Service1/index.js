const express = require('express');
const { exec } = require('child_process');
const Docker = require('dockerode');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8199;

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.get('/request', async (_req, res) => {
    try {
        const service1Info = await getServiceInfo();
        const service2Info = await axios.get('http://service2:8199');

        res.json({
            
            service1: service1Info,
            service2: service2Info.data
        });
        await sleep(2000);
        setTimeout(() => console.log(service1Info .containerName + ' ready to take another request'), 2000);
        
    } catch(error){
        console.log("here is some error");
        console.log(error);

        res.status(500).json({ error: error.message });
    }
});

app.post('/stop', (req, res) => {
    res.send('Shutting down...');
    exec('docker-compose down', (error, stdout, stderr) => {
        if(error){
       	   console.error('Error shutting down: ${error}');
       	   return res.status(500).send('Error sutting down');
        }
        console.log(stdout);
        res.status(200).send(200).send('Shutting down...');
    	process.exit();
    });

});

let currentState = "INIT";

app.put('/state', (req, res) => { res.send(currentState); });

async function getServiceInfo(){

    const containers = await docker.listContainers({
         filters: {
             label: ['service=sexposed_to_outside_service1.v1']
             }
            });
    const containerId = containers.find(c => c.State === 'running').Id; 
    const container = docker.getContainer(containerId);
    const info = await container.inspect();
    const containerName = info.Name;
    const ip = info.NetworkSettings.Networks['compse140-docker-compose-hands-on_ridvanContainer'].IPAddress;

    const processes = await execCommand('ps -ax');
    const diskSpace = await execCommand('df -h');
    const uptime = await execCommand('uptime -p');

    return {
        containerName,
        ip,
        processes,
        diskSpace,
        uptime
    };
}

function execCommand(command){
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if(error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

app.listen(port, () => console.log(`Service1 listening on port ${port}`));
