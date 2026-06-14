import { useState } from 'react'

const inputClassName =
  'w-full rounded-[var(--radius-dw)] border border-dw-border px-3 py-2 pr-10 text-sm outline-none focus:border-dw-primary focus:ring-2 focus:ring-blue-100 disabled:opacity-60'

type PasswordInputProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  minLength?: number
  label: string
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete,
  disabled = false,
  minLength,
  label,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-dw-text">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          minLength={minLength}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          disabled={disabled}
          aria-label={isVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
          className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-dw-muted hover:text-dw-text disabled:opacity-60"
        >
          {isVisible ? 'Gizle' : 'Göster'}
        </button>
      </div>
    </div>
  )
}
