"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const dockerode_1 = __importDefault(require("dockerode"));
const app = (0, express_1.default)();
const port = 8199;
const docker = new dockerode_1.default({ socketPath: '/var/run/docker.sock' });
app.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serviceInfo = yield getServiceInfo();
        res.json(serviceInfo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
function getServiceInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = docker.getContainer(process.env.HOSTNAME);
        const info = yield container.inspect();
        const ip = info.NetworkSettings.Networks['compse140-docker-compose-hands-on_ridvanContainer'].IPAddress;
        const processes = yield execCommand('ps -ax');
        const diskSpace = yield execCommand('df -h');
        const uptime = yield execCommand('uptime -p');
        return {
            ip,
            processes,
            diskSpace,
            uptime
        };
    });
}
function execCommand(command) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, (error, stdout) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(stdout);
            }
        });
    });
}
app.listen(port, () => console.log(`Service2 listening on port ${port}`));
