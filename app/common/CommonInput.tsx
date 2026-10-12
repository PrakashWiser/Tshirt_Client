import React, { ChangeEvent } from "react";

interface InputFieldProps {
    type?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    showLabel?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
    required = false,
    showLabel = true,
}) => {
    return (
        <div>
            {showLabel && name && (
                <label className="block mb-1 text-gray-500 capitalize">
                    Enter your {name.replace(/([A-Z])/g, " $1")}
                </label>
            )}

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border border-gray-300 p-2 rounded focus:outline-none"
            />
        </div>
    );
};

export default InputField;