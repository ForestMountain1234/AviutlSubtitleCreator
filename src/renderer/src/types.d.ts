export type TranscribeTexts = {
    start: number;
    end: number;
    words: TranscribeWords[];
};

export type TranscribeWords = {
    start: number;
    end: number;
    word: string;
};
