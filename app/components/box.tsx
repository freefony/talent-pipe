import { cn } from "~/libs/utils";

type BoxProps = React.HTMLAttributes<HTMLDivElement>;
export const Box = ({ children, className, ...props }: BoxProps) => {
    return <div className={cn('bg-white dark:bg-slate-800 p-6 rounded-lg', className)} {...props}>{children}</div>;
};