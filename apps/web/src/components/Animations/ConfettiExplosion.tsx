import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import styled from "styled-components";

const COLORS = ["#ff4081", "#ffea00", "#536dfe", "#00e676", "#ff5722"];
const NUM_CONFETTI = 50;

type ConfettiPiece = {
    id: number;
    x: number;
    y: number;
    rotate: number;
    color: string;
};

const Container = styled.div`
    position: absolute;
    inset: 0;
    top: -5px;

    .piece {
        position: absolute;
        width: 10px;
        height: 5px;
        border-radius: 3px;
    }
`;

const EFFECT_DURATION_SEC = 2;

const ConfettiExplosion = () => {
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const newConfetti = Array.from({ length: NUM_CONFETTI }, (_, i) => ({
            id: i,
            x: Math.random() * 600,
            y: Math.random() * 600,
            rotate: Math.random() * 360,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));
        setConfetti(newConfetti);
        setTimeout(() => {
            setConfetti([]);
            setShow(false);
        }, EFFECT_DURATION_SEC * 1000);
    }, []);

    if (!show) {
        return null;
    }

    return (
        <Container>
            {confetti.map(({ id, x, y, rotate, color }) => (
                <motion.div
                    key={id}
                    className="piece"
                    style={{ backgroundColor: color }}
                    initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                    animate={{
                        opacity: 0,
                        x,
                        y,
                        rotate,
                    }}
                    transition={{
                        delay: 0,
                        duration: EFFECT_DURATION_SEC,
                        ease: "anticipate",
                    }}
                />
            ))}
        </Container>
    );
};

export default ConfettiExplosion;
