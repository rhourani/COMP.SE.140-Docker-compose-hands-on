const express = require('express');
const { exec } = require('child_process');
const Docker = require('dockerode');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8199;

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

app.get('/', async (_req, res) => {
    try {
        const service1Info = await getServiceInfo();
        const service2Info = await axios.get('http://service2:8199');

        res.json({
            
            service1: service1Info,
            service2: service2Info.data
        });
    } catch(error){
        res.status(500).json({ error: error.message });
    }
});

async function getServiceInfo(){
    const container = docker.getContainer(process.env.HOSTNAME);
    const info = await container.inspect();
    const ip = info.NetworkSettings.Networks['COMPSE140_custom_network'].IPAddress;

    const processes = await execCommand('ps -ax');
    const diskSpace = await execCommand('df -h');
    const uptime = await execCommand('uptime -p');

    return {
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