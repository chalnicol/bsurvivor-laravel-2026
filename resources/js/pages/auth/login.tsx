import React, { useEffect, useState } from 'react';
import TransparentIcon from '../../components/transparentIcon';
import TextInput from '../../components/textInput';
import CustomLink from '../../components/customLink';
import { useForm } from '@inertiajs/react';
import CustomButton from '../../components/customButton';
import PromptMessage from '@/components/promptMessage';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import AuthBase from '@/components/authBase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import CheckButton from '@/components/checkButton';

const Login = () => {
  const {
    data,
    setData,
    processing,
    hasErrors,
    errors,
    clearErrors,
    post,
    reset,
  } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Handle login
    post('/login', {
      onBefore: () => {
        clearErrors();
      },
      onError: () => {
        reset('password');
      },
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleSocialSignin = (social: string) => {
    //..
  };

  return (
    <>
      <title>{`Login | ${import.meta.env.VITE_APP_NAME}`}</title>
      <AuthBase>
        <div className="relative w-full overflow-hidden rounded border border-gray-400 px-8 pt-2 pb-8 shadow-md">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="py-3 text-lg font-bold">Login</div>

          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {hasErrors && (
                <PromptMessage
                  type="error"
                  errors={errors}
                  onClose={() => clearErrors()}
                />
              )}

              <TextInput
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                disabled={processing}
                required
                label="email"
              />
              <TextInput
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                maxLength={15}
                disabled={processing}
                required
                label="password"
              />
              <CheckButton
                label="Remember Me"
                onChange={() => setData('remember', !data.remember)}
                checked={data.remember || false}
                disabled={processing}
              />

              <CustomButton
                color="transparent"
                label="Submit"
                disabled={processing}
                loading={processing}
                className="w-full bg-sky-800 py-2 uppercase hover:bg-sky-700"
              />
            </form>

            <div className="mt-4 flex flex-col items-start space-y-1.5">
              <CustomLink
                label="Forgot Password?"
                className="text-sm"
                disabled={processing}
                href="/forgot-password"
              />
              <CustomLink
                label="Not Yet A Member?"
                className="text-sm"
                disabled={processing}
                href="/register"
              />
            </div>

            <div className="mt-6">
              <hr className="mb-4 border-gray-400" />

              <div className="-mt-7 flex items-center justify-center">
                <p className="bg-gray-900 px-2 text-center text-sm font-semibold text-gray-400">
                  or use google account to login
                </p>
              </div>

              <div className="mt-5 flex justify-center gap-x-2">
                <CustomButton
                  disabled={processing}
                  onClick={() => handleSocialSignin('google')}
                  className="w-full bg-rose-700 py-2 hover:bg-rose-600"
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  <span className="text-sm">GOOGLE</span>
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </AuthBase>
    </>
  );
};

Login.layout = (page: React.ReactNode) => <AppCustomLayout children={page} />;
export default Login;
