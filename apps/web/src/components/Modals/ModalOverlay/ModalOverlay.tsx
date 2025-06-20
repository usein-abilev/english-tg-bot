import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import SVGIcon from "../../SVGIcon/SVGIcon";

const ModalOverlayStyled = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(0, 0, 0, 0.5);

    .modal-content {
        position: relative;

        width: 100%;
        height: 100vh;
        max-width: 480px;
        box-sizing: border-box;

        background: var(--app-bg-color);
        padding: 24px;

        .close-button {
            position: absolute;
            top: 24px;
            right: 24px;
            cursor: pointer;

            color: var(--app-subtitle-text-color);

            :active {
                color: var(--app-secondary-text-color);
            }
        }
    }
`;

interface ModalOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onClose: () => void;
}

function ModalOverlay({ children, open, onClose, ...props }: ModalOverlayProps) {
    return (
        <AnimatePresence>
            {open && (
                <ModalOverlayStyled
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="modal-overlay"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ x: "100vw" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100vw" }}
                        transition={{
                            ease: "anticipate",
                            duration: 0.3,
                        }}
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="close-button" onClick={onClose}>
                            <SVGIcon id="close" />
                        </div>
                        {children}
                    </motion.div>
                </ModalOverlayStyled>
            )}
        </AnimatePresence>
    );
}

export default ModalOverlay;
