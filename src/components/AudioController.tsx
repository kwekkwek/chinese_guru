'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './AudioController.module.css';

interface AudioControllerProps {
    targetText: string;
    onResult: (isCorrect: boolean) => void;
}

export default function AudioController({ targetText, onResult }: AudioControllerProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState<'idle' | 'listening' | 'correct' | 'incorrect' | 'permission-denied'>('idle');
    const [isSupported, setIsSupported] = useState(true);
    const [isSecure, setIsSecure] = useState(true);
    const recognitionRef = useRef<any>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsSecure(window.isSecureContext);
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                setIsSupported(false);
            }
        }
    }, []);

    // Reset feedback when target changes
    useEffect(() => {
        setFeedback('idle');
        setTranscript('');
        stopListening();
    }, [targetText]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopListening();
        };
    }, []);

    const startListening = () => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'zh-CN';
            recognition.continuous = false;
            recognition.interimResults = true; // Enable interim results for better feedback

            recognition.onstart = () => {
                setIsListening(true);
                setFeedback('listening');
                setTranscript('');

                // Set a timeout to stop recording if no speech is detected within 5 seconds
                if (silenceTimer.current) clearTimeout(silenceTimer.current);
                silenceTimer.current = setTimeout(() => {
                    console.log("No speech detected, stopping recording...");
                    stopListening();
                    setFeedback('idle');
                }, 5000);
            };

            recognition.onspeechstart = () => {
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                    silenceTimer.current = null;
                }
            };

            recognition.onspeechend = () => {
                recognition.stop();
            };

            recognition.onend = () => {
                setIsListening(false);
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                    silenceTimer.current = null;
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                    silenceTimer.current = null;
                }
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setFeedback('permission-denied');
                } else {
                    // Don't reset to idle if it was just a no-speech error, let the user try again
                    if (event.error !== 'no-speech') {
                        setFeedback('idle');
                    }
                }
            };

            recognition.onresult = (event: any) => {
                if (silenceTimer.current) {
                    clearTimeout(silenceTimer.current);
                    silenceTimer.current = null;
                }

                const last = event.results.length - 1;
                const result = event.results[last];
                const text = result[0].transcript;
                const isFinal = result.isFinal;

                setTranscript(text);

                if (isFinal) {
                    recognition.stop(); // Ensure we stop

                    const cleanText = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                    const cleanTarget = targetText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

                    if (cleanText.includes(cleanTarget)) {
                        setFeedback('correct');
                        onResult(true);
                    } else {
                        setFeedback('incorrect');
                        onResult(false);
                    }
                }
            };

            recognitionRef.current = recognition;
            recognition.start();

        } catch (error) {
            console.error("Failed to start recognition:", error);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort(); // abort() is often safer than stop() for immediate cleanup
            recognitionRef.current = null;
        }
        if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = null;
        }
        setIsListening(false);
    };

    const toggleListening = () => {
        if (!isSupported) return;

        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isSecure) {
        return (
            <div className={styles.error}>
                <strong>Security Restriction:</strong> Speech Recognition requires a secure connection (HTTPS).
                If you are testing on mobile via IP address, this feature is disabled by the browser.
                <br /><br />
                To fix this, deploy the app to Vercel or use a tunneling service like ngrok.
            </div>
        );
    }

    if (!isSupported) {
        return <div className={styles.error}>Your browser does not support Speech Recognition. Please use Chrome or Safari.</div>;
    }

    return (
        <div className={styles.container}>
            <button
                className={`${styles.micButton} ${isListening ? styles.listening : ''} ${feedback === 'correct' ? styles.btnCorrect : ''} ${feedback === 'incorrect' ? styles.btnIncorrect : ''}`}
                onClick={toggleListening}
                aria-label={isListening ? "Stop listening" : "Start listening"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.micIcon}>
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </button>

            <div className={styles.transcript}>
                {isListening ? (transcript ? <span className={styles.spoken}>{transcript}</span> : 'Listening...') : (transcript ? <span>You said: <span className={styles.spoken}>{transcript}</span></span> : 'Tap microphone to speak')}
            </div>

            {feedback === 'correct' && <div className={`${styles.feedback} ${styles.correct} fade-in`}>Correct! Excellent.</div>}
            {feedback === 'incorrect' && <div className={`${styles.feedback} ${styles.incorrect} fade-in`}>Try again.</div>}
            {feedback === 'permission-denied' && (
                <div className={`${styles.error} fade-in`}>
                    Microphone access denied. Please allow microphone access in your browser settings and refresh the page.
                </div>
            )}
        </div>
    );
}
