"use client";

import { useState, FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { db } from "@/services/firebase/firebaseConfiguration";
import { ref, set } from "firebase/database";

function Registrar() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleForm = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;
            await updateProfile(user, { displayName: username });

            // Salvar o username no Realtime Database
            await set(ref(db, `users/${user.uid}`), { username });

            alert("Usuário cadastrado com sucesso!");
            router.push("/login");
        } catch (err) {
            if (err instanceof FirebaseError) {
                setError(err.message);
            } else {
                setError("Ocorreu um erro desconhecido. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <div className="bg-[url('/background.png')] bg-cover flex items-center justify-center h-screen">
            <div className="rounded-3xl bg-transparent bg-black bg-opacity-50 shadow-lg shadow-black outline-black backdrop-blur-[20px]  p-8 h-104 w-96">
                <div className="flex justify-center items-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="Logo da Instituição"
                        width={100}
                        height={100}
                    />
                </div>

                {/* Formulário de Cadastro */}
                <form onSubmit={handleForm} className="space-y-4">
                    <h1 className="text-3xl font-bold text-black mb-4">Registrar</h1>
                    {error && <p className="text-red-500">{error}</p>}
                    <label htmlFor="username" className="block">
                        <p className="text-black font-bold">Username</p>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            type="text"
                            name="username"
                            id="username"
                            className="w-full p-2 shadow-sm shadow-black border text-black rounded mb-4"
                            placeholder="username"
                        />
                    </label>
                    <label htmlFor="email" className="block">
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
                        <p className="text-black font-bold ">Senha</p>
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
                        Registrar
                    </button>
                </form>

                <div className="text-center mt-4">
                    <a href="../login" className="underline text-white hover:text-gray-700">
                        Já possui conta?
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Registrar;
