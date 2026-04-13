export const TabindexExample02 = () => {
  return (
    <div className="my-10 flex flex-col items-start gap-y-4 rounded-lg border border-gray-200 p-4">
      <b>저를 한 번 클릭하고 Tab 키를 눌러 테스트 해보세요!</b>
      <button
        type="button"
        className="w-full rounded-md border border-blue-300 bg-blue-100 px-4 py-2 text-left text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
      >
        저는 button 태그 입니다. 대화형 콘텐츠라서 Focus 됩니다. tabindex="0"
      </button>
      <div
        id="test"
        className="w-full cursor-default rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-left text-gray-800"
      >
        저는 div 태그 입니다. 비 대화형 콘텐츠라서 Focus 되지 않아요.
      </div>
      <input
        tabIndex={-1}
        className="w-full rounded-md border border-green-300 bg-green-50 px-4 py-2 text-green-800 focus:outline-hidden focus:ring-2 focus:ring-green-500"
        placeholder={`저는 input 태그 입니다. 그러나 tabindex="-1" 로 지정되어 탐색되지 않습니다.`}
      />
      <textarea
        className="w-full cursor-pointer rounded-md border border-amber-300 bg-amber-100 px-4 py-2 text-left text-amber-800 hover:bg-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        placeholder={`저는 textarea 태그 입니다. 두 번째로 Focus 됩니다. tabindex="0"`}
      />
    </div>
  );
};
