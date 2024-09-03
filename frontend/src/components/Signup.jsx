import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        userName: '', // Use `userName` to match the backend
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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
            const res = await fetch('http://localhost:8000/api/v2/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(input) // Ensure this matches the backend's expected format
            });

            const data = await res.json();

            if (res.ok) {

                navigate("/")
                toast.success(data.message);

                setInput({
                    userName: '', // Use `userName` to match the backend
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
                    <p className='text-sm text-center'>Signup to see photos & videos from friends</p>
                </div>
                <div>
                    <span className='font-medium'>
                        Username
                    </span>
                    <Input type='text' className='focus-visible:ring-transparent my-2' onChange={changeEventHandler} name='userName' />
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
                            please wait...
                        </Button>
                    ) : (
                        <Button>Signup</Button>
                    )
                }



                <span className='text-center'>Already have an account?
                    <Link className='text-blue-600' to='/login'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;
