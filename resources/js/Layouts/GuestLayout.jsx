import { Link } from '@inertiajs/react';
import { BrainCircuit } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-bg-main text-ui-heading relative overflow-hidden font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 w-full h-96 bg-accent-blue/5 rounded-full blur-[150px] -translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 mb-8 flex flex-col items-center">
                <Link href="/" className="flex items-center gap-2">
                    <BrainCircuit className="text-black w-10 h-10" />
                    <span className="text-3xl font-bold tracking-wide text-ui-black">Nexus<span className="opacity-50">AI</span></span>
                </Link>
                <p className="text-sm text-ui-muted mt-2 tracking-wider uppercase font-medium">Enterprise R&D Platform</p>
            </div>

            <div className="relative z-10 mt-6 w-full overflow-hidden bg-white border border-ui-border px-8 py-10 shadow-[0_4px_30px_rgba(0,0,0,0.08)] sm:max-w-md sm:rounded-3xl">
                {children}
            </div>
        </div>
    );
}
