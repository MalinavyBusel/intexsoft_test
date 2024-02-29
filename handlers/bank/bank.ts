import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"

import {create, del, update, get} from '../../services/bankService'

module.exports =  class BankHandler implements Handler {
    handlerName: String
    mapping: Map<String, methodObj> = new Map([
        ["create", {
            description: "Creates a bank",
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
                comission: {
                  type: 'string',
                  short: 'c',
                  default: '0'
                },
              },
            call: this.create,
        }],
        ["delete", {
            description: "Deletes a bank",
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.delete,
        }],
        ["update", {
            description: "Ubdates bank's name or comission",
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
                rename: {
                    type: 'string',
                    short: 'r',
                },
                comission: {
                    type: 'string',
                    short: 'c',
                    default: '0'
                  },
              },
            call: this.update,
        }],
        ["read", {
            description: "Returns info about bank by its name",
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.read,
        }],
    ])
    constructor() {
        this.handlerName = 'bank'
    } 
    
    async apply(cmd: string, args: string[]) {
        console.log(`getting a ${cmd} command`)
        const method = this.mapping.get(cmd)

        // parse the cli arguments
        const options = method.options
        const values: Object = parseArgs({args, options}).values

        console.log(await method.call(values))
    }

    private create(args: any) {
        console.log('Hii, i"m there with values', args)
        create(args)
    }

    private async read(args: any) {
        return await get(args)
    }

    private update(args: any) {
        update(args)
    }

    private delete(args: any) {
        del(args)
    }
}
