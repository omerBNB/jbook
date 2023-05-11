import { useRef, useState, useEffect } from 'react'
import React from 'react'
import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from '../plugins/unpackage-path-plugin'

export const CodeInputIndex: React.FC = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  const ref = useRef<any>()
  
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    })
  }

  useEffect(() => {
    startService()
    return () => {}
  }, [])

  const sendCode = async () => {
    if(!ref.current){
        return
    }
    
    const res = await ref.current.build({
        entryPoints:['index.js'],
        bundle: true,
        write: false,
        plugins:[unpkgPathPlugin()]
    })
       
    setCode(res)
  }

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={sendCode}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}
