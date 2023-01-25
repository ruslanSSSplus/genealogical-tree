import React from 'react';
import './App.css';
import {humanType} from "../../Types/Types";


interface AppProps {
    humans: Array<humanType>
    openStatus: boolean
    openSex: boolean
    openSave: boolean
    setOpenSex: (a: boolean) => void
    setOpenStatus: (a: boolean) => void
    person: humanType
    changePersonClick: (id: number) => void
    saveChangesHandler: (id: number, humans: Array<humanType>) => void
    changeStatusHandler: (status: string, id: number) => void
    changeSexHandler: (status: string, id: number) => void
}


const App: React.FC<AppProps> = ({
                                     humans, changePersonClick, person, saveChangesHandler,
                                     openSave, setOpenStatus, changeStatusHandler,
                                     setOpenSex, openSex, changeSexHandler, openStatus
                                 }) => {


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
                    <button onClick={() => saveChangesHandler(person.id, humans)} className='buttons'> Save
                        Changes</button>
                    : null
                }

                <div>Name - {person.name}</div>
                <div>Age - {person.age}</div>
                <div onClick={() => setOpenStatus(!openStatus)} className="StatusSex">Status - {person.status}</div>
                {openStatus ?
                    <div className="dropdown-status">
                        <button onClick={() => changeStatusHandler('dead', person.id)} className='buttons'>dead</button>
                        <button onClick={() => changeStatusHandler('alive', person.id)} className='buttons'>alive
                        </button>
                    </div> : null
                }

                <div onClick={() => setOpenSex(!openSex)} className="StatusSex">Sex - {person.sex}</div>
                {openSex ?
                    <div className="dropdown-sex">
                        <button onClick={() => changeSexHandler('man', person.id)} className='buttons'>man</button>
                        <button onClick={() => changeSexHandler('woman', person.id)} className='buttons'>woman</button>
                    </div> : null
                }

            </div> : null
            }
        </div>
    );
}

export default App;
