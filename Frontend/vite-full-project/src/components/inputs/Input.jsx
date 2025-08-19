import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div>
            <label className="text-[13px] text-slate-800">{label}</label>
            <div className="input-box">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    placeholder={placeholder}
                    onChange={e => onChange(e)}
                    className='w-full background-transparent outline-none'
                />
                {type === 'password' && (
                    <>
                        {
                            showPassword
                                ? <FaRegEyeSlash
                                    size={22}
                                    className='text-violet-500 cursor-pointer'
                                    onClick={toggleShowPassword}
                                />
                                : <FaRegEye
                                    size={22}
                                    className='text-slate-500 cursor-pointer'
                                    onClick={toggleShowPassword}
                                />
                        }
                    </>
                )}
            </div>
        </div>
    )
}

export default Input;
