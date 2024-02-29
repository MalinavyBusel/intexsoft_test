export interface Handler {
    handlerName: String,
    apply(cmd: String, args: string[])
}

export type methodObj = {
    description: String,
    options: any,
    call: Function
}
