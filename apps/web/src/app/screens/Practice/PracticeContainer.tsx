import styled from "styled-components";

const PracticeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;

    font-family: var(--app-font-family);

    header {
        width: 100%;
        text-align: center;

        .title {
            font-size: 24px;
            line-height: 27px;
            font-weight: 500;
        }

        .progress {
            margin-top: 12px;

            .progress-description {
                margin-top: 4px;
                font-style: normal;
                font-weight: 600;
                font-size: 16px;
                line-height: 19px;
                color: #96a0aa;
            }
        }

        margin-bottom: 24px;
    }

    .vote-caption {
        margin-top: 12px;
        font-size: 16px;
        line-height: 18px;
        text-align: center;
        color: var(--app-subtitle-text-color);
    }

    .card-controls {
        margin-top: 16px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 12px;

        button {
            width: 100%;
        }
    }
`;

export default PracticeContainer;
