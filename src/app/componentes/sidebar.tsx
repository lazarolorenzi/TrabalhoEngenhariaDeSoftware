"use client"; // Certifique-se de que esta diretiva esteja presente

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/firebaseConfiguration';
import {router} from "next/client";

const Sidebar: React.FC = () => {
    const [displayName, setDisplayName] = useState<string | null>(null);
    const handleLogout = () => {
        auth.signOut().then(() => {
            router.push("/login");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setDisplayName(user.displayName);
            } else {
                console.log("Usuário não autenticado");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <aside className="w-64 bg-[#D9A05B] flex flex-col items-center pt-8 z-0 outline-lg outline-black shadow-sm shadow-black">
            <div className="text-center mb-4">
                {displayName ? (
                    <h2 className="text-xl text-black font-bold">{displayName}</h2>
                ) : (
                    <h2 className="text-xl text-white font-bold">Carregando...</h2>
                )}
            </div>

            <button className="text-center bg-white text-lg font-bold py-2 px-28 rounded flex items-center space-x-2 mt-4 underline text-red-500 hover:text-gray-700"
            onClick={handleLogout}>
                Sair
            </button>
        </aside>
    );
};

export default Sidebar;