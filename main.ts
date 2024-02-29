const Program = require('./program')
const BankHandler = require('./handlers/bank/bankHandler')
const ClientHandler = require('./handlers/client/clientHandler')


function main() {
    const bh = new BankHandler()
    const ch = new ClientHandler()
    const p = new Program(bh, ch);
    p.Serve()
    
}

main()