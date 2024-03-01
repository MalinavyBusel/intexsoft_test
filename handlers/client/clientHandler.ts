import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"
const mongoose = require('mongoose')
import { parse as uuidParse } from 'uuid'
import {UUID} from 'mongodb'

import {createAcc, delAccsOfClient, getAcc, getTransactions, makeBankTransaction} from '../../services/accountService'
import {
    createClient,
    delClient,
    getClient,
    listClients,
    addAccount
} from '../../services/clientService'
import {get as getBank} from '../../services/bankService'

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
        ["pay", {
            description: "Runs a transaction from client's account to another",
            options: {
                from: {
                    type: 'string',
                    short: 'f'
                },
                to: {
                    type: 'string',
                    short: 't'
                },
                clientName: {
                    type: 'string',
                    short: 'n'
                },
                amount: {
                    type: 'string',
                    short: 'a'
                }
            },
            call: this.pay,
        }],
        ["transactions", {
            description: "Returns all the transactions made by client",
            options: {
                start: {
                    type: 'string',
                    short: 's'
                }, 
                end: {
                    type: 'string', 
                    short: 'e'
                },
                clientName: {
                    type: 'string',
                    short: 'n'
                }
            },
            call: this.getTransactions,
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
    private async pay(args: any) {
        args.amount = Number(args.amount) 
        if (isNaN(args.amount) || args.amount < 0) {
            return 'Please, enter valid amount of money'
        }

        //check if from-acc is client's
        const from = await getAcc({uuid: UUID.createFromHexString(args.from)})
        console.log(from)
        const client = await getClient({name: args.clientName})
        if (client.name != from.client) {
            return 'Client can only send money from his own account'
        }
        //check if there enough money with comission
        const beforeComission = args.amount
        const to = await getAcc({uuid: UUID.createFromHexString(args.to)})
        if (to.bank != from.bank) {
            const client_bank = await getBank({name: from.bank})
            if (client.type == 'individual') {
                args.amount += client_bank.individual_comission // if needed, may be replaced with += comission/100
            } else if (client.type == 'entity') {
                args.amount += client_bank.entity_comission
            }
        }
        const afterComission = args.amount
        if (from.amount < args.amount) {
            return "Unable to perform operation, not enough money"
        }
        //start transaction with recounting accounts
        console.log('comissions', beforeComission, afterComission)
        const t = await makeBankTransaction({client: client.name, amountFrom: afterComission, amountTo: beforeComission, from, to})
        return t

        //return await createPayment()
    }
    private async getTransactions(args: any) {
        console.log(args)
        return await getTransactions({start: args.start, end: args.end, name: args.clientName})
    }
}

function isset(param: undefined | String): Boolean {
    return param != undefined && param != ''
}
