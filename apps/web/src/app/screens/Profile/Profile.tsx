import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";
import { createUserQuery } from "../../../features/api/user";
import { Avatar } from "@telegram-apps/telegram-ui";
import Section from "../../../components/Section/Section";
import SectionEmptyContent from "../../../components/Section/SectionEmptyContent";
import Button from "../../../components/Button/Button";

const ProfileContainer = styled.div`
    padding: var(--app-screen-padding);

    .profile-header {
        display: flex;
        gap: 8px;

        position: relative;

        .profile-info {
            display: flex;
            flex-direction: column;
            gap: 2px;

            .user-name {
                font-size: 20px;
                line-height: 24px;
                font-weight: 500;
                color: var(--app-title-text-color);
            }

            .user-level {
                font-size: 14px;
                line-height: 16px;
                color: var(--app-subtitle-text-color);
            }

            .user-interests {
                margin-top: 12px;

                display: flex;
                align-items: flex-end;
                gap: 6px;

                .interest-block {
                    padding: 3px 6px;

                    background: var(--app-secondary-bg-color);
                    border-radius: 20px;

                    font-weight: 400;
                    font-size: 13px;
                    line-height: 16px;
                }
            }
        }

        .profile-joined {
            position: absolute;
            top: 0;
            right: 0;
            text-align: right;
            font-size: 13px;
            line-height: 24px;
            color: var(--app-secondary-text-color);
        }
    }

    .profile-content {
        margin-top: 24px;
    }
`;

function Profile() {
    const { data } = useSuspenseQuery(createUserQuery());
    const user = data?.user;

    if (!user) {
        return <ProfileContainer>Loading...</ProfileContainer>;
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim();

    return (
        <ProfileContainer>
            <header className="profile-header">
                <Avatar src={user.photoUrl} size={96} />
                <div className="profile-info">
                    <div className="user-name">{fullName}</div>
                    <div className="user-level">no level</div>
                    <div className="user-interests">
                        <div className="interest-block">lang</div>
                        <div className="interest-block">dev</div>
                        <div className="interest-block">business</div>
                    </div>
                </div>
                <div className="profile-joined">
                    Joined: {new Date(user.createdAt).toLocaleDateString("uk")}
                </div>
            </header>
            <main className="profile-content">
                <Section>
                    <SectionEmptyContent>
                        <div>This content is not available in your country</div>
                        <div>Please leave your country and try again.</div>
                    </SectionEmptyContent>
                </Section>
            </main>
        </ProfileContainer>
    );
}

export default Profile;
