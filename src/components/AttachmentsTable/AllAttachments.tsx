import React, { useEffect } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'

const AllAttachments = () => {

    const processSelected = useAppSelector(state => state.process.selected)

    const phasesWithConditions = useAppSelector(state => state.conditions.phasesWithConditions)

    console.log({ processSelected, phasesWithConditions })

    useEffect(() => {

        return () => { }
    }, [])

    return (
        <div>AllAttachments</div>
    )
}

export default AllAttachments