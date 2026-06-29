import { useEffect, useRef } from 'react';

export function useConsoleMessage() {
    const hasFired = useRef(false);

    useEffect(() => {
        if (hasFired.current) return;
        hasFired.current = true;

        // console.clear();

        const asciiArt = `
 _   _      _ _       _
| | | | ___| | | ___ | |
| |_| |/ _ \\ | |/ _ \\| |
|  _  |  __/ | | (_) |_|
|_| |_|\\___|_|_|\\___/(_)
        `;

        console.log(
            `%c${asciiArt}\n%cWelcome to my portfolio! \n\n%cLooking under the hood? I built this site using %cLaravel, Inertia, and React%c.\n\nCheck out the source code: %chttps://github.com/joounii/portfolio`,
            "color: #b9b5ff; font-weight: bold; font-family: monospace;",
            "color: #dc7edc; font-size: 16px; font-weight: bold;",
            "color: #bb73ff; font-size: 14px;",
            "color: #ff2d20; font-weight: bold;",
            "color: #bb73ff; font-size: 14px;",
            "color: #2563eb; text-decoration: underline; font-size: 14px;"
        );
    }, []);
}
