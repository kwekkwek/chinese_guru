import styles from './WordCard.module.css';

interface Word {
    character: string;
    pinyin: string;
    meaning: string;
}

interface WordCardProps {
    word: Word;
    showDetails: boolean;
}

export default function WordCard({ word, showDetails }: WordCardProps) {
    const playAudio = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word.character);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.7; // slower speech rate for practice
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.character}>{word.character}</div>
            <div className={`${styles.details} ${showDetails ? styles.visible : ''}`}>
                <div
                    className={styles.pinyin}
                    onClick={playAudio}
                    title="Click to listen"
                >
                    {word.pinyin}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.speakerIcon}>
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                </div>
                <div className={styles.meaning}>{word.meaning}</div>
            </div>
        </div>
    );
}
