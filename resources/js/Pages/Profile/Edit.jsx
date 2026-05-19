import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { LogOut } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <DashboardLayout>
            <Head title="Profile" />

            <div className="max-w-3xl mx-auto w-full pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-ui-heading">Profile Settings</h1>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="px-4 py-2 flex items-center gap-2 border border-ui-border text-ui-muted hover:border-red-200 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" /> Log Out
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-ui-border rounded-2xl p-8 shadow-sm">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white border border-ui-border rounded-2xl p-8 shadow-sm">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white border border-ui-border rounded-2xl p-8 shadow-sm">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
