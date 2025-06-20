import React, { FC } from "react";
import styled from "styled-components";

const SectionContainer = styled.div`
    position: relative;
`;

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const Section: FC<SectionProps> = ({ children, ...props }) => {
    return <SectionContainer {...props}>{children}</SectionContainer>;
};

export default Section;
