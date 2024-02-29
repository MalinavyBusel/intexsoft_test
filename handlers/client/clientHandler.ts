import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"

import {createAcc} from '../../services/accountService'
import {
    createClient,
    delClient,
    updateClient,
    getClient,
    listClients,
    addAccount
} from '../../services/clientService'

module.exports =  class ClientHandler implements Handler {
    handlerName: String
    mapping: Map<String, methodObj> = new Map([
        ["create", {
            description: "Creates a client and account for him",
            options: {
                clientName: {
                  type: 'string',
                  short: 'n',
                },
                clientType: {
                    type: 'string',
                    short: 't',
                },
                bank: {
                    type: 'string',
                    short: 'b',
                },
                currency: {
                    type: 'string',
                    short: 'c',
                },
                amount: {
                    type: 'string',
                    short: 'a',
                    default: '0',
                },
              },
            call: this.create_client,
        }],
        // ["delete", {
        //     description: "Deletes a bank",
        //     options: {
        //         name: {
        //           type: 'string',
        //           short: 'n',
        //         },
        //       },
        //     call: this.delete_bank,
        // }],
        // ["update", {
        //     description: "Ubdates bank's name or comission",
        //     options: {
        //         name: {
        //           type: 'string',
        //           short: 'n',
        //         },
        //         rename: {
        //             type: 'string',
        //             short: 'r',
        //         },
        //         e: {
        //             type: 'string',
        //             short: 'c',
        //           },
        //         i: {
        //               type: 'string',
        //               short: 'c',
        //         },
        //       },
        //     call: this.update_bank,
        // }],
        // ["read", {
        //     description: "Returns info about bank by its name",
        //     options: {
        //         name: {
        //           type: 'string',
        //           short: 'n',
        //         },
        //       },
        //     call: this.read_bank,
        // }],
        // ["list", {
        //     description: "Returns info about all banks",
        //     options: {},
        //     call: this.list_banks,
        // }],
    ])
    constructor() {
        this.handlerName = 'client'
    } 
    
    async apply(cmd: string, args: string[]) {
        console.log(`getting a ${cmd} command`)
        const method = this.mapping.get(cmd)

        // parse the cli arguments
        const options = method.options
        const values: Object = parseArgs({args, options, allowPositionals: true}).values

        console.log(await method.call(values))
    }

    private async create_client(args: any) {
        //create client
        const c = await createClient({name: args.clientName, type: args.clientType})
        console.log('created client', c)

        //create account
        const a = await createAcc({bank: args.bank, client: args.clientName, currency: args.currency, amount: args.amount})
        console.log('created account', a)

        //push account
        const p = await addAccount({name: args.clientName, uuid: a.uuid})
    }
}

function isset(param: undefined | String): Boolean {
    return param != undefined && param != ''
}
