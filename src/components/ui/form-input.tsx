import { ReactNode, useState, forwardRef } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Quick cn helper instead of importing if it doesn't exist, but we assume it does based on the prompt.
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  maxLength?: number;
  prefix?: string;
  suffix?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: any;
  isValid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  register: UseFormRegisterReturn;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      required,
      helperText,
      maxLength,
      prefix,
      suffix,
      leftIcon,
      rightIcon,
      error,
      isValid,
      disabled,
      loading,
      register,
      className,
      inputClassName,
      labelClassName,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn("space-y-1.5 w-full", className)}>
        <label className={cn("block text-sm font-bold text-[#1C1B14]", labelClassName)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center z-10">
              {leftIcon}
            </div>
          )}
          {prefix && (
            <div className="absolute left-3 text-gray-500 font-medium select-none flex items-center justify-center z-10">
              {prefix}
            </div>
          )}
          
          <input
            type={inputType}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled || loading}
            {...register}
            className={cn(
              "w-full h-12 text-base rounded-xl border transition-all duration-200 outline-none bg-white",
              "focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]",
              (leftIcon || prefix) ? (prefix ? "pl-12" : "pl-10") : "pl-3",
              (rightIcon || suffix || isValid || error || isPassword || loading) ? (suffix ? "pr-12" : "pr-10") : "pr-3",
              disabled && "bg-gray-50 cursor-not-allowed opacity-70",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              !error && isValid && "border-green-500 focus:border-green-500 focus:ring-green-500/20",
              !error && !isValid && "border-[#E5E7EB]", // default gray-200
              inputClassName
            )}
          />
          
          <div className="absolute right-3 flex items-center gap-2">
            {suffix && (
              <span className="text-gray-500 font-medium select-none">{suffix}</span>
            )}
            
            {loading ? (
              <Loader2 className="w-4 h-4 text-[#FF7A00] animate-spin" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-500 pointer-events-none" />
            ) : isValid ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 pointer-events-none" />
            ) : rightIcon ? (
              <div className="text-gray-400 pointer-events-none flex items-center justify-center">{rightIcon}</div>
            ) : null}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 rounded-md p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error.message}
            </motion.p>
          ) : isValid ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Looks good!
            </motion.p>
          ) : helperText ? (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-500 mt-1.5"
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
