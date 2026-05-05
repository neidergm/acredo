import { useAppSelector } from '../../hooks/useAppSelector'

const Avatar = () => {

    const userInfo = useAppSelector(state => state.user.userInfo);

    if (!userInfo) {
        return null
    }

    return (
        <div className='avatar'>
            <div>
                {userInfo.picture ?
                    <img src={userInfo.picture} alt="User"/>
                    :
                    userInfo.mail[0]
                }
            </div>
        </div>
    )
}

export default Avatar