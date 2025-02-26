import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { List } from "@telegram-apps/telegram-ui";
import { useQuery } from "@tanstack/react-query";
import { createUserQuery } from "../../features/api/user";
import { replaceRouteParams, ROUTES } from "../../constants/routes";
import { DeckListBlock } from "../../components/Deck";
import { DeckSchema } from "../../features/types/deck.types";
import SectionHeader from "../../components/Section/SectionHeader";
import ActivityBlock, { ActivityBlockProps } from "../../components/ActivityBlock/ActivityBlock";
import Section from "../../components/Section/Section";
import SectionEmptyContent from "../../components/Section/SectionEmptyContent";

const ListStyled = styled(List)`
    padding: var(--app-screen-padding);

    .home-header {
        .greeting-title {
            padding: 0 12px;
            font-size: 32px;
            line-height: 35px;
            font-weight: 500;
            color: var(--app-title-text-color);
        }

        .activity-list {
            margin-top: 12px;

            display: flex;
            flex-direction: column;
            gap: 12px;
        }
    }
`;

/**
 * MiniApp Main Screen
 */
export default function Home() {
    const navigate = useNavigate();
    const { data: userResult } = useQuery(createUserQuery());

    const openPractice = useCallback(() => {
        navigate(ROUTES.PRACTICE);
    }, [navigate]);

    const activities: ActivityBlockProps[] = useMemo(() => {
        if (!userResult) return [];

        const { practiceCounters } = userResult;
        if (practiceCounters.cardsToPracticeCount > 0) {
            if (practiceCounters.cardsToReviewCount === 0) {
                return [
                    {
                        type: "action",
                        title: "🧠 Test Your Memory!",
                        description: `New ${practiceCounters.cardsToLearnCount} flashcards are ready for you. See how many you can recall!`,
                        buttonText: "Start",
                        onClick: openPractice,
                    },
                ];
            }
            return [
                {
                    type: "action",
                    title: "🎓 Time to Practice!",
                    description: `You have ${practiceCounters.cardsToPracticeCount} words waiting for review. Sharpen your memory now!`,
                    buttonText: "Practice",
                    onClick: openPractice,
                },
            ];
        } else {
            return [
                {
                    type: "promote",
                    title: "🌟 Exclusive AI Training",
                    description: "Try our AI-powered tutor for a personalized learning experience!",
                    buttonText: "Try it out",
                    onClick: () => console.log("Start"),
                },
            ];
        }
    }, [userResult, openPractice]);

    const handleDeckClick = (deck: DeckSchema) => {
        navigate(replaceRouteParams(ROUTES.DECKS_REVIEW, { id: deck.id }), {
            state: { deck },
        });
    };

    return (
        <ListStyled>
            <header className="home-header">
                <div className="greeting-title">Hello, {userResult?.user.firstName}!</div>
                {!!activities.length && (
                    <div className="activity-list">
                        {activities.map((activity, index) => (
                            <ActivityBlock
                                key={index}
                                type={activity.type}
                                title={activity.title}
                                description={activity.description}
                                buttonText={activity.buttonText}
                                onClick={activity.onClick}
                            />
                        ))}
                    </div>
                )}
            </header>
            <Section>
                <SectionHeader title="My decks" onViewAllClick={() => navigate(ROUTES.LIBRARY)} />
                {userResult?.decks?.length ? (
                    <DeckListBlock decks={userResult.decks} onDeckClick={handleDeckClick} />
                ) : (
                    <SectionEmptyContent>No decks available</SectionEmptyContent>
                )}
            </Section>
            <Section>
                <SectionHeader title="For you" onViewAllClick={() => navigate(ROUTES.EXPLORE)} />
                <SectionEmptyContent>Not available yet</SectionEmptyContent>
            </Section>
            <Section>
                <SectionHeader title="Recent activity" onViewAllClick={() => {}} />
                <SectionEmptyContent>Not available yet</SectionEmptyContent>
            </Section>
        </ListStyled>
    );
}
