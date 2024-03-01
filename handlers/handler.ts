export interface Handler {
    handlerName: String,
    apply(cmd: String, args: string[])
    iterate()
}

export type methodObj = {
    description: String,
    options: any,
    call: Function
}
