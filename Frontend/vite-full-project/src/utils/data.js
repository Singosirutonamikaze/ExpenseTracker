import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
} from 'react-icons/lu';

export const SIDE_MENU_DATA = [
    {
        id: '01',
        label: 'Dashboard',
        icon: LuLayoutDashboard,
        path: '/dashboard',
    },
    {
        id: '02',
        label: 'Revenues',
        icon: LuHandCoins,
        path: '/income',
    },
    {
        id: '03',
        label: 'Dépenses',
        icon: LuWalletMinimal,
        path: '/expense',
    },
    {
        id: '04',
        label: 'Déconnexion',
        icon: LuLogOut,
        path: 'logout',
    }
];