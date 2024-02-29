const Program = require('./program')
const BankHandler = require('./handlers/bank/bank')


function main() {
    const bh = new BankHandler()
    const p = new Program(bh);
    p.Serve()
    
}

main()