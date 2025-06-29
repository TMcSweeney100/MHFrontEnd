    import React, {useContext,useEffect,useState,createContext} from 'react';
    import { auth } from '../../firebase/firebase';
    import { onAuthStateChanged } from 'firebase/auth';

    //must import auth from our firebase.js file

    const AuthContext = React.createContext();

    export function useAuth(){
        return useContext(AuthContext);
    }

    // use states that control the sign in
    export function AuthProvider({children}){

        const [currentUser , setCurrentUser] = useState(null);
        const [userLoggedIn, setUserLoggedIn] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(()=>{
            const unsubscribe = onAuthStateChanged(auth, initializeUser);
            return unsubscribe;

        }, [])

        //when the user logs in it should trigger this argument.
        async function initializeUser(user){
            //if the user is valid value, we will spread the user properties into 
            //a new object, we set they are logged in to true
            if(user){
                setCurrentUser({...user});
                setUserLoggedIn(true);
            }else{
                setCurrentUser(null);
                setUserLoggedIn(false);
            }
            setLoading(false);
        }

        const value = {
            currentUser,
            userLoggedIn,
            loading
        }


        return (
            <AuthContext.Provider value={value}>
                {!loading && children}
            </AuthContext.Provider>
        )
    }