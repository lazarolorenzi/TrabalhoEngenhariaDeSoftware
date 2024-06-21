"use client";

import {ref, onValue, update} from "firebase/database";
import {db} from "../../../services/firebase/firebaseConfiguration";
import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Params} from "next/dist/shared/lib/router/utils/route-matcher";
import Navbar from "@/app/componentes/navbar";
import Sidebar from "@/app/componentes/sidebar";

interface IUserParams extends Params {
  id: string;
}

interface IManutencao {
  nome_usuario: string;
  criticidade: string;
  data_solicitacao: string;
  descricao: string;
  quarto: string;
  assunto: string;
  data_conclusao: string;
  funcionario: string;
}

export default function EditarManutencao() {
  const router = useRouter();
  const params: IUserParams = useParams();
  const {id} = params;
  const [manutencao, setManutencao] = useState<IManutencao>({
    nome_usuario: "",
    criticidade: "",
    data_solicitacao: "",
    data_conclusao: "",
    descricao: "",
    quarto: "",
    assunto: "",
    funcionario: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const unsubscribe = onValue(
          ref(db, `/manutencao/${id}`),
          (querySnapShot) => {
            const manutencaoData: IManutencao = querySnapShot.val() || {};
            console.log(manutencaoData);
            setManutencao(manutencaoData);
          }
      );

      return () => unsubscribe();
    };

    fetchData();
  }, [id]);

  const validate = () => {
    const errorsList: string[] = [];
    const today = new Date().toISOString().split("T")[0];

    if (!manutencao.nome_usuario.trim()) {
      errorsList.push("O nome do usuário é obrigatório.");
    }
    if (!manutencao.criticidade.trim()) {
      errorsList.push("A criticidade da manutenção é obrigatória.");
    }
    if (!manutencao.data_solicitacao) {
      errorsList.push("A data de solicitação é obrigatória.");
    } else if (manutencao.data_solicitacao < today) {
      errorsList.push(
          "A data de solicitação não pode ser anterior ao dia atual."
      );
    }
    if (!manutencao.descricao.trim()) {
      errorsList.push("A descrição da manutenção é obrigatória.");
    }
    if (!manutencao.quarto.trim()) {
      errorsList.push("O quarto é obrigatório.");
    }
    if (!manutencao.assunto.trim()) {
      errorsList.push("O assunto da manutenção é obrigatório.");
    }

    setErrors(errorsList);
    return errorsList.length === 0;
  };

  const editManutencao = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    update(ref(db, `/manutencao/${id}`), manutencao);
    router.push("/");
  };
  return (
      <div className="grid grid-rows-[auto_1fr] h-full w-full">
        <nav className="bg-[#D9A05B] z-10">
          <Navbar/>
        </nav>
        <div className="flex h-full">
          <aside className="hidden  h-screen md:block w-64 bg-white outline outline-1  outline-black shadow-md shadow-black">
            <Sidebar/>
          </aside>
          <main className="w-full h-full bg-white outline-black outline outline-0 shadow-sm shadow-black ">
            <nav className="bg-[#D9A05B] p-4 h-[92px]  shadow-md">
              <div className="container mx-auto flex my-4 items-center">
                <h1 className="text-xl font-bold text-white">Editando Manutenção</h1>
              </div>
            </nav>
            <div className="container mx-auto p-4 md:p-10">
              <form onSubmit={editManutencao} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data de Solicitação e Conclusão */}
                <div>
                  <label htmlFor="data_solicitacao" className="block text-gray-700 text-sm font-bold mb-2">
                    Data de solicitação:
                  </label>
                  <input
                      type="date"
                      id="data_solicitacao"
                      value={manutencao.data_solicitacao}
                      onChange={(e) =>
                          setManutencao({
                            ...manutencao,
                            data_solicitacao: e.target.value,
                          })
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="data_conclusao" className="block text-gray-700 text-sm font-bold mb-2">
                    Data de Conclusão:
                  </label>
                  <input
                      type="date"
                      id="data_conclusao"
                      value={manutencao.data_conclusao}
                      onChange={(e) =>
                          setManutencao({
                            ...manutencao,
                            data_conclusao: e.target.value,
                          })
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                {/* Criticidade e Quarto */}
                <div>
                  <label htmlFor="criticidade" className="block text-gray-700 text-sm font-bold mb-2">
                    Criticidade:
                  </label>
                  <select
                      id="criticidade"
                      value={manutencao.criticidade}
                      onChange={(e) => setManutencao({
                        ...manutencao,
                        criticidade: e.target.value
                      })}
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quarto" className="block text-gray-700 text-sm font-bold mb-2">
                    Quarto:
                  </label>
                  <input
                      type="text"
                      id="quarto"
                      placeholder="Número do quarto"
                      value={manutencao.quarto}
                      onChange={(e) => setManutencao({...manutencao, quarto: e.target.value})}
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Usuário e Funcionário */}
                <div>
                  <label htmlFor="nome_usuario" className="block text-gray-700 text-sm font-bold mb-2">
                    Usuário:
                  </label>
                  <input
                      type="text"
                      id="nome_usuario"
                      value={manutencao.nome_usuario}
                      onChange={(e) =>
                          setManutencao({...manutencao, nome_usuario: e.target.value})
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div>
                  <label
                      htmlFor="funcionario"
                      className="block text-gray-700 text-sm font-bold  mb-2"
                  >
                    Funcionario:
                  </label>
                  <input
                      id="funcionario"
                      type="text"
                      placeholder="Funcionario"
                      value={manutencao.funcionario}
                      onChange={(e) =>
                          setManutencao({...manutencao, funcionario: e.target.value})
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Assunto */}
                <div className="md:col-span-2">
                  <label htmlFor="assunto" className="block text-gray-700 text-sm font-bold mb-2">
                    Assunto:
                  </label>
                  <input
                      type="text"
                      id="assunto"
                      value={manutencao.assunto}
                      onChange={(e) =>
                          setManutencao({...manutencao, assunto: e.target.value})
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label htmlFor="descricao" className="block text-gray-700 text-sm font-bold mb-2">
                    Descrição:
                  </label>
                  <textarea
                      id="descricao"
                      value={manutencao.descricao}
                      onChange={(e) =>
                          setManutencao({...manutencao, descricao: e.target.value})
                      }
                      className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  />
                </div>

                {/* Botões */}
                <div className="md:col-span-2 flex justify-end mt-4">
                  <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-3xl mr-2 focus:outline-none focus:shadow-outline"
                  >
                    Voltar
                  </button>
                  <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
                      onClick={editManutencao}
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
  );
}
