import firebase from 'firebase';
import {createContext, ReactNode, useEffect, useState} from 'react';
import { auth } from '../services/firebase';

type User = {
    id: string;
    name:string;
    avatar:string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}
type AuthContextProviderProps = {
      children:ReactNode;
}
// passando o formato da informação para o contexto e adicionando em TestContext
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {

    const [user,setUser] = useState<User>();
    
    // Recuperando informação do usuaria já logado
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        if(user){
        const {displayName, photoURL, uid} = user;

        if(!displayName || !photoURL){
            throw new Error('Missing Information from Google Account');
        }
        setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
        })
        }
    })
    return () => {
        unsubscribe();
    }
    });

    // Logando usuario com o google
    async function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

        if(result.user){
            const {displayName, photoURL, uid} = result.user;

            if(!displayName || !photoURL){
            throw new Error('Missing Information from Google Account');
            }
            setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
            })
        }
    }

        return (
            <AuthContext.Provider value={{user, signInWithGoogle}}>
                {props.children}
            </AuthContext.Provider>
        );
}