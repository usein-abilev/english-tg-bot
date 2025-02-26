import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ from, to, delay }: { from: number; to: number; delay?: number }) {
    const nodeRef = useRef<any>();

    useEffect(() => {
        const node = nodeRef.current!;

        const controls = animate(from, to, {
            duration: 1.5,
            delay: delay || 0,
            ease: "anticipate",
            onUpdate(value) {
                node.textContent = +value.toFixed(0);
            },
        });

        return () => controls.stop();
    }, [from, to, delay]);

    return <span ref={nodeRef}>{from}</span>;
}

export default Counter;
