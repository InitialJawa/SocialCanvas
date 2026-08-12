import React from 'react';

export const Label = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <label className={`block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 ${className}`}>
    {children}
  </label>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/30 rounded-lg px-3 py-2.5 text-[var(--root-fg)] text-sm outline-none transition ${props.className || ''}`}
  />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/30 rounded-lg px-3 py-2.5 text-[var(--root-fg)] text-sm outline-none transition appearance-none ${props.className || ''}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.75rem center',
      backgroundSize: '1.2em 1.2em',
      paddingRight: '2.5rem',
      ...props.style
    }}
  >
    {props.children}
  </select>
);

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full bg-[var(--root-bg)] border border-[var(--panel-border)] focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/30 rounded-lg px-3 py-2.5 text-[var(--root-fg)] text-sm outline-none transition resize-none ${props.className || ''}`}
  />
);

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>(({ variant = 'secondary', className = '', ...props }, ref) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--panel-bg)] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--root-bg)] focus:ring-[var(--accent)] shadow-sm px-4 py-2 text-sm",
    secondary: "bg-[var(--root-bg)] hover:bg-[var(--panel-border)] border border-[var(--panel-border)] text-[var(--root-fg)] focus:ring-gray-500 shadow-sm px-4 py-2 text-sm",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 focus:ring-red-500 px-4 py-2 text-sm",
    ghost: "bg-transparent hover:bg-[var(--root-bg)] text-[var(--text-muted)] hover:text-[var(--root-fg)] px-3 py-1.5 text-xs"
  };

  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {props.children}
    </button>
  );
});
Button.displayName = 'Button';
