"use client";

import { ref, push } from "firebase/database";
import { auth, db } from "@/services/firebase/firebaseConfiguration";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from '../componentes/navbar';
import Sidebar from "../componentes/sidebar";
import { getAuth } from 'firebase/auth';

interface IManutencao {
    nome_usuario: string;
    criticidade: string;
    data_solicitacao: string;
    descricao: string;
    quarto: string;
    assunto: string;
}

export default function Home() {
    const { userAuth } = useAuthContext();
    const [authUser, setAuthUser] = useState(null);
    const [newManutencao, setNewManutencao] = useState<IManutencao>({
        nome_usuario: "",
        criticidade: "",
        data_solicitacao: new Date().toISOString().split('T')[0],
        descricao: "",
        quarto: "",
        assunto: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(userAuth)
                setNewManutencao((prevManutencao) => ({
                    ...prevManutencao,
                    nome_usuario: user.uid,
                }));
            } else {
                setAuthUser(null);
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth]);


    const handleSalvar = async () => {
        console.log('Botão Salvar clicado')
        const listaErro: string[] = [];
        const today = new Date().toISOString().split("T")[0];

        if (newManutencao.data_solicitacao < today) {
            listaErro.push("A data de solicitação não pode ser anterior ao dia atual.");
        }

        if (newManutencao.assunto.length < 5 || newManutencao.assunto.length > 100) {
            listaErro.push("O título deve ter entre 5 e 100 caracteres.");
        }
        if (newManutencao.descricao.length < 10 || newManutencao.descricao.length > 500) {
            listaErro.push("A descrição deve ter entre 10 e 500 caracteres.");
        }

        setErrors(listaErro);
        console.log(listaErro)
        if (listaErro.length > 0) {
            return; // Impede o envio se houver erros de validação
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                await push(ref(db, "/manutencao"), {
                    ...newManutencao,
                    nome_usuario: user.displayName,
                });
                alert("Solicitação de manutenção enviada com sucesso!");


                setNewManutencao({
                    nome_usuario: "",
                    criticidade: "",
                    data_solicitacao: "",
                    descricao: "",
                    quarto: "",
                    assunto: "",
                });
                router.push("/");
            }
        } catch (error) {
            // Tratar erros de envio
            console.error('Erro ao salvar:', error);
            alert("Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde."); // Exemplo de alerta
        }
    };

    return (
        <div className="grid  grid-rows-[auto_1fr] h-full w-full">
            <nav className="bg-[#D9A05B] z-10">
                <Navbar/>
            </nav>
            <div className="flex flex-auto h-full ">
                <aside
                    className="hidden md:block h-screen w-64 bg-white outline outline-1  outline-black shadow-md shadow-black">
                    <Sidebar/>
                </aside>
                <main className="w-full h-full bg-white outline-black outline outline-0 shadow-sm text-black shadow-black ">
                    <nav className="bg-[#D9A05B] p-4 h-[92px] shadow-md">
                        <div className="container mx-auto flex my-4 items-center">
                            <h1 className="text-xl font-bold text-white">Criando Manutenção</h1>
                        </div>
                    </nav>

                    {/* Conteúdo principal (Formulário) */}
                    <div className="container mx-auto p-4 md:p-10">
                        <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campo Data */}
                            <div>
                                <label htmlFor="data"
                                       className="block text-gray-700 text-sm font-bold mb-2">Data:</label>
                                <input type="date" id="data" value={newManutencao.data_solicitacao}
                                       onChange={(e) => setNewManutencao({
                                           ...newManutencao,
                                           data_solicitacao: e.target.value
                                       })} className="w-full border rounded-3xl p-2"/>
                            </div>

                            {/* Campo Criticidade */}
                            <div>
                                <label htmlFor="criticidade"
                                       className="block text-gray-700 text-sm font-bold mb-2">Criticidade:</label>
                                <select id="criticidade" value={newManutencao.criticidade}
                                        onChange={(e) => setNewManutencao({
                                            ...newManutencao,
                                            criticidade: e.target.value
                                        })} className="w-full border rounded-3xl p-2">
                                    <option value="Urgente">Urgente</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Média">Média</option>
                                    <option value="Baixa">Baixa</option>
                                </select>
                            </div>

                            {/* Campo Quarto */}
                            <div>
                                <label htmlFor="quarto"
                                       className="block text-gray-700 text-sm font-bold mb-2">Quarto:</label>
                                <input type="text" id="quarto" placeholder="Número do quarto"
                                       value={newManutencao.quarto}
                                       onChange={(e) => setNewManutencao({...newManutencao, quarto: e.target.value})}
                                       className="w-full border rounded-3xl p-2"/>
                            </div>

                            {/* Campo Assunto (col-span-2 para ocupar 2 colunas) */}
                            <div className="md:col-span-2">
                                <label htmlFor="assunto"
                                       className="block text-gray-700 text-sm font-bold mb-2">Assunto:</label>
                                <input type="text" id="assunto" placeholder="Pia quebrada" value={newManutencao.assunto}
                                       onChange={(e) => setNewManutencao({...newManutencao, assunto: e.target.value})}
                                       className="w-full border rounded-3xl p-2"/>
                            </div>

                            {/* Campo Descrição (col-span-2 para ocupar 2 colunas) */}
                            <div className="md:col-span-2">
                                <label htmlFor="descricao"
                                       className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
                                <textarea id="descricao" value={newManutencao.descricao}
                                          placeholder="Gostaria de solicitar a realização de manutenção na pia do banheiro..."
                                          onChange={(e) => setNewManutencao({
                                              ...newManutencao,
                                              descricao: e.target.value
                                          })} className="w-full border rounded-3xl p-2 h-32"/>
                            </div>

                            {/* Botões (col-span-2 para ocupar 2 colunas e alinhamento à direita) */}
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button type="button" onClick={() => router.push("/")}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl mr-2 focus:outline-none focus:shadow-outline">Voltar
                                </button>
                                <button type="submit"
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline">Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>

    );
}
