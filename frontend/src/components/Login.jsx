import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false)


    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e) => {
        e.preventDefault();

        // Log input data to check
        console.log('Input Data:', input);

        // Simple validation to ensure inputs are not empty
        if (!input.userName || !input.email || !input.password) {
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
                body: JSON.stringify(input) // Ensure this matches the backend's expected format
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);

                setInput({
                    email: '',
                    password: ''
                })

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8'>
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

                <Button>Login</Button>
            </form>
        </div>
    );
};

export default Login;
