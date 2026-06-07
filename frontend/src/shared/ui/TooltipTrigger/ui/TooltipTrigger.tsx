import { Tooltip, type TooltipProps } from 'antd'
import type { CSSProperties, FC, ReactNode } from 'react'

interface ITooltipTrigger extends Omit<TooltipProps, 'children'> {
	children: ReactNode
}

const triggerStyle: CSSProperties = {
	display: 'inline-flex',
}

export const TooltipTrigger: FC<ITooltipTrigger> = ({ children, ...tooltipProps }) => (
	<Tooltip {...tooltipProps}>
		<span style={triggerStyle}>{children}</span>
	</Tooltip>
)
