export type humanType = {
    name: string
    age: number
    sex: string
    status: string
    id: number
    children?: Array<humanType>
    lvl?: number
    isChange?: boolean
}
