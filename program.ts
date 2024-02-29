import { Handler } from "./handlers/handler"

const readline = require('node:readline')
const {parseArgs} = require('node:util')
     

module.exports = class Program {
    mapping: Map<String, Handler>
    constructor(
        ...handlers
    ) {
        console.log('constructing program')
        this.mapping = new Map()
        for (const handler of handlers) {
            this.mapping.set(handler.handlerName, handler)
        }
        console.log(this.mapping)
    }

    async Serve() {
        function readInput(): Promise<String> {
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
            let prompt = await readInput()
            let {handler, cmd, args} = processPrompt(prompt)
            console.log("params: ", handler, cmd, args)
            this.mapping.get(handler).apply(cmd, args)
        }
    }
}

function processPrompt(str: String): {handler: String; cmd: String; args: string[];} {
    const strSplitted = str.split(' ')
    const handlerName = strSplitted[0]
    const cmd = strSplitted[1]
    const args = strSplitted.slice(2)
    return {handler: handlerName, cmd, args}
    // const handlerName = str.slice(0, str.indexOf(' ')) || 'default';
    // str = str.slice(str.indexOf(' '))
    // const cmd = str.slice(0, str.indexOf(' ')) || 'default';
    // return {handler: handlerName, cmd, args: str.slice(str.indexOf(' ')).trim()}
}
