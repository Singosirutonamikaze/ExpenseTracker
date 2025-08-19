import React, { Component } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Model from '../../components/models/Model';
import { useUserAuthentication } from '../../hooks/useUserAuthentication';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-toastify';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/common/DeleteAlert';
import { withUserAuthentication } from '../../hooks/withUserAuthentication';

class Income extends Component {
  //useUserAuthentication();
  constructor(props) {
    super(props);
    this.state = {
      incomeData: [],
      openIncomeModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      }
    };
  }

  componentDidMount() {
    this.fetchIncomeData();
  }

  fetchIncomeData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if (response.data) {
        console.log("Données de revenus reçues:", response.data);
        this.setState({ incomeData: response.data });
      }
    } catch (error) {
      console.error('Erreur de recuperation des revenus :', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    if (!source.trim()) {
      toast.error("Le champ de source est obligatoire.")
      return;
    }

    if (!amount || amount <= 0 || isNaN(amount)) {
      toast.error("Le champ de montant est obligatoire et doit être un nombre valide.")
      return;
    }

    if (!date) {
      toast.error("Le champ de date est obligatoire.")
      return;
    }

    try {
      await axiosInstance.post(
        `${API_PATHS.INCOME.ADD_INCOME}`,
        {
          source,
          amount,
          date,
          icon
        }
      );

      this.setState({
        openIncomeModel: false
      });
      toast.success("Revenu ajouté avec succès.");
      this.fetchIncomeData();

    } catch (error) {
      console.error('Erreur d\'ajout des revenus :', error);
    }
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.INCOME.DELETE_INCOME(id)}`);

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Revenu supprimé avec succès.");
      this.fetchIncomeData();
    } catch (error) {
      console.error('Erreur de suppression des revenus :', error);
    }
  };

  handleDownloadIncome = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.DOWNLOAD_INCOME}`, {
        responseType: 'blob'
      });

      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'income.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Erreur de téléchargement des revenus :', error);
    }
  };

  render() {
    return (
      <DashboardLayout activeMenu="Revenues">
        <div className="my-5 mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className=''>
              <IncomeOverview
                data={this.state.incomeData}
                onAddIncome={() => this.setState({ openIncomeModel: true })}
              />
            </div>

            <IncomeList
              data={this.state.incomeData}
              onDeleteIncome={(id) => this.openDeleteAlert({
                show: true,
                data: this.state.incomeData.find(item => item._id === id)
              })}
              onDownloadIncome={this.handleDownloadIncome}
            />

          </div>

          <Model
            isOpen={this.state.openIncomeModel}
            onClose={() => this.setState({ openIncomeModel: false })}
            title="Ajouter un revenu"
          >
            <AddIncomeForm
              onAddIncome={this.handleAddIncome}
            />
          </Model>

          {this.state.openDeleteAlert.data && (
            <Model
              isOpen={this.state.openDeleteAlert.show}
              onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
              title="Confirmer la suppression"
            >
              <DeleteAlert
                message={`Êtes-vous sûr de vouloir supprimer le revenu de ${this.state.openDeleteAlert.data?.source || ''}?`}
                onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
                onConfirm={() => this.deleteIncome(this.state.openDeleteAlert.data._id)}
              />
            </Model>
          )}
        </div>
      </DashboardLayout>
    );
  }
}

export default withUserAuthentication(Income);