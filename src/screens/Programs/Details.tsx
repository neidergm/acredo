import { useEffect } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { useParams } from 'react-router-dom'

const Details = () => {

    const { id_program } = useParams();

    useEffect(() => {
        console.log(id_program)
    }, [])


    return (
        <>
            <SubHeader
                showBackButton
                text="Detalles de programa"
                className="container-xl"
            />

            <div className="container-xl">
                <div className="mb-5">

                </div>
            </div>
        </>
    )
}

export default Details