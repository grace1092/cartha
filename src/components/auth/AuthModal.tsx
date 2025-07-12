'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import ForgotPasswordModal from './ForgotPasswordModal';

type AuthModalType = 'signin' | 'signup' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: AuthModalType;
}

export default function AuthModal({ isOpen, onClose, initialType = 'signin' }: AuthModalProps) {
  const [modalType, setModalType] = useState<AuthModalType>(initialType);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    await signIn(email, password, rememberMe);
    onClose();
  };

  const handleSignUp = async (userData: any) => {
    await signUp(userData);
    onClose();
  };

  const handleResetPassword = async (email: string) => {
    await resetPassword(email);
  };

  const handleSwitchToSignUp = () => {
    setModalType('signup');
  };

  const handleSwitchToSignIn = () => {
    setModalType('signin');
  };

  const handleSwitchToForgotPassword = () => {
    setModalType('forgot-password');
  };

  const handleClose = () => {
    setModalType(initialType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {modalType === 'signin' && (
        <SignInModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToSignUp={handleSwitchToSignUp}
          onSwitchToForgotPassword={handleSwitchToForgotPassword}
          onSignIn={handleSignIn}
        />
      )}

      {modalType === 'signup' && (
        <SignUpModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUp={handleSignUp}
        />
      )}

      {modalType === 'forgot-password' && (
        <ForgotPasswordModal
          isOpen={isOpen}
          onClose={handleClose}
          onSwitchToSignIn={handleSwitchToSignIn}
          onResetPassword={handleResetPassword}
        />
      )}
    </>
  );
} 