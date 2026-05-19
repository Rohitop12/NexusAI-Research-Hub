export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl bg-ui-black px-4 py-3 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-gray-900 focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-ui-black focus:ring-offset-2 active:bg-black ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
