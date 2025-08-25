import { HeartHandshake ,  OctagonX} from 'lucide-react';


const ActionButtons = ({onConnect,onSkip}) => {
  return (
  <div className="md:px-5 pt-5 flex gap-4 justify-center text-white">
  {/* Skip button */}
  <button
    onClick={onSkip}
    className="relative overflow-hidden bg-gradient-to-b from-red-700 to-red-700 hover:from-red-800 hover:to-red-600 text-red-300 hover:text-red-200 px-8 py-3 flex items-center gap-2 rounded-2xl shadow-lg shadow-red-900/50 transition-all duration-300"
  >
    {/* Glossy overlay */}

    <span className="relative flex items-center font-semibold gap-2 z-10 text-gray-50">
      <OctagonX /> Skip
    </span>
  </button>

  {/* Connect button */}
  <button
    onClick={onConnect}
    className="relative overflow-hidden bg-gradient-to-b from-green-700 to-green-700 hover:from-green-800 hover:to-green-600 text-green-300 hover:text-green-200 px-8 py-3 flex items-center gap-2 rounded-2xl shadow-lg shadow-green-900/50 transition-all duration-300"
  >
    {/* Glossy overlay */}

    <span className="relative flex text-white items-center font-semibold gap-2 z-10 text-gray-50">
      <HeartHandshake /> Connect
    </span>
  </button>
</div>

  )
}

export default ActionButtons;