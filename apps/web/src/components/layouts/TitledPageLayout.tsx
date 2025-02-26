import React from "react";
import styled from "styled-components";

const Container = styled.div`
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .page-title {
        font-size: 32px;
        font-weight: bold;
        color: var(--app-title-text-color);
        padding: 24px 16px 0 28px;
    }

    .page-content {
        overflow: hidden;
        box-sizing: border-box;
        height: 100%;
    }
`;

export interface TitledPageLayoutProps {
    title: string | React.ReactNode;
    children: React.ReactNode;
}

function TitledPageLayout({ title, children }: TitledPageLayoutProps) {
    return (
        <Container>
            <div className="page-title">{title}</div>
            <div className="page-content">{children}</div>
        </Container>
    );
}

export default TitledPageLayout;
