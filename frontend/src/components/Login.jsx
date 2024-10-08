import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();

        if (!input.email || !input.password) {
            toast.error('Please fill out all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('http://localhost:8000/api/v2/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(input)
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(setAuthUser(data.user));
                navigate('/');
                toast.success(data.message);
                setInput({
                    email: '',
                    password: ''
                });
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from friends</p>
                </div>

                <div>
                    <Label htmlFor='email' className='font-medium'>
                        Email
                    </Label>
                    <Input
                        id='email'
                        type='email'
                        name='email'
                        value={input.email}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent my-2'
                    />
                </div>

                <div>
                    <Label htmlFor='password' className='font-medium'>
                        Password
                    </Label>
                    <Input
                        id='password'
                        type='password'
                        name='password'
                        value={input.password}
                        onChange={changeEventHandler}
                        className='focus-visible:ring-transparent my-2'
                    />
                </div>

                {loading ? (
                    <Button disabled>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Checking email & password
                    </Button>
                ) : (
                    <Button type="submit">Login</Button>
                )}

                <span className='text-center'>
                    Don't have an account?
                    <Link className='text-blue-600' to='/signup'> Signup</Link>
                </span>
            </form>
        </div>
    );
};

export default Login;
