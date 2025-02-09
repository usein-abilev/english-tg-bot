import React, { useMemo, useState } from "react";
import styled from "styled-components";
import fetchAPI from "../../../features/fetchAPI";
import { API_URL } from "../../../constants/config";

const Container = styled.div`
    /* max-width: 600px; */
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--app-bg-color);
    color: var(--app-text-color);
`;

const Input = styled.textarea`
    width: 100%;
    height: 80px;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    background: #eee;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const WordsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const WordBlock = styled.div`
    padding: 8px 12px;
    background: var(--app-secondary-bg-color);
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background: #ddd;
    }
`;

const Modal = styled.div`
    overflow: hidden;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--app-secondary-bg-color);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 300px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

export default function TestWordDefinition() {
    const [text, setText] = useState<string>("");
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [definition, setDefinition] = useState<any>([]);
    const phoneticAudio = useMemo(() => {
        if (!definition) return false;
        const [audioUrl] = definition
            .map((entry: any) => {
                if (entry.phonetics?.[0].audio) {
                    return entry.phonetics[0].audio;
                }
                return null;
            })
            .filter(Boolean);
        return audioUrl;
    }, [definition]);

    const words = text.split(/\s+/).filter(Boolean);
    const [cached, setCached] = useState<Record<string, any>>({});

    const fetchDefinition = async (word: string) => {
        try {
            word = word.replaceAll(/[,.]+/g, "").toLowerCase().trim();

            if (!cached[word]) {
                const response = await fetchAPI(`${API_URL}/dictionary/reveal?term=${word}`);
                const { data } = await response.json();
                setCached((prev) => ({ ...prev, [word]: data }));
                cached[word] = data;
                console.log("cache miss:", data);
            }

            const data = cached[word];
            setDefinition(data);
            setSelectedWord(word);
            if (phoneticAudio) {
                const audio = new Audio(phoneticAudio);
                audio.play();
            }
        } catch (error) {
            setDefinition([
                { word, meanings: [{ partOfSpeech: "", definitions: [{ definition: "Not found." }] }] },
            ]);
        }
    };

    return (
        <Container>
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Введите текст..." />
            <WordsContainer>
                {words.map((word, index) => (
                    <WordBlock key={index} onClick={() => fetchDefinition(word)}>
                        {word}
                    </WordBlock>
                ))}
            </WordsContainer>
            {/* {selectedWord && (
                <>
                    <Overlay onClick={() => setSelectedWord(null)} />
                    <Modal>
                        <div className="modal-header">
                            <h3>
                                {selectedWord} ({definition?.[0]?.phonetic})
                            </h3>
                            <button
                                onClick={() => {
                                    if (phoneticAudio) {
                                        const audio = new Audio(phoneticAudio);
                                        audio.play();
                                    }
                                }}
                            >
                                🔊
                            </button>
                        </div>

                        {definition?.map((entry, i) => (
                            <div key={i}>
                                {entry.meanings.map((meaning, j) => (
                                    <p key={j}>
                                        <strong>{meaning.partOfSpeech}</strong>:{" "}
                                        {meaning.definitions[0].definition}
                                    </p>
                                ))}
                            </div>
                        ))}
                        <button onClick={() => setSelectedWord(null)}>Закрыть</button>
                    </Modal>
                </>
            )} */}
        </Container>
    );
}
