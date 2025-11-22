'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import WordCard from '@/components/WordCard';
import AudioController from '@/components/AudioController';
import styles from './page.module.css';
import hskWords from '@/data/hsk_words.json';

function PracticeContent() {
    const searchParams = useSearchParams();
    const level = Number(searchParams.get('level')) || 1;

    const [words, setWords] = useState<typeof hskWords>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    useEffect(() => {
        const filtered = hskWords.filter(w => w.level === level);
        setWords(filtered);
        setCurrentIndex(0);
        setShowDetails(false);
        setIsCorrect(false);
    }, [level]);

    const handleResult = (correct: boolean) => {
        if (correct) {
            setIsCorrect(true);
            setShowDetails(true);
        }
    };

    const nextWord = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowDetails(false);
            setIsCorrect(false);
        } else {
            alert("Level Completed! Returning to start.");
            setCurrentIndex(0);
        }
    };

    if (words.length === 0) {
        return (
            <main className={styles.main}>
                <div className="glass-panel p-8">Loading words for Level {level}...</div>
            </main>
        );
    }

    const currentWord = words[currentIndex];

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    ← Back to Levels
                </Link>
                <div className={styles.progress}>
                    Level {level} • Word {currentIndex + 1} / {words.length}
                </div>
            </div>

            <div className={`glass-panel ${styles.container} fade-in`}>
                <WordCard word={currentWord} showDetails={showDetails} />

                <AudioController
                    targetText={currentWord.character}
                    onResult={handleResult}
                />

                <div className={styles.controls}>
                    <button
                        className={`btn ${styles.revealBtn}`}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>

                    <button
                        className={`btn ${styles.nextBtn}`}
                        onClick={nextWord}
                        disabled={!isCorrect}
                    >
                        Next Word →
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function Practice() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            <PracticeContent />
        </Suspense>
    );
}
