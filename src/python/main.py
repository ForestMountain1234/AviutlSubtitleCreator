from dataclasses import dataclass
import os
import sys

import ffmpeg
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder

class VideoPath(BaseModel):
    file_path: str


@dataclass
class TranscribeText:
    from_ms: float
    to_ms: float
    text: str


app = FastAPI()
output_path = f'{os.getcwd()}/temp.mp4'  # 出力先のファイルパスを指定

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.exception_handler(RequestValidationError)
async def handler(request:Request, exc:RequestValidationError):
    print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

def receive_signal(signalNumber, frame):
    print('Received:', signalNumber)
    sys.exit()


@app.on_event("startup")
async def startup_event():
    import signal
    signal.signal(signal.SIGINT, receive_signal)

@app.get('/')
def home():
    return {'hello': 'world'}

@app.post('/choose-video/')
async def mp4_transcribe(video_path: VideoPath):
    file_path = video_path.file_path
    base_name = os.path.splitext(output_path)[0]
    stream = ffmpeg.input(file_path) 
    stream = ffmpeg.output(stream, base_name + '.mp3') 
    ffmpeg.run(stream, overwrite_output=True)
    result = whisper_transcribe()

    return result


@app.get('/transcribe/')
def whisper_transcribe(device: str = 'cuda'):
    model_size = "large-v2"
    base_name = os.path.splitext(output_path)[0]

    model = WhisperModel(model_size, device=device, compute_type="float32")

    segments, info = model.transcribe(base_name + '.mp3', beam_size=5, language='ja')

    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

    # f = open('transcribe.txt', 'w', encoding='shift_jis')
    transcribe_list: list[TranscribeText] = []

    for segment in segments:
        print(f'[{round(segment.start, 2)} -> {round(segment.end, 2)}] {segment.text}')
        transcribe_list.append(TranscribeText(segment.start, segment.end, segment.text))
        # f.write(f'[{round(segment.start, 2)} -> {round(segment.end, 2)}] {segment.text}\n')

    # f.close()
    return jsonable_encoder(transcribe_list)
    

if __name__ == '__main__':
    uvicorn.run('main:app', port=10001, reload=True)