import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../useAppDispatch';
import { login } from '../../api/auth';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginForm {
    email: string;
    password: string;
}

export const useLogin = () => {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await login({ ...form });

            if (res) {
                dispatch(setCredentials(res));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        form,
        handleChange,
        handleLogin,
    };
};

