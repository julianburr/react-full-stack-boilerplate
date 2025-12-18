import { useState, type HTMLProps, type PropsWithChildren } from 'react';
import { Link, type To } from 'react-router';

import type { MouseEvent } from 'react';

import { Spinner } from '~/components/spinner';
import { cn } from '~/ui/lib/utils';

type BaseProps = {
  isLoading?: boolean;
  isActive?: boolean;
  variant?: 'primary' | 'grey' | 'ghost' | 'default' | 'blue' | 'pink';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
};

export type ButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'href' | 'type' | 'size' | 'onClick'> &
  BaseProps &
  PropsWithChildren<{
    onClick?: (e: MouseEvent) => any;
    isLoading?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>;

export type LinkProps = Omit<HTMLProps<HTMLAnchorElement>, 'href' | 'size' | 'onClick'> &
  BaseProps &
  PropsWithChildren<{
    onClick?: (e: MouseEvent) => any;
    to?: To;
  }>;

type Props = ButtonProps | LinkProps;

export function Button({
  children,
  isLoading: isLoadingProp,
  isActive,
  onClick,
  variant,
  size = 'md',
  icon,
  className,
  type,
  ...props
}: Props) {
  // Loading state + custom click handler to automatically handle async callbacks
  const [isLoadingState, setIsLoadingState] = useState(false);
  const handleClick = onClick
    ? async (e: MouseEvent) => {
        const res = onClick?.(e);
        if (res?.finally) {
          setIsLoadingState(true);
          res.finally(() => setIsLoadingState(false));
        }
      }
    : undefined;

  const isLoading = isLoadingProp ?? isLoadingState;
  const isIconOnly = !children && !!icon;

  // Prepare container classes shared between button and link variant
  const containerClasses =
    'relative w-auto flex flex-shrink-0 items-center justify-center overflow-hidden flex bg-[#333] rounded-sm h-[28px] px-[12px] text-sm data-[size=xs]:h-[18px] data-[size=xs]:px-[8px] data-[size=xs]:text-[10px] data-[size=sm]:px-[10px] data-[size=sm]:h-[24px] data-[size=sm]:px-[10px] data-[size=sm]:text-xs data-[size=lg]:h-[36px] data-[size=lg]:px-[16px] data-[size=xl]:h-[44px] data-[size=xl]:px-[20px] data-[size=xl]:text-base data-[variant=primary]:bg-[#333] data-[variant=primary]:text-[#fff] data-[variant=grey]:bg-[#333]/10 data-[variant=grey]:hover:bg-[#333]/16 data-[variant=grey]:data-[active=true]:bg-[#333]/16 data-[variant=grey]:focus:bg-[#333]/16  data-[variant=ghost]:bg-[#333]/0 data-[variant=ghost]:hover:bg-[#333]/10 data-[variant=ghost]:data-[active=true]:bg-[#333]/10 data-[variant=ghost]:focus:bg-[#333]/10 transition-all duration-120 data-[icon-only=true]:px-0 data-[icon-only=true]:w-auto data-[icon-only=true]:aspect-square data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-[.4]';

  // Prepare inner content
  const inner = (
    <>
      <span
        data-loading={isLoading}
        className="flex flex-row items-center w-full justify-center gap-[.3em] opacity-100 data-[loading=true]:opacity-0 transition-all duration-120"
      >
        {icon && <span className="[&>svg]:h-[1em] [&>svg]:w-[1em] [&>svg]:flex">{icon}</span>}
        {children && <span className="">{children}</span>}
      </span>
      <span
        data-loading={isLoading}
        className="absolute inset-0 flex items-center justify-center opacity-0 data-[loading=true]:opacity-100 transition-all duration-120"
      >
        <Spinner data-loading={isLoading} />
      </span>
    </>
  );

  // Href is in props = render as link
  if ('to' in props) {
    const { to, disabled, ...rest } = props as LinkProps;
    return (
      <Link
        to={to || '#'}
        onClick={handleClick}
        className={cn(containerClasses, className)}
        data-size={size}
        data-variant={variant}
        {...rest}
        data-disabled={isLoading || disabled}
        data-icon-only={isIconOnly}
        data-active={isActive}
        aria-selected={isActive}
      >
        {inner}
      </Link>
    );
  }

  // No href = render as button
  return (
    <button
      type={props.form ? 'submit' : (type as any) || 'button'}
      onClick={handleClick}
      className={cn(containerClasses, className)}
      data-size={size}
      data-variant={variant}
      {...(props as ButtonProps)}
      disabled={isLoading || props.disabled}
      data-disabled={props.disabled}
      data-icon-only={isIconOnly}
      data-active={isActive}
      aria-selected={isActive}
    >
      {inner}
    </button>
  );
}
