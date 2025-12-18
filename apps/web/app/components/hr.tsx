type Props = {
  text?: string;
};

export function Hr({ text }: Props) {
  return (
    <div className="flex flex-row items-center justify-center gap-2 my-4 text-[8px] text-center">
      {text ? (
        <>
          <span className="flex h-[1px] w-[20px] bg-[currentColor]/20 opacity-[.5]" />
          <span className="uppercase text-[currentColor]/25">{text}</span>
          <span className="flex h-[1px] w-[20px] bg-[currentColor]/20 opacity-[.5]" />
        </>
      ) : (
        <span className="flex h-[1px] w-[40px] bg-[currentColor]/20 opacity-[.5]" />
      )}
    </div>
  );
}
