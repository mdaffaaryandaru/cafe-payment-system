import React, { useEffect, useState } from 'react'
import { get } from '../../utils/api'

const PaymentPage = () => {
    const [cart, setCart] = useState([])
    const [dataMenu, setDataMenu] = useState([])
    
    
    const fetchMenu = async() => {
        try {
            const res = await get('/menu')
            setDataMenu(res)
        } catch (e) {
            console.log(e);
        }
    }
    
    useEffect(() => {
        fetchMenu()
    }, [])

    useEffect(() => {
        if (dataMenu.length != 0) {            
            const storedData = localStorage.getItem('order');

            if (storedData) {
              try {
                const orderJson = JSON.parse(storedData)
                setCart(orderJson.orderan)
              } catch (e) {
                console.error('Error parsing JSON from localStorage:', e);
              }
            }
        }
    }, [dataMenu])
    

    return (
        <section className='container'>
            <h1 className='text-4xl font-bold my-5'>Pembayaran</h1>
            {cart.map((item, i) => {
                const menu = dataMenu.find((menu) => menu.id === item.id_menu)
                console.log(menu.namaMenu)
                return (
                    <div key={i} className="">
                        
                    </div>
                )
            })}
        </section>
    )
}

export default PaymentPage