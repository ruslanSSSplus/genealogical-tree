import React, {useEffect, useState} from 'react';
import './App.css';
import {AppStateType, useTypedDispatch, useTypedSelector} from "./redux/reduxStore";
import {
    changePerson,
    changeSex,
    changeStatus, pushHumansFromStorrage,
    recurce,
    saveChanges,
} from "./redux/reducers/drevoReducer";
import {humanType} from "./Types/Types";

function App() {
    const dispatch = useTypedDispatch()
    const {drevo, humans, person} = useTypedSelector((state: AppStateType) => state.drevo)

    const [openSave, setOpenSave] = useState(false)
    const [openSex, setOpenSex] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)

    useEffect(() => {

        if (!localStorage.getItem("savedHumans")){
            dispatch(recurce(drevo[0], 1))
        } else {
            dispatch(pushHumansFromStorrage( JSON.parse(localStorage.getItem("savedHumans") || "")))
        }
        dispatch(changePerson(1))
    }, [])

    let changePersonClick = (id: number) => {
        setOpenSex(false)
        setOpenStatus(false)
        dispatch(changePerson(id))
    }
    let saveChangesHandler = (id: number, humans: Array<humanType>) => {
        dispatch(saveChanges(id))
        localStorage.setItem("savedHumans", JSON.stringify(humans))
    }

    let changeSexHandler = (sex: string, id: number) => {
        setOpenSave(true)
        dispatch(changeSex(sex, id))
    }
    let changeStatusHandler = (status: string, id: number) => {
        setOpenSave(true)
        dispatch(changeStatus(status, id))
    }

    return (
        <div className="App">
            {!!humans ? <div className="Drevo">
                {humans.map((item) => <div className={item.isChange ? `textChanged${item.lvl}` : `text${item.lvl}`}
                                           onClick={() => changePersonClick(item.id)}
                                           key={item.id}>
                        {item.name}
                    </div>
                )}
            </div> : null}
            {!!person ? <div className="Svoistva">
                {openSave ?
                    <button onClick={() => saveChangesHandler(person.id, humans)}> Save Changes</button>
                    : null
                }

                <div>{person.name}</div>
                <div>{person.age}</div>
                <div onClick={() => setOpenStatus(true)}>{person.status}</div>
                {openStatus ?
                    <div className="dropdown-status">
                        <button onClick={() => changeStatusHandler('dead', person.id)}>dead</button>
                        <button onClick={() => changeStatusHandler('alive', person.id)}>alive</button>
                    </div> : null
                }

                <div onClick={() => setOpenSex(true)}> {person.sex}</div>
                {openSex ?
                    <div className="dropdown-sex">
                        <button onClick={() => changeSexHandler('man', person.id)}>man</button>
                        <button onClick={() => changeSexHandler('woman', person.id)}>woman</button>
                    </div> : null
                }

            </div> : null
            }
        </div>
    );
}

export default App;
