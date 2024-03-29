import { parseArgs } from "util"
import { Handler, methodObj } from "../handler"
const mongoose = require('mongoose')
import { parse as uuidParse } from 'uuid'
import {UUID} from 'mongodb'

import {createAcc, delAccsOfClient, getAcc, getTransactions, makeBankTransaction} from '../../services/accountService'
import {
    createClient,
    getClient,
    listClients,
    addAccount
} from '../../services/clientService'
import {get, get as getBank} from '../../services/bankService'

module.exports =  class ClientHandler implements Handler {
    handlerName: string
    mapping: Map<string, methodObj> = new Map([
        ["create", {
            description: `Creates a client and account for him
-n -- client name
-t -- client type (entity or individual)
-b -- bank name
-c -- currency
-a -- amount of money from start on the bind account`,
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
                    default: 'dollar'
                },
                amount: {
                    type: 'string',
                    short: 'a',
                    default: '0',
                },
              },
            call: this.create_client,
        }],
        ["deleteAccs", {
            description: `Deletes all client accounts from a bank
-n -- client name
-b -- bank name`,
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
            description: `Registers new account for a client
-n -- client name
-b -- bank name
-c -- currency
-a -- amount of money from start on the bind account`,
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
                        default: 'dollar'
                    },
                    amount: {
                        type: 'string',
                        short: 'a',
                        default: '0',
                    },
                  
              },
            call: this.add_account,
        }],
        ["read", {
            description: `Returns info about client by its name
-n -- client name`,
            options: {
                clientName: {
                  type: 'string',
                  short: 'n',
                },
              },
            call: this.get_client,
        }],
        ["list", {
            description: `Returns the list of all clients
No options provided`,
            options: {},
            call: this.list,
        }],
        ["pay", {
            description: `Runs a transaction from client's account to another
-f -- account-sender uuid
-t -- account-reciever uuid
-n -- name of client who owns account-sender
-a -- how mush money to send before processing comission`,
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
            description: `Returns all the transactions made by client
-s -- left border datetime (optional)
-e -- right border daterime, if not set - current date is default
-n -- name of the client, whose transactions will be returned`,
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
    iterate() {
        for (const handleFunc of this.mapping) {
            console.log('->', handleFunc[0])
            console.log(handleFunc[1].description)
            console.log('-------------------')
        }
    }
    
    async apply(cmd: string, args: string[]) {
        const method = this.mapping.get(cmd)
        if (method == undefined) {
            console.log("No such method for clients")
            return
        }

        // parse the cli arguments
        const options = method.options
        const values: Object = parseArgs({args, options, allowPositionals: true}).values

        console.log(await method.call(values))
    }

    private async create_client(args: any) {
        const exists = await getClient({name: args.clientName})
        if (exists != null) {
            return 'Client with such name already exists'
        }
        if (args.clientType != 'entity' && args.clientType != 'individual') {
            return "Provide valid account type"
        }
        const bank = await get({name: args.bank})
        if (bank == null) {
            return "No bank with such name"
        }
        //create client
        const c = await createClient({name: args.clientName, type: args.clientType})

        //create account
        const a = await createAcc({bank: args.bank, client: args.clientName, currency: Number(args.currency), amount: args.amount})

        //push account
        const p = await addAccount({name: args.clientName, uuid: a.uuid})
        
        return getClient({name: args.clientName})
    }
    private async delete_client(args: any) {
        const a = delAccsOfClient({bank: args.bank, client: args.clientName})
        return a
    }
    private async add_account(args: any) {
        const exists = await getClient({name: args.clientName})
        if (exists == null) {
            return 'No such client'
        }
        const bank = await get({name: args.bank})
        if (bank == null) {
            return "No bank with such name"
        }
        const a = await createAcc({bank: args.bank, client: args.clientName, currency: args.currency, amount: Number(args.amount)})
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
        const t = await getAcc({uuid: args.to})
        if (t == null) {
            return "Sender is invalid - provide another uuid"
        }
        const f = await getAcc({uuid: args.from})
        if (f == null) {
            return "Reciever is invalid - provide another uuid"
        }
        const exists = await getClient({name: args.clientName})
        if (exists == null) {
            return 'No such client'
        }
        //check if from-acc is client's
        const from = await getAcc({uuid: UUID.createFromHexString(args.from)})
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
        const transac = await makeBankTransaction({client: client.name, amountFrom: afterComission, amountTo: beforeComission, from, to})
        return transac
    }
    private async getTransactions(args: any) {
        const exists = await getClient({name: args.clientName})
        if (exists == null) {
            return 'No such client'
        }
        return await getTransactions({start: args.start, end: args.end, name: args.clientName})
    }
}
