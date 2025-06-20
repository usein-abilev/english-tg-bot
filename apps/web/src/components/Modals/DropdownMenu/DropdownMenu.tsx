import { useState, useRef, useEffect, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

const DropdownWrapper = styled.div`
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 1000;

    .DropdownMenu-menu {
        z-index: 100;
        position: absolute;
        background: var(--app-deck-bg-color);
        color: var(--app-title-text-color);
        border-radius: 12px;
        overflow: hidden;

        min-width: 200px;
    }

    .DropdownMenu-item {
        user-select: none;
        padding: 12px 18px;
        border-bottom: 1px solid var(--app-section-text-color);
        cursor: pointer;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background: var(--app-secondary-bg-color);
        }
    }
`;

interface DropdownMenuProps {
    buttonRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const DropdownMenu: FC<DropdownMenuProps> = ({ buttonRef, isOpen, onClose, children }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (buttonRef.current && isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuWidth = menuRef.current?.clientWidth || -0;
            const menuHeight = menuRef.current?.clientHeight || -0;
            let left = rect.left;
            let top = rect.bottom;

            if (left + menuWidth > window.innerWidth) {
                left = window.innerWidth - menuWidth - 10;
            }

            if (top + menuHeight > window.innerHeight) {
                top = rect.top + window.scrollY - menuHeight - 5;
            }

            setPosition({
                top,
                left,
            });
        }
    }, [isOpen, buttonRef, menuRef]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: any) => {
            onClose();
        };

        const handleScroll = () => {
            onClose();
        };

        document.addEventListener("mouseup", handleClickOutside);
        document.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
            document.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen, onClose, buttonRef]);

    return (
        <AnimatePresence>
            {isOpen && (
                <DropdownWrapper className="DropdownMenu-wrapper">
                    <motion.div
                        ref={menuRef}
                        className="DropdownMenu-menu"
                        initial={{ opacity: 0, scale: 0.85, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{ top: position.top, left: position.left, zIndex: 100 }}
                    >
                        {children}
                    </motion.div>
                </DropdownWrapper>
            )}
        </AnimatePresence>
    );
};

export default DropdownMenu;
