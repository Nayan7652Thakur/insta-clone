import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => { // Renamed to loginHandler for clarity
        e.preventDefault();

        // Log input data to check
        console.log('Input Data:', input);

        // Simple validation to ensure inputs are not empty
        if (!input.email || !input.password) { // Removed userName check
            toast.error('Please fill out all fields');
            return;
        }

        try {
            setLoading(true)
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

                navigate('/')

                toast.success(data.message);

                setInput({
                    email: '',
                    password: ''
                });

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>
                        LOGO
                    </h1>
                    <p className='text-sm text-center'>Login to see photos & videos from friends</p>
                </div>

                <div>
                    <span className='font-medium'>
                        Email
                    </span>
                    <Input type='email' className='focus-visible:ring-transparent my-2' onChange={changeEventHandler} name='email' />
                </div>

                <div>
                    <span className='font-medium'>
                        Password
                    </span>
                    <Input type='password' className='focus-visible:ring-transparent my-2' onChange={changeEventHandler} name='password' />
                </div>

                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Checking email & password
                        </Button>
                    ) : (
                        <Button>Login</Button>
                    )
                }

                <span className='text-center'>Don't have an account?
                    <Link className='text-blue-600' to='/signup'> Signup</Link> {/* Updated link text */}
                </span>
            </form>
        </div>
    );
};

export default Login;
