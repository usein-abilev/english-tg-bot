// import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div``;

function MainLayout({ children }: { children: React.ReactNode }) {
    // // useSuspenseQuery to throw error for test
    // const { data, error } = useSuspenseQuery({
    //     queryKey: ["test"],
    //     queryFn: async () => {
    //         throw new Error("test error");
    //     },
    // });

    return <StyledContainer>{children}</StyledContainer>;
}

export default MainLayout;
