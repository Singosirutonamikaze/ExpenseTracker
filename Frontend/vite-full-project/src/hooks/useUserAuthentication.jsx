import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";


export const useUserAuthentication = () => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {

        if(user){
            return; // L'utilisateur est déjà authentifié
        }

        let isMounted = true;

        const fetchUserInfo = async () => {
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                if(isMounted){
                    clearUser();
                    navigate("/login");
                }
                console.error('Erreur de récupération des informations utilisateur:', error);
            }
        }

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [user, updateUser, clearUser, navigate]);
};
