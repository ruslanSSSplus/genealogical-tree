import {InferActionsTypes} from "../reduxStore";
import {Dispatch} from 'redux';
import {humanType} from "../../Types/Types";

const PUSH_HUMANS = 'TREE/PUSH_HUMANS';
const CHANGE_PERSON = 'TREE/CHANGE_PERSON';
const CHANGE_SEX = 'TREE/CHANGE_SEX';
const CHANGE_STATUS = 'TREE/CHANGE_STATUS';
const SAVE_CHANGES = 'TREE/SAVE_CHANGES';
const IS_CHANGE = 'TREE/IS_CHANGE';
const PUSH_HUMANS_FROM_STORAGE = 'TREE/PUSH_HUMANS_FROM_STORAGE';
const CLEAR_HUMANS = 'TREE/CLEAR_HUMANS';

let initialState = {
    tree: [
        {
            name: 'Ivan',
            age: 79,
            sex: 'man',
            status: 'dead',
            id: 1,
            children: [
                {
                    name: 'Nastya',
                    age: 56,
                    sex: 'woman',
                    status: 'alive',
                    id: 2,
                    children: [
                        {
                            name: 'Vasya',
                            age: 26,
                            sex: 'man',
                            status: 'alive',
                            id: 4,
                            children: [
                                {
                                    name: 'Maria',
                                    age: 6,
                                    sex: 'woman',
                                    status: 'alive',
                                    id: 6,
                                },
                                {
                                    name: 'Nicola',
                                    age: 8,
                                    sex: 'man',
                                    status: 'alive',
                                    id: 11,
                                }
                            ]
                        },
                        {
                            name: 'Alex',
                            age: 22,
                            sex: 'man',
                            status: 'alive',
                            id: 7,
                            children: [
                                {
                                    name: 'Petr',
                                    age: 2,
                                    sex: 'man',
                                    status: 'alive',
                                    id: 8,
                                }
                            ]
                        },
                    ]
                },
                {
                    name: 'Boris',
                    age: 56,
                    sex: 'man',
                    status: 'dead',
                    id: 3,
                    children: [
                        {
                            name: 'Vitalia',
                            age: 26,
                            sex: 'man',
                            status: 'alive',
                            id: 5,
                            children: [{
                                name: 'Max',
                                age: 8,
                                sex: 'man',
                                status: 'alive',
                                id: 13,
                            }]
                        },
                        {
                            name: 'Sergey',
                            age: 37,
                            sex: 'man',
                            status: 'alive',
                            id: 9,
                            children: [
                                {
                                    name: 'Sasha',
                                    age: 22,
                                    sex: 'man',
                                    status: 'alive',
                                    id: 10,
                                    children: [{
                                        name: 'Danya',
                                        age: 2,
                                        sex: 'man',
                                        status: 'alive',
                                        id: 14,
                                    }]
                                },
                                {
                                    name: 'Vova',
                                    age: 18,
                                    sex: 'man',
                                    status: 'alive',
                                    id: 12,
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ] as Array<humanType>, // ???????????????? ????????????, ???? ???? ????????????????
    humans: [] as Array<humanType>, // ???????????? ???????????? ???????????????? ?? ?????????? ?????????????? ?? ???????????????? ???????????? ????
    person: {
        name: 'Ivan',
        age: 79,
        sex: 'man',
        status: 'dead',
        id: 1
    } as humanType // ??????????????, ?????????????? ???????????????????????? ???????????? (???? ?????????????? ?????????? ???????????? ??????????????)
}


export type initialStateType = typeof initialState

type ActionsType = InferActionsTypes<typeof actions>

const treeReducer = (state = initialState, action: ActionsType): initialStateType => {
    switch (action.type) {

        case PUSH_HUMANS:
            return {...state, humans: [...state.humans, action.human]}
        case CHANGE_PERSON:
            let newOne = state.humans.find(e => e.id === action.id);
            if (!newOne) {
                newOne = state.tree[0]
            }
            return {...state, person: newOne}
        case CHANGE_SEX:
            let rebornPerson = state.person
            rebornPerson.sex = action.sex
            return {...state, person: rebornPerson}
        case CHANGE_STATUS:
            let refreshPerson = state.person
            refreshPerson.status = action.status
            return {...state, person: refreshPerson}
        case SAVE_CHANGES:
            return {
                ...state, humans: state.humans.filter((item: humanType) => {
                    if (item.isChange === true) {
                        item.isChange = false
                        return item
                    }
                    return item
                })
            }
        case IS_CHANGE:
            return {
                ...state, humans: state.humans.filter((item: humanType) => {
                    if (item.id === action.id) {
                        item.isChange = true
                        return item
                    }
                    return item
                })
            }
        case PUSH_HUMANS_FROM_STORAGE:
            return {...state, humans: action.humans}
        case CLEAR_HUMANS:
            return {...state, humans: []}
        default:
            return state;
    }
}
// ?? ???????? ?????????????? ???? ?????????????????????? ???? ?????????? ?????????????? ??????????, ?????????????? ?????????????????? ?????????????? ?? ????
export const recursion = (human: humanType, lvl: number) => {
    return (dispatch: Dispatch) => {
        let humanCopy = {...human}
        humanCopy.lvl = lvl // ?????? ?? ??????????????, ???????? ???????????????? ?????????? ???? ?????????? ?????????????? ?? ????????, ?????? ???????????? ??????, ?????? ???????????? ???? ?? ????????????
        humanCopy.isChange = false // ?????? ?????????????? ???????? ???????????????? ???????????? ???????????????????????? ????????????????, ???? ???? ??????????????????
        dispatch(actions.pushNewHuman(humanCopy))
        if (!!humanCopy.children) {
            for (let i = 0; i < humanCopy.children.length; i++) {
                // @ts-ignore
                dispatch(recursion(humanCopy.children[i], lvl + 1))
            }
        }
    }
}
export const changePerson = (id: number) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.changePerson(id))
    }
}
export const changeSex = (sex: string, id: number) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.changeSex(sex))
        dispatch(actions.isChange(id))
    }
}
export const changeStatus = (status: string, id: number) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.isChange(id))
        dispatch(actions.changeStatus(status))
    }
}

export const saveChanges = (id: number) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.saveChanges(id))
    }
}
export const isChange = (id: number) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.isChange(id))
    }
}

export const pushHumansFromStorrage = () => {
    return (dispatch: Dispatch) => {
        dispatch(actions.pushHumansFromStorrage(JSON.parse(localStorage.getItem("savedHumans") || "")))
    }
}
export const clearHumans = () => {
    return (dispatch: Dispatch) => {
        localStorage.clear()
        dispatch(actions.clearHumans())
    }
}

export const actions = {
    pushNewHuman: (human: humanType) => ({
        type: PUSH_HUMANS, human,
    } as const),
    changePerson: (id: number) => ({
        type: CHANGE_PERSON, id,
    } as const),
    changeSex: (sex: string) => ({
        type: CHANGE_SEX, sex,
    } as const),
    changeStatus: (status: string) => ({
        type: CHANGE_STATUS, status,
    } as const),
    saveChanges: (id: number) => ({
        type: SAVE_CHANGES, id,
    } as const),
    isChange: (id: number) => ({
        type: IS_CHANGE, id,
    } as const),
    pushHumansFromStorrage: (humans: Array<humanType>) => ({
        type: PUSH_HUMANS_FROM_STORAGE, humans,
    } as const),
    clearHumans: () => ({
        type: CLEAR_HUMANS,
    } as const),
}


export default treeReducer;