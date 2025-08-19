import React, { Component, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, Navigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import UploadImage from '../../utils/uploadImage';

function SignUp(props) {
  const [profilePic, setProfilePic] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let hasError = false;
    let errorMessage = "";

    if (!fullName || !email || !password) {
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
      setError(errorMessage);
      return;
    } else {
      setError(null);
      try {
        let profileImageUrl = null;
        if (profilePic) {
          const imageUpload = await UploadImage(profilePic);
          if (imageUpload && imageUpload.data && imageUpload.data.imageUrl) {
            profileImageUrl = imageUpload.data.imageUrl;
          } else if (imageUpload && imageUpload.imageUrl) {
            profileImageUrl = imageUpload.imageUrl;
          }
        }

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          fullName,
          email,
          password,
          profileImageUrl
        });

        const { token, user } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          if (props.updateUser) props.updateUser(user);
        }

        setShouldRedirect(true);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.message || "Une erreur est survenue, veuillez réessayer plus tard.");
        } else {
          setError("Une erreur est survenue, veuillez réessayer plus tard.");
        }
        setShouldRedirect(false);
      }
    }
  };

  if (shouldRedirect && localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center px-4'>
        <h3 className="text-xl font-semibold text-black">
          Créer un compte
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'> Rejoignez-nous en saisissant vos informations pour créer un compte.</p>

        <form onSubmit={handleSignUp} className='w-full mt-10'>
          <ProfilePhotoSelector
            image={profilePic}
            onChange={setProfilePic}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className='col-span-2'>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <button
            type='submit'
            className='btn-primary'
          >
            S'inscrire
          </button>

          <p className='text-[13px] text-slate-700 mt-3'>
            Vous avez un compte ? {"  "}
            <Link className='font-medium text-violet-600 underline' to='/login'>
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

export default SignUp;