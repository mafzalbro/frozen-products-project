const ThreeDotsSpinner = () => {
    return (
        <div className="inline-flex items-center justify-center text-2xl">
            <span className="animate-pulse duration-500 delay-300">.</span>
            <span className="animate-pulse duration-500 delay-700">.</span>
            <span className="animate-pulse duration-500 delay-1000">.</span>
        </div>
    );
}

export default ThreeDotsSpinner;
