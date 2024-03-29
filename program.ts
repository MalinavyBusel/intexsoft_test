import { Handler } from "./handlers/handler"
const BankHandler = require('./handlers/bank/bankHandler')
const ClientHandler = require('./handlers/client/clientHandler')

const readline = require('node:readline')
const mongoose = require('mongoose')
require('dotenv').config();
const process = require('process')

const url = process.env.MONGO_URL;
mongoose.connect(url);

module.exports = class Program {
    mapping: Map<string, Handler>
    constructor(
    ) {
        this.mapping = new Map()
        const bh = new BankHandler()
        const ch = new ClientHandler()
        const handlers = [bh, ch]
        for (const handler of handlers) {
            this.mapping.set(handler.handlerName, handler)
        }
        this.Serve()
    }

    async Serve() {
        function readInput(): Promise<string> {
            const i = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
              });

            return new Promise(resolve => i.question("> ", prompt => {
                i.close();
                resolve(prompt);
            }))
        }

        while (true) {
            const prompt = await readInput()
            const {handler, cmd, args} = processPrompt(prompt)
            console.log("params: ", handler, cmd, args)
            const handlerObj = this.mapping.get(handler)

            if (handler == 'help') {
                this.help()
            } else if (handler == 'exit') {
                process.exit()
            } else if (handlerObj == undefined) {
                console.log('no such command')
            } else {
                handlerObj.apply(cmd, args)
            }
        }
    }
    private help() {
        for (const handler of this.mapping) {
            console.log(handler[0].toUpperCase())
            handler[1].iterate()
            console.log('-------------------\n-------------------')
        }
    }
}

function processPrompt(str: string): {handler: string; cmd: string; args: string[];} {
    const strSplitted = str.split(' ')
    const handlerName = strSplitted[0]
    const cmd = strSplitted[1]
    const args = strSplitted.slice(2)
    return {handler: handlerName, cmd, args}
}
