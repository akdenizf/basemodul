export function StorySeam() {
  return (
    <div className="relative h-14 overflow-hidden bg-paper" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#E1E0D7]" />
      <div className="relative mx-auto flex h-full w-fit items-center justify-center bg-paper px-5">
        <span className="h-2 w-2 rounded-full bg-[#D8843F] ring-4 ring-[#F7F5EF]" />
      </div>
    </div>
  );
}
