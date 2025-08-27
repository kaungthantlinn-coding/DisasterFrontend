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
        console.log('🔍 Google Sign-In script loaded successfully');
        console.log('🔍 Using Google Client ID:', clientIdData.clientId);
        
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

    script.onerror = () => {
      console.error('❌ Failed to load Google Sign-In script');
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clientIdData?.clientId]);

  const handleGoogleResponse = (response: any) => {
    console.log('🔍 Google Sign-In Response:', response);
    
    if (response.credential) {
      console.log('🔍 Google Credential Length:', response.credential.length);
      console.log('🔍 Google Credential Preview:', response.credential.substring(0, 50) + '...');
      
      // Validate the credential format
      if (typeof response.credential !== 'string' || response.credential.length < 100) {
        console.error('❌ Invalid Google credential format');
        return;
      }
      
      googleLoginMutation.mutate(response.credential);
    } else {
      console.error('❌ No credential in Google response:', response);
      if (response.error) {
        console.error('❌ Google Sign-In Error:', response.error);
      }
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
    <div className="w-full" data-testid="google-signin-button-container">
      <div id="google-signin-button" className="w-full [&>div]:!rounded-xl [&>div]:!shadow-sm [&>div]:!border-gray-300 [&>div]:!transition-all [&>div]:!duration-300 [&>div]:hover:!shadow-md [&>div]:hover:!scale-[1.02]"></div>
      {googleLoginMutation.error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {(googleLoginMutation.error as any)?.response?.data?.message || 'Google login failed'}
        </div>
      )}
      {googleLoginMutation.isPending && (
        <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in with Google...
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;