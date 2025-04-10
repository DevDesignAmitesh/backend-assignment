interface ToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ isActive, onToggle }: ToggleProps) => {
  return (
    <div
      onClick={onToggle}
      className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          isActive ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default ToggleSwitch;
