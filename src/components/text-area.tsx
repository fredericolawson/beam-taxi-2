'use client';
import { useState, useRef, useEffect } from 'react';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onBlur?: () => void;
}

const AutoResizeTextarea: React.FC<Props> = ({
  value: controlledValue,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  onBlur,
}) => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const currentValue = controlledValue ?? value;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [currentValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setValue(newValue);
    }
  };

  return (
    <textarea
      ref={ref}
      value={currentValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className="bg-muted/50 w-full resize-none overflow-hidden rounded border p-3 text-sm transition-all duration-200 ease-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      rows={2}
      onBlur={onBlur}
    />
  );
};

export default AutoResizeTextarea;
