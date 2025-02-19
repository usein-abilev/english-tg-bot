import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CardSchema } from "../../../../features/types/deck.types";
import styled from "styled-components";
import CardFlipper from "../../../../components/Card/CardFlipper";
import Button from "../../../../components/Button/Button";

const Container = styled.div`
    padding: var(--app-screen-padding);
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;

    .card-view {
        width: 100%;
        min-height: 80%;
    }
`;

function DeckCardReview() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as CardSchema;
    return (
        <Container>
            <div className="card-view">
                <CardFlipper card={state} />
                <Button mode="filled" style={{ width: "100%" }} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
        </Container>
    );
}

export default DeckCardReview;
