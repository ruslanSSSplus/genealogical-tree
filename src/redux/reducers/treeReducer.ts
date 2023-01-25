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
                            age: 16,
                            sex: 'man',
                            status: 'alive',
                            id: 5,
                        },
                        {
                            name: 'Sergey',
                            age: 30,
                            sex: 'man',
                            status: 'alive',
                            id: 9,
                            children: [
                                {
                                    name: 'Sasha',
                                    age: 10,
                                    sex: 'man',
                                    status: 'alive',
                                    id: 10,
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ] as Array<humanType>, // исходный массив, он не меняется
    humans: [] as Array<humanType>, // данный массив попадает в локал сторедж и меняется именно он
    person: {
        name: 'Ivan',
        age: 79,
        sex: 'man',
        status: 'dead',
        id: 1
    } as humanType // человек, который показывается справа (по дефолту самый первый человек)
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
        default:
            return state;
    }
}
// в этой функции мы пробегаемся по всему массиву древо, включая вложенные обьекты и тд
export const recursion = (human: humanType, lvl: number) => {
    return (dispatch: Dispatch) => {
        human.lvl = lvl // это я добавил, чтоб понимать какой по счету человек в роду, чем больше лвл, тем правее он в дереве
        human.isChange = false // это добавил чтоб понимать какого пользователя изменили, но не сохранили
        dispatch(actions.pushNewHuman(human))
        if (!!human.children) {
            for (let i = 0; i < human.children.length; i++) {
                // @ts-ignore
                dispatch(recursion(human.children[i], lvl + 1))
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

export const pushHumansFromStorrage = (humans: Array<humanType>) => {
    return (dispatch: Dispatch) => {
        dispatch(actions.pushHumansFromStorrage(humans))
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
}


export default treeReducer;