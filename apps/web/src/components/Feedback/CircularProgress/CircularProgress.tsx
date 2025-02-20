import React, { FC } from "react";
import { CircularProgress as UICircularProgress } from "@telegram-apps/telegram-ui";
import styled from "styled-components";
import { getCircleAttributes } from "./getCircleAttributes";

const Container = styled.div`
    position: relative;
    display: inline-flex;
    max-width: min-content;
    max-height: min-content;

    .content {
        display: flex;
        justify-content: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 24px;
        font-weight: 500;
        color: var(--app-text-color);
    }
`;

interface CircularProgressProps extends React.ComponentProps<typeof UICircularProgress> {}

/**
 * Renders a circular progress indicator, useful for displaying loading states or progress metrics.
 * The component dynamically adjusts its size and stroke based on the provided `size` prop and visually represents
 * the `progress` prop as a percentage of the circle's circumference.
 */
export const CircularProgress = ({ size = "medium", progress = 0 }: CircularProgressProps) => {
    const circleAttributes = getCircleAttributes(size);
    if (!circleAttributes) {
        return null;
    }

    const circumference = 2 * Math.PI * circleAttributes.radius;
    const circleSize = circleAttributes.size / 2;

    return (
        <Container className="CircularProgress-container">
            <svg
                width={circleAttributes.size}
                height={circleAttributes.size}
                fill="none"
                stroke={progress >= 50 ? "var(--app-accent-green)" : "var(--app-accent-yellow)"}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx={circleSize}
                    cy={circleSize}
                    r={circleAttributes.radius}
                    strokeOpacity=".1"
                    strokeWidth={circleAttributes.strokeWidth}
                    fill="none"
                />
                <circle
                    fill="none"
                    cx={circleSize}
                    cy={circleSize}
                    r={circleAttributes.radius}
                    strokeWidth={circleAttributes.strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * ((100 - progress) / 100)}
                />
            </svg>
            <div className="content">{progress?.toFixed(0)}</div>
        </Container>
    );
};

export default CircularProgress;
