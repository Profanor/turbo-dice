import { motion } from 'framer-motion';

type RecentResultsDisplayProps = {
  recentResults: number[];
};

const RecentResultsDisplay: React.FC<RecentResultsDisplayProps> = ({ recentResults }) => {
  return (
    <div className="flex items-center space-x-4 overflow-x-auto">
      {recentResults.length > 0 ? (
        recentResults.map((res, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="px-3 py-1 rounded-full bg-gray-700 text-yellow-400 font-bold"
          >
            {res}
          </motion.div>
        ))
      ) : (
        <span className="text-gray-400 text-sm italic">No recent rolls yet...</span>
      )}
    </div>
  );
};

export default RecentResultsDisplay;
