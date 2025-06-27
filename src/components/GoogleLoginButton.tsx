import React, { useEffect } from 'react';
import { useGoogleLogin, useGoogleClientId } from '../hooks/useGoogleLogin';

const GoogleLoginButton: React.FC = () => {
  const googleLoginMutation = useGoogleLogin();
  const { data: clientIdData, isLoading: isLoadingClientId, error: clientIdError } = useGoogleClientId();

  useEffect(() => {
    if (!clientIdData?.clientId) return;

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientIdData.clientId,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: 400,
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [clientIdData?.clientId]);

  const handleGoogleResponse = (response: any) => {
    if (response.credential) {
      googleLoginMutation.mutate(response.credential);
    }
  };

  if (isLoadingClientId) {
    return (
      <div className="w-full h-12 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-gray-500">Loading Google Sign-In...</span>
      </div>
    );
  }

  if (clientIdError) {
    return (
      <div className="w-full">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800 text-sm font-medium mb-2">
            Google Sign-In Configuration Error
          </div>
          <div className="text-red-700 text-sm">
            {clientIdError.message}
          </div>
          <div className="text-red-600 text-xs mt-2">
            Please check your .env file and ensure VITE_GOOGLE_CLIENT_ID is set to a valid Google Client ID.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" className="w-full"></div>
      {googleLoginMutation.error && (
        <div className="mt-2 text-red-600 text-sm text-center">
          {(googleLoginMutation.error as any)?.response?.data?.message || 'Google login failed'}
        </div>
      )}
      {googleLoginMutation.isPending && (
        <div className="mt-2 text-blue-600 text-sm text-center">
          Signing in with Google...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;