import TransparentIcon from '../../components/transparentIcon';
import TextInput from '../../components/textInput';
import CustomLink from '../../components/customLink';
import { useForm } from '@inertiajs/react';
import CustomButton from '@/components/customButton';
import { AppCustomLayout } from '@/layouts/app-custom-layout';
import AuthBase from '@/components/authBase';
import { formRules } from '@/data';
import PromptMessage from '@/components/promptMessage';

const Register = () => {
  const {
    data,
    setData,
    post,
    reset,
    hasErrors,
    errors,
    clearErrors,
    processing,
  } = useForm({
    username: '',
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    post('/register', {
      onBefore: () => {
        clearErrors();
      },
      onError: () => {
        reset('password', 'password_confirmation');
      },
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <>
      <title>{`Register | ${import.meta.env.VITE_APP_NAME}`}</title>
      <AuthBase>
        <div className="relative w-full overflow-hidden rounded border border-gray-400 p-8 pt-2 shadow-md">
          <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />
          <div className="py-3 text-lg font-bold">Register</div>

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
                type="text"
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
                maxLength={15}
                disabled={processing}
                required
                rules={formRules.username}
                label="Username"
              />
              <TextInput
                type="text"
                value={data.full_name}
                onChange={(e) => setData('full_name', e.target.value)}
                maxLength={40}
                disabled={processing}
                required
                rules={formRules.full_name}
                label="Full Name"
              />

              <TextInput
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                disabled={processing}
                required
                rules={formRules.email}
                label="Email"
              />
              <TextInput
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                disabled={processing}
                required
                rules={formRules.password}
                label="Password"
              />
              <TextInput
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData('password_confirmation', e.target.value)
                }
                disabled={processing}
                required
                label="Confirm Password"
              />

              <CustomButton
                label="Submit"
                className="mt-5 w-full bg-sky-800 py-2 uppercase hover:bg-sky-700"
                disabled={processing}
              />
            </form>

            <CustomLink
              label="I have already an account"
              className="mt-4 text-sm"
              disabled={processing}
              href="/login"
            />
          </div>
        </div>
      </AuthBase>
    </>
  );
};

Register.layout = (page: React.ReactNode) => (
  <AppCustomLayout children={page} />
);

export default Register;
