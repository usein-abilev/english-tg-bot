import { Button as TelegramButton, ButtonProps } from "@telegram-apps/telegram-ui";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

const ButtonStyled = styled(TelegramButton)`
    & > * {
        width: auto;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &[disabled] {
        pointer-events: none;
    }
`;

interface CustomButtonProps extends ButtonProps {
    elementRef?: React.Ref<HTMLDivElement>;
}

function Button({ elementRef, ...props }: CustomButtonProps) {
    const style = useMemo(() => {
        if (!props.mode) {
            return {
                background: "var(--app-primary-button-color)",
            };
        }
        if (props.mode === "bezeled") {
            return {
                background: "var(--app-secondary-button-color)",
                color: "var(--app-secondary-button-text-color)",
            };
        }
        return {};
    }, [props.mode]);

    return (
        <ButtonStyled {...props} ref={elementRef} style={{ ...style, ...props.style }}>
            {props.children}
        </ButtonStyled>
    );
}

export default Button;
