type Props = {
  w?: string | number;
  h?: string | number;
};

export function Spacer({ w, h, ...props }: Props) {
  return <div className="flex h-px w-px shrink-0" style={{ width: w, height: h }} {...props} />;
}
