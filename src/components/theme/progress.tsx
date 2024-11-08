'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <ProgressBar
                height="1px"
                color="#64adff"
                options={{ showSpinner: false }}
                shallowRouting
                disableSameURL
            />
        </>
    );
};

export default ProgressBarProviders;
