import { firebase_app } from "../firebaseConfiguration";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseError } from 'firebase/app';

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Obtenha o objeto do usuário
        return { user, error: null }; // Retorne o usuário e null para erro
    } catch (error) {
        if (error instanceof FirebaseError) {
            // Tratamento de erros específicos do Firebase
            if (error.code === 'auth/invalid-email') {
                return { user: null, error: 'Email inválido' };
            } else if (error.code === 'auth/wrong-password') {
                return { user: null, error: 'Senha incorreta' };
            } else if (error.code === 'auth/user-not-found') {
                return { user: null, error: 'Usuário não encontrado' };
            }
        }
        return { user: null, error: 'Ocorreu um erro durante o login' }; // Erro genérico
    }
}