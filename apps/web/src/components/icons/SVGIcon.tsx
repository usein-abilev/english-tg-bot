/* eslint-disable max-len */
import React, { FC } from "react";

const icons = {
    cards: {
        width: 12,
        height: 12,
        element: (
            <symbol fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1.6.5h5.124a1.1 1.1 0 0 1 1.1 1.1v.964H5.357a1.1 1.1 0 0 0-1.1 1.1v5.754H1.6a1.1 1.1 0 0 1-1.1-1.1V1.6A1.1 1.1 0 0 1 1.6.5Z"
                    stroke="var(--app-accent-blue)"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.5 3.682V10.4a1.1 1.1 0 0 1-1.1 1.1H5.276a1.1 1.1 0 0 1-1.1-1.1V3.682a1.1 1.1 0 0 1 1.1-1.1H10.4a1.1 1.1 0 0 1 1.1 1.1Z"
                    stroke="var(--app-accent-blue)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        ),
    },
    "completed-cards": {
        width: 12,
        height: 12,
        element: (
            <symbol fill="none" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.45 6A5.45 5.45 0 1 1 .55 6a5.45 5.45 0 0 1 10.9 0Z"
                    stroke="var(--app-accent-green)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8.75 4.5 5.25 8l-2-2"
                    stroke="var(--app-accent-green)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        ),
    },
    "remind-cards": {
        width: 9,
        height: 12,
        element: (
            <symbol fill="none" viewBox="0 0 9 12" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.85 4.2a3.905 3.905 0 0 1-.903 2.514c-.457.556-.897 1.3-.897 2.156V10c0 .8-.65 1.45-1.45 1.45h-.8c-.8 0-1.45-.65-1.45-1.45V8.87c0-.856-.44-1.6-.897-2.156A3.905 3.905 0 0 1 .55 4.2C.55 2.104 2.104.55 4.2.55S7.85 2.104 7.85 4.2ZM2.4 9.3H6M2.7 5.4h3M4.2 5.4v3.9"
                    stroke="#DCC83C"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        ),
    },
    "three-dots": {
        width: 20,
        height: 5,
        element: (
            <symbol viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3 5C1.62151 5 0.5 3.87841 0.5 2.49983C0.5 1.12159 1.62147 0 3 0C4.37853 0 5.5 1.12155 5.5 2.49983C5.5 3.87841 4.37849 5 3 5Z"
                    fill="#F5F5F5"
                />
                <path
                    d="M10 5C8.62151 5 7.5 3.87845 7.5 2.49983C7.5 1.12159 8.62147 0 10 0C11.3785 0 12.5 1.12155 12.5 2.49983C12.5 3.87841 11.3785 5 10 5Z"
                    fill="#F5F5F5"
                />
                <path
                    d="M17 5C15.6215 5 14.5 3.87845 14.5 2.49983C14.5 1.12159 15.6215 0 17 0C18.3785 0 19.5 1.12155 19.5 2.49983C19.5 3.87841 18.3785 5 17 5Z"
                    fill="#F5F5F5"
                />
            </symbol>
        ),
    },
    "plus-circle": {
        width: 40,
        height: 40,
        element: (
            <symbol
                width="40"
                height="40"
                viewBox="0 0 40 40"
                stroke="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M19.9995 40C30.9212 40 39.9996 30.9411 39.9996 20C39.9996 9.0784 30.9016 0 19.9799 0C9.03875 0 -0.000350952 9.0784 -0.000350952 20C-0.000350952 30.9411 9.05845 40 19.9995 40ZM19.9407 29.7647C18.8427 29.7647 18.2545 28.9607 18.2545 27.8235V21.7255H11.8231C10.6662 21.7255 9.86235 21.1176 9.86235 20.0392C9.86235 18.9215 10.6073 18.2941 11.8231 18.2941H18.2545V11.8039C18.2545 10.6666 18.8427 9.8628 19.9407 9.8628C21.0387 9.8628 21.7054 10.6274 21.7054 11.8039V18.2941H28.1564C29.3524 18.2941 30.0975 18.9215 30.0975 20.0392C30.0975 21.1176 29.3132 21.7255 28.1564 21.7255H21.7054V27.8235C21.7054 29 21.0387 29.7647 19.9407 29.7647Z"
                    fill="#F0F0F0"
                    stroke="none"
                />
            </symbol>
        ),
    },
    "plus-line": {
        width: 18,
        height: 19,
        element: (
            <symbol viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M1.5 9.5H16.5M9 2V17"
                    stroke="#F5F5F5"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        ),
    },
    "play-line": {
        width: 20,
        height: 21,
        element: (
            <symbol viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16.5892 9.06311L16.7086 8.84349L16.5892 9.06312C17.7481 9.69328 17.7481 11.3079 16.5892 11.938L16.7086 12.1577L16.5892 11.938L5.9125 17.7439L6.03193 17.9636L5.9125 17.7439C4.75092 18.3756 3.375 17.5377 3.375 16.3065V4.69465C3.375 3.46343 4.75092 2.6255 5.9125 3.25716L16.5892 9.06311ZM6.74852 19.2814L6.62909 19.0617L6.74852 19.2814L17.4252 13.4754C19.8027 12.1825 19.8027 8.81862 17.4252 7.5257L17.3057 7.74532L17.4252 7.52569L6.74852 1.71977C4.47581 0.483874 1.625 2.07401 1.625 4.69465V16.3065C1.625 18.9271 4.47582 20.5172 6.74852 19.2814Z"
                    fill="#F5F5F5"
                    stroke="#F5F5F5"
                    strokeWidth="0.5"
                />
            </symbol>
        ),
    },
    translate: {
        width: 16,
        height: 16,
        element: (
            <symbol width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.207 8.103 5.98 3.807M7.68 8.117l-1.7-4.31M7.114 6.673H4.797M10.877 8.46h2.24M11.893 8.46c0 1.447-1.763 3.837-3.53 4.203"
                    stroke="#96A0AA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M9.31 10.93c.71.8 1.87 1.58 2.94 1.733M8.843 1.833H3.046c-.67 0-1.213.543-1.213 1.214v5.796c0 .67.543 1.214 1.213 1.214h5.797c.67 0 1.213-.544 1.213-1.214V3.047c0-.67-.543-1.214-1.213-1.214Z"
                    stroke="#96A0AA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M5.943 10.057v2.896c0 .667.547 1.214 1.214 1.214h5.793c.667 0 1.213-.547 1.213-1.214V7.157c0-.667-.546-1.214-1.213-1.214h-2.897"
                    stroke="#96A0AA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </symbol>
        ),
    },
};

export function SVGIconRoot() {
    return (
        <svg style={{ display: "none" }}>
            {Object.entries(icons).map(([id, icon]) => React.cloneElement(icon.element, { key: id, id }))}
        </svg>
    );
}

interface SVGIconProps {
    id: keyof typeof icons;
}

const SVGIcon: FC<SVGIconProps> = ({ id, ...props }) => {
    const { width, height } = icons[id];
    return (
        <svg {...props} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <use href={`#${id}`} />
        </svg>
    );
};

export default SVGIcon;
