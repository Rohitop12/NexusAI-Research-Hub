export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white/20 bg-[#0A0A0C] text-accent-blue shadow-sm focus:ring-accent-blue focus:ring-offset-[#15151A] ' +
                className
            }
        />
    );
}
