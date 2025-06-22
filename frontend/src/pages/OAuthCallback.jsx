// src/pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../utils/api';

const OAuthCallback = ({ onLogin }) => {
  const { provider } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      api.oauthLogin(provider, code)
        .then(res => {
          onLogin({ user: res.user, token: res.access_token });
          navigate('/');
        }).catch(err => {
          console.error(err);
          navigate('/');
        });
    }
  }, []);

  return <p>Signing in with {provider}...</p>;
};

export default OAuthCallback;
