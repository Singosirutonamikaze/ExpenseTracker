import React, { Component } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

// HOC pour authentifier l'utilisateur
export const withUserAuthentication = (WrappedComponent) => {
  return class WithUserAuthentication extends Component {
    static contextType = UserContext;
    
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        isAuthenticated: false,
        shouldRedirect: false
      };
    }
    
    componentDidMount() {
      this.checkAuthentication();
    }
    
    checkAuthentication = async () => {
      const { user, updateUser, clearUser } = this.context;
      
      if (user) {
        this.setState({ isLoading: false, isAuthenticated: true });
        return;
      }
      
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (response.data) {
          updateUser(response.data);
          this.setState({ isLoading: false, isAuthenticated: true });
        }
      } catch (error) {
        console.error('Erreur de récupération des informations utilisateur:', error);
        clearUser();
        this.setState({ isLoading: false, shouldRedirect: true });
      }
    };
    
    render() {
      const { isLoading, isAuthenticated, shouldRedirect } = this.state;
      
      if (isLoading) {
        return <div>Chargement...</div>; // Ou un spinner de chargement
      }
      
      if (shouldRedirect) {
        return <Navigate to="/login" replace />;
      }
      
      if (isAuthenticated) {
        return <WrappedComponent {...this.props} />;
      }
      
      return <Navigate to="/login" replace />;
    }
  };
};