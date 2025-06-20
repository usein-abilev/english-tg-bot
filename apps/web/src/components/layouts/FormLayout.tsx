import React, { FC } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    padding: 16px;

    .form-container {
        width: 100%;
        max-width: 380px;

        .form-header {
            font-weight: var(--tgui--font_weight--accent2);
            font-size: var(--tgui--title2--font_size);
            line-height: var(--tgui--title2--line_height);
            text-align: center;
            color: #eaeaea;
        }

        .form-content {
            margin-top: 28px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .form-footer {
            margin-top: 56px;
        }
    }
`;

interface FormProps {
    header: string | React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

const FormLayout: FC<FormProps> = (props) => {
    return (
        <Container>
            <div className="form-container">
                <div className="form-header">{props.header}</div>
                <div className="form-content">{props.children}</div>
                <div className="form-footer">{props.footer}</div>
            </div>
        </Container>
    );
};

export default FormLayout;
