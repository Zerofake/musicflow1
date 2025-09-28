"use client";

import React, { useEffect, useRef } from 'react';

const AdsterraBanner: React.FC = () => {
    const bannerRef = useRef<HTMLDivElement>(null);
    const scriptInjected = useRef(false);

    useEffect(() => {
        if (bannerRef.current && !scriptInjected.current) {
            const configScript = document.createElement('script');
            configScript.type = 'text/javascript';
            configScript.innerHTML = `
                atOptions = {
                    'key' : 'd82c6bcd60640ad7af73a03a2b4bc2b0',
                    'format' : 'iframe',
                    'height' : 60,
                    'width' : 468,
                    'params' : {}
                };
            `;
            bannerRef.current.appendChild(configScript);

            const invokeScript = document.createElement('script');
            invokeScript.type = 'text/javascript';
            invokeScript.src = '//www.highperformanceformat.com/d82c6bcd60640ad7af73a03a2b4bc2b0/invoke.js';
            bannerRef.current.appendChild(invokeScript);

            scriptInjected.current = true;
        }

    }, []);

    return <div ref={bannerRef} className="my-4 flex justify-center"></div>;
};

export default AdsterraBanner;
