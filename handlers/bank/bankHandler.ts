import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"

import {create, del, update, get, list} from '../../services/bankService'

module.exports =  class BankHandler implements Handler {
    handlerName: String
    mapping: Map<String, methodObj> = new Map([
        ["create", {
            description: `Creates a bank
-n -- name
-e -- comission for entity clients
-i -- comission for individual clients`,
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
                e: {
                  type: 'string',
                  short: 'c',
                  default: '0'
                },
                i: {
                    type: 'string',
                    short: 'c',
                    default: '0'
                },
              },
            call: this.create_bank,
        }],
        ["delete", {
            description: `Deletes a bank
-n -- bank name`,
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.delete_bank,
        }],
        [`update`, {
            description: `Ubdates bank's name or comission
-n -- bank's current name
-r -- bank's new name (optional)
-i -- new indivinual comission (optional)
-e -- new entity comission (optional)
At least one of optional fields must be provided`,
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
                rename: {
                    type: 'string',
                    short: 'r',
                },
                e: {
                    type: 'string',
                    short: 'c',
                  },
                i: {
                      type: 'string',
                      short: 'c',
                },
              },
            call: this.update_bank,
        }],
        ["read", {
            description: `Returns info about bank by its name
-n -- bank's name`,
            options: {
                name: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.read_bank,
        }],
        ["list", {
            description: `Returns info about all banks
no options required`,
            options: {},
            call: this.list_banks,
        }],
    ])
    constructor() {
        this.handlerName = 'bank'
    } 
    iterate() {
        for (const handleFunc of this.mapping) {
            console.log('->', handleFunc[0])
            console.log(handleFunc[1].description)
            console.log('-------------------')
        }
    }
    
    async apply(cmd: string, args: string[]) {
        console.log(`getting a ${cmd} command`)
        const method = this.mapping.get(cmd)

        // parse the cli arguments
        const options = method.options
        const values: Object = parseArgs({args, options, allowPositionals: true}).values

        console.log(await method.call(values))
    }

    private async create_bank(args: any) {
        console.log('Hii, i"m there with values', args)
        if (!isset(args.name)) {
            return "Please, provide a valid name of a bank with '-n <name>'"
        }
        args.i = Number(args.i)
        if (Number.isNaN(args.i) || args.i < 0) {
            return "Please, provide a positive number in individual comission"
        }
        args.e = Number(args.e)
        if (Number.isNaN(args.e) || args.e < 0) {
            return "Please, provide a positive number in entity comission"
        }
        return await create(args)
    }

    private async read_bank(args: any) {
        if (!isset(args.rename)) {
            return "Please, provide a valid name of a bank with '-n <name>'"
        }
        return await get(args)
    }

    private async update_bank(args: any) {
        if (!isset(args.name)) {
            return "Please, provide a valid name of a bank with '-n <name>'"
        }
        if (!isset(args.rename) && !isset(args.e) && !isset(args.i)) {
            return "Please, provide at least one field to update"
        }
        args.i = Number(args.i)
        args.e = Number(args.e)
        return await update(args)
    }

    private async delete_bank(args: any) {
        if (!isset(args.rename)) {
            return "Please, provide a valid name of a bank with '-n <name>'"
        }
    
        return await del(args)
    }

    private async list_banks(args:any) {
        return await list()
    }
}

function isset(param: undefined | String): Boolean {
    return param != undefined && param != ''
}
