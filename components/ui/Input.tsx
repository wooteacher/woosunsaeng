type InputProps = {
  name?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  name,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold outline-none transition focus:border-green-500 focus:bg-white"
    />
  );
}