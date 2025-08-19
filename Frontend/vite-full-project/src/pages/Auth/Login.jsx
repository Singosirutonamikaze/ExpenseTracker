import React, { Component } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, Navigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      shouldRedirect: true,
      updateUser: props.updateUser || (() => {}),
    };
  }

  handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    const { updateUser } = this.props;

    let hasError = false;
    let errorMessage = false;

    if (!email || !password) {
      hasError = true;
      errorMessage = "Veuillez remplir tous les champs";
    }

    if (!validateEmail(email)) {
      hasError = true;
      errorMessage = "Veuillez entrer une adresse email valide";
    }

    if (password.length < 8) {
      hasError = true;
      errorMessage = "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (hasError) {
      this.setState({ error: errorMessage });
    } else {
      this.setState({ error: null });

      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });

        const { token, user } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          this.setState({ shouldRedirect: true });
        }

      } catch (error) {
        if (error.response && error.response.data) {
          this.setState({ error: error.response.data.message || "Une erreur s'est produite" });
        } else {
          this.setState({ error: "Une erreur s'est produite lors de la connexion" });
        }
        this.setState({ shouldRedirect: false });
      }
    }

  }

  render() {
    const { email, password, error, shouldRedirect } = this.state;

    if (shouldRedirect) {
      const isAuthenticated = !!localStorage.getItem("token");
      if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return (
      <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col  justify-center'>
          <h3 className="text-xl font-semibold text-black">
            Bienvenus sur la page de connexion
          </h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'> S'il vous plait veuillez entrer vos de details de connexion.</p>

          <form onSubmit={this.handleLogin}>
            <Input
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
              label="Votre addresse email"
              placeholder="donne@gmail.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => this.setState({ password: e.target.value })}
              label="Votre mot de passe"
              placeholder="Minimum 8 charactères"
              type="password"
            />
            {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}

            <button
              type='submit'
              className='btn-primary'
            >
              Se connecter
            </button>

            <p className='text-[13px] text-slate-700 mt-3'>
              Vous n'avez pas de compte ? {"  "}
              <Link className='font-medium text-violet-600 underline' to='/signup'>
                S'inscrire
              </Link>
            </p>

          </form>
        </div>

      </AuthLayout>
    )
  }
}

export default Login;
