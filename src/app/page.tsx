"use client";

import { useEffect, useState } from "react";
import { auth } from "@/services/firebase/firebaseConfiguration";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import React from 'react';
import Navbar from './componentes/navbar';
import Sidebar from "@/app/componentes/sidebar";
import ListaManutencao from "@/app/componentes/listaManutencao";


interface IMetas {
    [key: string]: {
        tipo: string;
        data_conclusao: string;
        data_inicio: string;
        descricao: string;
        status: string;
        titulo: string;
        id_usuario: string;
    };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [metas, setMetas] = useState<IMetas>({});
    const {userAuth} = useAuthContext();
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado: ", user.uid);
            } else {
                console.log("Usuário deslogado");
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="grid grid-rows-[auto_1fr] h-full w-full">
            <nav className="bg-[#D9A05B] z-10">
                <Navbar/>
            </nav>
            <div className="flex h-screen">
                <aside className="w-64 bg-white outline outline-1  outline-black shadow-md shadow-black">
                    <Sidebar/>
                </aside>
                <main className=" w-full h-full bg-white outline-black outline outline-0 shadow-sm shadow-black ">
                    <ListaManutencao/>
                </main>
            </div>
        </div>

    );
}
