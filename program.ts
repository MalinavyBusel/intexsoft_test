const readline = require('node:readline')
const {parseArgs} = require('node:util')
     

module.exports = class Program {

    constructor() {}
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
            console.log('-- ', processPrompt(prompt))
        }
    }
}

function processPrompt(str: String): {handler: String; cmd: String; args: String;} {
    const handlerName = str.slice(0, str.indexOf(' ')) || 'default';
    str = str.slice(str.indexOf(' '))
    const cmd = str.slice(0, str.indexOf(' ')) || 'default';
    return {handler: handlerName, cmd, args: str.slice(str.indexOf(' ')).trim()}
}
