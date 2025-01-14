import express from 'express';
import { exec } from 'child_process';
import Docker from 'dockerode';

const app = express();
const port = 8199;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

app.get('/', async (_req, res) => {
    try {
        const serviceInfo = await getServiceInfo();
        res.json(serviceInfo);
    } catch(error: any) {
        res.status(500).json({ error: error.message });
    }
});

async function getServiceInfo(): Promise<{ip: string; processes: string; diskSpace: string; uptime: string}>{
    const container = docker.getContainer(process.env.HOSTNAME as string);
    const info = await container.inspect();
    const ip = "1.1.11.1"; //info.NetworkSettings.Networks['compse140-docker-compose-hands-on_ridvanContainer'].IPAddress;

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

function execCommand(command: string): Promise<string> {
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

app.listen(port, () => console.log(`Service2 listening on port ${port}`));