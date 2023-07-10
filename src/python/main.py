from dataclasses import dataclass
import json
import os
import sys
from typing import AsyncGenerator
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
from faster_whisper import WhisperModel
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class TranscribeArgs(BaseModel):
    path: str
    device: str = 'cuda'

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


async def streaming_json(generator: AsyncGenerator[dict, None]):
    first = True
    async for item in generator:
        if not first:
            yield ','
        yield json.dumps(item, ensure_ascii=False)
        first = False

@app.post('/transcribe/')
async def whisper_transcribe(args: TranscribeArgs):
    segments_generator = transcribe_segments(args)
    return StreamingResponse(streaming_json(segments_generator), media_type='application/json')
    
async def transcribe_segments(args: TranscribeArgs) -> AsyncGenerator[dict, None]:
    model_size = "large-v2"
    model = WhisperModel(model_size, device=args.device, compute_type="float32")
    segments, info = model.transcribe(args.path, beam_size=5, language='ja', word_timestamps=True)

    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

    # f = open('transcribe.txt', 'w', encoding='shift_jis')

    for segment in segments:
        print(f'[{round(segment.start, 2)} -> {round(segment.end, 2)}] {segment.text}')
        words = list(map(lambda w: {'start': w.start, 'end': w.end, 'word': w.word}, segment.words)) #type: ignore
        transcribe_obj = {'start': segment.start, 'end': segment.end, 'words': words}
        transcribe_json = transcribe_obj
        # print(transcribe_json)
        yield transcribe_json
        # f.write(f'[{round(segment.start, 2)} -> {round(segment.end, 2)}] {segment.text}\n')


if __name__ == '__main__':
    uvicorn.run('main:app', port=10001, reload=True)