import React, { FC } from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
    padding: 0 16px;
`;

interface SectionProps {
    children?: React.ReactNode;
}

const Section: FC<SectionProps> = ({ children, ...props }) => {
    return <SectionContainer {...props}>{children}</SectionContainer>;
};

export default Section;
