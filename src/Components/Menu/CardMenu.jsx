import React, { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'

const CardMenu = ({ itemCategory, handleSelectMenu, handleSelectToping, dataTopings }) => {
    const [selectedToppings, setSelectedToppings] = useState([]);
    

    useEffect(() => {
        setSelectedToppings(dataTopings);
    }, [dataTopings]);


    return (
        <div key={itemCategory.kategori} className="w-full mb-5 text-black">
            <h1 className="text-2xl font-bold mb-3 text-black">{itemCategory.kategori}</h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xl:gap-5">
                {itemCategory.menu.map((menu) => (
                    <div key={menu.id} className="flex flex-col gap-2 bg-slate-100 p-3 rounded border border-slate-200">
                        <div className="w-full flex gap-2">
                            <img className="aspect-square object-cover w-20 h-20 rounded" src={`${process.env.REACT_APP_BASE_URL_API}/menu/images/${menu.gambarMenu}`} alt={menu.namaMenu}/>
                            <div className="w-full flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h4 className="text-xl font-bold text-black">{menu.namaMenu}</h4>
                                    <span className="text-gray-500">{menu.kategoriMenu}</span>
                                    <p className="text-base text-black">
                                        {Number(menu.hargaMenu).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        })}
                                    </p>
                                </div>
                                <button className="bg-slate-600 text-white p-1 rounded" onClick={() => handleSelectMenu(menu.id)} >
                                    <CirclePlus />
                                </button>
                            </div>
                        </div>
                        {/* Toping */}
                        <div className="w-full flex flex-col gap-2">
                            {menu.topings.map((toping, i) => {
                                return (
                                    <div key={i} className="flex justify-between items-center">
                                        <label className="flex items-center gap-2">
                                            {/* Checkbox input */}
                                            <input
                                                type="checkbox"
                                                checked={selectedToppings.menuId === menu.id && selectedToppings.topings.includes(toping.namaToping)}
                                                onChange={() => handleSelectToping(menu.id, toping.namaToping)}
                                            />
                                            {/* Topping name */}
                                            <span>{toping.namaToping}</span>
                                        </label>
                                        {/* Topping price */}
                                        <span>
                                            {Number(toping.hargaToping).toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            })}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CardMenu