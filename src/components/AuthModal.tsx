import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Check, LogIn, Chrome, ShieldAlert, Sparkles, User, HelpCircle, Lock, AlertCircle } from 'lucide-react';
import { Button } from './ui';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signInAnonymously } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isGuest: boolean;
  uid?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout }: Props) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user: UserProfile = {
        name: result.user.displayName || 'Google User',
        email: result.user.email || '',
        avatar: result.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: false,
        uid: result.user.uid
      };
      
      onLoginSuccess(user);
      setSuccessMessage(t('auth.successGoogle'));
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || t('auth.failGoogle'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      let userCredential;
      if (activeTab === 'register') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const user: UserProfile = {
        name: name || userCredential.user.displayName || email.split('@')[0],
        email: userCredential.user.email || email,
        avatar: userCredential.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: false,
        uid: userCredential.user.uid
      };
      
      onLoginSuccess(user);
      setSuccessMessage(activeTab === 'register' ? t('auth.successRegister') : t('auth.successLogin'));
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || t('auth.errorAuth'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage(t('auth.enterEmail'));
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(t('auth.successReset'));
      setTimeout(() => {
        setSuccessMessage('');
        setActiveTab('login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || t('auth.failReset'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      let uid = '';
      try {
        const anonRes = await signInAnonymously(auth);
        uid = anonRes.user.uid;
      } catch {
        let localUid = localStorage.getItem('socialcanvas_guest_uid');
        if (!localUid) {
          localUid = 'guest_local_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
          localStorage.setItem('socialcanvas_guest_uid', localUid);
        }
        uid = localUid;
      }
      const guestUser: UserProfile = {
        name: 'Guest Creator',
        email: 'guest@socialcanvas.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        isGuest: true,
        uid: uid,
      };
      onLoginSuccess(guestUser);
      setSuccessMessage(t('auth.successGuest'));
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Guest login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md max-h-full bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-2xl rounded-3xl overflow-y-auto custom-scrollbar z-10 text-[var(--root-fg)] p-6 sm:p-8 flex flex-col gap-5"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-[var(--button-hover)] text-[var(--text-muted)] hover:text-[var(--root-fg)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {successMessage ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-500">{t('auth.success')}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{successMessage}</p>
              </div>
            </div>
          ) : currentUser ? (
            <div className="flex flex-col gap-5 text-center">
              <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--accent)]/30 shadow-md">
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{currentUser.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{currentUser.email}</p>
                <div className="mt-2.5 inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/10 uppercase tracking-wider">
                  {currentUser.isGuest ? t('auth.guestAccount') : t('auth.registeredAccount')}
                </div>
              </div>

              <div className="p-4 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-2xl text-left text-xs space-y-2">
                <p className="font-semibold text-[var(--root-fg)]">{t('auth.sessionInfo')}</p>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  {t('auth.sessionInfoDesc')}
                </p>
              </div>

              <div className="flex gap-2.5 mt-2">
                <Button variant="secondary" onClick={onClose} className="flex-1 h-10 text-xs font-bold rounded-xl">
                  {t('auth.close')}
                </Button>
                <Button variant="danger" onClick={() => { onLogout(); onClose(); }} className="flex-1 h-10 text-xs font-bold rounded-xl">
                  {t('auth.logout')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[var(--accent)]/10 mb-2 uppercase tracking-wider">
                  <User className="w-3 h-3" /> Akun SocialCanvas
                </div>
                <h3 className="text-xl font-extrabold tracking-tight">{t('auth.loginOrRegister')}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {t('auth.loginOrRegisterDesc')}
                </p>
              </div>
              
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold flex gap-2 items-center">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex border-b border-[var(--panel-border)]">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'login' 
                      ? 'border-[var(--accent)] text-[var(--accent)]' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                  }`}
                >
                  {t('auth.login')}
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 pb-2.5 text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'register' 
                      ? 'border-[var(--accent)] text-[var(--accent)]' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                  }`}
                >
                  {t('auth.register')}
                </button>
                <button
                  onClick={() => setActiveTab('forgot')}
                  className={`flex-1 pb-2.5 text-[10px] sm:text-xs font-bold border-b-2 transition-all ${
                    activeTab === 'forgot' 
                      ? 'border-[var(--accent)] text-[var(--accent)]' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--root-fg)]'
                  }`}
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>

              {activeTab === 'forgot' ? (
                <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                  <div className="text-xs text-[var(--text-muted)] mb-2">
                    {t('auth.forgotPasswordDesc')}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t('auth.emailAddress')}</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[var(--accent)]/50 text-[var(--root-fg)]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !email}
                    className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] text-sm font-bold gap-2 rounded-lg mt-1"
                  >
                    {isSubmitting ? t('auth.sending') : t('auth.sendResetLink')}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
                  {activeTab === 'register' && (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t('auth.creatorName')}</label>
                      <input
                        type="text"
                        required
                        placeholder={t('auth.creatorNamePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[var(--accent)]/50 text-[var(--root-fg)]"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t('auth.emailAddress')}</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[var(--accent)]/50 text-[var(--root-fg)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">{t('auth.password')}</label>
                    <input
                      type="password"
                      required
                      placeholder={t('auth.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[var(--accent)]/50 text-[var(--root-fg)]"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !email || !password}
                    className="w-full h-11 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] text-sm font-bold gap-2 rounded-lg mt-1"
                  >
                    {isSubmitting ? t('auth.processing') : (activeTab === 'register' ? t('auth.registerNow') : t('auth.loginAccount'))}
                  </Button>
                </form>
              )}
              
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--panel-border)]"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-[var(--panel-bg)] px-2 text-[var(--text-muted)]">{t('auth.or')}</span></div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {/* Google OAuth */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="flex items-center justify-between px-4 py-3 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl hover:border-[var(--accent)]/50 hover:bg-[var(--button-hover)] transition-all text-xs font-bold cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Chrome className="w-4 h-4 text-blue-500" />
                    <span>{t('auth.loginWithGoogle')}</span>
                  </div>
                </button>

                {/* Guest Login */}
                <button
                  onClick={handleGuestLogin}
                  disabled={isSubmitting}
                  className="flex items-center justify-between px-4 py-3 bg-[var(--root-bg)] border border-[var(--panel-border)] rounded-xl hover:border-[var(--accent)]/50 hover:bg-[var(--button-hover)] transition-all text-xs font-bold cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>{t('auth.continueAsGuest')}</span>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-center text-[var(--text-muted)] leading-relaxed">
                {t('auth.importantFirebase')}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

