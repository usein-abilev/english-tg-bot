const MAX_GRADE = 4;
const ONE_MINUTE = 60_000;

const calcFactor = (grade: number, easinessFactor: number) => {
    const clamped = MAX_GRADE - Math.max(0, Math.min(MAX_GRADE, grade));
    return easinessFactor + (0.1 - clamped * (0.08 + clamped * 0.02));
};

/**
 * Calculate the next interval, repetitions, and easiness factor for SuperMemo 2.
 * This is a spaced repetition algorithm.
 *
 * @param grade The user's grade for the card. It should be between 0 and 4 (`MAX_GRADE`).
 * @param repetitions The number of times the user has reviewed the card.
 * @param prevInterval The previous interval for the card.
 * @param easinessFactor The easiness factor for the card.
 * @returns The new interval, repetitions, and easiness factor.
 */
const calcSuperMemo2 = (
    grade: number,
    repetitions: number,
    prevInterval: number,
    easinessFactor: number,
) => {
    let factor = calcFactor(grade, easinessFactor);
    let interval: number;
    if (grade < 2) {
        repetitions = 0;
        interval = ONE_MINUTE * 5;
    } else {
        if (repetitions === 0) {
            interval = ONE_MINUTE * 10;
        } else if (repetitions === 1) {
            interval = ONE_MINUTE * 60 * 24;
        } else {
            interval = Math.round(prevInterval * factor);
        }
    }

    factor = Math.max(1.3, factor);
    return { easinessFactor: factor, interval, repetitions };
};

export default calcSuperMemo2;
