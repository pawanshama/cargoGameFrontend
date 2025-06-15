import React from 'react';

interface RadioProps {
  label: string;
  name: string;
  id: string;
  selectedId: string;
  onChange: (selectedId: string) => void;
}

const DynamicRadio: React.FC<RadioProps> = ({ label, name, id, selectedId, onChange }) => {
  const handleChange = () => {
    onChange(id);
  };

  return (
    <label htmlFor={id} className="relative flex items-center gap-1 cursor-pointer">
      <span className={`w-4 h-4 rounded-full border border-secondary shadow-[0px_2px_6px_0px_rgba(0,0,0,0.55)_inset] flex items-center justify-center`}>
        {selectedId === id ? <span className={`w-2 h-2 bg-primary rounded-full`}></span> : ''}
      </span>
      <input
        type="radio"
        name={name}
        id={id}
        className="opacity-0 absolute top-0 left-0 h-full w-full"
        checked={selectedId === id}
        onChange={handleChange}
      />
      <p className="textSmall text-white">{label}</p>
    </label>
  );
};

export default DynamicRadio;