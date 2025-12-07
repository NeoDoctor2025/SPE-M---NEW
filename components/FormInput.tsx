import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
}

export const FormInput = ({ label, error, helpText, className, ...props }: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {props.required && <span className="text-critical ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`px-3 py-2 border rounded-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-critical focus:ring-critical/30'
            : 'border-slate-300 dark:border-slate-700 focus:ring-primary/30 focus:border-primary'
        } ${className || ''}`}
      />
      {error && (
        <p className="text-xs text-critical flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
};

interface FormTextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  rows?: number;
}

export const FormTextArea = ({ label, error, helpText, className, rows = 3, ...props }: FormTextAreaProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {props.required && <span className="text-critical ml-1">*</span>}
      </label>
      <textarea
        {...props}
        rows={rows}
        className={`px-3 py-2 border rounded-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
          error
            ? 'border-critical focus:ring-critical/30'
            : 'border-slate-300 dark:border-slate-700 focus:ring-primary/30 focus:border-primary'
        } ${className || ''}`}
      />
      {error && (
        <p className="text-xs text-critical flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
};

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect = ({ label, error, helpText, options, className, ...props }: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
        {props.required && <span className="text-critical ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`px-3 py-2 border rounded-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-critical focus:ring-critical/30'
            : 'border-slate-300 dark:border-slate-700 focus:ring-primary/30 focus:border-primary'
        } ${className || ''}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-critical flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  );
};
