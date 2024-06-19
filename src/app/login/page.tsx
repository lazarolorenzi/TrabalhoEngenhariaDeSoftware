"use client";

import { useState, FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import signIn from "../../services/firebase/auth/signIn";
import { useRouter } from "next/navigation";
import Image from 'next/image';

function SignIn() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleForm = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { user, error } = await signIn(email, password);

      if (error) {
        if (typeof error === 'string') {
          console.error(error);
          throw new Error(error);
        } else {
          console.error("Erro desconhecido:", error);
          throw new Error("Ocorreu um erro durante o login");
        }
      }

      return router.push("/");
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
      <div className="bg-[url('/background.png')] bg-cover flex items-center justify-center h-screen">
        <div
            className="rounded-3xl bg-transparent bg-custom-gradient bg-black bg-opacity-50 shadow-lg shadow-black outline-black backdrop-blur-[20px]  p-8 h-104 w-96">
          <div className="flex justify-center items-center mb-8">
            <Image src="/logo.png" alt="Logo da Instituição" width={100} height={100}/>
          </div>
          <form onSubmit={handleForm} className="space-y-4">
            <h1 className="text-3xl font-bold text-black mb-4">Login</h1>

            <label htmlFor="email " className="block">
              <p className="text-black font-bold">Email</p>
              <input
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  name="email"
                  id="email"
                  className="w-full p-2 shadow-sm shadow-black border text-black rounded mb-4"
                  placeholder="@gmail.com"
              />
            </label>
            <label htmlFor="password" className="block text-black">
              <p className="text-black font-bold ">Senha</p> {/* Label estilizado */}
              <input
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  name="password"
                  id="password"
                  className="w-full p-2 shadow-sm shadow-black border rounded mb-4"
                  placeholder="password"
              />
            </label>

            <button
                type="submit"
                className="bg-gradient-to-r shadow-sm shadow-black outline-black outline-4 from-amber-300 to-amber-700 hover:bg-gray-300 text-gray-800  font-bold py-2 px-4 rounded w-full"
            >
              Acessar
            </button>
          </form>
          <div className="text-center mt-4">
            <a href="../registrar" className="underline text-white hover:text-gray-700">Cadastrar</a>
          </div>
          <div className="text-center mt-4">
            <a href="#" className="underline text-white hover:text-gray-700">Esqueci a senha</a>
          </div>
        </div>
      </div>
  );
}

export default SignIn;