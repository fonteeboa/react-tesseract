import Tesseract from 'tesseract.js';

export const processImage = async (file: File): Promise<string> => {
    const languages = [
        'eng', 'spa', 'fra', 'deu', 'ita', 'por', 'rus', 'jpn', 'chi_sim', 'chi_tra'
        // Add more languages as needed
    ];
    const worker = await Tesseract.createWorker(languages);
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    return text;
};
