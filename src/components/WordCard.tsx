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
    return (
        <div className={`glass-panel ${styles.card}`}>
            <div className={styles.character}>{word.character}</div>
            <div className={`${styles.details} ${showDetails ? styles.visible : ''}`}>
                <div className={styles.pinyin}>{word.pinyin}</div>
                <div className={styles.meaning}>{word.meaning}</div>
            </div>
        </div>
    );
}
