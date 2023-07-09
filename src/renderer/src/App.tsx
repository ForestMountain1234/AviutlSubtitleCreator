import axios from 'axios'
import { CSSProperties } from 'react';
import { BiDownArrowCircle } from 'react-icons/bi'
import { GrNext } from 'react-icons/gr'

const App = () => {
  const card: CSSProperties = {
    width: '30%',
    height: '100%',
    margin: '0px 20px 0px 20px',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
  }

  const chooseFile = async (e) => {
    console.log('aaa')
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    console.log(files)

    //@ts-ignore
    const file_path = files[0].path
    const response = await axios.post('http://localhost:10001/choose-video/', { file_path })
    console.log(response);
  }

  const transcibe = async () => {
    const response = await axios.get('http://localhost:10001/transcribe/')
    console.log(response);
  }


  return (
    <div style={{ padding: '0px 45px 0px 45px', boxSizing: 'border-box', height: '100vh', backgroundColor: '#e4e6f0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center' }}>
        <h1 style={{ marginBottom: 5 }}>
          Aviutl Subtitles Creator
        </h1>
      </div>

      <div style={{ borderBottom: '1px solid #404040', marginBottom: 12 }}></div>

      <div style={{ padding: '20px 55px', height: '70%', textAlign: 'center' }}>
        <div style={{ height: '25%', border: 'dashed 1px #66666a', backgroundColor: '#c0c1cd', borderRadius: 20 }}>
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

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35%', marginTop: 30 }}>
          <div style={card}>
            <p style={{ textAlign: 'center', fontFamily: 'BIZ UDPGothic', fontSize: 13, color: '#494949', marginLeft: 10 }}>mp3に変換</p>
          </div>

          <GrNext size={30} />

          <div style={card} onClick={() => transcibe()}>
            <p style={{ textAlign: 'center', fontFamily: 'BIZ UDPGothic', fontSize: 13, color: '#494949', marginLeft: 10 }}>テキスト抽出(AI解析)</p>
          </div>

          <GrNext size={30} />

          <div style={card}>
            <p style={{ textAlign: 'center', fontFamily: 'BIZ UDPGothic', fontSize: 13, color: '#494949', marginLeft: 10 }}>Aviutl字幕ファイル生成</p>
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
            字幕を開く
          </button>
        </div>

      </div>

    </div >
  )
}

export default App
