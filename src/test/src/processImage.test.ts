import Tesseract from 'tesseract.js';
import { extractTextFromFile } from '../../services/ocrService';

jest.mock('tesseract.js');

describe('extractTextFromFile', () => {
  const mockRecognize = jest.fn();
  const mockTerminate = jest.fn();
  const mockCreateWorker = jest.fn().mockResolvedValue({
    recognize: mockRecognize,
    terminate: mockTerminate,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (Tesseract.createWorker as jest.Mock) = mockCreateWorker;
  });

  it('should process the image and return text', async () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const recognizedText = 'extracted text';
    mockRecognize.mockResolvedValue({ data: { text: recognizedText } });

    const result = await extractTextFromFile(file);

    expect(Tesseract.createWorker).toHaveBeenCalledWith([
      'eng', 'spa', 'fra', 'deu', 'ita', 'por', 'rus', 'jpn', 'chi_sim', 'chi_tra',
    ]);
    expect(mockRecognize).toHaveBeenCalledWith(file);
    expect(mockTerminate).toHaveBeenCalled();
    expect(result).toBe(recognizedText);
  });

});
