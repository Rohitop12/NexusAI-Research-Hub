import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
        <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-accent-yellow">
                    {status}
                </div>
            )}

            {/* Google OAuth Button */}
            <a
                id="google-login-btn"
                href="/auth/google"
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-ui-border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md mb-6"
            >
                <GoogleIcon />
                Continue with Google
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-ui-border"></div>
                <span className="text-xs text-ui-muted font-medium">or sign in with email</span>
                <div className="flex-1 h-px bg-ui-border"></div>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-ui-muted">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-8 flex flex-col items-center justify-end gap-4">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Log in
                    </PrimaryButton>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-ui-muted underline hover:text-ui-black transition-colors focus:outline-none"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                {/* Divider */}
                <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-ui-border"></div>
                    <span className="text-xs text-ui-muted font-medium">Don't have an account?</span>
                    <div className="flex-1 h-px bg-ui-border"></div>
                </div>

                {/* Register Button */}
                <Link
                    href={route('register')}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2.5 rounded-xl border border-ui-border text-sm font-semibold text-ui-black hover:bg-ui-border/50 transition-colors"
                >
                    Create an Account
                </Link>
            </form>
        </GuestLayout>
    );
}
