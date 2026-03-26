// import { Link } from "react-router-dom";

import CustomButton from '@/components/customButton';
import PromptMessage from '@/components/promptMessage';
import TextInput from '@/components/textInput';
import TransparentIcon from '@/components/transparentIcon';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const DeleteAccount: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    hasErrors,
    reset,
    clearErrors,
    errors,
  } = useForm({
    password: '', // This starts empty
  });

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    destroy('/settings/profile', {
      onError: () => reset(),
    });
  };

  const contRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative overflow-hidden rounded border border-gray-300 px-4 py-3 shadow-md">
      <TransparentIcon className="absolute -top-12 -right-12 z-0 w-60 rotate-30 opacity-5" />

      <div className="relative z-10">
        <h2 className="text-lg font-bold text-gray-300">Delete Account</h2>
        <p className="mt-2 text-sm text-gray-400">
          Deleting your account is permanent and cannot be undone.
        </p>

        <form onSubmit={handleDelete} className="mt-2 space-y-3">
          {hasErrors && (
            <PromptMessage
              type="error"
              errors={errors}
              onClose={() => clearErrors()}
            />
          )}

          <TextInput
            type="password"
            placeholder="input account password here"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            required={true}
          />
          <CustomButton
            label="Delete Account"
            loading={processing}
            disabled={processing}
            className="mt-3 w-34 bg-rose-500 py-1.5 hover:bg-rose-400"
          />
        </form>
      </div>
    </div>
  );
};
export default DeleteAccount;
