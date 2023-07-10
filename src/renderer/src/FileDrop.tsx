import { BiDownArrowCircle } from 'react-icons/bi'
import { AiFillSetting } from 'react-icons/ai'
import { TranscribeTexts } from './types'

const FileDrop = (props: {
    setPage: React.Dispatch<React.SetStateAction<string>>,
    subtitles: TranscribeTexts[],
    setSubtitles: React.Dispatch<React.SetStateAction<TranscribeTexts[]>>
}) => {
    console.log('aaa')

    const chooseFile = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        const files = e.dataTransfer.files
        console.log(files)

        //@ts-ignore
        const file_path = files[0].path
        const response = await fetch('http://localhost:10001/transcribe/', {
            method: 'POST',
            body: JSON.stringify({ path: file_path, device: 'cuda' }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log(response)

        if (response.body == null) { return }

        const reader = response.body.getReader()

        const processStream = async () => {
            props.setSubtitles([])
            props.setPage('SubtitleEdit')

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    break
                }
                // valueはUint8Array型のデータ
                const chunk = new TextDecoder().decode(value)
                // chunkを適切な方法で処理する
                console.log(chunk)
                console.log(props.subtitles)
                props.setSubtitles((prevSubtitles) => [...prevSubtitles, ...JSON.parse('[' + chunk.replace(/^,|,$/g, '') + ']')])
            }
            console.log('end')
        }

        processStream()
    }

    return (
        <div style={{ boxSizing: 'border-box', height: '100vh', backgroundColor: '#e4e6f0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                verticalAlign: 'center',
                backgroundColor: '#ffffff',
                boxShadow: '#cbcbcb84 0px 8px 30px',
                padding: '0px 45px 0px 45px'
            }}
            >
                <div style={{ width: 100 }}></div>

                <h1 style={{ marginBottom: 15 }}>
                    Aviutl Subtitles Creator
                </h1>

                <button style={{
                    width: 100,
                    height: 40,
                    border: 'none',
                    borderRadius: 5,
                    padding: '10px 10px',
                    fontFamily: 'BIZ UDPGothic',
                    fontSize: 37,
                    background: 'none',
                    color: '#2d2d2d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <AiFillSetting />
                </button>


            </div>

            <div style={{ padding: '20px 95px', height: '70%', textAlign: 'center', lineHeight: '0.7rem' }}>
                <div style={{ height: '15%', fontFamily: 'BIZ UDPGothic', fontSize: 16 }}>
                    <p>mp4ファイルをAIが音声解析し、AVIUTLの字幕作成作業をサポートするアプリです。</p>
                </div>

                <div style={{ height: '35%', border: 'dashed 1px #66666a', backgroundColor: '#c0c1cd', borderRadius: 20 }}>
                    <div
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onDrop={chooseFile}
                        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <BiDownArrowCircle size={35} />
                        <p style={{ textAlign: 'center', fontFamily: 'BIZ UDPGothic', fontSize: 16, color: '#494949', marginLeft: 10 }}>mp4ファイルをドラッグ＆ドロップ</p>
                    </div>
                </div>

                <div style={{ height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button style={{
                        width: 500,
                        height: 70,
                        border: 'none',
                        borderRadius: 15,
                        padding: '10px 10px',
                        fontFamily: 'BIZ UDPGothic',
                        fontSize: 18,
                        backgroundColor: '#0037ff',
                        color: '#fff',
                        boxShadow: '#0942e084 0px 8px 30px',
                    }}>
                        またはファイルを選択
                    </button>
                </div>

            </div>

        </div >
    )
}

export default FileDrop
