
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/services/firebase/firebaseConfiguration";
import { ref, onValue, remove } from "firebase/database";

interface IManutencao {
    id: string;
    nome_usuario: string;
    criticidade: string;
    data_solicitacao: string;
    descricao: string;
    quarto: string;
    assunto: string;
}

const ListaManutencao = () => {
    const [manutencoes, setManutencoes] = useState<IManutencao[]>([]);

    useEffect(() => {
        fetchManutencoes(); // Busca as manutenções ao montar o componente
    }, []);

    const fetchManutencoes = () => {
        const manutencaoRef = ref(db, "/manutencao");
        onValue(manutencaoRef, (snapshot) => {
            const manutencoesData = snapshot.val() || {};
            const manutencoesArray: IManutencao[] = Object.keys(
                manutencoesData
            ).map((key) => ({
                id: key,
                ...manutencoesData[key],
            }));
            setManutencoes(manutencoesArray);
        });
    };

    const clearManutencao = async (manutencaoId: string) => {
        try {
            const manutencaoRef = ref(db, `/manutencao/${manutencaoId}`);
            await remove(manutencaoRef);
            fetchManutencoes(); // Atualiza a lista após a exclusão
            console.log(`Manutenção ${manutencaoId} removida com sucesso!`);
        } catch (error) {
            console.error("Erro ao remover manutenção:", error);
            // Lógica para lidar com o erro (exibir um alerta, por exemplo)
        }
    };

    return (
        <div className="container w-full h-full p-10">
            <nav className="bg-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#686868]">Lista de Manutenções</h1>
                    <Link href={`criarManutencao`}>
                        <button
                            className="bg-[#6EC162] hover:bg-[#479541] text-white font-bold py-2 px-4 rounded-md shadow-sm">
                            Adicionar
                        </button>
                    </Link>
                </div>
            </nav>

            {/* ... (Campo de pesquisa) ... */}

            <table className="table-auto w-full text-black my-4">
                <thead>
                <tr>
                    <th className="px-4 py-2">Usuário</th>
                    <th className="px-4 py-2">Quarto</th>
                    <th className="px-4 py-2">Criticidade</th>
                    <th className="px-4 py-2">Data</th>
                    <th className="px-4 py-2">Assunto</th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {manutencoes.map((item) => (
                    <tr key={item.id}>
                        <td className="border px-4 py-2">{item.nome_usuario}</td>
                        <td className="border px-4 py-2">{item.quarto}</td>
                        <td className="border px-4 py-2">{item.criticidade}</td>
                        <td className="border px-4 py-2">{item.data_solicitacao}</td>
                        <td className="border px-4 py-2">{item.assunto}</td>
                        <td className="border px-4 py-2 text-center">
                            <Link href={`editarManutencoes/${item.id}`}>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
                                    Visualizar
                                </button>
                            </Link>

                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm ml-2"
                                onClick={() => clearManutencao(item.id!)}
                            >
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* ... (Paginação) ... */}
        </div>
    );
};
export default ListaManutencao;
