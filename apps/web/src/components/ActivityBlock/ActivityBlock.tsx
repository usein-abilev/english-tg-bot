import React, { FC } from "react";
import styled from "styled-components";
import Button from "../Button/Button";

const ActivityContainer = styled.div`
    background: var(--app-activity-bg-blue);
    padding: 12px 16px;
    border-radius: 18px;
    user-select: none;

    &[data-type="promote"] {
        background: var(--app-activity-bg-green);
    }

    .activity-header {
        font-family: var(--app-font-family);
        font-style: normal;

        .activity-title {
            color: var(--app-title-text-color);
            font-weight: 500;
            font-size: 20px;
            line-height: 23px;
        }

        .activity-description {
            margin-top: 4px;
            font-weight: 400;
            font-size: 13px;
            line-height: 19px;
            color: color-mix(in srgb, #fff 65%, transparent);
        }
    }

    .activity-footer {
        margin-top: 12px;
    }
`;

export interface ActivityBlockProps {
    type: "action" | "promote";
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
}

const ActivityBlock: FC<ActivityBlockProps> = ({ type, title, description, ...props }) => {
    const hasFooter = !!props.buttonText;

    return (
        <ActivityContainer data-type={type}>
            <div className="activity-header">
                <div className="activity-title">{title}</div>
                <div className="activity-description">{description}</div>
            </div>
            {hasFooter && (
                <div className="activity-footer">
                    <Button
                        style={{ width: "100%" }}
                        size="s"
                        mode="white"
                        onClick={props.onClick}
                        className="activity-button"
                    >
                        {props.buttonText}
                    </Button>
                </div>
            )}
        </ActivityContainer>
    );
};

export default ActivityBlock;
