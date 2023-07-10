import { useState } from 'react'
import FileDrop from './FileDrop'
import SubtitleEdit from './SubtitleEdit'
import { TranscribeTexts } from './types'

const App = () => {
  const [page, setPage] = useState('')
  const [subtitles, setSubtitles] = useState<TranscribeTexts[]>([])

  return (
    <div style={{ boxSizing: 'border-box', height: '100vh', backgroundColor: '#e4e6f0' }}>
      {
        (
          () => {
            switch (page) {
              case 'FileDrop':
                return <FileDrop setPage={setPage} subtitles={subtitles} setSubtitles={setSubtitles} />
              case 'SubtitleEdit':
                return <SubtitleEdit setPage={setPage} subtitles={subtitles} setSubtitles={setSubtitles} />
              default:
                return <FileDrop setPage={setPage} subtitles={subtitles} setSubtitles={setSubtitles} />
            }
          }
        )()
      }

    </div >
  )
}

export default App
