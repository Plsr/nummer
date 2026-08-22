type PrimaryButtonProps = {
  children: React.ReactNode;
};

export function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <div className="flex bg-blue-500 rounded-lg transition-all group-active:translate-y-2 group-active:border-b-0 border-b border-blue-400 group-active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841] [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841] h-10 w-sm mx-auto flex-1 items-center justify-center px-4 text-sm font-medium text-background  hover:bg-blue-400 in-disabled:opacity-40">
      {props.children}
    </div>
  );
}
