const express = require('express');
const { exec } = require('child_process');
const Docker = require('dockerode');
const axios = require('axios');
const auth = require('basic-auth')

const app = express();
app.use(express.text());
const port = process.env.PORT || 8199;

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// app.get('/request', async (_req, res) => {
//     try {
//         const service1Info = await getServiceInfo();
//         const service2Info = await axios.get('http://service2:8199');

//         res.json({

//             service1: service1Info,
//             service2: service2Info.data
//         });
//         await sleep(2000);
//         setTimeout(() => console.log(service1Info.containerName + ' ready to take another request'), 2000);

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

app.post('/stop', (req, res) => {
    res.send('Shutting down...');
    exec('docker-compose down', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send('Error sutting down');
        }
        res.status(200).send(200).send('Shutting down...');
        process.exit();
    });

});


//api gateway methods
let currentState = 'INIT';
const validStates = ['INIT', 'PAUSED', 'RUNNING', 'SHUTDOWN'];
const stateHistory = [];


const isAuthenticated = (req) => {
    const credentials = auth(req);
    if (!credentials || credentials.name !== 'ridvan' || credentials.pass !== 'ridvan') {
        return false;
    }
    return true;
};

app.put('/state', (req, res) => {

    //check if incmoing string is valid for system's states
    let newState = req.body;
    if (!validStates.includes(newState)) {
        res.set('Content-Type', 'text/plain');
        res.status(400).send('Invalid state ' + newState);
        return res;
    }

    //Case where system in in INIT and use is logged in, then system will goes to 
    // RUNNING state
    if(currentState === "INIT" && isAuthenticated(req)){

        //Set next state and log transition history
        newState = 'RUNNING';
        logTransition(newState);
        currentState = newState;

        res.set('Content-Type', 'text/plain');
        return res.status(200).send('RUNNING');
    }
    else if (currentState === "INIT" && !isAuthenticated(req)) {
        res.set('Content-Type', 'text/plain');
        return res.status(501).send('Unauthorized');
    }

    //Handle situation where system state is RUNNING or PAUSED
    else if((currentState === "RUNNING" || currentState === "PAUSED")){
        if (newState === "INIT") {
            //Set next state and log transition history
            logTransition(newState);
            currentState = newState;
    
            //Reset state of the system >> already state resetted
            //Log out the user by cleaning the credentials
            res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
            return res.status(200).send('Logged out');
            
        }

        else if (newState === "SHUTDOWN") {
            logTransition(newState);
            exec('docker-compose down', (error, stdout, stderr) => {
                if (error) {
                    return res.set('Content-Type', 'text/plain')
                    .status(500).send(error);
                }
                res.set('Content-Type', 'text/plain');
                return res.status(200).send('Shutting down performed');
            });
        }
        //Case where system can go between paused and running but states are not same
        else if(newState !== currentState){
            logTransition(newState);
            currentState = newState;
            res.set('Content-Type', 'text/plain');
            return res.status(200).send(newState);
        }
    }
    res.set('Content-Type', 'text/plain');
    return res.status(200).send("No change done");
});

app.get('/state', (req, res) => {
    res.set('Content-Type', 'text/plain');
    return res.status(200).send(currentState);
});

app.get('/requestAsText', async (req, res) => {
    try {
        const service1Info = await getServiceInfo();
        const service2Info = await axios.get('http://service2:8199');
        res.set('Content-Type', 'text/plain');
        
        res.send({

            service1: service1Info,
            service2: service2Info.data
        });
        await sleep(2000);
        setTimeout(() => console.log(service1Info.containerName + ' ready to take another request'), 2000);

    } catch (error) {
        res.status(500).text({ error: error.message });
    }
});


app.get('/run-log', (req, res) => {
    res.set('Content-Type', 'text/plain'); 
    return res.status(200).send(stateHistory.toString());
});

//helper methods
function logTransition(newState) {
    const timestamp = new Date().toISOString();
    stateHistory.push(`${timestamp}: ${currentState}->${newState}`);
}

async function getServiceInfo() {

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

function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
}

app.listen(port, () => console.log(`Service1 listening on port ${port}`));
