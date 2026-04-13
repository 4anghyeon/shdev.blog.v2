interface BookInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  imageurl: string;
  bookname: string;
}

export function BookInfo({ imageurl, bookname, children }: BookInfoProps) {
  return (
    <div className="my-4 flex items-center gap-x-4 rounded-lg border border-gray-300 bg-gray-100/50 p-4 dark:border-stone-700 dark:bg-stone-700 dark:text-gray-200">
      <img src={imageurl} alt={bookname} width={40} height={51.66} />
      {children}
    </div>
  );
}
