const SIZES = {
    large: {
        size: 72,
        strokeWidth: 6,
        radius: 32,
    },
    medium: {
        size: 54,
        strokeWidth: 5,
        radius: 24,
    },
    small: {
        size: 28,
        strokeWidth: 3,
        radius: 10,
    },
};

export const getCircleAttributes = (size: "small" | "medium" | "large") => {
    return SIZES[size];
};
