import React from "react";
import styled from "styled-components";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import { SegmentedControl } from "@telegram-apps/telegram-ui";
import { SegmentedControlItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/SegmentedControl/components/SegmentedControlItem/SegmentedControlItem";

const LibraryContainer = styled.div`
    padding: var(--app-screen-padding);
`;

interface LibraryProps {}

function Library(props: LibraryProps) {
    const [selectedTab, setSelectedTab] = React.useState<"my" | "favorite">("my");

    return (
        <LibraryContainer>
            <SegmentedControl>
                <SegmentedControlItem selected={selectedTab === "my"} onClick={() => setSelectedTab("my")}>
                    My Decks
                </SegmentedControlItem>
                <SegmentedControlItem
                    selected={selectedTab === "favorite"}
                    onClick={() => setSelectedTab("favorite")}
                >
                    Favorite
                </SegmentedControlItem>
            </SegmentedControl>

            <SectionEmptyContent style={{ marginTop: "12px" }}>
                Library not implemented yet
            </SectionEmptyContent>
        </LibraryContainer>
    );
}

export default Library;
