import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMode } from '../../utils/types';
import { useAppDispatch } from '../useAppDispatch';
import { login } from '../../api/auth';
import { setCredentials } from '../../store/slices/authSlice';

interface LoginForm {
    email: string;
    password: string;
}

export const useLogin = () => {
    const [authMode, setAuthMode] = useState<AuthMode>('user');
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const role = authMode === 'admin' ? 'ADMIN' : 'USER';
            const res = await login({ ...form, role });

            if (res) {
                dispatch(setCredentials(res));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return {
        authMode,
        form,
        handleChange,
        handleLogin,
        setAuthMode
    };
};

