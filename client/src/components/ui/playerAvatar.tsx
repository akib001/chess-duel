import React from 'react'
import { PieceTypes, PlayerTypes } from '../../../utils/enums'
import { PIECE_IMAGES } from '../../../utils/constants';

interface PlayerAvatarProps {
    playerType: PlayerTypes;
};

const PlayerAvatar : React.FC<PlayerAvatarProps> = ({playerType}) => {
    const bgGradient = playerType === PlayerTypes.WHITE ? 'bg-gradient-to-t from-stone-500 to-stone-700' : 'bg-gradient-to-r from-neutral-300 to-stone-400';
    const imageUrl = playerType === PlayerTypes.WHITE ? PIECE_IMAGES[PieceTypes.WHITE_PAWN] : PIECE_IMAGES[PieceTypes.BLACK_PAWN];

    return (
        <img className={`w-10 h-10 ${bgGradient}`} src={imageUrl} alt='Player image' />
    )
}

export default PlayerAvatar