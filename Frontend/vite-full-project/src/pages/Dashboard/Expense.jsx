import React, { Component } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Model from '../../components/models/Model';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import { toast } from 'react-toastify';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/common/DeleteAlert';
import { withUserAuthentication } from '../../hooks/withUserAuthentication';

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseData: [],
      openExpenseModel: false,
      loading: false,
      openDeleteAlert: {
        show: false,
        data: null
      }
    };
  }

  componentDidMount() {
    this.fetchExpenseData();
  }

  fetchExpenseData = async () => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        console.log("Données de dépenses reçues:", response.data);
        this.setState({ expenseData: response.data });
      }
    } catch (error) {
      console.error('Erreur de récupération des dépenses :', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) {
      toast.error("Le champ de catégorie est obligatoire.")
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
        `${API_PATHS.EXPENSE.ADD_EXPENSE}`,
        {
          category,
          amount,
          date,
          icon
        }
      );

      this.setState({
        openExpenseModel: false
      });
      toast.success("Dépense ajoutée avec succès.");
      this.fetchExpenseData();

    } catch (error) {
      console.error('Erreur d\'ajout des dépenses :', error);
    }
  };

  openDeleteAlert = (alertData) => {
    this.setState({ openDeleteAlert: alertData });
  };

  deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(`${API_PATHS.EXPENSE.DELETE_EXPENSE(id)}`);

      this.setState({ openDeleteAlert: { show: false, data: null } });
      toast.success("Dépense supprimée avec succès.");
      this.fetchExpenseData();
    } catch (error) {
      console.error('Erreur de suppression des dépenses :', error);
    }
  };

  handleDownloadExpense = async () => {
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.DOWNLOAD_EXPENSE}`, {
        responseType: 'blob'
      });
      
      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error('Erreur de téléchargement des dépenses :', error);
    }
  };

  render() {
    return (
      <DashboardLayout activeMenu="Dépenses">
        <div className="my-5 mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className=''>
              <ExpenseOverview
                data={this.state.expenseData}
                onAddExpense={() => this.setState({ openExpenseModel: true })}
              />
            </div>

            <ExpenseList
              data={this.state.expenseData}
              onDeleteExpense={(id) => this.openDeleteAlert({
                show: true,
                data: this.state.expenseData.find(item => item._id === id)
              })}
              onDownloadExpense={this.handleDownloadExpense}
            />
          </div>

          <Model
            isOpen={this.state.openExpenseModel}
            onClose={() => this.setState({ openExpenseModel: false })}
            title="Ajouter une dépense"
          >
            <AddExpenseForm
              onAddExpense={this.handleAddExpense}
            />
          </Model>

          {this.state.openDeleteAlert.data && (
            <Model
              isOpen={this.state.openDeleteAlert.show}
              onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
              title="Confirmer la suppression"
            >
              <DeleteAlert
                message={`Êtes-vous sûr de vouloir supprimer la dépense de ${this.state.openDeleteAlert.data?.category || ''}?`}
                onClose={() => this.setState({ openDeleteAlert: { show: false, data: null } })}
                onConfirm={() => this.deleteExpense(this.state.openDeleteAlert.data._id)}
              />
            </Model>
          )}
        </div>
      </DashboardLayout>
    );
  }
}

export default withUserAuthentication(Expense);
