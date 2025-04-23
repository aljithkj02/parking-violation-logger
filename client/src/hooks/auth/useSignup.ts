import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthMode } from '../../utils/types';
import { useAppDispatch } from '../useAppDispatch';
import { signup } from '../../api/auth';
import { setCredentials } from '../../store/slices/authSlice';

interface SignupForm {
    name: string;
    email: string;
    password: string;
}

export const useSignup = () => {
    const [authMode, setAuthMode] = useState<AuthMode>('user');
    const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '' });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const role = authMode === 'admin' ? 'ADMIN' : 'USER';
            const res = await signup({ ...form, role });

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
        handleSubmit,
        setAuthMode
    };
};

