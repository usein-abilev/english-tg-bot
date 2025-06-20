import React from "react";

function SectionEmptyContent({
    children,
    ...props
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <div
                className="SectionEmptyContent-content"
                style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "var(--app-secondary-bg-color)",
                    color: "var(--app-section-text-color)",
                    borderRadius: "18px",
                    padding: "42px 0",
                    textAlign: "center",
                    fontSize: "16px",
                    lineHeight: "20px",
                    fontWeight: 400,
                    userSelect: "none",
                    fontFamily: "var(--app-font-family)",
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default SectionEmptyContent;
