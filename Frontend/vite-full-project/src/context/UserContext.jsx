import React, { useState, createContext } from "react";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    const updateUser = (userData) => {
        setUser(userData);
        if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const clearUser = () => {
        setUser(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser
            }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
