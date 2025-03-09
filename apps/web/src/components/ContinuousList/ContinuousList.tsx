import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

interface ContinuousListProps extends React.HTMLAttributes<HTMLDivElement> {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

function ContinuousList({
    children,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    ...props
}: ContinuousListProps) {
    const observerRef = useRef(null);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                fetchNextPage();
            }
        });

        observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage]);

    return (
        <Container {...props}>
            {children}
            <div ref={observerRef} style={{ height: 1 }} />
        </Container>
    );
}

export default ContinuousList;
