import { useDispatch } from 'react-redux'
import type { T_AppDispatch } from './../store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => T_AppDispatch = useDispatch
