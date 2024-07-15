import React from 'react';
import { UseFormRegister, FieldErrors, FieldError } from 'react-hook-form';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  required = false,
  register,
  errors,
  disabled = false,
}) => {
  const error = errors[id];
  return (
    <div className='form-control'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='mt-1'>
        <input
          id={id}
          type={type}
          {...register(id, { required })}
          disabled={disabled}
          className={`input input-bordered w-full ${error ? 'border-red-500' : ''}`}
        />
        {error && (
          <p className='mt-2 text-sm text-red-600'>
            {(error as FieldError).message || `${label} is required`}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;
