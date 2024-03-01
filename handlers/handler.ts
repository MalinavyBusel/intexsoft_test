export interface Handler {
    handlerName: string,
    apply(cmd: string, args: string[])
    iterate()
}

export type methodObj = {
    description: string,
    options: any,
    call: Function
}
