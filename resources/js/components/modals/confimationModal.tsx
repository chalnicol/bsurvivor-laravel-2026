import React from 'react';
import CustomButton from '../customButton';
import BaseModal from './baseModal';

interface ConfirmationModalProps {
  message?: string;
  details?: string;
  children?: React.ReactNode;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  children,
  details,
  loading,
  onClose,
  onConfirm,
}) => {
  const finalMessage =
    message || 'Are you sure you want to perform this action?';

  return (
    <BaseModal size="lg">
      <div className="space-y-2 rounded border border-gray-600 bg-gray-900 px-4 py-3">
        <p className="font-semibold text-gray-300">{finalMessage}</p>

        {children ? (
          <div className="mt-3">{children}</div>
        ) : details ? (
          <p className="rounded bg-gray-700 px-2.5 py-1.5 text-sm font-semibold text-gray-300">
            {details}
          </p>
        ) : null}

        <div className="mt-4 flex items-center space-x-2">
          <CustomButton
            type="button"
            label="Cancel"
            disabled={loading}
            onClick={onClose}
            className="bg-gray-600 px-3 hover:bg-gray-500"
          />
          <CustomButton
            type="button"
            label="Confirm"
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
            className="bg-rose-700 px-3 hover:bg-rose-600"
          />
        </div>
      </div>
    </BaseModal>
  );
};
export default ConfirmationModal;
