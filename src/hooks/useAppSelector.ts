import { TypedUseSelectorHook, useSelector } from 'react-redux'
import type { T_AppState } from '../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppSelector: TypedUseSelectorHook<T_AppState> = useSelector