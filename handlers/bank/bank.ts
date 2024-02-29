import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"

module.exports =  class BankHandler implements Handler {
    handlerName: String
    mapping: Map<String, methodObj> = new Map([
        ["create", {
            description: "Creates a bank",
            options: {
                foo: {
                  type: 'boolean',
                  short: 'f',
                },
                bar: {
                  type: 'string',
                },
              },
            call: this.create,
        }],
    ])
    constructor() {
        this.handlerName = 'bank'
    } 
    
    apply(cmd: string, args: string[]) {
        console.log(`getting a ${cmd} command`)
        const method = this.mapping.get(cmd)
        const options = method.options
        const values: Object = parseArgs({args, options}).values

        method.call(values)
    }

    private create(args: any) {
        console.log('Hii, i"m there with values', args)
    }
}
