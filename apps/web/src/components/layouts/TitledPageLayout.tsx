import React from "react";
import styled from "styled-components";

const Container = styled.div`
    padding: var(--app-screen-padding);

    .page-title {
        font-size: 32px;
        font-weight: bold;
        color: var(--app-title-text-color);
        padding: 0 12px;
    }

    .page-content {
        margin-top: 12px;
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
