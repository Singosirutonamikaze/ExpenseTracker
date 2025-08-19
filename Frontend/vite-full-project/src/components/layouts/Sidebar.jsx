import React, { useContext, useEffect, useState } from 'react';
import { SIDE_MENU_DATA } from '../../utils/data';
import { UserContext } from '../../context/UserContext';
import gsap from 'gsap';
import ChartAvatar from '../cards/ChartAvatar';
import { useNavigate } from 'react-router-dom';
import { useUserAuthentication } from '../../hooks/useUserAuthentication';

const Sidebar = ({ activeMenu: initialActiveMenu }) => {
    useUserAuthentication();
    const navigate = useNavigate();
    const { user, clearUser } = useContext(UserContext);
    const [activeMenu, setActiveMenu] = useState(initialActiveMenu || 'Dashboard');

    // Debugging
    useEffect(() => {
        console.log("User data in Sidebar:", user);
    }, [user]);

    const handleClick = (route, label) => {
        if (route === 'logout') {
            handleLogout();
        } else {
            setActiveMenu(label);
            navigate(`${route}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        if (clearUser) {
            clearUser();
        }
        navigate('/login');
    };

    useEffect(() => {
        gsap.fromTo('.sidebar', { x: -300 }, { x: 0, duration: 0.5 });
    }, []);
    
    // Accéder aux bonnes propriétés - utiliser user.user si l'objet a cette structure
    const userData = user?.user || user || {};
    const userFullName = userData.fullName || 'Utilisateur';
    const userProfileImage = userData.profileImageUrl || '';

    return (
        <div className='w-64 h-[calc(100vh-64px)] bg-white shadow-md p-4 border-r border-gray-200/50 sticky top-[61px] z-50 sidebar'>
            <div className='flex flex-col items-center mb-6 justify-center gap-3 mt-3 '>
                <div className="text-center mb-3 flex flex-col items-center">
                    {userProfileImage ? (
                        <img
                            src={userProfileImage}
                            alt='Profile utilisateur'
                            className='w-20 h-20 rounded-full object-cover border-2 border-violet-700 bg-slate-400 mx-auto'
                            onError={(e) => {
                                console.log("Image error, falling back to avatar");
                                e.target.style.display = 'none';
                                document.getElementById('fallbackAvatar').style.display = 'flex';
                            }}
                        />
                    ) : (
                        <ChartAvatar
                            id="fallbackAvatar"
                            fullName={userFullName}
                            width="w-20"
                            height="h-20"
                            style='text-xl'
                        />
                    )}
                    <p className="mt-7 mb-4 font-medium text-gray-800">{userFullName}</p>
                </div>

                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key={`menu-${index}`}
                        className={`
                            w-full flex items-center gap-4 text-[15px] 
                            ${activeMenu === item.label ?
                                'bg-violet-700 text-white' :
                                'text-gray-700 hover:bg-gray-200'
                            } 
                            py-3 px-6 rounded-lg mb-3
                            transition-colors duration-200
                        `}
                        onClick={() => handleClick(item.path, item.label)}
                    >
                        <item.icon className='text-xl' />
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
