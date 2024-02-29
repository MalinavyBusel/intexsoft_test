import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"

import {createAcc, delAccsOfClient} from '../../services/accountService'
import {
    createClient,
    delClient,
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
        ["delete", {
            description: "Deletes a client from a bank",
            options: {
                clientName: {
                  type: 'string',
                  short: 'n',
                },
                bank: {
                    type: 'string',
                    short: 'b'
                }
              },
            call: this.delete_client,
        }],
        ["addAccount", {
            description: "Registers new account for a client",
            options: {
                options: {
                    clientName: {
                      type: 'string',
                      short: 'n',
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
              },
            call: this.add_account,
        }],
        ["read", {
            description: "Returns info about client by its name",
            options: {
                clientName: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.get_client,
        }],
        ["list", {
            description: "Returns the list of all clients",
            options: {},
            call: this.list,
        }],
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

        //create account
        const a = await createAcc({bank: args.bank, client: args.clientName, currency: args.currency, amount: args.amount})

        //push account
        const p = await addAccount({name: args.clientName, uuid: a.uuid})
        
        return getClient({name: args.clientName})
    }
    private async delete_client(args: any) {
        const a = delAccsOfClient({bank: args.bank, client: args.clientName})
        const c = delClient({name: args.clientName})
        return c
    }
    private async add_account(args: any) {
        const a = await createAcc({bank: args.bank, client: args.clientName, currency: args.currency, amount: args.amount})
        const p = await addAccount({name: args.clientName, uuid: a.uuid})
        return p
    }
    private async get_client(args: any) {
        return await getClient({name: args.clientName})
    }
    private async list(args: any) {
        return await listClients()
    }
}

function isset(param: undefined | String): Boolean {
    return param != undefined && param != ''
}
