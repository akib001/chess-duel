import React from 'react'
import Board from './board'

const ChessGame = () => {
  return (
    <div className="w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-[1100px] 2xl:max-w-[1300px] mx-auto px-4">
      <Board />
    </div>
  )
}

export default ChessGame