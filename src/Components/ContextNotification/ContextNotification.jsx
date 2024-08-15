import React, { createContext, useEffect, useState } from 'react'



const ContextNotification = createContext()

const ProviderNotification = ({ children }) => {
    const [notif, setNotif] = useState([])

    const addNotif = (newData) => {
        console.log(newData)
        setNotif(prev => [...prev, newData])
    };

    useEffect(() => {
        console.log('perubahan')
        console.log(notif)
    }, [notif])

    return (
        <ContextNotification.Provider value={{ notif, addNotif }}>
            { children }
        </ContextNotification.Provider>
    )
}

export { ContextNotification, ProviderNotification }