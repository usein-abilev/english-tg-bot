import { Button } from "@telegram-apps/telegram-ui";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ErrorRecoveryScreenStyled = styled.div`
    background: var(--tg-theme-bg-color);
    font-family: var(--tgui--font-family);
    font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 28px;
    box-sizing: border-box;

    .inner-block {
        max-width: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 28px;
        text-align: center;
    }
`;

function ErrorRecoveryScreen() {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate(0);
    };

    return (
        <ErrorRecoveryScreenStyled>
            <div className="inner-block">
                <p>Something went wrong. Please try again.</p>
                <Button onClick={handleRetry}>Retry</Button>
            </div>
        </ErrorRecoveryScreenStyled>
    );
}

export default ErrorRecoveryScreen;
