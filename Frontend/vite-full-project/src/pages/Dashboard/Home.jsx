import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuthentication } from '../../hooks/useUserAuthentication';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import InfoCard from '../../components/cards/InfoCard';
import {
  LuHandCoins,
  LuWalletMinimal,
} from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import { addThousandSeparator } from '../../utils/helper';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithCharts from '../../components/Dashboard/RecentIncomeWithCharts';
import RecentIncome from '../../components/Dashboard/RecentIncome';


function Home() {
  useUserAuthentication();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DASHBOARD_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }

    } catch (error) {
      console.log('Erreur interne. Veuillez reprendre s\'il vous plait.', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        alert('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};

  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label='Balance Total'
            value={addThousandSeparator(dashboardData?.totalBalance || 0)}
            color='bg-violet-500'
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label='Revenues Total'
            value={addThousandSeparator(dashboardData?.totalIncome || 0)}
            color='bg-orange-500'
          />

          <InfoCard
            icon={<LuHandCoins />}
            label='Dépenses Total'
            value={addThousandSeparator(dashboardData?.totalExpense || 0)}
            color='bg-red-500'
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate('/expense')}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />


          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses}
            onSeeMore={() => navigate('/expense')}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithCharts
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            onSeeMore={() => navigate('/income')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}


export default Home;
