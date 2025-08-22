import { HeartHandshake ,  OctagonX} from 'lucide-react';


const ActionButtons = ({onConnect,onSkip}) => {
  return (
    <div className='px-5 pt-5 flex gap-4 justify center text-white'>
        <button onClick={onSkip} className='bg-red-500 hover:bg-red-600 px-8 py-3 cursor-pointer flex items-center gap-2 rounded-2xl transition-easeOut duration-300'>
            < OctagonX/>Skip
        </button>
        <button onClick={onConnect} className='bg-green-500 hover:bg-green-600 px-8 py-3 cursor-pointer flex items-center gap-2 rounded-2xl transition-easeOut duration-300'>
            <HeartHandshake/>Connect
        </button>
    </div>
  )
}

export default ActionButtons;