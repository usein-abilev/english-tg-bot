import React, { FC } from "react";
import styled from "styled-components";

const CenterInfoStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .info-block {
        font-family: var(--tgui--font-family);
        font-size: var(--tgui--subtitle--font_size);
        line-height: var(--tgui--subtitle--line_height);
        color: var(--tgui--subtitle_text_color);
    }
`;

interface CenterInfoProps {
    children?: React.ReactNode;
    text?: string;
}

const CenterInfoFallback: FC<CenterInfoProps> = ({ children, text }) => {
    if (!children && !text) return null;
    return (
        <CenterInfoStyled>
            <div className="info-block">{children ? children : text}</div>
        </CenterInfoStyled>
    );
};

export default CenterInfoFallback;
