import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(resolve, time, value));
}

// 친구 목록 API 시뮬레이션
function mockFriendsAPI(responseTime: number): Promise<Friend[]> {
  return delay(responseTime, [
    { id: 1, name: "철수", avatar: "👨" },
    { id: 2, name: "영희", avatar: "👩" },
    { id: 3, name: "민수", avatar: "👨‍💻" },
    { id: 4, name: "지은", avatar: "👩‍🎨" },
    { id: 5, name: "호영", avatar: "👨‍🚀" },
    { id: 6, name: "서진", avatar: "👩‍⚕️" },
  ]);
}

export const PromiseRaceRenderingQuiz = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [containerMinHeight, setContainerMinHeight] = useState<
    number | undefined
  >(undefined);
  const friendsListRef = useRef<HTMLDivElement>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);

  const downToUpVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: (friends.length - 1 - i) * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const waitAnimation = () => {
    return new Promise((res) => {
      loadingSpinnerRef.current?.addEventListener("animationiteration", () => {
        res(true);
      });
    });
  };

  const loadFriends = async (simulatedDelay: number): Promise<void> => {
    setFriends([]);
    setIsLoading(false);

    const apiCall: Promise<Friend[]> = mockFriendsAPI(simulatedDelay);

    const response = await Promise.race([apiCall, delay(100, "slow" as const)]);

    if (response !== "slow") {
      setFriends(response);
    } else {
      setIsLoading(true);
      const result: Friend[] = await apiCall;
      waitAnimation().then(() => {
        setIsLoading(false);
        setFriends(result);
      });
    }
  };

  useEffect(() => {
    // container 높이 유지
    if (friends.length > 0 && friendsListRef.current) {
      setContainerMinHeight(friendsListRef.current.clientHeight);
    }
  }, [friends]);

  return (
    <div className="mx-auto my-5 max-w-md rounded-lg border border-gray-200 bg-white p-6">
      <span className="mb-6 text-center font-bold text-xl">친구 목록</span>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <motion.button
          onClick={() => loadFriends(50)}
          className="rounded bg-yellow-400 px-4 py-2 text-white transition-colors hover:bg-yellow-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          친구 목록 보기
          <div className="text-xs opacity-75">(빠른 응답)</div>
        </motion.button>
        <motion.button
          onClick={() => loadFriends(300)}
          className="hover:red-500 rounded bg-red-400 px-4 py-2 text-white transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          친구 목록 보기
          <div className="text-xs opacity-75">(느린 응답)</div>
        </motion.button>
      </div>

      <div
        className="space-y-3"
        ref={friendsListRef}
        style={{
          minHeight: containerMinHeight ? `${containerMinHeight}px` : undefined,
        }}
      >
        {isLoading && (
          <motion.div
            className="py-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={loadingSpinnerRef}
          >
            <div className="inline-flex items-center">
              <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              <span className="text-blue-600">친구 목록 불러오는 중...</span>
            </div>
          </motion.div>
        )}
        {friends.map((friend: Friend, index: number) => (
          <motion.div
            key={friend.id}
            className="flex items-center gap-x-3 rounded-lg border bg-gray-50 p-3"
            custom={index}
            variants={downToUpVariants}
            initial="hidden"
            animate="visible"
          >
            <span>{friend.avatar}</span>
            <span>{friend.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
