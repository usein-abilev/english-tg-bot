import React, { FC, useMemo } from "react";
import styled from "styled-components";
import Button from "../../../components/Button/Button";

interface PracticeSessionEndProps {
    results: number[];
}

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;

    .title {
        font-size: 24px;
        font-weight: 500;
        color: var(--app-title-text-color);
    }

    .results {
        font-size: 16px;
    }
    .footer {
        width: 100%;
        button {
            width: 100%;
        }
    }

    img#man-celebration {
        position: absolute;
        right: 0;
        bottom: -150px;
    }
`;

const PracticeSessionEnd: FC<PracticeSessionEndProps> = ({ results }) => {
    const stats = useMemo(() => {
        const total = results.length;

        let easy = 0,
            hard = 0,
            bad = 0;

        results.forEach((r) => {
            if (r === 2) easy++;
            if (r === 1) hard++;
            if (r < 1) bad++;
        });

        const easyPercent = (easy / total) * 100;
        const hardPercent = (hard / total) * 100;
        const badPercent = (bad / total) * 100;

        return {
            total,
            easy,
            easyPercent,
            hard,
            hardPercent,
            bad,
            badPercent,
        };
    }, [results]);

    return (
        <StyledContainer>
            <div className="title">Practice session ended 🎉</div>
            <div className="results">
                <div>Total cards: {stats.total}</div>
                <div id="easy-count">
                    Easy: {stats.easy} ({stats.easyPercent.toFixed(1)}%)
                </div>
                <div id="hard-count">
                    Hard: {stats.hard} ({stats.hardPercent.toFixed(1)}%)
                </div>
                <div id="bad-count">
                    Bad: {stats.bad} ({stats.badPercent.toFixed(1)}%)
                </div>
            </div>
            <div className="footer">
                <Button size="m">Share results</Button>
            </div>
            <img
                src="https://i.gifer.com/origin/0f/0fd379b81bc8023064986c9c45f22253_w200.gif"
                alt="celebration"
                id="man-celebration"
            />
        </StyledContainer>
    );
};

export default PracticeSessionEnd;
