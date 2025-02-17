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

    .card {
        width: 100%;
        height: 80%;
        perspective: 1000px;
        cursor: pointer;
    }

    .card-inner {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        transform-style: preserve-3d;
    }

    .flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;

        backface-visibility: hidden;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 22px;
        line-height: 24px;
        min-height: 120px;
        box-sizing: border-box;
        white-space: pre-wrap;
        border-radius: 12px;
        color: var(--app-title-text-color);
        background: var(--app-card-bg-color);
    }

    .card-front {
        padding: 24px;
    }

    .card-back {
        font-size: 18px;
        line-height: 21px;
        color: var(--app-subtitle-text-color);
        transform: rotateY(180deg);

        position: relative;
        padding: 12px 16px;

        .definition-header {
            position: absolute;
            right: 16px;
            top: 12px;

            display: flex;
            justify-content: flex-end;
            gap: 12px;

            .header-icon {
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
                background: var(--app-secondary-button-color);
            }
        }

        .definition-content {
            position: absolute;
            top: 0;
            padding-top: 12px;
            box-sizing: border-box;

            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &.scrollable {
                overflow-y: auto;
            }
        }
    }

    .center-text {
        text-align: center;
    }

    .vote-caption {
        margin-top: 32px;
        font-size: 16px;
        line-height: 18px;
        text-align: center;
        color: var(--tgui--secondary_hint_color);
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
