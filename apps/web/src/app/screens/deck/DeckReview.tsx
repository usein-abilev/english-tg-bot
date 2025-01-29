import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

function DeckReview() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    if (!location.state || !id) {
        return <div>Invalid deck</div>;
    }
    console.log("Location", id, location.state);

    return <div>{id}</div>;
}

export default DeckReview;
