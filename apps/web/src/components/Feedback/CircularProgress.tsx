import React, { FC } from "react";
import { CircularProgress as UICircularProgress } from "@telegram-apps/telegram-ui";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    display: inline-flex;
    max-width: min-content;
    max-height: min-content;

    svg {
        stroke: red;
    }

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
    }
`;

interface CircularProgressProps extends React.ComponentProps<typeof UICircularProgress> {}

const CircularProgress: FC<CircularProgressProps> = (props) => {
    return (
        <Container className="CircularProgress-container">
            <UICircularProgress size={props.size} progress={props.progress} />
            <div className="content">{props.progress}</div>
        </Container>
    );
};

export default CircularProgress;
