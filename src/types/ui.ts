import type { ChangeEvent } from 'react';

export type ChangeEventFC<T extends HTMLElement> = (event: ChangeEvent<T>) => void;
