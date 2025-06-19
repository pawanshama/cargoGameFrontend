import React from 'react';

interface RadioProps {
  label: string;
  name: string;
  id: string;
  selectedId: string;
  onChange: (selectedId: string) => void;
}

const DynamicRadio: React.FC<RadioProps> = ({ label, name, id, selectedId, onChange }) => {
  const isSelected = selectedId === id;

  const handleChange = () => {
    onChange(id);
  };

  return (
    <label
      htmlFor={id}
      onClick={handleChange}
      className={`relative flex items-center gap-1 cursor-pointer px-2 py-[0.25rem] rounded-full transition-all duration-200 
        ${isSelected
          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md scale-[1.02]"
          : "bg-white/10 text-white/70 hover:bg-white/20"}
      `}
    >
      <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center transition-colors 
        ${isSelected ? "border-white bg-white" : "border-white/50"}`}>
        {isSelected && <div className="w-[6px] h-[6px] bg-purple-700 rounded-full" />}
      </div>

      <input
        type="radio"
        name={name}
        id={id}
        className="opacity-0 absolute inset-0"
        checked={isSelected}
        onChange={handleChange}
      />

      <span className="text-xs font-medium">{label}</span>
    </label>
  );
};

export default DynamicRadio;
