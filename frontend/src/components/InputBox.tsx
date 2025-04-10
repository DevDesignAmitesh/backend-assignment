interface InputBoxProps {
  label?: string;
  placeholder: string;
  value?: string | File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  type?: string;
  isAuth?: boolean;
}

const InputBox = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  isAuth,
}: InputBoxProps) => {
  const isFile = type === "file";

  return (
    <div
      className={`${
        !isAuth ? "w-full" : "md:w-[80%] w-[90%]"
      } flex flex-col gap-2 justify-center items-start`}
    >
      {label && <p>{label}</p>}
      <input
        type={type}
        accept="image/png, image/jpeg"
        required
        placeholder={placeholder}
        onChange={onChange}
        className="rounded-md border-2 p-2 border-gray-400 w-full"
        {...(!isFile && { value: typeof value === "string" ? value : "" })}
      />
    </div>
  );
};

export default InputBox;
