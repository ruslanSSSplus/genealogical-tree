import React, {useEffect, useState} from 'react';
import {AppStateType, useTypedDispatch, useTypedSelector} from "../redux/reduxStore";
import {
    changePerson,
    changeSex,
    changeStatus,
    pushHumansFromStorrage,
    recursion,
    saveChanges,
} from "../redux/reducers/treeReducer";
import {humanType} from "../Types/Types";
import App from "./App/App";

function AppContainer() {
    const dispatch = useTypedDispatch()
    const {tree, humans, person} = useTypedSelector((state: AppStateType) => state.tree)

    const [openSave, setOpenSave] = useState(false) // показываю или скрываю кнопку SAVE
    const [openSex, setOpenSex] = useState(false) // показываю или скрываю кнопки Пола
    const [openStatus, setOpenStatus] = useState(false) // показываю или скрываю кнопки Статуса

    useEffect(() => {
        //  localStorage.clear()
        if (!localStorage.getItem("savedHumans"))  // проверяю сторедж на наличие массива
        {
            dispatch(recursion(tree[0], 1)) // если пустой, заполняю его
        } else {
            dispatch(pushHumansFromStorrage(JSON.parse(localStorage.getItem("savedHumans") || ""))) // если полный, то беру его из стореджа
        }
        dispatch(changePerson(1)) // выставляю пользователя которого можно менять (правая часть экрана)
    }, [])


    // функция для события сменя пользователя (юзер кликнул на кого-то)
    let changePersonClick = (id: number) => {
        setOpenSex(false)
        setOpenStatus(false)
        dispatch(changePerson(id))
    }
    // функция для сохранения изменений в локал сторедж
    let saveChangesHandler = (id: number, humans: Array<humanType>) => {
        dispatch(saveChanges(id))
        setOpenSex(false)
        setOpenStatus(false)
        setOpenSave(false)
        localStorage.setItem("savedHumans", JSON.stringify(humans))
    }
    // меняем в массиве пользователей пол определенного пользователя
    let changeSexHandler = (sex: string, id: number) => {
        setOpenSave(true)
        dispatch(changeSex(sex, id))
    }
    // меняем в массиве пользователей статус определенного пользователя
    let changeStatusHandler = (status: string, id: number) => {
        setOpenSave(true)
        dispatch(changeStatus(status, id))
    }

    return <App humans={humans} changePersonClick={changePersonClick} person={person}
                saveChangesHandler={saveChangesHandler}
                openSave={openSave} setOpenStatus={setOpenStatus} changeStatusHandler={changeStatusHandler}
                setOpenSex={setOpenSex} openSex={openSex} changeSexHandler={changeSexHandler} openStatus={openStatus}/>

}

export default AppContainer;
