import { CSSProperties } from 'react';
import { BsFillBackspaceFill } from 'react-icons/bs'
import { MdContentCopy } from 'react-icons/md'
import { TranscribeTexts } from './types';

const SubtitleEdit = (props: {
    setPage: React.Dispatch<React.SetStateAction<string>>,
    subtitles: TranscribeTexts[],
    setSubtitles: React.Dispatch<React.SetStateAction<TranscribeTexts[]>>
}) => {
    const card: CSSProperties = {
        width: '90%',
        height: '93%',
        margin: '0px 5% 0px 5%',
        padding: '15px 0px',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        overflowY: 'auto',
        lineHeight: '1rem'
    }

    console.log(props.subtitles)

    return (
        <div style={{ boxSizing: 'border-box', height: '100vh', backgroundColor: '#e4e6f0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                verticalAlign: 'center',
                backgroundColor: '#ffffff',
                boxShadow: '#cbcbcb84 0px 8px 30px',
                padding: '0px 45px 0px 45px',
                height: '60px'
            }}
            >
                <button style={{
                    width: 100,
                    height: 40,
                    border: 'none',
                    borderRadius: 5,
                    padding: '10px 10px',
                    fontFamily: 'BIZ UDPGothic',
                    fontSize: 20,
                    background: 'none',
                    color: '#2d2d2d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    onClick={() => { props.setPage('FileDrop') }}
                >
                    <BsFillBackspaceFill />
                    <span style={{ fontSize: 14, marginLeft: 15 }}>戻る</span>
                </button>

                <h3 style={{ marginBottom: 15, fontFamily: 'BIZ UDPGothic' }}>
                    解析結果
                </h3>

                <div style={{ width: 100 }}></div>

            </div>

            <div style={{ height: 'calc(100% - 120px)', padding: '25px 0px' }}>
                <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            margin: '5px 0px 5px 20px',
                            width: 80,
                            fontSize: 15, fontFamily: 'BIZ UDPGothic'
                        }}>
                            コピー
                        </div>
                        <p style={{ margin: '5px 20px', fontSize: 15, width: 400, fontFamily: 'BIZ UDPGothic', padding: '8px 15px' }}>
                            テキスト
                        </p>

                        <div style={{ margin: '5px 20px', width: 120, fontSize: 15, fontFamily: 'BIZ UDPGothic' }}>
                            時刻
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #aaa', height: 15 }}></div>

                    {props.subtitles.map((s) => {
                        return (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button style={{
                                    margin: '5px 0px 5px 20px',
                                    width: 80,
                                    height: 30,
                                    border: 'none',
                                    borderRadius: 15,
                                    padding: '8px 0px',
                                    fontFamily: 'BIZ UDPGothic',
                                    fontSize: 16,
                                    backgroundColor: '#0037ff',
                                    color: '#fff',
                                    boxShadow: '#0942e084 0px 8px 30px',
                                }}
                                    onClick={() => {
                                        const words = s.words.map((w) => {
                                            return w.word
                                        })
                                        if (navigator.clipboard) {
                                            navigator.clipboard.writeText(words.join(''))
                                        }
                                    }}
                                >
                                    <MdContentCopy />
                                </button>
                                <p style={{ margin: '5px 20px', fontSize: 15, width: 400, fontFamily: 'BIZ UDPGothic', backgroundColor: '#f0f0f0', padding: '8px 15px', borderRadius: 30 }}>{
                                    s.words.map((w) => {
                                        return w.word
                                    })
                                }
                                </p>

                                <div style={{ margin: '5px 20px', width: 120, fontSize: 10, fontFamily: 'BIZ UDPGothic' }}>
                                    [{('000' + s.start.toFixed(2)).slice(-7)}-{('000' + s.end.toFixed(2)).slice(-7)}]
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div >
    )
}

export default SubtitleEdit 
